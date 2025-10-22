import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { hapticFeedback, TOUCH_TARGET_SIZES } from '../../utils/touchInteractions';

const TouchButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  haptic = 'light',
  ripple = true,
  longPress = false,
  onPress,
  onLongPress,
  className = '',
  style = {},
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef();
  const longPressTimer = useRef();

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-primary-600 border-2 border-primary-200 shadow-sm hover:shadow-md',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl',
    error: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50'
  };

  const sizes = {
    xs: { height: TOUCH_TARGET_SIZES.minimum, padding: 'px-3 py-2', text: 'text-xs' },
    sm: { height: TOUCH_TARGET_SIZES.minimum, padding: 'px-4 py-2', text: 'text-sm' },
    md: { height: TOUCH_TARGET_SIZES.comfortable, padding: 'px-6 py-3', text: 'text-base' },
    lg: { height: TOUCH_TARGET_SIZES.large, padding: 'px-8 py-4', text: 'text-lg' },
    xl: { height: 64, padding: 'px-10 py-5', text: 'text-xl' }
  };

  const sizeConfig = sizes[size];

  const handleTouchStart = (e) => {
    if (disabled || loading) return;

    setIsPressed(true);
    
    // Haptic feedback
    if (haptic && hapticFeedback[haptic]) {
      hapticFeedback[haptic]();
    }

    // Create ripple effect
    if (ripple) {
      const rect = buttonRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
        size: Math.max(rect.width, rect.height) * 2
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    // Long press handling
    if (longPress && onLongPress) {
      longPressTimer.current = setTimeout(() => {
        hapticFeedback.heavy();
        onLongPress(e);
      }, 500);
    }

    props.onTouchStart?.(e);
  };

  const handleTouchEnd = (e) => {
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!disabled && !loading && onPress) {
      onPress(e);
    }

    props.onTouchEnd?.(e);
  };

  const handleTouchCancel = (e) => {
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    props.onTouchCancel?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-xl font-medium transition-all duration-200
        ${variants[variant]}
        ${sizeConfig.padding}
        ${sizeConfig.text}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : 'scale-100'}
        touch-manipulation select-none
        ${className}
      `}
      style={{
        minHeight: sizeConfig.height,
        minWidth: sizeConfig.height,
        ...style
      }}
      disabled={disabled || loading}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex items-center justify-center space-x-2"
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Long Press Indicator */}
      {longPress && isPressed && (
        <motion.div
          className="absolute inset-0 border-2 border-white/50 rounded-xl"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

export default TouchButton;