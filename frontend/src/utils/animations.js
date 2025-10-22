/**
 * Professional Animation Utilities
 * Provides helper functions for managing animations and respecting user preferences
 */

// Animation duration constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SLOWER: 750,
  SLOWEST: 1000,
};

// Animation easing functions
export const ANIMATION_EASING = {
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_SPRING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  EASE_BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  EASE_SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_SWIFT: 'cubic-bezier(0.4, 0, 0.6, 1)',
  EASE_SHARP: 'cubic-bezier(0.4, 0, 1, 1)',
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preferences
 * @param {number} duration - Default duration in milliseconds
 * @returns {number} Adjusted duration (1ms if reduced motion preferred)
 */
export const getAnimationDuration = (duration = ANIMATION_DURATION.NORMAL) => {
  return prefersReducedMotion() ? 1 : duration;
};

/**
 * Get animation easing based on user preferences
 * @param {string} easing - Default easing function
 * @returns {string} Adjusted easing (linear if reduced motion preferred)
 */
export const getAnimationEasing = (easing = ANIMATION_EASING.EASE_OUT) => {
  return prefersReducedMotion() ? 'linear' : easing;
};

/**
 * Create a CSS animation string with motion preferences
 * @param {string} name - Animation name
 * @param {number} duration - Duration in milliseconds
 * @param {string} easing - Easing function
 * @param {string} fillMode - Animation fill mode
 * @returns {string} CSS animation string
 */
export const createAnimation = (
  name,
  duration = ANIMATION_DURATION.NORMAL,
  easing = ANIMATION_EASING.EASE_OUT,
  fillMode = 'both'
) => {
  const adjustedDuration = getAnimationDuration(duration);
  const adjustedEasing = getAnimationEasing(easing);
  return `${name} ${adjustedDuration}ms ${adjustedEasing} ${fillMode}`;
};

/**
 * Apply animation to an element with motion preferences
 * @param {HTMLElement} element - Target element
 * @param {string} animationName - Animation name
 * @param {Object} options - Animation options
 */
export const animateElement = (element, animationName, options = {}) => {
  if (!element) return;

  const {
    duration = ANIMATION_DURATION.NORMAL,
    easing = ANIMATION_EASING.EASE_OUT,
    fillMode = 'both',
    onComplete = null,
  } = options;

  const animation = createAnimation(animationName, duration, easing, fillMode);
  element.style.animation = animation;

  if (onComplete) {
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      onComplete();
    };
    element.addEventListener('animationend', handleAnimationEnd);
  }
};

/**
 * Fade in an element
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const fadeIn = (element, options = {}) => {
  animateElement(element, 'fadeIn', {
    duration: ANIMATION_DURATION.NORMAL,
    ...options,
  });
};

/**
 * Slide up an element
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const slideUp = (element, options = {}) => {
  animateElement(element, 'slideUp', {
    duration: ANIMATION_DURATION.NORMAL,
    ...options,
  });
};

/**
 * Scale in an element
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const scaleIn = (element, options = {}) => {
  animateElement(element, 'scaleIn', {
    duration: ANIMATION_DURATION.FAST,
    ...options,
  });
};

/**
 * Bounce in an element
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const bounceIn = (element, options = {}) => {
  animateElement(element, 'bounceIn', {
    duration: ANIMATION_DURATION.SLOW,
    easing: ANIMATION_EASING.EASE_BOUNCE,
    ...options,
  });
};

/**
 * Shake an element (for error states)
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const shake = (element, options = {}) => {
  animateElement(element, 'shake', {
    duration: 500,
    easing: ANIMATION_EASING.EASE_IN_OUT,
    ...options,
  });
};

/**
 * Create a staggered animation for multiple elements
 * @param {NodeList|Array} elements - Elements to animate
 * @param {string} animationName - Animation name
 * @param {Object} options - Animation options
 */
export const staggerAnimation = (elements, animationName, options = {}) => {
  const {
    staggerDelay = 100,
    ...animationOptions
  } = options;

  elements.forEach((element, index) => {
    setTimeout(() => {
      animateElement(element, animationName, animationOptions);
    }, index * staggerDelay);
  });
};

/**
 * Create intersection observer for scroll animations
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} Intersection observer instance
 */
export const createScrollAnimationObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    animationClass = 'animate-fade-in',
  } = options;

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
      }
    });
  }, {
    threshold,
    rootMargin,
  });
};

/**
 * Initialize scroll animations for elements with data-animate attribute
 */
export const initScrollAnimations = () => {
  if (typeof window === 'undefined') return;

  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = createScrollAnimationObserver();

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  return observer;
};

/**
 * Cleanup animations and observers
 * @param {IntersectionObserver} observer - Observer to disconnect
 */
export const cleanupAnimations = (observer) => {
  if (observer) {
    observer.disconnect();
  }
};

// Export default object with all utilities
export default {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  prefersReducedMotion,
  getAnimationDuration,
  getAnimationEasing,
  createAnimation,
  animateElement,
  fadeIn,
  slideUp,
  scaleIn,
  bounceIn,
  shake,
  staggerAnimation,
  createScrollAnimationObserver,
  initScrollAnimations,
  cleanupAnimations,
};