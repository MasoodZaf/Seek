import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  HeartIcon,
  BoltIcon,
  GiftIcon,
} from '@heroicons/react/24/solid';
import {
  ShareIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Progress from './Progress';
import Button from './Button';

const AchievementBadge = ({
  achievement,
  size = 'md',
  variant = 'card',
  showProgress = true,
  showActions = true,
  onClick,
  onShare,
  className,
  animate = true,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const sizes = {
    xs: { container: 'p-3', icon: 'w-4 h-4', text: 'text-xs' },
    sm: { container: 'p-4', icon: 'w-5 h-5', text: 'text-sm' },
    md: { container: 'p-6', icon: 'w-6 h-6', text: 'text-base' },
    lg: { container: 'p-8', icon: 'w-8 h-8', text: 'text-lg' },
  };

  const rarities = {
    common: {
      border: 'border-secondary-300 dark:border-secondary-600',
      bg: 'bg-secondary-50 dark:bg-secondary-800/50',
      glow: 'shadow-secondary-500/20',
      iconBg: 'bg-secondary-100 dark:bg-secondary-700',
      iconColor: 'text-secondary-600 dark:text-secondary-400',
    },
    rare: {
      border: 'border-blue-300 dark:border-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      glow: 'shadow-blue-500/30',
      iconBg: 'bg-blue-100 dark:bg-blue-800/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    epic: {
      border: 'border-purple-300 dark:border-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      glow: 'shadow-purple-500/30',
      iconBg: 'bg-purple-100 dark:bg-purple-800/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    legendary: {
      border: 'border-yellow-300 dark:border-yellow-600',
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      glow: 'shadow-yellow-500/40',
      iconBg: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-800/50 dark:to-orange-800/50',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
  };

  const getIcon = (iconType) => {
    const icons = {
      trophy: TrophyIcon,
      star: StarIcon,
      fire: FireIcon,
      lightbulb: LightBulbIcon,
      rocket: RocketLaunchIcon,
      heart: HeartIcon,
      bolt: BoltIcon,
      gift: GiftIcon,
    };
    return icons[iconType] || TrophyIcon;
  };

  const { container, icon, text } = sizes[size];
  const rarity = rarities[achievement.rarity] || rarities.common;
  const Icon = getIcon(achievement.iconType);

  const handleClick = () => {
    if (achievement.earned && achievement.rarity === 'legendary') {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    }
    onClick?.(achievement);
  };

  const MotionDiv = animate ? motion.div : 'div';
  const cardProps = animate ? {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    whileHover: { 
      scale: 1.02, 
      y: -2,
      transition: { duration: 0.2 }
    },
    transition: { duration: 0.3 }
  } : {};

  if (variant === 'compact') {
    return (
      <MotionDiv
        className={clsx(
          'flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300',
          achievement.earned ? rarity.bg : 'bg-secondary-50 dark:bg-secondary-800/30 opacity-60',
          achievement.earned ? rarity.border : 'border-secondary-200 dark:border-secondary-700',
          achievement.earned && isHovered && rarity.glow,
          'cursor-pointer',
          className
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        {...cardProps}
        {...props}
      >
        <div className={clsx(
          'p-2 rounded-lg',
          achievement.earned ? rarity.iconBg : 'bg-secondary-100 dark:bg-secondary-700'
        )}>
          <Icon className={clsx(
            'w-5 h-5',
            achievement.earned ? rarity.iconColor : 'text-secondary-400'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={clsx(
            'font-medium truncate',
            achievement.earned ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500'
          )}>
            {achievement.title}
          </h4>
          {achievement.progress !== undefined && !achievement.earned && (
            <div className="mt-1">
              <Progress
                value={achievement.progress}
                size="xs"
                showLabel={false}
                variant="primary"
              />
            </div>
          )}
        </div>
        
        {achievement.rarity && achievement.earned && (
          <div className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            rarity.iconBg,
            rarity.iconColor
          )}>
            {achievement.rarity.toUpperCase()}
          </div>
        )}
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      className={clsx(
        'relative rounded-xl border-2 transition-all duration-300 overflow-hidden',
        container,
        achievement.earned ? rarity.bg : 'bg-secondary-50 dark:bg-secondary-800/30 opacity-60',
        achievement.earned ? rarity.border : 'border-secondary-200 dark:border-secondary-700',
        achievement.earned && isHovered && `hover:shadow-xl ${rarity.glow}`,
        onClick && 'cursor-pointer',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      {...cardProps}
      {...props}
    >
      {/* Particle effects for legendary achievements */}
      <AnimatePresence>
        {showParticles && achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      {achievement.earned && achievement.rarity === 'legendary' && (
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full transform translate-x-8 -translate-y-8" />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={clsx(
            'p-3 rounded-xl',
            achievement.earned ? rarity.iconBg : 'bg-secondary-100 dark:bg-secondary-700'
          )}>
            <Icon className={clsx(
              icon,
              achievement.earned ? rarity.iconColor : 'text-secondary-400'
            )} />
          </div>
          
          {achievement.rarity && achievement.earned && (
            <motion.div
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-bold',
                rarity.iconBg,
                rarity.iconColor
              )}
              initial={animate ? { scale: 0, rotate: -90 } : {}}
              animate={animate ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {achievement.rarity.toUpperCase()}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h4 className={clsx(
            'font-semibold',
            text,
            achievement.earned ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500'
          )}>
            {achievement.title}
          </h4>
          
          <p className={clsx(
            'text-sm',
            achievement.earned ? 'text-secondary-600 dark:text-secondary-400' : 'text-secondary-400'
          )}>
            {achievement.description}
          </p>

          {/* Progress for incomplete achievements */}
          {!achievement.earned && achievement.progress !== undefined && showProgress && (
            <div className="pt-2">
              <div className="flex justify-between text-xs text-secondary-500 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}%</span>
              </div>
              <Progress
                value={achievement.progress}
                size="sm"
                showLabel={false}
                variant="primary"
                animated
              />
            </div>
          )}

          {/* Earned date */}
          {achievement.earned && achievement.earnedDate && (
            <p className={clsx(
              'text-xs',
              rarity.iconColor
            )}>
              Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
            </p>
          )}

          {/* Rewards */}
          {achievement.rewards && achievement.rewards.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Rewards:
              </p>
              <div className="flex flex-wrap gap-1">
                {achievement.rewards.map((reward, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                  >
                    {reward}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && achievement.earned && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-secondary-200 dark:border-secondary-600">
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(achievement);
              }}
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </Button>
            
            {onShare && (
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(achievement);
                }}
              >
                <ShareIcon className="w-4 h-4 mr-1" />
                Share
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Shine effect on hover */}
      {achievement.earned && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
          animate={isHovered ? { opacity: 1, x: ['-100%', '100%'] } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </MotionDiv>
  );
};

export default AchievementBadge;