import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({
  value = 0,
  duration = 2,
  delay = 0,
  format = 'number',
  prefix = '',
  suffix = '',
  className = '',
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => {
    if (format === 'currency') {
      return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
    } else if (format === 'percentage') {
      return `${Math.round(current)}%`;
    } else if (format === 'decimal') {
      return `${prefix}${current.toFixed(1)}${suffix}`;
    }
    return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      spring.set(value);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [spring, value, delay]);

  useEffect(() => {
    return display.onChange((latest) => {
      setDisplayValue(latest);
    });
  }, [display]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      {...props}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;