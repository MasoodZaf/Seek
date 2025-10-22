import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import AnimatedCounter from './AnimatedCounter';

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'percentage',
  color = 'primary',
  variant = 'default',
  animate = true,
  className,
  onClick,
  ...props
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      icon: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-100 dark:bg-primary-800/50',
      gradient: 'from-primary-500 to-primary-600',
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      icon: 'text-success-600 dark:text-success-400',
      iconBg: 'bg-success-100 dark:bg-success-800/50',
      gradient: 'from-success-500 to-success-600',
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      icon: 'text-warning-600 dark:text-warning-400',
      iconBg: 'bg-warning-100 dark:bg-warning-800/50',
      gradient: 'from-warning-500 to-warning-600',
    },
    error: {
      bg: 'bg-error-50 dark:bg-error-900/20',
      icon: 'text-error-600 dark:text-error-400',
      iconBg: 'bg-error-100 dark:bg-error-800/50',
      gradient: 'from-error-500 to-error-600',
    },
  };

  const colors = colorClasses[color];

  const cardClasses = clsx(
    'relative overflow-hidden rounded-xl p-6 transition-all duration-300',
    {
      'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 hover:shadow-lg hover:shadow-primary-500/10': variant === 'default',
      [`${colors.bg} border-2 border-transparent hover:border-${color}-200`]: variant === 'colored',
      'bg-gradient-to-br text-white border-0 hover:shadow-xl': variant === 'gradient',
      'cursor-pointer': onClick,
    },
    variant === 'gradient' && `${colors.gradient}`,
    className
  );

  const MotionCard = animate ? motion.div : 'div';
  const cardProps = animate ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: { y: -2, scale: 1.02 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <MotionCard
      className={cardClasses}
      onClick={onClick}
      {...cardProps}
      {...props}
    >
      {/* Background decoration */}
      {variant === 'gradient' && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="absolute inset-0 bg-white rounded-full transform translate-x-16 -translate-y-16" />
        </div>
      )}

      <div className="relative z-10 flex items-center">
        {/* Icon */}
        {Icon && (
          <div className={clsx(
            'p-3 rounded-lg',
            variant === 'gradient' ? 'bg-white/20' : colors.iconBg
          )}>
            <Icon className={clsx(
              'h-6 w-6',
              variant === 'gradient' ? 'text-white' : colors.icon
            )} />
          </div>
        )}

        {/* Content */}
        <div className="ml-4 flex-1">
          <p className={clsx(
            'text-sm font-medium',
            variant === 'gradient' ? 'text-white/80' : 'text-secondary-600 dark:text-secondary-400'
          )}>
            {label}
          </p>
          
          <div className="flex items-baseline space-x-2">
            <AnimatedCounter
              value={typeof value === 'number' ? value : 0}
              className={clsx(
                'text-2xl font-bold',
                variant === 'gradient' ? 'text-white' : 'text-secondary-900 dark:text-secondary-100'
              )}
              format={typeof value === 'string' ? 'string' : 'number'}
            />
            
            {change !== undefined && (
              <motion.span
                className={clsx(
                  'text-sm font-medium flex items-center',
                  change > 0 ? 'text-success-600' : 'text-error-600',
                  variant === 'gradient' && 'text-white/90'
                )}
                initial={animate ? { opacity: 0, x: -10 } : {}}
                animate={animate ? { opacity: 1, x: 0 } : {}}
                transition={animate ? { delay: 0.5 } : {}}
              >
                <span className="mr-1">
                  {change > 0 ? '↗' : '↘'}
                </span>
                {changeType === 'percentage' ? `${Math.abs(change)}%` : change}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      {onClick && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0"
          whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
          transition={{ duration: 0.6 }}
        />
      )}
    </MotionCard>
  );
};

export default StatCard;