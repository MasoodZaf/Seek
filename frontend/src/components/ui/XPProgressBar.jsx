import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import AnimatedCounter from './AnimatedCounter';

const XPProgressBar = ({
  currentXP = 0,
  nextLevelXP = 1000,
  level = 1,
  size = 'md',
  variant = 'gradient',
  showLevel = true,
  showXP = true,
  animate = true,
  className,
  onLevelUp,
  ...props
}) => {
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100);
  const remainingXP = Math.max(nextLevelXP - currentXP, 0);

  const sizes = {
    sm: { height: 'h-2', text: 'text-sm', level: 'text-lg' },
    md: { height: 'h-3', text: 'text-base', level: 'text-xl' },
    lg: { height: 'h-4', text: 'text-lg', level: 'text-2xl' },
    xl: { height: 'h-6', text: 'text-xl', level: 'text-3xl' },
  };

  const variants = {
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    gold: 'from-yellow-400 via-yellow-500 to-yellow-600',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    primary: 'from-primary-500 to-primary-600',
  };

  const { height, text, level: levelText } = sizes[size];

  return (
    <div className={clsx('space-y-3', className)} {...props}>
      {/* Level and XP display */}
      <div className="flex items-center justify-between">
        {showLevel && (
          <div className="flex items-center space-x-2">
            <motion.div
              className={clsx(
                'font-bold text-primary-600 dark:text-primary-400',
                levelText
              )}
              initial={animate ? { scale: 0.8, opacity: 0 } : {}}
              animate={animate ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <AnimatedCounter value={level} prefix="LVL " />
            </motion.div>
            
            {progress === 100 && (
              <motion.div
                className="px-2 py-1 bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300 rounded-full text-xs font-medium"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.3, type: 'spring' }}
              >
                LEVEL UP!
              </motion.div>
            )}
          </div>
        )}

        {showXP && (
          <div className={clsx('text-secondary-600 dark:text-secondary-400 font-mono', text)}>
            <AnimatedCounter value={currentXP} format="number" /> / <AnimatedCounter value={nextLevelXP} format="number" /> XP
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className={clsx(
          'w-full rounded-full overflow-hidden bg-secondary-200 dark:bg-secondary-700',
          height
        )}>
          <motion.div
            className={clsx(
              'h-full rounded-full relative overflow-hidden bg-gradient-to-r',
              variants[variant]
            )}
            initial={animate ? { width: 0 } : { width: `${progress}%` }}
            animate={animate ? { width: `${progress}%` } : {}}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Particle effects for level up */}
            {progress === 100 && animate && (
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${10 + i * 10}%`,
                      top: '50%',
                    }}
                    animate={{
                      y: [-5, -15, -5],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Glow effect */}
        <motion.div
          className={clsx(
            'absolute inset-0 rounded-full opacity-50 blur-sm bg-gradient-to-r',
            variants[variant]
          )}
          style={{ width: `${progress}%` }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Additional info */}
      <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
        <span>{Math.round(progress)}% to next level</span>
        {remainingXP > 0 && (
          <span>
            <AnimatedCounter value={remainingXP} format="number" /> XP needed
          </span>
        )}
      </div>

      {/* Level up celebration */}
      {progress === 100 && animate && (
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="text-2xl font-bold text-yellow-500 animate-bounce">
            🎉 LEVEL UP! 🎉
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default XPProgressBar;