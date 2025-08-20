import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Spinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  return (
    <div
      className={clsx(
        'border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
};

const LoadingDots = ({ className }) => (
  <div className={clsx('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-primary-600 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

const LoadingPulse = ({ className }) => (
  <motion.div
    className={clsx('bg-primary-600 rounded', className)}
    animate={{
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  />
);

const LoadingSkeleton = ({ 
  className, 
  width = '100%', 
  height = '1rem', 
  rounded = 'rounded' 
}) => (
  <motion.div
    className={clsx(
      'bg-secondary-200 animate-pulse',
      rounded,
      className
    )}
    style={{ width, height }}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  />
);

const LoadingOverlay = ({ 
  children, 
  loading = false, 
  spinner = true,
  text = 'Loading...',
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
        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="flex flex-col items-center space-y-3">
          {spinner && <Spinner size="lg" />}
          {text && (
            <p className="text-sm text-secondary-600 font-medium">{text}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const LoadingCard = ({ className }) => (
  <div className={clsx('card p-6', className)}>
    <div className="space-y-4">
      <LoadingSkeleton height="1.5rem" width="60%" />
      <LoadingSkeleton height="1rem" width="100%" />
      <LoadingSkeleton height="1rem" width="80%" />
      <div className="flex space-x-2 pt-2">
        <LoadingSkeleton height="2rem" width="4rem" rounded="rounded-lg" />
        <LoadingSkeleton height="2rem" width="4rem" rounded="rounded-lg" />
      </div>
    </div>
  </div>
);

const LoadingPage = ({ 
  text = 'Loading amazing content...', 
  description = 'This won\'t take long!' 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-50">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="mb-6">
        <Spinner size="xl" />
      </div>
      <h2 className="text-xl font-semibold text-secondary-900 mb-2">
        {text}
      </h2>
      <p className="text-secondary-600">
        {description}
      </p>
    </motion.div>
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
};

export default Spinner;