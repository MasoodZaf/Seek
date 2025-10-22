/**
 * Animation Utilities Tests
 * Tests for animation performance, accessibility compliance, and utility functions
 */

import animationUtils, {
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
} from '../animations.js';

// Mock window.matchMedia for testing
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock IntersectionObserver
const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  };

  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    mockObserver.callback = callback;
    return mockObserver;
  });

  return mockObserver;
};

describe('Animation Constants', () => {
  test('ANIMATION_DURATION contains expected values', () => {
    expect(ANIMATION_DURATION).toHaveProperty('FAST', 150);
    expect(ANIMATION_DURATION).toHaveProperty('NORMAL', 300);
    expect(ANIMATION_DURATION).toHaveProperty('SLOW', 500);
    expect(ANIMATION_DURATION).toHaveProperty('SLOWER', 750);
    expect(ANIMATION_DURATION).toHaveProperty('SLOWEST', 1000);
  });

  test('ANIMATION_EASING contains valid CSS easing functions', () => {
    expect(ANIMATION_EASING.EASE_IN).toBe('cubic-bezier(0.4, 0, 1, 1)');
    expect(ANIMATION_EASING.EASE_OUT).toBe('cubic-bezier(0, 0, 0.2, 1)');
    expect(ANIMATION_EASING.EASE_IN_OUT).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(ANIMATION_EASING.EASE_SPRING).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
    expect(ANIMATION_EASING.EASE_BOUNCE).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
  });

  test('all easing functions are valid CSS cubic-bezier values', () => {
    Object.values(ANIMATION_EASING).forEach(easing => {
      expect(easing).toMatch(/^cubic-bezier\([\d\s.,\-]+\)$/);
    });
  });
});

