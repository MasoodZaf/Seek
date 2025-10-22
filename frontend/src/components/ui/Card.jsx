import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  className,
  variant = 'default',
  elevation = 'flat',
  hover = false,
  padding = 'md',
  animate = true,
  gradient = false,
  glowOnHover = false,
  interactive = false,
  ...props
}) => {
  const paddings = {
    none: '',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const elevations = {
    flat: 'shadow-none border border-secondary-200',
    elevated: 'shadow-elevation-1 border border-secondary-100/50',
    floating: 'shadow-elevation-2 border border-secondary-100/30',
    high: 'shadow-elevation-3 border border-secondary-100/20',
  };

  const variants = {
    default: 'bg-white rounded-xl transition-all duration-300',
    glass: 'card-glass',
    gradient: 'card-gradient',
    outline: 'bg-transparent border-2 border-secondary-200 rounded-xl hover:border-secondary-300 transition-all duration-300',
    dark: 'card-dark',
    premium: 'card-premium',
  };
  
  const classes = clsx(
    variants[variant],
    elevations[elevation],
    paddings[padding],
    {
      'relative overflow-hidden': gradient || variant === 'gradient' || variant === 'premium',
      'group cursor-pointer': hover || interactive,
      'hover:shadow-glow': glowOnHover,
    },
    className
  );

  // Enhanced hover animations with better physics
  const getHoverAnimation = () => {
    if (!hover && !interactive) return undefined;
    
    return {
      y: -4,
      scale: 1.01,
      boxShadow: elevation === 'flat' 
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        : '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        mass: 0.8
      }
    };
  };

  const motionProps = animate ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    },
    whileHover: getHoverAnimation(),
    whileTap: (hover || interactive) ? { 
      scale: 0.99,
      transition: { duration: 0.1 }
    } : undefined
  } : {};

  // Enhanced gradient overlay for premium feel
  const GradientOverlay = () => {
    if (!gradient && variant !== 'gradient' && variant !== 'premium') return null;
    
    return (
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      </motion.div>
    );
  };

  // Shimmer effect for premium cards
  const ShimmerEffect = () => {
    if (variant !== 'premium') return null;
    
    return (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      </div>
    );
  };
  
  if (animate) {
    return (
      <motion.div
        className={classes}
        {...motionProps}
        {...props}
      >
        <GradientOverlay />
        <ShimmerEffect />
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className={classes} {...props}>
      <GradientOverlay />
      <ShimmerEffect />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const CardHeader = ({ children, className, divider = false, ...props }) => (
  <div 
    className={clsx(
      'mb-4', 
      {
        'pb-4 border-b border-secondary-200': divider
      },
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className, size = 'lg', gradient = false, ...props }) => {
  const sizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-semibold',
    xl: 'text-2xl font-bold',
  };

  return (
    <h3 
      className={clsx(
        sizes[size],
        gradient ? 'text-gradient' : 'text-secondary-900',
        'leading-tight',
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className, muted = false, ...props }) => (
  <p 
    className={clsx(
      'text-sm mt-1 leading-relaxed',
      muted ? 'text-secondary-500' : 'text-secondary-600',
      className
    )} 
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ children, className, spacing = 'normal', ...props }) => {
  const spacings = {
    none: '',
    tight: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  return (
    <div className={clsx(spacings[spacing], className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, justify = 'between', align = 'center', ...props }) => {
  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div 
      className={clsx(
        'mt-6 flex gap-3',
        justifications[justify],
        alignments[align],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// New Badge component for cards
const CardBadge = ({ children, className, variant = 'primary', size = 'sm', ...props }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    secondary: 'bg-secondary-100 text-secondary-800',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span 
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};

// New Image component for cards
const CardImage = ({ src, alt, className, aspectRatio = 'video', ...props }) => {
  const aspectRatios = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]',
    wide: 'aspect-[21/9]',
  };

  return (
    <div className={clsx('overflow-hidden rounded-lg', aspectRatios[aspectRatio], className)}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        {...props}
      />
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Badge = CardBadge;
Card.Image = CardImage;

export default Card;