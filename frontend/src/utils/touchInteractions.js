/**
 * Touch Interaction Utilities
 * Provides touch-friendly interactions and gesture support
 */

// Touch target size constants (iOS Human Interface Guidelines)
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // 44px minimum touch target
  comfortable: 48, // 48px comfortable touch target
  large: 56, // 56px large touch target
};

// Gesture detection utilities
export class GestureDetector {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      swipeThreshold: 50,
      velocityThreshold: 0.3,
      doubleTapDelay: 300,
      longPressDelay: 500,
      ...options
    };
    
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.lastTap = 0;
    this.longPressTimer = null;
    this.isLongPress = false;
    
    this.bindEvents();
  }

  bindEvents() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
    this.isLongPress = false;

    // Start long press timer
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.onLongPress?.(e);
    }, this.options.longPressDelay);

    this.onTouchStart?.(e);
  }

  handleTouchMove(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.onTouchMove?.(e);
  }

  handleTouchEnd(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (this.isLongPress) {
      return;
    }

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const deltaTime = endTime - this.startTime;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

    // Detect swipe gestures
    if (Math.abs(deltaX) > this.options.swipeThreshold || Math.abs(deltaY) > this.options.swipeThreshold) {
      if (velocity > this.options.velocityThreshold) {
        const direction = this.getSwipeDirection(deltaX, deltaY);
        this.onSwipe?.(direction, { deltaX, deltaY, velocity, e });
        return;
      }
    }

    // Detect double tap
    const now = Date.now();
    if (this.lastTap && (now - this.lastTap) < this.options.doubleTapDelay) {
      this.onDoubleTap?.(e);
      this.lastTap = 0;
    } else {
      this.lastTap = now;
      // Delay single tap to allow for double tap detection
      setTimeout(() => {
        if (this.lastTap === now) {
          this.onTap?.(e);
        }
      }, this.options.doubleTapDelay);
    }

    this.onTouchEnd?.(e);
  }

  handleTouchCancel(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.onTouchCancel?.(e);
  }

  getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }
}

// Pull-to-refresh utility
export class PullToRefresh {
  constructor(element, onRefresh, options = {}) {
    this.element = element;
    this.onRefresh = onRefresh;
    this.options = {
      threshold: 80,
      maxDistance: 120,
      resistance: 2.5,
      ...options
    };
    
    this.startY = 0;
    this.currentY = 0;
    this.isRefreshing = false;
    this.isPulling = false;
    
    this.bindEvents();
  }

  bindEvents() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  handleTouchStart(e) {
    if (this.element.scrollTop === 0 && !this.isRefreshing) {
      this.startY = e.touches[0].clientY;
      this.isPulling = true;
    }
  }

  handleTouchMove(e) {
    if (!this.isPulling || this.isRefreshing) return;

    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.startY;

    if (deltaY > 0) {
      e.preventDefault();
      const distance = Math.min(deltaY / this.options.resistance, this.options.maxDistance);
      this.updatePullIndicator(distance);
    }
  }

  handleTouchEnd(e) {
    if (!this.isPulling || this.isRefreshing) return;

    const deltaY = this.currentY - this.startY;
    const distance = deltaY / this.options.resistance;

    if (distance > this.options.threshold) {
      this.triggerRefresh();
    } else {
      this.resetPull();
    }

    this.isPulling = false;
  }

  updatePullIndicator(distance) {
    const progress = Math.min(distance / this.options.threshold, 1);
    this.onPullProgress?.(progress, distance);
  }

  async triggerRefresh() {
    this.isRefreshing = true;
    this.onRefreshStart?.();
    
    try {
      await this.onRefresh();
    } finally {
      this.isRefreshing = false;
      this.resetPull();
      this.onRefreshEnd?.();
    }
  }

  resetPull() {
    this.onPullReset?.();
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Haptic feedback utility
export const hapticFeedback = {
  light: () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  
  medium: () => {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  },
  
  heavy: () => {
    if (navigator.vibrate) {
      navigator.vibrate([30, 10, 30]);
    }
  },
  
  success: () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 5, 10]);
    }
  },
  
  error: () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 25, 50]);
    }
  },
  
  selection: () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  }
};

// Touch-friendly component wrapper
export const withTouchSupport = (Component) => {
  return React.forwardRef((props, ref) => {
    const {
      onTap,
      onDoubleTap,
      onLongPress,
      onSwipe,
      touchFeedback = 'light',
      minTouchTarget = TOUCH_TARGET_SIZES.minimum,
      ...otherProps
    } = props;

    const elementRef = React.useRef();
    const gestureDetector = React.useRef();

    React.useEffect(() => {
      if (elementRef.current && (onTap || onDoubleTap || onLongPress || onSwipe)) {
        gestureDetector.current = new GestureDetector(elementRef.current);
        
        if (onTap) gestureDetector.current.onTap = onTap;
        if (onDoubleTap) gestureDetector.current.onDoubleTap = onDoubleTap;
        if (onLongPress) gestureDetector.current.onLongPress = onLongPress;
        if (onSwipe) gestureDetector.current.onSwipe = onSwipe;

        return () => {
          gestureDetector.current?.destroy();
        };
      }
    }, [onTap, onDoubleTap, onLongPress, onSwipe]);

    const handleTouchStart = (e) => {
      if (touchFeedback && hapticFeedback[touchFeedback]) {
        hapticFeedback[touchFeedback]();
      }
      props.onTouchStart?.(e);
    };

    return (
      <Component
        {...otherProps}
        ref={(node) => {
          elementRef.current = node;
          if (ref) {
            if (typeof ref === 'function') ref(node);
            else ref.current = node;
          }
        }}
        onTouchStart={handleTouchStart}
        style={{
          minHeight: minTouchTarget,
          minWidth: minTouchTarget,
          touchAction: 'manipulation',
          userSelect: 'none',
          ...props.style
        }}
      />
    );
  });
};

// React hooks for touch interactions
export const useGestures = (ref, handlers = {}) => {
  React.useEffect(() => {
    if (!ref.current) return;

    const detector = new GestureDetector(ref.current);
    
    Object.keys(handlers).forEach(key => {
      if (detector[key] !== undefined) {
        detector[key] = handlers[key];
      }
    });

    return () => detector.destroy();
  }, [ref, handlers]);
};

export const usePullToRefresh = (ref, onRefresh, options = {}) => {
  const pullToRefresh = React.useRef();

  React.useEffect(() => {
    if (!ref.current || !onRefresh) return;

    pullToRefresh.current = new PullToRefresh(ref.current, onRefresh, options);

    return () => pullToRefresh.current?.destroy();
  }, [ref, onRefresh, options]);

  return {
    isRefreshing: pullToRefresh.current?.isRefreshing || false,
    resetPull: () => pullToRefresh.current?.resetPull()
  };
};

// Touch-optimized scroll utilities
export const smoothScrollTo = (element, top, duration = 300) => {
  const start = element.scrollTop;
  const change = top - start;
  const startTime = performance.now();

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeInOutCubic = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    element.scrollTop = start + change * easeInOutCubic;
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export default {
  GestureDetector,
  PullToRefresh,
  hapticFeedback,
  withTouchSupport,
  useGestures,
  usePullToRefresh,
  smoothScrollTo,
  TOUCH_TARGET_SIZES
};