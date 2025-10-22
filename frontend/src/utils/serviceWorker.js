/**
 * Service Worker registration and management utilities
 */
import React from 'react';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Additional utilities for service worker management
export class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    this.callbacks = {
      onUpdate: [],
      onSuccess: [],
      onOffline: [],
      onOnline: []
    };
    
    this.init();
  }

  init() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('App is back online');
      this.callbacks.onOnline.forEach(callback => callback());
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      this.callbacks.onOffline.forEach(callback => callback());
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event.data);
      });
    }
  }

  register(callbacks = {}) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    
    register({
      onUpdate: (registration) => {
        this.registration = registration;
        this.updateAvailable = true;
        this.callbacks.onUpdate.forEach(callback => callback(registration));
      },
      onSuccess: (registration) => {
        this.registration = registration;
        this.callbacks.onSuccess.forEach(callback => callback(registration));
      }
    });
  }

  async updateServiceWorker() {
    if (this.registration && this.registration.waiting) {
      // Send message to service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  }

  async clearCache() {
    if ('serviceWorker' in navigator && this.registration) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        this.registration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      });
    }
  }

  async getVersion() {
    if ('serviceWorker' in navigator && this.registration) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.version);
        };
        
        this.registration.active.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );
      });
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'CACHE_UPDATED':
        console.log('Service Worker: Cache updated', payload);
        break;
      case 'OFFLINE_READY':
        console.log('Service Worker: App ready for offline use');
        break;
      default:
        console.log('Service Worker: Unknown message', type, payload);
    }
  }

  isOnline() {
    return navigator.onLine;
  }

  isUpdateAvailable() {
    return this.updateAvailable;
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Hook for React components
export const useServiceWorker = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleUpdate = () => setUpdateAvailable(true);

    serviceWorkerManager.on('onOnline', handleOnline);
    serviceWorkerManager.on('onOffline', handleOffline);
    serviceWorkerManager.on('onUpdate', handleUpdate);

    return () => {
      serviceWorkerManager.off('onOnline', handleOnline);
      serviceWorkerManager.off('onOffline', handleOffline);
      serviceWorkerManager.off('onUpdate', handleUpdate);
    };
  }, []);

  const updateApp = async () => {
    setIsInstalling(true);
    await serviceWorkerManager.updateServiceWorker();
    setIsInstalling(false);
  };

  const clearCache = async () => {
    return serviceWorkerManager.clearCache();
  };

  return {
    isOnline,
    updateAvailable,
    isInstalling,
    updateApp,
    clearCache
  };
};