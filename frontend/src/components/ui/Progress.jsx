import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  label,
  className,
  animate = true,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
  };
  
  const trackClasses = clsx(
    'w-full bg-secondary-200 rounded-full overflow-hidden',
    sizes[size],
    className
  );
  
  const fillClasses = clsx(
    'h-full rounded-full transition-all duration-300 ease-out',
    variants[variant]
  );
  
  const ProgressBar = animate ? motion.div : 'div';
  const progressProps = animate ? {
    initial: { width: 0 },
    animate: { width: `${percentage}%` },
    transition: { duration: 0.8, ease: "easeOut" }
  } : {
    style: { width: `${percentage}%` }
  };
  
  return (
    <div {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-secondary-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={trackClasses}>
        <ProgressBar
          className={fillClasses}
          {...progressProps}
        />
      </div>
    </div>
  );
};

export default Progress;