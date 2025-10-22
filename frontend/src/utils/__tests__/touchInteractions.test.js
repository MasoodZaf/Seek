import { GestureDetector, PullToRefresh, hapticFeedback, TOUCH_TARGET_SIZES } from '../touchInteractions';

// Mock DOM methods
Object.defineProperty(window, 'navigator', {
  value: {
    vibrate: jest.fn()
  },
  writable: true
});

describe('TouchInteractions', () => {
  describe('TOUCH_TARGET_SIZES', () => {
    test('should have correct minimum touch target size', () => {
      expect(TOUCH_TARGET_SIZES.minimum).toBe(44);
    });

    test('should have comfortable touch target size', () => {
      expect(TOUCH_TARGET_SIZES.comfortable).toBe(48);
    });

    test('should have large touch target size', () => {
      expect(TOUCH_TARGET_SIZES.large).toBe(56);
    });
  });

  describe('GestureDetector', () => {
    let element;
    let detector;
    let mockHandlers;

    beforeEach(() => {
      element = document.createElement('div');
      mockHandlers = {
        onTap: jest.fn(),
        onDoubleTap: jest.fn(),
        onLongPress: jest.fn(),
        onSwipe: jest.fn()
      };
      detector = new GestureDetector(element);
      Object.assign(detector, mockHandlers);
    });

    afterEach(() => {
      detector.destroy();
    });

    test('should create gesture detector with default options', () => {
      expect(detector.element).toBe(element);
      expect(detector.options.swipeThreshold).toBe(50);
      expect(detector.options.velocityThreshold).toBe(0.3);
      expect(detector.options.doubleTapDelay).toBe(300);
      expect(detector.options.longPressDelay).toBe(500);
    });

    test('should detect tap gesture', (done) => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      const mockTouchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100, clientY: 100 }]
      });

      detector.onTap = (e) => {
        expect(e).toBe(mockTouchEnd);
        done();
      };

      element.dispatchEvent(mockTouchStart);
      setTimeout(() => {
        element.dispatchEvent(mockTouchEnd);
      }, 100);
    });

    test('should detect swipe right gesture', () => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      const mockTouchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 200, clientY: 100 }]
      });

      element.dispatchEvent(mockTouchStart);
      element.dispatchEvent(mockTouchEnd);

      expect(mockHandlers.onSwipe).toHaveBeenCalledWith(
        'right',
        expect.objectContaining({
          deltaX: 100,
          deltaY: 0
        })
      );
    });

    test('should detect swipe left gesture', () => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 200, clientY: 100 }]
      });
      const mockTouchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100, clientY: 100 }]
      });

      element.dispatchEvent(mockTouchStart);
      element.dispatchEvent(mockTouchEnd);

      expect(mockHandlers.onSwipe).toHaveBeenCalledWith(
        'left',
        expect.objectContaining({
          deltaX: -100,
          deltaY: 0
        })
      );
    });

    test('should detect long press gesture', (done) => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });

      detector.onLongPress = (e) => {
        expect(e).toBe(mockTouchStart);
        done();
      };

      element.dispatchEvent(mockTouchStart);
    });

    test('should cancel long press on touch move', () => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      const mockTouchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 110, clientY: 100 }]
      });

      element.dispatchEvent(mockTouchStart);
      element.dispatchEvent(mockTouchMove);

      setTimeout(() => {
        expect(mockHandlers.onLongPress).not.toHaveBeenCalled();
      }, 600);
    });

    test('should get correct swipe direction', () => {
      expect(detector.getSwipeDirection(100, 0)).toBe('right');
      expect(detector.getSwipeDirection(-100, 0)).toBe('left');
      expect(detector.getSwipeDirection(0, 100)).toBe('down');
      expect(detector.getSwipeDirection(0, -100)).toBe('up');
    });
  });

  describe('PullToRefresh', () => {
    let element;
    let pullToRefresh;
    let mockOnRefresh;

    beforeEach(() => {
      element = document.createElement('div');
      element.scrollTop = 0;
      mockOnRefresh = jest.fn().mockResolvedValue();
      pullToRefresh = new PullToRefresh(element, mockOnRefresh);
    });

    afterEach(() => {
      pullToRefresh.destroy();
    });

    test('should create pull to refresh with default options', () => {
      expect(pullToRefresh.element).toBe(element);
      expect(pullToRefresh.onRefresh).toBe(mockOnRefresh);
      expect(pullToRefresh.options.threshold).toBe(80);
      expect(pullToRefresh.options.maxDistance).toBe(120);
      expect(pullToRefresh.options.resistance).toBe(2.5);
    });

    test('should trigger refresh when threshold is exceeded', async () => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientY: 100 }]
      });
      const mockTouchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientY: 300 }]
      });

      element.dispatchEvent(mockTouchStart);
      pullToRefresh.currentY = 300;
      element.dispatchEvent(mockTouchEnd);

      expect(mockOnRefresh).toHaveBeenCalled();
    });

    test('should not trigger refresh when threshold is not exceeded', () => {
      const mockTouchStart = new TouchEvent('touchstart', {
        touches: [{ clientY: 100 }]
      });
      const mockTouchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientY: 150 }]
      });

      element.dispatchEvent(mockTouchStart);
      pullToRefresh.currentY = 150;
      element.dispatchEvent(mockTouchEnd);

      expect(mockOnRefresh).not.toHaveBeenCalled();
    });
  });

  describe('hapticFeedback', () => {
    beforeEach(() => {
      navigator.vibrate.mockClear();
    });

    test('should trigger light haptic feedback', () => {
      hapticFeedback.light();
      expect(navigator.vibrate).toHaveBeenCalledWith(10);
    });

    test('should trigger medium haptic feedback', () => {
      hapticFeedback.medium();
      expect(navigator.vibrate).toHaveBeenCalledWith(20);
    });

    test('should trigger heavy haptic feedback', () => {
      hapticFeedback.heavy();
      expect(navigator.vibrate).toHaveBeenCalledWith([30, 10, 30]);
    });

    test('should trigger success haptic feedback', () => {
      hapticFeedback.success();
      expect(navigator.vibrate).toHaveBeenCalledWith([10, 5, 10]);
    });

    test('should trigger error haptic feedback', () => {
      hapticFeedback.error();
      expect(navigator.vibrate).toHaveBeenCalledWith([50, 25, 50]);
    });

    test('should trigger selection haptic feedback', () => {
      hapticFeedback.selection();
      expect(navigator.vibrate).toHaveBeenCalledWith(5);
    });

    test('should handle missing vibrate API gracefully', () => {
      const originalVibrate = navigator.vibrate;
      delete navigator.vibrate;

      expect(() => {
        hapticFeedback.light();
      }).not.toThrow();

      navigator.vibrate = originalVibrate;
    });
  });
});