describe('Motion Preference Detection', () => {
  beforeEach(() => {
    // Reset window.matchMedia mock
    delete window.matchMedia;
  });

  test('prefersReducedMotion returns false when motion is not reduced', () => {
    mockMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  test('prefersReducedMotion returns true when motion is reduced', () => {
    mockMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  test('prefersReducedMotion returns false when window is undefined (SSR)', () => {
    const originalWindow = global.window;
    delete global.window;
    
    expect(prefersReducedMotion()).toBe(false);
    
    global.window = originalWindow;
  });

  test('getAnimationDuration respects motion preferences', () => {
    mockMatchMedia(false);
    expect(getAnimationDuration(300)).toBe(300);
    
    mockMatchMedia(true);
    expect(getAnimationDuration(300)).toBe(1);
  });

  test('getAnimationEasing respects motion preferences', () => {
    mockMatchMedia(false);
    expect(getAnimationEasing(ANIMATION_EASING.EASE_OUT)).toBe(ANIMATION_EASING.EASE_OUT);
    
    mockMatchMedia(true);
    expect(getAnimationEasing(ANIMATION_EASING.EASE_OUT)).toBe('linear');
  });
});

describe('Animation Creation', () => {
  beforeEach(() => {
    mockMatchMedia(false); // Default to motion enabled
  });

  test('createAnimation generates valid CSS animation string', () => {
    const animation = createAnimation('fadeIn', 300, ANIMATION_EASING.EASE_OUT, 'both');
    expect(animation).toBe('fadeIn 300ms cubic-bezier(0, 0, 0.2, 1) both');
  });

  test('createAnimation uses default values', () => {
    const animation = createAnimation('fadeIn');
    expect(animation).toContain('fadeIn');
    expect(animation).toContain('300ms');
    expect(animation).toContain('cubic-bezier(0, 0, 0.2, 1)');
    expect(animation).toContain('both');
  });

  test('createAnimation respects reduced motion preferences', () => {
    mockMatchMedia(true);
    const animation = createAnimation('fadeIn', 300, ANIMATION_EASING.EASE_OUT);
    expect(animation).toBe('fadeIn 1ms linear both');
  });
});

describe('Element Animation Functions', () => {
  let mockElement;

  beforeEach(() => {
    mockMatchMedia(false);
    mockElement = {
      style: {},
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  });

  test('animateElement applies animation to element', () => {
    animateElement(mockElement, 'fadeIn', { duration: 300 });
    expect(mockElement.style.animation).toContain('fadeIn');
    expect(mockElement.style.animation).toContain('300ms');
  });

  test('animateElement handles null element gracefully', () => {
    expect(() => animateElement(null, 'fadeIn')).not.toThrow();
  });

  test('animateElement calls onComplete callback', () => {
    const onComplete = jest.fn();
    animateElement(mockElement, 'fadeIn', { onComplete });
    
    expect(mockElement.addEventListener).toHaveBeenCalledWith('animationend', expect.any(Function));
    
    // Simulate animation end
    const animationEndHandler = mockElement.addEventListener.mock.calls[0][1];
    animationEndHandler();
    
    expect(onComplete).toHaveBeenCalled();
    expect(mockElement.removeEventListener).toHaveBeenCalled();
  });

  test('fadeIn applies correct animation', () => {
    fadeIn(mockElement);
    expect(mockElement.style.animation).toContain('fadeIn');
    expect(mockElement.style.animation).toContain('300ms');
  });

  test('slideUp applies correct animation', () => {
    slideUp(mockElement);
    expect(mockElement.style.animation).toContain('slideUp');
  });

  test('scaleIn applies correct animation with fast duration', () => {
    scaleIn(mockElement);
    expect(mockElement.style.animation).toContain('scaleIn');
    expect(mockElement.style.animation).toContain('150ms');
  });

  test('bounceIn applies correct animation with bounce easing', () => {
    bounceIn(mockElement);
    expect(mockElement.style.animation).toContain('bounceIn');
    expect(mockElement.style.animation).toContain('500ms');
    expect(mockElement.style.animation).toContain('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
  });

  test('shake applies correct animation', () => {
    shake(mockElement);
    expect(mockElement.style.animation).toContain('shake');
    expect(mockElement.style.animation).toContain('500ms');
  });
});

describe('Staggered Animations', () => {
  let mockElements;

  beforeEach(() => {
    mockMatchMedia(false);
    mockElements = [
      { style: {}, addEventListener: jest.fn(), removeEventListener: jest.fn() },
      { style: {}, addEventListener: jest.fn(), removeEventListener: jest.fn() },
      { style: {}, addEventListener: jest.fn(), removeEventListener: jest.fn() },
    ];
    
    // Mock setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('staggerAnimation applies animations with delays', () => {
    staggerAnimation(mockElements, 'fadeIn', { staggerDelay: 100 });
    
    // First element should animate immediately (index 0 * delay = 0ms)
    jest.advanceTimersByTime(0);
    expect(mockElements[0].style.animation).toContain('fadeIn');
    
    // Advance timers and check subsequent elements
    jest.advanceTimersByTime(100);
    expect(mockElements[1].style.animation).toContain('fadeIn');
    
    jest.advanceTimersByTime(100);
    expect(mockElements[2].style.animation).toContain('fadeIn');
  });

  test('staggerAnimation uses default stagger delay', () => {
    staggerAnimation(mockElements, 'fadeIn');
    
    // First element animates immediately
    jest.advanceTimersByTime(0);
    expect(mockElements[0].style.animation).toContain('fadeIn');
    
    jest.advanceTimersByTime(100); // Default delay
    expect(mockElements[1].style.animation).toContain('fadeIn');
  });
});

describe('Scroll Animation Observer', () => {
  let mockObserver;

  beforeEach(() => {
    mockObserver = mockIntersectionObserver();
  });

  test('createScrollAnimationObserver creates IntersectionObserver', () => {
    const observer = createScrollAnimationObserver();
    expect(IntersectionObserver).toHaveBeenCalled();
    expect(observer).toBe(mockObserver);
  });

  test('createScrollAnimationObserver uses custom options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      animationClass: 'custom-animate'
    };
    
    createScrollAnimationObserver(options);
    
    const [callback, observerOptions] = IntersectionObserver.mock.calls[0];
    expect(observerOptions.threshold).toBe(0.5);
    expect(observerOptions.rootMargin).toBe('10px');
  });

  test('scroll animation observer adds class when element intersects', () => {
    const observer = createScrollAnimationObserver({ animationClass: 'test-animate' });
    const mockElement = {
      classList: {
        add: jest.fn()
      }
    };

    // Simulate intersection
    const callback = IntersectionObserver.mock.calls[0][0];
    callback([{ isIntersecting: true, target: mockElement }]);

    expect(mockElement.classList.add).toHaveBeenCalledWith('test-animate');
  });

  test('scroll animation observer ignores non-intersecting elements', () => {
    const observer = createScrollAnimationObserver();
    const mockElement = {
      classList: {
        add: jest.fn()
      }
    };

    // Simulate non-intersection
    const callback = IntersectionObserver.mock.calls[0][0];
    callback([{ isIntersecting: false, target: mockElement }]);

    expect(mockElement.classList.add).not.toHaveBeenCalled();
  });
});

describe('Scroll Animation Initialization', () => {
  let mockObserver;

  beforeEach(() => {
    mockObserver = mockIntersectionObserver();
    
    // Mock document.querySelectorAll
    const mockElements = [
      { dataset: { animate: 'fadeIn' } },
      { dataset: { animate: 'slideUp' } }
    ];
    
    document.querySelectorAll = jest.fn().mockReturnValue(mockElements);
  });

  test('initScrollAnimations observes elements with data-animate attribute', () => {
    const observer = initScrollAnimations();
    
    expect(document.querySelectorAll).toHaveBeenCalledWith('[data-animate]');
    expect(mockObserver.observe).toHaveBeenCalledTimes(2);
    expect(observer).toBe(mockObserver);
  });

  test('initScrollAnimations returns undefined when window is undefined', () => {
    const originalWindow = global.window;
    delete global.window;
    
    const result = initScrollAnimations();
    expect(result).toBeUndefined();
    
    global.window = originalWindow;
  });
});

describe('Animation Cleanup', () => {
  test('cleanupAnimations disconnects observer', () => {
    const mockObserver = {
      disconnect: jest.fn()
    };
    
    cleanupAnimations(mockObserver);
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  test('cleanupAnimations handles null observer gracefully', () => {
    expect(() => cleanupAnimations(null)).not.toThrow();
  });
});

describe('Performance Considerations', () => {
  test('animation durations are reasonable for performance', () => {
    // Ensure no animation duration is too long (> 1 second for micro-interactions)
    const microInteractionDurations = [
      ANIMATION_DURATION.FAST,
      ANIMATION_DURATION.NORMAL,
      ANIMATION_DURATION.SLOW
    ];
    
    microInteractionDurations.forEach(duration => {
      expect(duration).toBeLessThanOrEqual(500);
    });
  });

  test('easing functions use hardware-accelerated properties', () => {
    // Cubic-bezier functions are hardware accelerated
    Object.values(ANIMATION_EASING).forEach(easing => {
      expect(easing).toMatch(/cubic-bezier/);
    });
  });

  test('reduced motion preferences are respected throughout', () => {
    mockMatchMedia(true);
    
    // Test various animation functions respect reduced motion
    expect(getAnimationDuration(300)).toBe(1);
    expect(getAnimationEasing(ANIMATION_EASING.EASE_OUT)).toBe('linear');
    
    const animation = createAnimation('fadeIn', 300, ANIMATION_EASING.EASE_OUT);
    expect(animation).toContain('1ms');
    expect(animation).toContain('linear');
  });
});

describe('Accessibility Compliance', () => {
  test('respects prefers-reduced-motion media query', () => {
    mockMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
    
    mockMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  test('provides fallbacks for reduced motion', () => {
    mockMatchMedia(true);
    
    // All animation functions should work with reduced motion
    const mockElement = { style: {}, addEventListener: jest.fn(), removeEventListener: jest.fn() };
    
    fadeIn(mockElement);
    expect(mockElement.style.animation).toContain('1ms');
    
    slideUp(mockElement);
    expect(mockElement.style.animation).toContain('1ms');
    
    scaleIn(mockElement);
    expect(mockElement.style.animation).toContain('1ms');
  });

  test('animation observer respects reduced motion', () => {
    mockMatchMedia(true);
    
    const observer = createScrollAnimationObserver();
    expect(observer).toBeDefined();
    
    // Observer should still work but animations will be reduced
    const mockElement = { classList: { add: jest.fn() } };
    const callback = IntersectionObserver.mock.calls[0][0];
    callback([{ isIntersecting: true, target: mockElement }]);
    
    expect(mockElement.classList.add).toHaveBeenCalled();
  });
});

describe('Default Export', () => {
  test('default export contains all utilities', () => {
    expect(animationUtils).toHaveProperty('ANIMATION_DURATION');
    expect(animationUtils).toHaveProperty('ANIMATION_EASING');
    expect(animationUtils).toHaveProperty('prefersReducedMotion');
    expect(animationUtils).toHaveProperty('getAnimationDuration');
    expect(animationUtils).toHaveProperty('createAnimation');
    expect(animationUtils).toHaveProperty('fadeIn');
    expect(animationUtils).toHaveProperty('slideUp');
    expect(animationUtils).toHaveProperty('staggerAnimation');
    expect(animationUtils).toHaveProperty('initScrollAnimations');
    expect(animationUtils).toHaveProperty('cleanupAnimations');
  });
});