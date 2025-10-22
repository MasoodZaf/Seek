import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  StopIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  ClockIcon,
  CpuChipIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ExecutionButton = ({ 
  onExecute, 
  onCancel, 
  isExecuting, 
  executionTime, 
  memoryUsage,
  isExecutable = true,
  disabled = false,
  size = 'md',
  variant = 'primary',
  showMetrics = true,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [animationState, setAnimationState] = useState('idle'); // 'idle', 'executing', 'success', 'error'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isExecuting) {
      setAnimationState('executing');
      // Simulate progress for visual feedback
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
      if (animationState === 'executing') {
        setAnimationState('success');
        setTimeout(() => setAnimationState('idle'), 2000);
      }
    }
  }, [isExecuting, animationState]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-8 py-3 text-lg';
      case 'xl':
        return 'px-10 py-4 text-xl';
      default:
        return 'px-6 py-2 text-base';
    }
  };

  const getVariantClasses = () => {
    if (disabled || !isExecutable) {
      return isDarkMode 
        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
        : 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }

    switch (variant) {
      case 'secondary':
        return isDarkMode
          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/25';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25';
      default:
        return isExecuting
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40';
    }
  };

  const getAnimationClasses = () => {
    if (animationState === 'executing') {
      return 'animate-pulse transform scale-105';
    }
    if (animationState === 'success') {
      return 'animate-bounce';
    }
    return 'hover:scale-105 active:scale-95';
  };

  const getIcon = () => {
    if (animationState === 'success') {
      return <CheckIcon className="h-5 w-5" />;
    }
    if (isExecuting) {
      return (
        <div className="relative">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        </div>
      );
    }
    if (!isExecutable) {
      return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
    return <PlayIcon className="h-5 w-5" />;
  };

  const getButtonText = () => {
    if (animationState === 'success') {
      return 'Success!';
    }
    if (isExecuting) {
      return 'Running...';
    }
    if (!isExecutable) {
      return 'Not Executable';
    }
    return 'Run Code';
  };

  const handleClick = () => {
    if (disabled || !isExecutable) return;
    
    if (isExecuting) {
      onCancel?.();
    } else {
      onExecute?.();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Main execution button */}
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={disabled || !isExecutable}
          className={`
            relative overflow-hidden rounded-lg font-medium transition-all duration-300 ease-out
            ${getSizeClasses()}
            ${getVariantClasses()}
            ${getAnimationClasses()}
            ${className}
          `}
        >
          {/* Progress bar background */}
          {isExecuting && (
            <div 
              className="absolute inset-0 bg-white bg-opacity-20 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          )}
          
          {/* Button content */}
          <div className="relative flex items-center space-x-2 z-10">
            {getIcon()}
            <span>{getButtonText()}</span>
          </div>

          {/* Glow effect */}
          {!disabled && isExecutable && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 hover:opacity-20 transition-opacity duration-300" />
          )}
        </button>

        {/* Execution ring animation */}
        {isExecuting && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-400 animate-ping opacity-75" />
        )}
      </div>

      {/* Cancel button when executing */}
      {isExecuting && onCancel && (
        <button
          onClick={onCancel}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${isDarkMode 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-red-600 text-white hover:bg-red-700'
            }
          `}
        >
          <StopIcon className="h-4 w-4" />
          <span>Cancel</span>
        </button>
      )}

      {/* Execution metrics */}
      {showMetrics && (executionTime || memoryUsage) && (
        <div className="flex items-center space-x-4">
          {executionTime && (
            <div className={`flex items-center space-x-1 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <ClockIcon className="h-4 w-4" />
              <span>{executionTime}ms</span>
            </div>
          )}
          
          {memoryUsage && (
            <div className={`flex items-center space-x-1 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <CpuChipIcon className="h-4 w-4" />
              <span>{memoryUsage}KB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Performance indicator component
export const PerformanceIndicator = ({ executionTime, memoryUsage, className = '' }) => {
  const { isDarkMode } = useTheme();
  
  const getPerformanceLevel = () => {
    if (!executionTime) return 'unknown';
    if (executionTime < 100) return 'excellent';
    if (executionTime < 500) return 'good';
    if (executionTime < 1000) return 'fair';
    return 'slow';
  };

  const getPerformanceColor = () => {
    const level = getPerformanceLevel();
    switch (level) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'slow': return 'text-red-500';
      default: return isDarkMode ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getPerformanceIcon = () => {
    const level = getPerformanceLevel();
    switch (level) {
      case 'excellent':
      case 'good':
        return <BoltIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center space-x-1 ${getPerformanceColor()}`}>
        {getPerformanceIcon()}
        <span className="text-sm font-medium">
          {getPerformanceLevel().charAt(0).toUpperCase() + getPerformanceLevel().slice(1)}
        </span>
      </div>
      
      {executionTime && (
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {executionTime}ms
        </div>
      )}
      
      {memoryUsage && (
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {memoryUsage}KB
        </div>
      )}
    </div>
  );
};

export default ExecutionButton;