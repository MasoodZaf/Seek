import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FireIcon } from '@heroicons/react/24/solid';
import AnimatedCounter from './AnimatedCounter';

const StreakIndicator = ({
  streak = 0,
  maxStreak = 0,
  size = 'md',
  variant = 'fire',
  showAnimation = true,
  className,
  ...props
}) => {
  const sizes = {
    sm: { container: 'w-16 h-16', icon: 'w-6 h-6', text: 'text-sm' },
    md: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-base' },
    lg: { container: 'w-24 h-24', icon: 'w-10 h-10', text: 'text-lg' },
    xl: { container: 'w-32 h-32', icon: 'w-12 h-12', text: 'text-xl' },
  };

  const variants = {
    fire: {
      colors: ['#ff6b35', '#f7931e', '#ffd23f'],
      glow: 'shadow-orange-500/50',
    },
    ice: {
      colors: ['#00d4ff', '#0099cc', '#006699'],
      glow: 'shadow-blue-500/50',
    },
    electric: {
      colors: ['#ffff00', '#ffcc00', '#ff9900'],
      glow: 'shadow-yellow-500/50',
    },
  };

  const { container, icon, text } = sizes[size];
  const { colors, glow } = variants[variant];

  const getStreakLevel = () => {
    if (streak >= 30) return 'legendary';
    if (streak >= 14) return 'epic';
    if (streak >= 7) return 'rare';
    if (streak >= 3) return 'common';
    return 'none';
  };

  const streakLevel = getStreakLevel();

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)} {...props}>
      {/* Main container */}
      <motion.div
        className={clsx(
          'relative rounded-full flex flex-col items-center justify-center',
          container,
          streak > 0 ? `bg-gradient-to-br shadow-lg ${glow}` : 'bg-secondary-100 dark:bg-secondary-800'
        )}
        style={streak > 0 ? {
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
        } : {}}
        initial={showAnimation ? { scale: 0, rotate: -180 } : {}}
        animate={showAnimation ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
      >
        {/* Animated fire particles */}
        {streak > 0 && showAnimation && (
          <>
            {[...Array(Math.min(streak, 8))].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [-5, -15, -5],
                  opacity: [0.6, 1, 0.6],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}

        {/* Fire icon */}
        <motion.div
          animate={streak > 0 && showAnimation ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <FireIcon
            className={clsx(
              icon,
              streak > 0 ? 'text-white' : 'text-secondary-400 dark:text-secondary-600'
            )}
          />
        </motion.div>

        {/* Streak number */}
        <motion.div
          className={clsx(
            'font-bold',
            text,
            streak > 0 ? 'text-white' : 'text-secondary-600 dark:text-secondary-400'
          )}
          initial={showAnimation ? { opacity: 0, y: 10 } : {}}
          animate={showAnimation ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <AnimatedCounter value={streak} duration={1} delay={0.5} />
        </motion.div>

        {/* Glow effect */}
        {streak > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-30 blur-md"
            style={{
              background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Streak level indicator */}
      {streakLevel !== 'none' && (
        <motion.div
          className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg"
          style={{
            background: streakLevel === 'legendary' ? '#ffd700' :
                       streakLevel === 'epic' ? '#9d4edd' :
                       streakLevel === 'rare' ? '#3b82f6' : '#22c55e'
          }}
          initial={showAnimation ? { scale: 0, rotate: -90 } : {}}
          animate={showAnimation ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.4, type: 'spring' }}
        >
          {streakLevel.toUpperCase()}
        </motion.div>
      )}

      {/* Max streak indicator */}
      {maxStreak > streak && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-secondary-500 dark:text-secondary-400 text-center">
          Best: {maxStreak}
        </div>
      )}

      {/* Milestone celebrations */}
      {streak > 0 && streak % 7 === 0 && showAnimation && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: Math.cos((i * 30) * Math.PI / 180) * 60,
                y: Math.sin((i * 30) * Math.PI / 180) * 60,
                opacity: [1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default StreakIndicator;