import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  ChevronDownIcon,
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const Select = forwardRef(({
  className,
  label,
  error,
  success,
  helperText,
  leftIcon: LeftIcon,
  placeholder = 'Select an option...',
  animate = true,
  variant = 'default',
  size = 'md',
  required = false,
  children,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base',
  };

  const variants = {
    default: 'input-default',
    success: 'input-success',
    warning: 'input-warning',
    error: 'input-error',
  };

  // Determine current variant based on state
  const currentVariant = error ? 'error' : success ? 'success' : variant;
  
  const selectClasses = clsx(
    'input appearance-none cursor-pointer',
    variants[currentVariant],
    sizes[size],
    {
      'pl-10': LeftIcon,
      'pr-10': true, // Always have space for chevron
    },
    className
  );

  // Status icon component
  const StatusIcon = () => {
    if (error) {
      return <ExclamationCircleIcon className="h-5 w-5 text-error-500" />;
    }
    
    if (success) {
      return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
    }
    
    return null;
  };
  
  const SelectComponent = animate ? motion.select : 'select';
  const selectProps = animate ? {
    whileFocus: { 
      scale: 1.005,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <label className={clsx(
          'block text-sm font-medium mb-2 transition-colors duration-200',
          error ? 'text-error-700' : success ? 'text-success-700' : 'text-secondary-700'
        )}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <LeftIcon className={clsx(
              'h-5 w-5 transition-colors duration-200',
              error ? 'text-error-400' : success ? 'text-success-400' : 'text-secondary-400'
            )} />
          </div>
        )}
        
        {/* Select Field */}
        <SelectComponent
          ref={ref}
          className={selectClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...selectProps}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </SelectComponent>

        {/* Focus Ring Animation */}
        {animate && isFocused && (
          <motion.div
            className={clsx(
              'absolute inset-0 rounded-lg pointer-events-none',
              error ? 'ring-2 ring-error-500' : success ? 'ring-2 ring-success-500' : 'ring-2 ring-primary-500'
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          />
        )}
        
        {/* Right Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2 pointer-events-none z-10">
          {/* Status Icon */}
          <StatusIcon />
          
          {/* Chevron Icon */}
          <ChevronDownIcon className={clsx(
            'h-5 w-5 transition-colors duration-200',
            error ? 'text-error-400' : success ? 'text-success-400' : 'text-secondary-400'
          )} />
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      <AnimatePresence mode="wait">
        {(error || success || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx('mt-2 text-sm flex items-start gap-1', {
              'text-error-600': error,
              'text-success-600': success && !error,
              'text-secondary-600': helperText && !error && !success,
            })}
          >
            {error && <ExclamationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
            {success && !error && <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
            {helperText && !error && !success && <InformationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
            <span>{error || (success && typeof success === 'string' ? success : null) || helperText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;