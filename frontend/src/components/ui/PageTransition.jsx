import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100vw',
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: '100vw',
    scale: 1.02
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// Alternative slide transitions (for future use)
// eslint-disable-next-line no-unused-vars
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

// Fade transition
const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

// Scale transition
const scaleVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.1 }
};

// Rotation transition (for special pages)
const rotateVariants = {
  initial: { opacity: 0, rotate: -180, scale: 0.5 },
  in: { opacity: 1, rotate: 0, scale: 1 },
  out: { opacity: 0, rotate: 180, scale: 0.5 }
};

export const PageTransition = ({ 
  children, 
  type = 'fade',
  className = '',
  ...props 
}) => {
  const location = useLocation();
  
  const getVariants = () => {
    switch (type) {
      case 'slide':
        return pageVariants;
      case 'fade':
        return fadeVariants;
      case 'scale':
        return scaleVariants;
      case 'rotate':
        return rotateVariants;
      default:
        return fadeVariants;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={`min-h-screen ${className}`}
        initial="initial"
        animate="in"
        exit="out"
        variants={getVariants()}
        transition={pageTransition}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Higher-order component for wrapping pages
export const withPageTransition = (Component, transitionType = 'fade') => {
  return function TransitionWrappedComponent(props) {
    return (
      <PageTransition type={transitionType}>
        <Component {...props} />
      </PageTransition>
    );
  };
};

// Route transition container
export const RouteTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Staggered children animation
export const StaggeredContainer = ({ children, staggerDelay = 0.1, className = '' }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({ children, className = '' }) => {
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};

// Loading transition
export const LoadingTransition = ({ isLoading, children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={isLoading ? 'loading' : 'content'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// Modal/Dialog transitions
export const ModalTransition = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          className="max-w-lg w-full mx-4"
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PageTransition;