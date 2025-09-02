import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  style = 'default',
  showLabel = true,
  showPercentage = true,
  label,
  className,
  animate = true,
  striped = false,
  animated = false,
  glowing = false,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };
  
  const variants = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    error: 'from-error-500 to-error-600',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  };
  
  const trackClasses = clsx(
    'w-full rounded-full overflow-hidden relative',
    sizes[size],
    style === 'glass' ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-secondary-200',
    {
      'shadow-inner': style === 'inset',
      'shadow-glow': glowing,
    },
    className
  );
  
  const fillClasses = clsx(
    'h-full rounded-full relative overflow-hidden',
    style === 'flat' ? variants[variant].replace('from-', 'bg-').split(' ')[0].replace('to-', '') : `bg-gradient-to-r ${variants[variant]}`,
    {
      'shadow-lg': style === 'elevated',
      'animate-pulse': animated && !animate,
    }
  );
  
  const ProgressBar = animate ? motion.div : 'div';
  const progressProps = animate ? {
    initial: { width: 0, opacity: 0 },
    animate: { 
      width: `${percentage}%`, 
      opacity: 1,
      transition: { 
        width: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
        opacity: { duration: 0.3 }
      }
    }
  } : {
    style: { width: `${percentage}%` }
  };
  
  return (
    <div {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label || 'Progress'}
          </span>
          {showPercentage && (
            <motion.span 
              className="text-sm text-secondary-600 dark:text-secondary-400 font-mono"
              initial={animate ? { opacity: 0 } : {}}
              animate={animate ? { opacity: 1 } : {}}
              transition={animate ? { delay: 0.5 } : {}}
            >
              {Math.round(percentage)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div className={trackClasses}>
        <ProgressBar
          className={fillClasses}
          {...progressProps}
        >
          {/* Striped pattern */}
          {striped && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] animate-[stripe_1s_linear_infinite]" />
          )}
          
          {/* Shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          
          {/* Particle effect for special occasions */}
          {percentage === 100 && animate && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [-10, -20, -10],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </ProgressBar>
        
        {/* Glow effect */}
        {glowing && percentage > 0 && (
          <motion.div
            className={`absolute inset-0 rounded-full opacity-50 blur-sm bg-gradient-to-r ${variants[variant]}`}
            style={{ width: `${percentage}%` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

export default Progress;