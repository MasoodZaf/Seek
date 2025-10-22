import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  animate = true,
  gradient = false,
  glow = false,
  fullWidth = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  loadingText = 'Loading...',
  ...props
}, ref) => {
  const baseClasses = 'btn relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: gradient ? 'btn-primary-gradient' : 'btn-primary',
    secondary: 'btn-secondary',
    success: gradient ? 'btn-success-gradient' : 'btn-success',
    warning: gradient ? 'btn-warning-gradient' : 'btn-warning',
    error: gradient ? 'btn-error-gradient' : 'btn-error',
    ghost: 'btn-ghost',
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs rounded-md min-h-[24px]',
    sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    md: 'px-4 py-2 text-sm rounded-lg min-h-[40px]',
    lg: 'px-6 py-3 text-base rounded-lg min-h-[48px]',
    xl: 'px-8 py-4 text-lg rounded-xl min-h-[56px]',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  
  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'w-full': fullWidth,
      'shadow-glow': glow && !disabled && !loading,
      'cursor-pointer': !disabled && !loading,
    },
    className
  );

  // Enhanced loading spinner with better animation and accessibility
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        className={clsx(
          'border-2 border-current border-t-transparent rounded-full animate-spin',
          spinnerSizes[size]
        )}
        role="status"
        aria-label={loadingText}
      />
      <span className="sr-only">{loadingText}</span>
    </div>
  );

  // Enhanced ripple effect for better feedback
  const RippleEffect = () => (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-transparent opacity-0"
      whileHover={{ 
        opacity: [0, 1, 0], 
        x: ['-100%', '100%'] 
      }}
      transition={{ 
        duration: 0.8, 
        ease: 'easeInOut',
        repeat: loading ? Infinity : 0,
        repeatDelay: 0.5
      }}
    />
  );
  
  const ButtonContent = () => (
    <>
      {loading && <LoadingSpinner />}
      <div className={clsx(
        'flex items-center justify-center gap-2 relative z-10',
        { 'opacity-0': loading }
      )}>
        {Icon && iconPosition === 'left' && (
          <Icon className={clsx(iconSizes[size], 'flex-shrink-0')} />
        )}
        <span className="truncate">{children}</span>
        {Icon && iconPosition === 'right' && (
          <Icon className={clsx(iconSizes[size], 'flex-shrink-0')} />
        )}
      </div>
    </>
  );

  // Enhanced hover animations with better spring physics
  const hoverAnimation = {
    scale: disabled || loading ? 1 : 1.02,
    y: disabled || loading ? 0 : -1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      mass: 0.8
    }
  };

  const tapAnimation = {
    scale: disabled || loading ? 1 : 0.98,
    y: disabled || loading ? 0 : 0,
    transition: { 
      type: "spring", 
      stiffness: 600, 
      damping: 30 
    }
  };
  
  // Enhanced accessibility props
  const accessibilityProps = {
    'aria-label': ariaLabel || (loading ? loadingText : undefined),
    'aria-describedby': ariaDescribedBy,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    type: props.type || 'button'
  };

  if (animate) {
    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...accessibilityProps}
        {...props}
      >
        <RippleEffect />
        <ButtonContent />
      </motion.button>
    );
  }
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...accessibilityProps}
      {...props}
    >
      <ButtonContent />
    </button>
  );
});

Button.displayName = 'Button';

export default Button;