import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Button from './Button';

const QuickActions = ({ actions = [], title = "Quick Actions", className, animate = true, ...props }) => {
  return (
    <div className={clsx('space-y-4', className)} {...props}>
      {title && (
        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
          {title}
        </h3>
      )}
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <QuickActionItem
            key={action.id || index}
            action={action}
            index={index}
            animate={animate}
          />
        ))}
      </div>
    </div>
  );
};

const QuickActionItem = ({ action, index, animate }) => {
  const {
    icon: Icon,
    label,
    description,
    href,
    onClick,
    variant = 'secondary',
    color = 'primary',
    badge,
    disabled = false,
  } = action;

  const MotionDiv = animate ? motion.div : 'div';
  const itemProps = animate ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    whileHover: { x: 4 },
    transition: { delay: index * 0.1, duration: 0.3 }
  } : {};

  const buttonContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className={clsx(
            'p-2 rounded-lg',
            variant === 'primary' ? 'bg-white/20' : `bg-${color}-100 dark:bg-${color}-900/30`
          )}>
            <Icon className={clsx(
              'w-4 h-4',
              variant === 'primary' ? 'text-white' : `text-${color}-600 dark:text-${color}-400`
            )} />
          </div>
        )}
        
        <div className="text-left">
          <div className="font-medium">{label}</div>
          {description && (
            <div className={clsx(
              'text-xs',
              variant === 'primary' ? 'text-white/80' : 'text-secondary-500 dark:text-secondary-400'
            )}>
              {description}
            </div>
          )}
        </div>
      </div>
      
      {badge && (
        <span className={clsx(
          'px-2 py-1 text-xs font-medium rounded-full',
          variant === 'primary' ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
        )}>
          {badge}
        </span>
      )}
    </div>
  );

  const buttonProps = {
    variant,
    size: 'sm',
    className: 'w-full justify-start h-auto py-3 px-4',
    disabled,
    onClick,
  };

  return (
    <MotionDiv {...itemProps}>
      {href ? (
        <Link to={href}>
          <Button {...buttonProps}>
            {buttonContent}
          </Button>
        </Link>
      ) : (
        <Button {...buttonProps}>
          {buttonContent}
        </Button>
      )}
    </MotionDiv>
  );
};

export { QuickActions, QuickActionItem };
export default QuickActions;