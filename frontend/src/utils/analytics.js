/**
 * Google Analytics and Tracking Utilities
 * Comprehensive analytics implementation with privacy controls
 */

// Analytics configuration
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const ANALYTICS_ENABLED = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';

/**
 * Initialize Google Analytics
 */
export const initializeAnalytics = () => {
  if (!ANALYTICS_ENABLED || !window) {
    console.log('Analytics disabled');
    return;
  }

  // Check if user has consented to analytics
  const analyticsConsent = localStorage.getItem('analytics_consent');
  if (analyticsConsent !== 'true') {
    console.log('Analytics consent not given');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
    anonymize_ip: true, // Privacy-friendly
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('Google Analytics initialized');
};

/**
 * Track page view
 */
export const trackPageView = (path, title) => {
  if (!ANALYTICS_ENABLED || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href
  });
};

/**
 * Track custom event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!ANALYTICS_ENABLED || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

/**
 * Track tutorial started
 */
export const trackTutorialStarted = (tutorialId, tutorialTitle, category) => {
  trackEvent('tutorial_started', {
    tutorial_id: tutorialId,
    tutorial_title: tutorialTitle,
    category: category,
    event_category: 'Learning',
    event_label: tutorialTitle
  });
};

/**
 * Track tutorial completed
 */
export const trackTutorialCompleted = (tutorialId, tutorialTitle, category, timeSpent) => {
  trackEvent('tutorial_completed', {
    tutorial_id: tutorialId,
    tutorial_title: tutorialTitle,
    category: category,
    time_spent: timeSpent,
    event_category: 'Learning',
    event_label: tutorialTitle,
    value: timeSpent
  });
};

/**
 * Track challenge attempted
 */
export const trackChallengeAttempted = (challengeId, challengeTitle, difficulty) => {
  trackEvent('challenge_attempted', {
    challenge_id: challengeId,
    challenge_title: challengeTitle,
    difficulty: difficulty,
    event_category: 'Challenges',
    event_label: challengeTitle
  });
};

/**
 * Track challenge completed
 */
export const trackChallengeCompleted = (challengeId, challengeTitle, difficulty, attempts) => {
  trackEvent('challenge_completed', {
    challenge_id: challengeId,
    challenge_title: challengeTitle,
    difficulty: difficulty,
    attempts: attempts,
    event_category: 'Challenges',
    event_label: challengeTitle,
    value: attempts
  });
};

/**
 * Track code execution
 */
export const trackCodeExecution = (language, success, executionTime) => {
  trackEvent('code_execution', {
    language: language,
    success: success,
    execution_time: executionTime,
    event_category: 'Playground',
    event_label: language,
    value: executionTime
  });
};

/**
 * Track code translation
 */
export const trackCodeTranslation = (fromLanguage, toLanguage, success) => {
  trackEvent('code_translation', {
    from_language: fromLanguage,
    to_language: toLanguage,
    success: success,
    event_category: 'Tools',
    event_label: `${fromLanguage} to ${toLanguage}`
  });
};

/**
 * Track database query translation
 */
export const trackDatabaseTranslation = (fromDB, toDB, success) => {
  trackEvent('database_translation', {
    from_database: fromDB,
    to_database: toDB,
    success: success,
    event_category: 'Tools',
    event_label: `${fromDB} to ${toDB}`
  });
};

/**
 * Track user registration
 */
export const trackUserRegistration = (method = 'email') => {
  trackEvent('sign_up', {
    method: method,
    event_category: 'User',
    event_label: method
  });
};

/**
 * Track user login
 */
export const trackUserLogin = (method = 'email') => {
  trackEvent('login', {
    method: method,
    event_category: 'User',
    event_label: method
  });
};

/**
 * Track achievement unlocked
 */
export const trackAchievementUnlocked = (achievementId, achievementTitle) => {
  trackEvent('achievement_unlocked', {
    achievement_id: achievementId,
    achievement_title: achievementTitle,
    event_category: 'Achievements',
    event_label: achievementTitle
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm, resultCount) => {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
    event_category: 'Search',
    event_label: searchTerm,
    value: resultCount
  });
};

/**
 * Track error
 */
export const trackError = (errorMessage, errorType, context) => {
  trackEvent('exception', {
    description: errorMessage,
    error_type: errorType,
    context: context,
    fatal: false,
    event_category: 'Errors'
  });
};

/**
 * Track outbound link
 */
export const trackOutboundLink = (url, label) => {
  trackEvent('click', {
    event_category: 'Outbound Link',
    event_label: label || url,
    value: url
  });
};

/**
 * Track video play
 */
export const trackVideoPlay = (videoTitle, videoId) => {
  trackEvent('video_start', {
    video_title: videoTitle,
    video_id: videoId,
    event_category: 'Video',
    event_label: videoTitle
  });
};

/**
 * Track download
 */
export const trackDownload = (fileName, fileType) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    event_category: 'Downloads',
    event_label: fileName
  });
};

/**
 * Set user ID (for logged-in users)
 */
export const setUserId = (userId) => {
  if (!ANALYTICS_ENABLED || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties) => {
  if (!ANALYTICS_ENABLED || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Request analytics consent
 */
export const requestAnalyticsConsent = () => {
  return new Promise((resolve) => {
    // Check if consent was already given
    const existingConsent = localStorage.getItem('analytics_consent');
    if (existingConsent !== null) {
      resolve(existingConsent === 'true');
      return;
    }

    // Show consent dialog (you would implement a proper UI for this)
    const consent = window.confirm(
      'We use Google Analytics to improve your learning experience. ' +
      'Your data is anonymized and we respect your privacy. ' +
      'Do you consent to analytics tracking?'
    );

    localStorage.setItem('analytics_consent', consent.toString());
    resolve(consent);
  });
};

/**
 * Opt out of analytics
 */
export const optOutOfAnalytics = () => {
  localStorage.setItem('analytics_consent', 'false');

  // Disable Google Analytics
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  console.log('Analytics opt-out successful');
};

/**
 * Opt in to analytics
 */
export const optInToAnalytics = () => {
  localStorage.setItem('analytics_consent', 'true');

  // Enable Google Analytics
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  // Initialize analytics
  initializeAnalytics();

  console.log('Analytics opt-in successful');
};

/**
 * Check if analytics is enabled
 */
export const isAnalyticsEnabled = () => {
  return ANALYTICS_ENABLED && localStorage.getItem('analytics_consent') === 'true';
};

// Performance tracking
export const trackPerformance = () => {
  if (!ANALYTICS_ENABLED || !window.gtag || !window.performance) return;

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;

  trackEvent('performance', {
    page_load_time: pageLoadTime,
    connect_time: connectTime,
    render_time: renderTime,
    event_category: 'Performance',
    value: pageLoadTime
  });
};

// Export all functions
export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackTutorialStarted,
  trackTutorialCompleted,
  trackChallengeAttempted,
  trackChallengeCompleted,
  trackCodeExecution,
  trackCodeTranslation,
  trackDatabaseTranslation,
  trackUserRegistration,
  trackUserLogin,
  trackAchievementUnlocked,
  trackSearch,
  trackError,
  trackOutboundLink,
  trackVideoPlay,
  trackDownload,
  setUserId,
  setUserProperties,
  requestAnalyticsConsent,
  optOutOfAnalytics,
  optInToAnalytics,
  isAnalyticsEnabled,
  trackPerformance
};
