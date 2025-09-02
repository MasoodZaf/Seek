import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  className,
  variant = 'default',
  hover = false,
  padding = 'md',
  animate = true,
  gradient = false,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    default: hover ? 'card-hover' : 'card',
    glass: 'card-glass',
    elevated: 'bg-white rounded-xl shadow-elevation-2 border border-gray-100/50',
    gradient: 'bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-xl shadow-xl border border-white/20 backdrop-blur-sm',
    outline: 'bg-transparent border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors',
    dark: 'card-dark'
  };
  
  const classes = clsx(
    variants[variant],
    paddings[padding],
    {
      'relative overflow-hidden': gradient,
      'group': hover
    },
    className
  );

  const motionProps = animate ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    },
    whileHover: hover ? { 
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 }
    } : undefined
  } : {};
  
  if (animate) {
    return (
      <motion.div
        className={classes}
        {...motionProps}
        {...props}
      >
        {gradient && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className={classes} {...props}>
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-secondary-900', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={clsx('text-sm text-secondary-600 mt-1', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('mt-6 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;