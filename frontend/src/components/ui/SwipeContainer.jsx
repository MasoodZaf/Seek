import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useGestures, hapticFeedback } from '../../utils/touchInteractions';

const SwipeContainer = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  velocityThreshold = 0.3,
  enableHaptic = true,
  showSwipeIndicators = true,
  className = '',
  ...props
}) => {
  const containerRef = useRef();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSwipe = (direction, data) => {
    if (enableHaptic) {
      hapticFeedback.medium();
    }

    setSwipeDirection(direction);
    
    // Execute appropriate callback
    switch (direction) {
      case 'left':
        onSwipeLeft?.(data);
        break;
      case 'right':
        onSwipeRight?.(data);
        break;
      case 'up':
        onSwipeUp?.(data);
        break;
      case 'down':
        onSwipeDown?.(data);
        break;
    }

    // Reset after animation
    setTimeout(() => {
      setSwipeDirection(null);
      setSwipeProgress(0);
    }, 300);
  };

  useGestures(containerRef, {
    onSwipe: handleSwipe,
    onTouchStart: () => {
      setIsDragging(true);
      if (enableHaptic) {
        hapticFeedback.selection();
      }
    },
    onTouchEnd: () => {
      setIsDragging(false);
      setSwipeProgress(0);
    }
  });

  const handleDrag = (event, info) => {
    const { offset } = info;
    const maxOffset = Math.max(Math.abs(offset.x), Math.abs(offset.y));
    const progress = Math.min(maxOffset / swipeThreshold, 1);
    setSwipeProgress(progress);

    // Determine primary direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      setSwipeDirection(offset.x > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(offset.y > 0 ? 'down' : 'up');
    }
  };

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    if (speed > velocityThreshold * 1000) {
      // High velocity swipe
      if (Math.abs(offset.x) > Math.abs(offset.y)) {
        handleSwipe(offset.x > 0 ? 'right' : 'left', { offset, velocity, event });
      } else {
        handleSwipe(offset.y > 0 ? 'down' : 'up', { offset, velocity, event });
      }
    } else if (Math.max(Math.abs(offset.x), Math.abs(offset.y)) > swipeThreshold) {
      // Distance-based swipe
      if (Math.abs(offset.x) > Math.abs(offset.y)) {
        handleSwipe(offset.x > 0 ? 'right' : 'left', { offset, velocity, event });
      } else {
        handleSwipe(offset.y > 0 ? 'down' : 'up', { offset, velocity, event });
      }
    }
    
    setIsDragging(false);
    setSwipeProgress(0);
    setSwipeDirection(null);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative touch-manipulation ${className}`}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      {...props}
    >
      {/* Swipe Indicators */}
      {showSwipeIndicators && (
        <AnimatePresence>
          {isDragging && swipeProgress > 0.3 && (
            <>
              {/* Left Swipe Indicator */}
              {swipeDirection === 'left' && onSwipeLeft && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: swipeProgress, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium">Delete</span>
                  </div>
                </motion.div>
              )}

              {/* Right Swipe Indicator */}
              {swipeDirection === 'right' && onSwipeRight && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: swipeProgress, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                </motion.div>
              )}

              {/* Up Swipe Indicator */}
              {swipeDirection === 'up' && onSwipeUp && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: swipeProgress, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l3-3m0 0l3 3m-3-3v6m0-6V4" />
                    </svg>
                    <span className="text-sm font-medium">More</span>
                  </div>
                </motion.div>
              )}

              {/* Down Swipe Indicator */}
              {swipeDirection === 'down' && onSwipeDown && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: swipeProgress, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className="flex items-center space-x-2 bg-purple-500 text-white px-3 py-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-sm font-medium">Dismiss</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      )}

      {/* Content */}
      <motion.div
        animate={{
          scale: isDragging ? 0.98 : 1,
          opacity: swipeDirection ? 0.8 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* Swipe Progress Indicator */}
      {isDragging && swipeProgress > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        >
          <div 
            className={`
              absolute inset-0 rounded-lg transition-colors duration-200
              ${swipeDirection === 'left' ? 'bg-red-500' : ''}
              ${swipeDirection === 'right' ? 'bg-green-500' : ''}
              ${swipeDirection === 'up' ? 'bg-blue-500' : ''}
              ${swipeDirection === 'down' ? 'bg-purple-500' : ''}
            `}
            style={{ opacity: swipeProgress * 0.2 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwipeContainer;