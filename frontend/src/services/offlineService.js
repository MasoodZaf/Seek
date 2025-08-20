class OfflineService {
  constructor() {
    this.dbName = 'SeekOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];

    this.initDB();
    this.setupEventListeners();
  }

  async initDB() {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported. Falling back to localStorage.');
      return;
    }

    try {
      this.db = await this.openDB();
      console.log('Offline database initialized');
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
    }
  }

  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Tutorials store
        if (!db.objectStoreNames.contains('tutorials')) {
          const tutorialStore = db.createObjectStore('tutorials', { keyPath: 'id' });
          tutorialStore.createIndex('language', 'language', { unique: false });
          tutorialStore.createIndex('difficulty', 'difficulty', { unique: false });
          tutorialStore.createIndex('category', 'category', { unique: false });
        }

        // User progress store
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
          progressStore.createIndex('tutorialId', 'tutorialId', { unique: false });
          progressStore.createIndex('userId', 'userId', { unique: false });
        }

        // Code snippets store
        if (!db.objectStoreNames.contains('codeSnippets')) {
          const snippetStore = db.createObjectStore('codeSnippets', { keyPath: 'id' });
          snippetStore.createIndex('language', 'language', { unique: false });
          snippetStore.createIndex('tags', 'tags', { multiEntry: true });
        }

        // Offline queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
          queueStore.createIndex('action', 'action', { unique: false });
        }

        // AI conversations store
        if (!db.objectStoreNames.contains('aiConversations')) {
          const aiStore = db.createObjectStore('aiConversations', { keyPath: 'id' });
          aiStore.createIndex('sessionId', 'sessionId', { unique: false });
          aiStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
      this.notifyConnectionStatus('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyConnectionStatus('offline');
    });

    // Periodic sync when online
    setInterval(() => {
      if (this.isOnline) {
        this.syncOfflineData();
      }
    }, 30000); // Sync every 30 seconds when online
  }

  notifyConnectionStatus(status) {
    const event = new CustomEvent('connectionStatusChanged', {
      detail: { isOnline: status === 'online' }
    });
    window.dispatchEvent(event);
  }

  // Tutorial Management
  async storeTutorial(tutorial) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['tutorials'], 'readwrite');
        const store = transaction.objectStore('tutorials');
        await store.put({
          ...tutorial,
          offlineTimestamp: Date.now(),
          synced: this.isOnline
        });
      } else {
        // Fallback to localStorage
        const tutorials = this.getTutorialsFromStorage();
        tutorials[tutorial.id] = {
          ...tutorial,
          offlineTimestamp: Date.now(),
          synced: this.isOnline
        };
        localStorage.setItem('offline_tutorials', JSON.stringify(tutorials));
      }
      
      console.log(`Tutorial ${tutorial.id} stored offline`);
    } catch (error) {
      console.error('Error storing tutorial offline:', error);
    }
  }

  async getTutorial(id) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['tutorials'], 'readonly');
        const store = transaction.objectStore('tutorials');
        const request = store.get(id);
        
        return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } else {
        const tutorials = this.getTutorialsFromStorage();
        return tutorials[id] || null;
      }
    } catch (error) {
      console.error('Error getting tutorial from offline storage:', error);
      return null;
    }
  }

  async getAllTutorials(filters = {}) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['tutorials'], 'readonly');
        const store = transaction.objectStore('tutorials');
        const request = store.getAll();
        
        return new Promise((resolve) => {
          request.onsuccess = () => {
            let tutorials = request.result || [];
            
            // Apply filters
            if (filters.language) {
              tutorials = tutorials.filter(t => t.language === filters.language);
            }
            if (filters.difficulty) {
              tutorials = tutorials.filter(t => t.difficulty === filters.difficulty);
            }
            if (filters.category) {
              tutorials = tutorials.filter(t => t.category === filters.category);
            }
            
            resolve(tutorials);
          };
          request.onerror = () => resolve([]);
        });
      } else {
        const tutorials = Object.values(this.getTutorialsFromStorage());
        return tutorials.filter(tutorial => {
          if (filters.language && tutorial.language !== filters.language) return false;
          if (filters.difficulty && tutorial.difficulty !== filters.difficulty) return false;
          if (filters.category && tutorial.category !== filters.category) return false;
          return true;
        });
      }
    } catch (error) {
      console.error('Error getting tutorials from offline storage:', error);
      return [];
    }
  }

  getTutorialsFromStorage() {
    try {
      return JSON.parse(localStorage.getItem('offline_tutorials') || '{}');
    } catch {
      return {};
    }
  }

  // Progress Management
  async storeProgress(progressData) {
    try {
      const progress = {
        ...progressData,
        id: `${progressData.userId}_${progressData.tutorialId}`,
        offlineTimestamp: Date.now(),
        synced: false
      };

      if (this.db) {
        const transaction = this.db.transaction(['progress'], 'readwrite');
        const store = transaction.objectStore('progress');
        await store.put(progress);
      } else {
        const allProgress = JSON.parse(localStorage.getItem('offline_progress') || '{}');
        allProgress[progress.id] = progress;
        localStorage.setItem('offline_progress', JSON.stringify(allProgress));
      }

      // Add to sync queue if online
      if (this.isOnline) {
        this.addToSyncQueue('PROGRESS_UPDATE', progress);
      }

      console.log(`Progress stored offline for tutorial ${progressData.tutorialId}`);
    } catch (error) {
      console.error('Error storing progress offline:', error);
    }
  }

  async getProgress(userId, tutorialId) {
    try {
      const id = `${userId}_${tutorialId}`;
      
      if (this.db) {
        const transaction = this.db.transaction(['progress'], 'readonly');
        const store = transaction.objectStore('progress');
        const request = store.get(id);
        
        return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } else {
        const allProgress = JSON.parse(localStorage.getItem('offline_progress') || '{}');
        return allProgress[id] || null;
      }
    } catch (error) {
      console.error('Error getting progress from offline storage:', error);
      return null;
    }
  }

  // Code Snippets Management
  async storeCodeSnippet(snippet) {
    try {
      const codeSnippet = {
        ...snippet,
        id: snippet.id || `snippet_${Date.now()}`,
        offlineTimestamp: Date.now(),
        synced: false
      };

      if (this.db) {
        const transaction = this.db.transaction(['codeSnippets'], 'readwrite');
        const store = transaction.objectStore('codeSnippets');
        await store.put(codeSnippet);
      } else {
        const snippets = JSON.parse(localStorage.getItem('offline_snippets') || '{}');
        snippets[codeSnippet.id] = codeSnippet;
        localStorage.setItem('offline_snippets', JSON.stringify(snippets));
      }

      console.log(`Code snippet ${codeSnippet.id} stored offline`);
      return codeSnippet.id;
    } catch (error) {
      console.error('Error storing code snippet offline:', error);
      return null;
    }
  }

  async getCodeSnippets(filters = {}) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['codeSnippets'], 'readonly');
        const store = transaction.objectStore('codeSnippets');
        const request = store.getAll();
        
        return new Promise((resolve) => {
          request.onsuccess = () => {
            let snippets = request.result || [];
            
            if (filters.language) {
              snippets = snippets.filter(s => s.language === filters.language);
            }
            if (filters.tag) {
              snippets = snippets.filter(s => s.tags && s.tags.includes(filters.tag));
            }
            
            resolve(snippets);
          };
          request.onerror = () => resolve([]);
        });
      } else {
        const allSnippets = Object.values(JSON.parse(localStorage.getItem('offline_snippets') || '{}'));
        return allSnippets.filter(snippet => {
          if (filters.language && snippet.language !== filters.language) return false;
          if (filters.tag && (!snippet.tags || !snippet.tags.includes(filters.tag))) return false;
          return true;
        });
      }
    } catch (error) {
      console.error('Error getting code snippets from offline storage:', error);
      return [];
    }
  }

  // AI Conversations
  async storeAIConversation(conversation) {
    try {
      const conv = {
        ...conversation,
        offlineTimestamp: Date.now()
      };

      if (this.db) {
        const transaction = this.db.transaction(['aiConversations'], 'readwrite');
        const store = transaction.objectStore('aiConversations');
        await store.put(conv);
      } else {
        const conversations = JSON.parse(localStorage.getItem('offline_ai_conversations') || '{}');
        conversations[conversation.id] = conv;
        localStorage.setItem('offline_ai_conversations', JSON.stringify(conversations));
      }

      console.log(`AI conversation ${conversation.id} stored offline`);
    } catch (error) {
      console.error('Error storing AI conversation offline:', error);
    }
  }

  async getAIConversation(sessionId) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['aiConversations'], 'readonly');
        const store = transaction.objectStore('aiConversations');
        const index = store.index('sessionId');
        const request = index.getAll(sessionId);
        
        return new Promise((resolve) => {
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
      } else {
        const conversations = Object.values(JSON.parse(localStorage.getItem('offline_ai_conversations') || '{}'));
        return conversations.filter(conv => conv.sessionId === sessionId);
      }
    } catch (error) {
      console.error('Error getting AI conversation from offline storage:', error);
      return [];
    }
  }

  // Sync Queue Management
  async addToSyncQueue(action, data) {
    try {
      const queueItem = {
        action,
        data,
        timestamp: Date.now(),
        retryCount: 0
      };

      if (this.db) {
        const transaction = this.db.transaction(['syncQueue'], 'readwrite');
        const store = transaction.objectStore('syncQueue');
        await store.add(queueItem);
      } else {
        this.syncQueue.push(queueItem);
      }

      console.log(`Added ${action} to sync queue`);
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  async syncOfflineData() {
    if (!this.isOnline) return;

    try {
      let queueItems = [];
      
      if (this.db) {
        const transaction = this.db.transaction(['syncQueue'], 'readonly');
        const store = transaction.objectStore('syncQueue');
        const request = store.getAll();
        
        queueItems = await new Promise((resolve) => {
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
      } else {
        queueItems = [...this.syncQueue];
      }

      for (const item of queueItems) {
        try {
          await this.processSyncItem(item);
          await this.removeSyncItem(item.id);
          console.log(`Synced ${item.action} successfully`);
        } catch (error) {
          console.error(`Failed to sync ${item.action}:`, error);
          
          // Increment retry count
          item.retryCount = (item.retryCount || 0) + 1;
          
          // Remove after 3 failed attempts
          if (item.retryCount >= 3) {
            await this.removeSyncItem(item.id);
            console.log(`Removed ${item.action} from sync queue after 3 failures`);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  async processSyncItem(item) {
    switch (item.action) {
      case 'PROGRESS_UPDATE':
        await fetch('/api/v1/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(item.data)
        });
        break;
        
      case 'CODE_EXECUTION':
        await fetch('/api/v1/code/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(item.data)
        });
        break;
        
      default:
        console.warn(`Unknown sync action: ${item.action}`);
    }
  }

  async removeSyncItem(itemId) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['syncQueue'], 'readwrite');
        const store = transaction.objectStore('syncQueue');
        await store.delete(itemId);
      } else {
        this.syncQueue = this.syncQueue.filter(item => item.id !== itemId);
      }
    } catch (error) {
      console.error('Error removing sync item:', error);
    }
  }

  // Utility Methods
  getStorageInfo() {
    const storageSize = this.calculateStorageSize();
    return {
      isOnline: this.isOnline,
      hasIndexedDB: !!this.db,
      storageSize,
      queueLength: this.syncQueue.length,
      lastSync: localStorage.getItem('lastSyncTimestamp')
    };
  }

  calculateStorageSize() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (key.startsWith('offline_')) {
        totalSize += localStorage.getItem(key).length;
      }
    }
    return `${Math.round(totalSize / 1024)} KB`;
  }

  async clearOfflineData() {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['tutorials', 'progress', 'codeSnippets', 'syncQueue', 'aiConversations'], 'readwrite');
        await transaction.objectStore('tutorials').clear();
        await transaction.objectStore('progress').clear();
        await transaction.objectStore('codeSnippets').clear();
        await transaction.objectStore('syncQueue').clear();
        await transaction.objectStore('aiConversations').clear();
      }
      
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('offline_')) {
          localStorage.removeItem(key);
        }
      });
      
      this.syncQueue = [];
      console.log('Offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

// Create and export singleton instance
const offlineService = new OfflineService();
export default offlineService;