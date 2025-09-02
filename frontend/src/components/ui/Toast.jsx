import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const toastVariants = {
  hidden: { 
    opacity: 0, 
    x: 500,
    scale: 0.3,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    x: 500,
    scale: 0.5,
    transition: {
      duration: 0.2
    }
  }
};

const Toast = ({
  id,
  type = 'info',
  title,
  message,
  onClose,
  action,
  duration = 5000,
  persistent = false
}) => {
  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const styles = {
    success: 'bg-white border-l-4 border-success-500 shadow-lg',
    error: 'bg-white border-l-4 border-error-500 shadow-lg',
    warning: 'bg-white border-l-4 border-warning-500 shadow-lg',
    info: 'bg-white border-l-4 border-primary-500 shadow-lg',
  };

  const iconStyles = {
    success: 'text-success-500',
    error: 'text-error-500',
    warning: 'text-warning-500',
    info: 'text-primary-500',
  };

  const Icon = icons[type];

  React.useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, persistent, onClose]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={clsx(
        'max-w-md w-full rounded-lg p-4 pointer-events-auto ring-1 ring-black ring-opacity-5',
        styles[type]
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={clsx('h-6 w-6', iconStyles[type])} />
        </div>
        <div className="ml-3 w-0 flex-1">
          {title && (
            <p className="text-sm font-medium text-gray-900">{title}</p>
          )}
          <p className={clsx('text-sm text-gray-700', { 'mt-1': title })}>
            {message}
          </p>
          {action && (
            <div className="mt-3">
              <button
                type="button"
                className="bg-white rounded-md text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={action.handler}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => onClose(id)}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for timed toasts */}
      {!persistent && duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-bl-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer = ({ toasts = [], onClose }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-6 space-y-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Enhanced toast context and hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...toast };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = React.useCallback({
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    
    // Advanced methods
    promise: async (promise, { loading, success, error }) => {
      const id = addToast({ type: 'info', message: loading, persistent: true });
      
      try {
        const result = await promise;
        removeToast(id);
        addToast({ type: 'success', message: success });
        return result;
      } catch (err) {
        removeToast(id);
        addToast({ type: 'error', message: error || err.message });
        throw err;
      }
    },
    
    custom: (component, options = {}) => addToast({ 
      type: 'custom', 
      component, 
      ...options 
    }),
  }, [addToast, removeToast]);

  return {
    toasts,
    toast,
    addToast,
    removeToast,
    removeAllToasts,
  };
};

// Global toast provider
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const toastUtils = useToast();

  return (
    <ToastContext.Provider value={toastUtils}>
      {children}
      <ToastContainer 
        toasts={toastUtils.toasts} 
        onClose={toastUtils.removeToast} 
      />
    </ToastContext.Provider>
  );
};

export const useGlobalToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useGlobalToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;