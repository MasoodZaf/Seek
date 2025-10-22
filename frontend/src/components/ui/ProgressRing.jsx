import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ProgressRing = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  strokeWidth = 8,
  showLabel = true,
  showPercentage = true,
  label,
  className,
  animate = true,
  glowing = false,
  children,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    xs: { width: 40, height: 40, strokeWidth: 4 },
    sm: { width: 60, height: 60, strokeWidth: 6 },
    md: { width: 80, height: 80, strokeWidth: 8 },
    lg: { width: 120, height: 120, strokeWidth: 10 },
    xl: { width: 160, height: 160, strokeWidth: 12 },
  };
  
  const variants = {
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'url(#gradient)',
  };
  
  const { width, height } = sizes[size];
  const actualStrokeWidth = strokeWidth || sizes[size].strokeWidth;
  const radius = (width - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)} {...props}>
      <svg
        width={width}
        height={height}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          {glowing && (
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>
        
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={actualStrokeWidth}
          fill="none"
          className="text-secondary-200 dark:text-secondary-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke={variants[variant]}
          strokeWidth={actualStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={animate ? { strokeDashoffset } : {}}
          transition={animate ? {
            duration: 1.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          } : {}}
          filter={glowing ? 'url(#glow)' : undefined}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            {showPercentage && (
              <motion.span
                className="text-lg font-bold text-secondary-900 dark:text-secondary-100"
                initial={animate ? { opacity: 0, scale: 0.5 } : {}}
                animate={animate ? { opacity: 1, scale: 1 } : {}}
                transition={animate ? { delay: 0.5, duration: 0.5 } : {}}
              >
                {Math.round(percentage)}%
              </motion.span>
            )}
            {showLabel && label && (
              <span className="text-xs text-secondary-600 dark:text-secondary-400 text-center">
                {label}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;