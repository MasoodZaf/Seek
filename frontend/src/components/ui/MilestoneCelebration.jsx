import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import Button from './Button';

const MilestoneCelebration = ({
  isVisible = false,
  milestone,
  onClose,
  onShare,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose?.();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  if (!isVisible || !milestone) return null;

  const getMilestoneIcon = (type) => {
    const icons = {
      level: TrophyIcon,
      streak: FireIcon,
      achievement: StarIcon,
      completion: SparklesIcon,
    };
    return icons[type] || TrophyIcon;
  };

  const getMilestoneColor = (type) => {
    const colors = {
      level: 'from-yellow-400 to-yellow-600',
      streak: 'from-orange-400 to-red-600',
      achievement: 'from-purple-400 to-pink-600',
      completion: 'from-green-400 to-blue-600',
    };
    return colors[type] || 'from-primary-400 to-primary-600';
  };

  const Icon = getMilestoneIcon(milestone.type);
  const colorGradient = getMilestoneColor(milestone.type);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                animate={{
                  y: window.innerHeight + 100,
                  x: [0, Math.random() * 200 - 100],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Main celebration modal */}
        <motion.div
          className="relative bg-white dark:bg-secondary-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ 
            type: 'spring',
            damping: 15,
            stiffness: 300,
            delay: 0.1 
          }}
        >
          {/* Celebration icon */}
          <motion.div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${colorGradient} mb-6 shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              damping: 10,
              stiffness: 200,
              delay: 0.3 
            }}
          >
            <Icon className="w-10 h-10 text-white" />
            
            {/* Sparkle effects around icon */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${50 + Math.cos((i * 60) * Math.PI / 180) * 40}%`,
                  top: `${50 + Math.sin((i * 60) * Math.PI / 180) * 40}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5 + i * 0.1,
                }}
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {milestone.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-secondary-600 dark:text-secondary-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {milestone.description}
          </motion.p>

          {/* Rewards */}
          {milestone.rewards && milestone.rewards.length > 0 && (
            <motion.div
              className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                Rewards Earned:
              </h3>
              <div className="space-y-1">
                {milestone.rewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    className="text-sm text-primary-600 dark:text-primary-400 flex items-center justify-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    {reward}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            {onShare && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onShare(milestone)}
                className="flex-1"
              >
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
            transition={{ delay: 1, duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorGradient} opacity-20 blur-xl -z-10`}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default MilestoneCelebration;