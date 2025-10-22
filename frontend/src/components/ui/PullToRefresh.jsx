import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import { usePullToRefresh, hapticFeedback } from '../../utils/touchInteractions';

const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 80,
  maxDistance = 120,
  disabled = false,
  className = '',
  refreshingText = 'Refreshing...',
  pullText = 'Pull to refresh',
  releaseText = 'Release to refresh'
}) => {
  const containerRef = useRef();
  const [pullDistance, setPullDistance] = useState(0);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshComplete, setRefreshComplete] = useState(false);

  const handleRefresh = async () => {
    if (disabled) return;
    
    setIsRefreshing(true);
    hapticFeedback.medium();
    
    try {
      await onRefresh?.();
      setRefreshComplete(true);
      hapticFeedback.success();
      
      // Show success state briefly
      setTimeout(() => {
        setRefreshComplete(false);
        setIsRefreshing(false);
        setPullDistance(0);
        setPullProgress(0);
      }, 1000);
    } catch (error) {
      hapticFeedback.error();
      setIsRefreshing(false);
      setPullDistance(0);
      setPullProgress(0);
    }
  };

  const pullToRefresh = usePullToRefresh(containerRef, handleRefresh, {
    threshold,
    maxDistance,
    onPullProgress: (progress, distance) => {
      setPullProgress(progress);
      setPullDistance(distance);
      
      // Haptic feedback at threshold
      if (progress >= 1 && pullProgress < 1) {
        hapticFeedback.light();
      }
    },
    onPullReset: () => {
      setPullDistance(0);
      setPullProgress(0);
    }
  });

  const getStatusText = () => {
    if (refreshComplete) return 'Refreshed!';
    if (isRefreshing) return refreshingText;
    if (pullProgress >= 1) return releaseText;
    return pullText;
  };

  const getStatusIcon = () => {
    if (refreshComplete) {
      return <CheckIcon className="h-5 w-5 text-green-500" />;
    }
    
    if (isRefreshing) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ArrowPathIcon className="h-5 w-5 text-primary-500" />
        </motion.div>
      );
    }
    
    return (
      <motion.div
        animate={{ 
          rotate: pullProgress >= 1 ? 180 : pullProgress * 180,
          scale: Math.max(0.8, pullProgress)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ArrowPathIcon className="h-5 w-5 text-primary-500" />
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        transform: `translateY(${Math.min(pullDistance, maxDistance)}px)`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull Indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ 
              opacity: 1, 
              y: -60 + Math.min(pullDistance * 0.8, 60),
              scale: Math.max(0.8, Math.min(pullProgress * 1.2, 1.2))
            }}
            exit={{ opacity: 0, y: -60 }}
            className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center py-4"
          >
            {/* Background blur */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-lg" />
            
            {/* Content */}
            <div className="relative flex flex-col items-center space-y-2">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100">
                {getStatusIcon()}
              </div>
              
              {/* Progress Ring */}
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={`${
                      refreshComplete 
                        ? 'text-green-500' 
                        : pullProgress >= 1 
                          ? 'text-primary-500' 
                          : 'text-gray-400'
                    }`}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: refreshComplete ? 1 : Math.min(pullProgress, 1),
                      rotate: isRefreshing ? 360 : 0
                    }}
                    transition={{ 
                      pathLength: { duration: 0.3 },
                      rotate: { duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }
                    }}
                    style={{
                      pathLength: refreshComplete ? 1 : Math.min(pullProgress, 1)
                    }}
                  />
                </svg>
              </div>
              
              {/* Status Text */}
              <motion.p 
                key={getStatusText()}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm font-medium ${
                  refreshComplete 
                    ? 'text-green-600' 
                    : pullProgress >= 1 
                      ? 'text-primary-600' 
                      : 'text-gray-500'
                }`}
              >
                {getStatusText()}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;