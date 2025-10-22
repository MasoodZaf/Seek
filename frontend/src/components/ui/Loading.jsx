import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Spinner = ({ size = 'md', variant = 'primary', className }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const variants = {
    primary: 'border-primary-200 border-t-primary-600',
    success: 'border-success-200 border-t-success-600',
    warning: 'border-warning-200 border-t-warning-600',
    error: 'border-error-200 border-t-error-600',
    white: 'border-white/30 border-t-white',
    gradient: 'border-transparent',
  };
  
  if (variant === 'gradient') {
    return (
      <motion.div
        className={clsx(sizes[size], 'rounded-full', className)}
        style={{
          background: 'conic-gradient(from 0deg, transparent, #3b82f6, transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full bg-white" style={{ margin: '2px' }} />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={clsx(
        'border-2 rounded-full',
        sizes[size],
        variants[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

const LoadingDots = ({ className, variant = 'primary', size = 'md' }) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
    white: 'bg-white',
    gradient: 'bg-gradient-primary',
  };

  return (
    <div className={clsx('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={clsx(sizes[size], variants[variant], 'rounded-full')}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const LoadingPulse = ({ className, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
    gradient: 'bg-gradient-primary',
  };

  return (
    <motion.div
      className={clsx(variants[variant], 'rounded', className)}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

const LoadingSkeleton = ({ 
  className, 
  width = '100%', 
  height = '1rem', 
  rounded = 'rounded',
  shimmer = true,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-secondary-200',
    light: 'bg-secondary-100',
    dark: 'bg-secondary-300',
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        variants[variant],
        rounded,
        className
      )}
      style={{ width, height }}
    >
      {shimmer && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      {!shimmer && (
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

const LoadingOverlay = ({ 
  children, 
  loading = false, 
  spinner = true,
  text = 'Loading...',
  variant = 'primary',
  blur = true,
  className 
}) => {
  if (!loading) return children;
  
  return (
    <div className={clsx('relative', className)}>
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          'absolute inset-0 bg-white/90 flex items-center justify-center z-50',
          blur && 'backdrop-blur-sm'
        )}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-elevation-2"
        >
          {spinner && <Spinner size="lg" variant={variant} />}
          {text && (
            <div className="text-center">
              <p className="text-sm text-secondary-700 font-medium">{text}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const LoadingCard = ({ className, variant = 'default' }) => (
  <motion.div
    className={clsx('card p-6', className)}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="space-y-4">
      <LoadingSkeleton height="1.5rem" width="60%" variant={variant} />
      <LoadingSkeleton height="1rem" width="100%" variant={variant} />
      <LoadingSkeleton height="1rem" width="80%" variant={variant} />
      <LoadingSkeleton height="1rem" width="90%" variant={variant} />
      <div className="flex space-x-3 pt-2">
        <LoadingSkeleton height="2.5rem" width="5rem" rounded="rounded-lg" variant={variant} />
        <LoadingSkeleton height="2.5rem" width="5rem" rounded="rounded-lg" variant={variant} />
      </div>
    </div>
  </motion.div>
);

const LoadingPage = ({ 
  text = 'Loading amazing content...', 
  description = 'This won\'t take long!',
  variant = 'gradient',
  showProgress = false,
  progress = 0
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-primary-50/30">
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center max-w-md mx-auto px-6"
    >
      <div className="mb-8">
        <Spinner size="2xl" variant={variant} />
      </div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-secondary-900 mb-3"
      >
        {text}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-secondary-600 mb-6"
      >
        {description}
      </motion.p>
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 0.4 }}
          className="w-full bg-secondary-200 rounded-full h-2 mb-4"
        >
          <motion.div
            className="bg-gradient-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <LoadingDots variant={variant === 'gradient' ? 'primary' : variant} />
      </motion.div>
    </motion.div>
  </div>
);

// Professional branded loading components
const BrandedSpinner = ({ size = 'md', className }) => (
  <div className={clsx('relative', className)}>
    <Spinner size={size} variant="gradient" />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ rotate: -360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-1/2 h-1/2 bg-primary-600 rounded-full opacity-20" />
    </motion.div>
  </div>
);

const LoadingButton = ({ children, loading = false, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={clsx(
      'btn btn-primary relative',
      { 'opacity-75 cursor-not-allowed': loading },
      props.className
    )}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size="sm" variant="white" />
      </div>
    )}
    <span className={clsx({ 'opacity-0': loading })}>
      {children}
    </span>
  </button>
);

const ProgressLoader = ({ progress = 0, text = 'Loading...', className }) => (
  <div className={clsx('w-full max-w-md mx-auto', className)}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-secondary-700">{text}</span>
      <span className="text-sm text-secondary-500">{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-secondary-200 rounded-full h-2">
      <motion.div
        className="bg-gradient-primary h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const LoadingList = ({ items = 3, className }) => (
  <div className={clsx('space-y-3', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-secondary-200"
      >
        <LoadingSkeleton width="3rem" height="3rem" rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton height="1rem" width="70%" />
          <LoadingSkeleton height="0.75rem" width="50%" />
        </div>
      </motion.div>
    ))}
  </div>
);

export {
  Spinner,
  LoadingDots,
  LoadingPulse,
  LoadingSkeleton,
  LoadingOverlay,
  LoadingCard,
  LoadingPage,
  BrandedSpinner,
  LoadingButton,
  ProgressLoader,
  LoadingList,
};

export default Spinner;