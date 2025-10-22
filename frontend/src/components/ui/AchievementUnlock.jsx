import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const AchievementUnlock = ({
  isVisible = false,
  achievement,
  onClose,
  onShare,
  autoClose = true,
  autoCloseDelay = 4000,
}) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowParticles(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose?.();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  if (!isVisible || !achievement) return null;

  const getIcon = (iconType) => {
    const icons = {
      trophy: TrophyIcon,
      star: StarIcon,
      fire: FireIcon,
      sparkles: SparklesIcon,
    };
    return icons[iconType] || TrophyIcon;
  };

  const getRarityConfig = (rarity) => {
    const configs = {
      common: {
        gradient: 'from-gray-400 to-gray-600',
        glow: 'shadow-gray-500/50',
        particles: 15,
        colors: ['#9ca3af', '#6b7280', '#4b5563'],
      },
      rare: {
        gradient: 'from-blue-400 to-blue-600',
        glow: 'shadow-blue-500/50',
        particles: 25,
        colors: ['#60a5fa', '#3b82f6', '#2563eb'],
      },
      epic: {
        gradient: 'from-purple-400 to-pink-600',
        glow: 'shadow-purple-500/50',
        particles: 35,
        colors: ['#a78bfa', '#8b5cf6', '#7c3aed'],
      },
      legendary: {
        gradient: 'from-yellow-400 via-orange-500 to-red-600',
        glow: 'shadow-yellow-500/60',
        particles: 50,
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#ea580c'],
      },
    };
    return configs[rarity] || configs.common;
  };

  const Icon = getIcon(achievement.iconType);
  const rarityConfig = getRarityConfig(achievement.rarity);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Particle explosion */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(rarityConfig.particles)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: rarityConfig.colors[i % rarityConfig.colors.length],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0.5],
                  opacity: [0, 1, 0],
                  x: Math.cos((i * 360 / rarityConfig.particles) * Math.PI / 180) * (150 + Math.random() * 100),
                  y: Math.sin((i * 360 / rarityConfig.particles) * Math.PI / 180) * (150 + Math.random() * 100),
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Main achievement card */}
        <motion.div
          className={`relative bg-white dark:bg-secondary-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl ${rarityConfig.glow}`}
          initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
          transition={{ 
            type: 'spring',
            damping: 15,
            stiffness: 300,
            delay: 0.2 
          }}
        >
          {/* Background glow */}
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${rarityConfig.gradient} opacity-10 blur-xl`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Achievement unlocked text */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Achievement Unlocked!
            </h2>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${rarityConfig.gradient} text-white`}>
              {achievement.rarity?.toUpperCase() || 'ACHIEVEMENT'}
            </div>
          </motion.div>

          {/* Achievement icon */}
          <motion.div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${rarityConfig.gradient} mb-6 shadow-lg ${rarityConfig.glow}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              damping: 10,
              stiffness: 200,
              delay: 0.6 
            }}
          >
            <Icon className="w-12 h-12 text-white" />
            
            {/* Rotating sparkles around icon */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${50 + Math.cos((i * 45) * Math.PI / 180) * 50}%`,
                  top: `${50 + Math.sin((i * 45) * Math.PI / 180) * 50}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.8 + i * 0.1,
                }}
              />
            ))}
          </motion.div>

          {/* Achievement details */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
              {achievement.title}
            </h3>
            
            <p className="text-secondary-600 dark:text-secondary-400">
              {achievement.description}
            </p>

            {/* Rewards */}
            {achievement.rewards && achievement.rewards.length > 0 && (
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Rewards Earned:
                </h4>
                <div className="space-y-1">
                  {achievement.rewards.map((reward, index) => (
                    <motion.div
                      key={index}
                      className="text-sm text-primary-600 dark:text-primary-400 flex items-center justify-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    >
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      {reward}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            {onShare && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onShare(achievement)}
                className="flex-1"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share Achievement
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Continue
            </Button>
          </motion.div>

          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="w-6 h-6" />
          </motion.button>

          {/* Pulsing border effect for legendary */}
          {achievement.rarity === 'legendary' && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-yellow-400"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>

        {/* Screen flash effect for legendary achievements */}
        {achievement.rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 bg-yellow-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default AchievementUnlock;