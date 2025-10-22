import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const Textarea = forwardRef(({
  className,
  label,
  error,
  success,
  helperText,
  placeholder,
  animate = true,
  variant = 'default',
  size = 'md',
  floatingLabel = false,
  required = false,
  rows = 4,
  resize = 'vertical',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  // Track if textarea has value for floating label
  useEffect(() => {
    if (props.value !== undefined) {
      setHasValue(!!props.value);
    }
  }, [props.value]);

  const handleTextareaChange = (e) => {
    setHasValue(!!e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

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

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  // Determine current variant based on state
  const currentVariant = error ? 'error' : success ? 'success' : variant;
  
  const textareaClasses = clsx(
    'input',
    variants[currentVariant],
    sizes[size],
    resizeClasses[resize],
    {
      'pt-6 pb-2': floatingLabel && (isFocused || hasValue),
      'pt-4 pb-4': floatingLabel && !isFocused && !hasValue,
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
  
  const TextareaComponent = animate ? motion.textarea : 'textarea';
  const textareaProps = animate ? {
    whileFocus: { 
      scale: 1.005,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    transition: { duration: 0.2 }
  } : {};
  
  return (
    <div className="relative">
      {/* Traditional Label */}
      {label && !floatingLabel && (
        <label className={clsx(
          'block text-sm font-medium mb-2 transition-colors duration-200',
          error ? 'text-error-700' : success ? 'text-success-700' : 'text-secondary-700'
        )}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Floating Label */}
        {floatingLabel && label && (
          <motion.label
            className={clsx(
              'absolute left-3 transition-all duration-200 pointer-events-none z-10',
              {
                'top-2 text-xs font-medium': isFocused || hasValue,
                'top-4 text-sm': !isFocused && !hasValue,
              },
              error ? 'text-error-600' : success ? 'text-success-600' : isFocused ? 'text-primary-600' : 'text-secondary-500'
            )}
            animate={{
              y: isFocused || hasValue ? 0 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </motion.label>
        )}
        
        {/* Textarea Field */}
        <TextareaComponent
          ref={ref}
          className={textareaClasses}
          placeholder={floatingLabel ? '' : placeholder}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleTextareaChange}
          {...textareaProps}
          {...props}
        />

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
        
        {/* Status Icon */}
        {(error || success) && (
          <div className="absolute top-3 right-3 z-10">
            <StatusIcon />
          </div>
        )}
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

Textarea.displayName = 'Textarea';

export default Textarea;