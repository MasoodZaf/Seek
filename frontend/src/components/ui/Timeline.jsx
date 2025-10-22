import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Timeline = ({ items = [], className, animate = true, ...props }) => {
  return (
    <div className={clsx('relative', className)} {...props}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-secondary-200 dark:bg-secondary-700" />
      
      <div className="space-y-6">
        {items.map((item, index) => (
          <TimelineItem
            key={item.id || index}
            item={item}
            index={index}
            animate={animate}
          />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index, animate }) => {
  const {
    icon: Icon,
    title,
    description,
    time,
    type = 'default',
    color = 'primary',
  } = item;

  const colorClasses = {
    primary: {
      dot: 'bg-primary-500 border-primary-200',
      icon: 'text-primary-600',
      iconBg: 'bg-primary-100',
    },
    success: {
      dot: 'bg-success-500 border-success-200',
      icon: 'text-success-600',
      iconBg: 'bg-success-100',
    },
    warning: {
      dot: 'bg-warning-500 border-warning-200',
      icon: 'text-warning-600',
      iconBg: 'bg-warning-100',
    },
    error: {
      dot: 'bg-error-500 border-error-200',
      icon: 'text-error-600',
      iconBg: 'bg-error-100',
    },
  };

  const colors = colorClasses[color];

  const MotionDiv = animate ? motion.div : 'div';
  const itemProps = animate ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: index * 0.1, duration: 0.5 }
  } : {};

  return (
    <MotionDiv
      className="relative flex items-start space-x-4"
      {...itemProps}
    >
      {/* Timeline dot/icon */}
      <div className="relative flex-shrink-0">
        {Icon ? (
          <div className={clsx(
            'flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-secondary-800',
            colors.iconBg
          )}>
            <Icon className={clsx('w-4 h-4', colors.icon)} />
          </div>
        ) : (
          <div className={clsx(
            'w-3 h-3 rounded-full border-4 border-white dark:border-secondary-800',
            colors.dot
          )} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
            {title}
          </h4>
          {time && (
            <time className="text-xs text-secondary-500 dark:text-secondary-400">
              {time}
            </time>
          )}
        </div>
        
        {description && (
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
            {description}
          </p>
        )}
      </div>
    </MotionDiv>
  );
};

export { Timeline, TimelineItem };
export default Timeline;