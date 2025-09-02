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
  ...props
}, ref) => {
  const baseClasses = 'btn relative overflow-hidden';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    ghost: 'btn-ghost',
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'opacity-50 cursor-not-allowed': disabled || loading,
      'cursor-pointer': !disabled && !loading,
    },
    className
  );
  
  const ButtonContent = () => (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className={clsx('flex items-center gap-2', { 'opacity-0': loading })}>
        {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
      </div>
    </>
  );
  
  if (animate) {
    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileHover={{ 
          scale: disabled || loading ? 1 : 1.05,
          y: disabled || loading ? 0 : -2,
          boxShadow: disabled || loading ? 'none' : '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
        }}
        whileTap={{ 
          scale: disabled || loading ? 1 : 0.95,
          y: disabled || loading ? 0 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17,
          boxShadow: { duration: 0.2 }
        }}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
          whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        <ButtonContent />
      </motion.button>
    );
  }
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      <ButtonContent />
    </button>
  );
});

Button.displayName = 'Button';

export default Button;