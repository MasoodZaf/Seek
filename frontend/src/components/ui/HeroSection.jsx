import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import ProgressRing from './ProgressRing';
import AnimatedCounter from './AnimatedCounter';

const HeroSection = ({
  title,
  subtitle,
  user,
  stats,
  variant = 'gradient',
  className,
  children,
  ...props
}) => {
  const variants = {
    gradient: 'bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600',
    solid: 'bg-primary-600',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20',
  };

  return (
    <motion.div
      className={clsx(
        'relative overflow-hidden rounded-2xl p-8 text-white',
        variants[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      {...props}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        
        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {/* Main content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {title || `Welcome back, ${user?.firstName || 'User'}! 🎯`}
            </h1>
            <p className="text-lg text-white/80 mb-6">
              {subtitle || "Ready to continue your coding journey? You're doing great!"}
            </p>
          </motion.div>

          {/* Quick stats */}
          {stats && (
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm">
                  <AnimatedCounter value={stats.currentStreak || 0} suffix=" day streak" />
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm">
                  <AnimatedCounter value={stats.totalHours || 0} suffix=" hours learned" />
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Level progress */}
        {stats && (
          <motion.div
            className="hidden md:block ml-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-center mb-4">
              <p className="text-white/80 text-sm mb-1">Current Level</p>
              <ProgressRing
                value={stats.xp || 0}
                max={stats.nextLevelXp || 1000}
                size="lg"
                variant="gradient"
                glowing
                showLabel={false}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {stats.level || 1}
                  </div>
                  <div className="text-xs text-white/70">Level</div>
                </div>
              </ProgressRing>
            </div>
            
            <div className="text-center text-xs text-white/70">
              <AnimatedCounter 
                value={stats.xp || 0} 
                format="number"
              /> / <AnimatedCounter 
                value={stats.nextLevelXp || 1000} 
                format="number"
              /> XP
            </div>
          </motion.div>
        )}
      </div>

      {/* Custom children content */}
      {children && (
        <motion.div
          className="relative z-10 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {children}
        </motion.div>
      )}

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
        whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
};

export default HeroSection;