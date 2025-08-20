class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.serviceWorkerRegistration = null;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.subscribed = false;
    
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn('Push notifications not supported in this browser');
      return;
    }

    try {
      // Register service worker
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
      
      // Check if already subscribed
      const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      this.subscribed = !!subscription;
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async requestPermission() {
    if (!this.isSupported) {
      return { success: false, error: 'Notifications not supported' };
    }

    try {
      this.permission = await Notification.requestPermission();
      
      if (this.permission === 'granted') {
        return { success: true, permission: this.permission };
      } else {
        return { success: false, error: 'Permission denied', permission: this.permission };
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, error: error.message };
    }
  }

  async subscribe() {
    if (!this.serviceWorkerRegistration || this.permission !== 'granted') {
      return { success: false, error: 'Not ready for subscription' };
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
      });

      // Send subscription to backend
      const response = await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        this.subscribed = true;
        localStorage.setItem('notificationSubscribed', 'true');
        return { success: true, subscription };
      } else {
        throw new Error('Failed to save subscription to server');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return { success: false, error: error.message };
    }
  }

  async unsubscribe() {
    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify backend
        await fetch('/api/v1/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
      }

      this.subscribed = false;
      localStorage.removeItem('notificationSubscribed');
      return { success: true };
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Local notification for immediate feedback
  showLocalNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      tag: 'seek-notification',
      renotify: true,
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }

  // Schedule notifications
  async scheduleNotification(type, scheduledTime, data = {}) {
    const notifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    
    const notification = {
      id: Date.now(),
      type,
      scheduledTime,
      data,
      created: new Date().toISOString()
    };

    notifications.push(notification);
    localStorage.setItem('scheduledNotifications', JSON.stringify(notifications));

    // Set up timer if time is in the near future (within 24 hours)
    const timeUntil = scheduledTime - Date.now();
    if (timeUntil > 0 && timeUntil <= 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        this.triggerScheduledNotification(notification);
      }, timeUntil);
    }

    return notification;
  }

  triggerScheduledNotification(notification) {
    switch (notification.type) {
      case 'streak_reminder':
        this.showLocalNotification(
          '🔥 Keep your streak alive!',
          {
            body: `You're on a ${notification.data.streak} day streak. Code today to keep it going!`,
            tag: 'streak-reminder',
            actions: [
              { action: 'code', title: 'Start Coding' },
              { action: 'dismiss', title: 'Remind Later' }
            ]
          }
        );
        break;

      case 'lesson_reminder':
        this.showLocalNotification(
          '📚 Continue Learning',
          {
            body: `Your lesson "${notification.data.lessonTitle}" is waiting for you!`,
            tag: 'lesson-reminder',
            actions: [
              { action: 'continue', title: 'Continue Lesson' },
              { action: 'dismiss', title: 'Later' }
            ]
          }
        );
        break;

      case 'achievement_unlocked':
        this.showLocalNotification(
          '🎉 Achievement Unlocked!',
          {
            body: `Congratulations! You've earned "${notification.data.achievementName}"`,
            tag: 'achievement',
            requireInteraction: true
          }
        );
        break;

      case 'weekly_summary':
        this.showLocalNotification(
          '📊 Your Weekly Progress',
          {
            body: `You completed ${notification.data.lessonsCompleted} lessons this week!`,
            tag: 'weekly-summary'
          }
        );
        break;

      case 'challenge_available':
        this.showLocalNotification(
          '⚡ New Challenge Available',
          {
            body: `A new ${notification.data.difficulty} challenge is ready for you!`,
            tag: 'challenge'
          }
        );
        break;
    }
  }

  // Streak management notifications
  setupStreakReminders(user) {
    const streak = user.progress?.currentStreak || 0;
    const lastActivity = user.progress?.lastActivityAt;
    
    if (!lastActivity) return;

    const lastActivityTime = new Date(lastActivity).getTime();
    const now = Date.now();
    const hoursSinceActivity = (now - lastActivityTime) / (1000 * 60 * 60);

    // If user hasn't coded for 20 hours, remind them
    if (hoursSinceActivity >= 20 && hoursSinceActivity < 24) {
      const reminderTime = now + (4 * 60 * 60 * 1000); // Remind in 4 hours
      this.scheduleNotification('streak_reminder', reminderTime, { streak });
    }

    // Schedule daily reminder at user's preferred time
    const preferredTime = user.preferences?.reminderTime || '19:00'; // 7 PM default
    const [hours, minutes] = preferredTime.split(':');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    this.scheduleNotification('streak_reminder', tomorrow.getTime(), { streak });
  }

  // Lesson progress notifications
  setupLessonReminders(currentLesson) {
    if (!currentLesson) return;

    // Remind to continue incomplete lesson after 3 hours
    if (currentLesson.progress < 100) {
      const reminderTime = Date.now() + (3 * 60 * 60 * 1000);
      this.scheduleNotification('lesson_reminder', reminderTime, {
        lessonTitle: currentLesson.title,
        progress: currentLesson.progress
      });
    }
  }

  // Achievement notifications
  showAchievementNotification(achievement) {
    this.showLocalNotification(
      '🏆 Achievement Unlocked!',
      {
        body: `Congratulations! You've earned "${achievement.name}"`,
        icon: achievement.icon || '/logo192.png',
        tag: 'achievement',
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200],
        actions: [
          { action: 'view', title: 'View Achievement' },
          { action: 'share', title: 'Share' }
        ]
      }
    );

    // Store achievement notification for offline viewing
    const achievements = JSON.parse(localStorage.getItem('recentAchievements') || '[]');
    achievements.unshift({
      ...achievement,
      notifiedAt: new Date().toISOString()
    });
    localStorage.setItem('recentAchievements', JSON.stringify(achievements.slice(0, 10)));
  }

  // Learning session reminders
  setupLearningReminders(schedule = {}) {
    const {
      monday = '19:00',
      tuesday = '19:00',
      wednesday = '19:00',
      thursday = '19:00',
      friday = '19:00',
      saturday = '10:00',
      sunday = '10:00'
    } = schedule;

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const times = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];

    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const [hours, minutes] = times[i].split(':');
      const targetDate = new Date();
      
      // Calculate next occurrence of this day
      const daysUntilTarget = (i - now.getDay() + 7) % 7;
      targetDate.setDate(now.getDate() + (daysUntilTarget || 7));
      targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (targetDate.getTime() > now.getTime()) {
        this.scheduleNotification('lesson_reminder', targetDate.getTime(), {
          day: days[i],
          scheduledTime: times[i]
        });
      }
    }
  }

  // Weekly progress summary
  scheduleWeeklySummary() {
    const now = new Date();
    const sunday = new Date(now);
    
    // Find next Sunday at 6 PM
    sunday.setDate(now.getDate() + (7 - now.getDay()));
    sunday.setHours(18, 0, 0, 0);

    this.scheduleNotification('weekly_summary', sunday.getTime(), {
      weekOf: now.toISOString()
    });
  }

  // Utility methods
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  getStatus() {
    return {
      isSupported: this.isSupported,
      permission: this.permission,
      subscribed: this.subscribed,
      serviceWorkerReady: !!this.serviceWorkerRegistration
    };
  }

  async checkAndCleanupScheduled() {
    const notifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    const now = Date.now();
    
    // Remove expired notifications
    const activeNotifications = notifications.filter(n => n.scheduledTime > now);
    localStorage.setItem('scheduledNotifications', JSON.stringify(activeNotifications));

    return activeNotifications.length;
  }

  // Test notification
  testNotification() {
    this.showLocalNotification(
      '🧪 Test Notification',
      {
        body: 'This is a test notification from Seek Learning Platform!',
        tag: 'test',
        icon: '/logo192.png'
      }
    );
  }
}

// Service worker message handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
      const { action, data } = event.data;
      
      // Handle notification actions
      switch (action) {
        case 'code':
        case 'continue':
          window.location.href = '/playground';
          break;
        case 'view':
          window.location.href = '/achievements';
          break;
        case 'share':
          if (navigator.share) {
            navigator.share({
              title: 'I just earned an achievement on Seek!',
              text: `Check out my progress on Seek Learning Platform`,
              url: window.location.origin
            });
          }
          break;
      }
    }
  });
}

// Create and export singleton instance
const notificationService = new NotificationService();
export default notificationService;