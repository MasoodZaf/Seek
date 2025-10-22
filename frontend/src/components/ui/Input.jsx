import React, { forwardRef, useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { getAriaDescribedBy } from '../../utils/accessibility';

const Input = forwardRef(({
  className,
  type = 'text',
  label,
  error,
  success,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  placeholder,
  showPasswordToggle = false,
  animate = true,
  variant = 'default',
  size = 'md',
  floatingLabel = false,
  required = false,
  loading = false,
  id: providedId,
  'aria-label': ariaLabel,
  'aria-describedby': providedAriaDescribedBy,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  // Generate unique IDs for accessibility
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const labelId = `${inputId}-label`;
  
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Track if input has value for floating label
  useEffect(() => {
    if (props.value !== undefined) {
      setHasValue(!!props.value);
    }
  }, [props.value]);

  const handleInputChange = (e) => {
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

  // Determine current variant based on state
  const currentVariant = error ? 'error' : success ? 'success' : variant;
  
  const inputClasses = clsx(
    'input',
    variants[currentVariant],
    sizes[size],
    {
      'pl-10': LeftIcon,
      'pr-10': RightIcon || (type === 'password' && showPasswordToggle) || loading || error || success,
      'pt-6 pb-2': floatingLabel && (isFocused || hasValue),
      'pt-4 pb-4': floatingLabel && !isFocused && !hasValue,
    },
    className
  );

  // Status icon component
  const StatusIcon = () => {
    if (loading) {
      return (
        <div className="animate-spin">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </div>
      );
    }
    
    if (error) {
      return <ExclamationCircleIcon className="h-5 w-5 text-error-500" />;
    }
    
    if (success) {
      return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
    }
    
    return null;
  };
  
  const InputComponent = animate ? motion.input : 'input';
  const inputProps = animate ? {
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
        <label 
          id={labelId}
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-medium mb-2 transition-colors duration-200',
            error ? 'text-error-700' : success ? 'text-success-700' : 'text-secondary-700'
          )}
        >
          {label}
          {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
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

        {/* Floating Label */}
        {floatingLabel && label && (
          <motion.label
            id={labelId}
            htmlFor={inputId}
            className={clsx(
              'absolute left-3 transition-all duration-200 pointer-events-none z-10',
              LeftIcon && 'left-10',
              {
                'top-2 text-xs font-medium': isFocused || hasValue,
                'top-1/2 -translate-y-1/2 text-sm': !isFocused && !hasValue,
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
            {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
          </motion.label>
        )}
        
        {/* Input Field */}
        <InputComponent
          ref={ref}
          id={inputId}
          type={inputType}
          className={inputClasses}
          placeholder={floatingLabel ? '' : placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
          required={required}
          aria-label={ariaLabel || (floatingLabel ? label : undefined)}
          aria-labelledby={!ariaLabel && label && !floatingLabel ? labelId : undefined}
          aria-describedby={getAriaDescribedBy(inputId, !!error, !!(helperText || success))}
          aria-invalid={!!error}
          aria-required={required}
          {...inputProps}
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
        
        {/* Right Icons */}
        {(RightIcon || (type === 'password' && showPasswordToggle) || loading || error || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2 z-10">
            {/* Status Icon */}
            <StatusIcon />
            
            {/* Password Toggle */}
            {type === 'password' && showPasswordToggle && (
              <button
                type="button"
                className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded focus:text-primary-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            )}
            
            {/* Custom Right Icon */}
            {RightIcon && !loading && !error && !success && (
              <RightIcon className="h-5 w-5 text-secondary-400" />
            )}
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
            id={error ? errorId : helpId}
            role={error ? 'alert' : 'status'}
            aria-live={error ? 'assertive' : 'polite'}
            className={clsx('mt-2 text-sm flex items-start gap-1', {
              'text-error-600': error,
              'text-success-600': success && !error,
              'text-secondary-600': helperText && !error && !success,
            })}
          >
            {error && <ExclamationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />}
            {success && !error && <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />}
            {helperText && !error && !success && <InformationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />}
            <span>{error || (success && typeof success === 'string' ? success : null) || helperText}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;