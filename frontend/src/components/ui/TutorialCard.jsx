import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  PlayIcon,
  ClockIcon,
  StarIcon,
  BookmarkIcon,
  UserGroupIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { Badge, Progress, Button } from './';

const TutorialCard = ({
  tutorial,
  size = 'md',
  variant = 'default',
  showProgress = true,
  showActions = true,
  onClick,
  onBookmark,
  onRate,
  className,
  animate = true,
  ...props
}) => {
  const [isBookmarked, setIsBookmarked] = useState(tutorial.isBookmarked || false);
  const [rating, setRating] = useState(tutorial.userRating || 0);
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: { container: 'p-4', image: 'h-32', text: 'text-sm' },
    md: { container: 'p-6', image: 'h-40', text: 'text-base' },
    lg: { container: 'p-8', image: 'h-48', text: 'text-lg' },
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      python: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      java: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      react: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      nodejs: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      html: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      css: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    };
    return colors[language?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getDifficultyVariant = (difficulty) => {
    const variants = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'error',
    };
    return variants[difficulty?.toLowerCase()] || 'secondary';
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(tutorial, !isBookmarked);
  };

  const handleRating = (e, newRating) => {
    e.preventDefault();
    e.stopPropagation();
    setRating(newRating);
    onRate?.(tutorial, newRating);
  };

  const { container, image, text } = sizes[size];
  const estimatedHours = tutorial.estimatedDuration ? Math.floor(tutorial.estimatedDuration / 60) : 0;
  const estimatedMinutes = tutorial.estimatedDuration ? tutorial.estimatedDuration % 60 : 0;

  const MotionDiv = animate ? motion.div : 'div';
  const cardProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    transition: { duration: 0.3 }
  } : {};

  const CardContent = () => (
    <MotionDiv
      className={clsx(
        'relative bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-all duration-300 group cursor-pointer',
        'hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300 dark:hover:border-primary-600',
        {
          'opacity-60': tutorial.locked,
        },
        container,
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => !tutorial.locked && onClick?.(tutorial)}
      {...cardProps}
      {...props}
    >
      {/* Thumbnail/Preview */}
      {tutorial.thumbnail && (
        <div className={clsx('relative rounded-lg overflow-hidden mb-4', image)}>
          <img
            src={tutorial.thumbnail}
            alt={tutorial.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Play button overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/90 dark:bg-secondary-800/90 rounded-full p-3 shadow-lg">
              {tutorial.locked ? (
                <LockClosedIcon className="w-6 h-6 text-secondary-600" />
              ) : (
                <PlayIcon className="w-6 h-6 text-primary-600" />
              )}
            </div>
          </motion.div>

          {/* Status indicators */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {tutorial.isNew && (
              <Badge variant="primary" size="xs">
                New
              </Badge>
            )}
            {tutorial.isFeatured && (
              <Badge variant="warning" size="xs">
                Featured
              </Badge>
            )}
            {tutorial.progress === 100 && (
              <Badge variant="success" size="xs">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>

          {/* Bookmark button */}
          {showActions && (
            <button
              className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-secondary-800/90 rounded-full shadow-lg transition-colors hover:bg-white dark:hover:bg-secondary-700"
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="w-4 h-4 text-primary-600" />
              ) : (
                <BookmarkIcon className="w-4 h-4 text-secondary-600" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className={clsx(
          'font-semibold text-secondary-900 dark:text-secondary-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors',
          text
        )}>
          {tutorial.title}
        </h3>

        {/* Description */}
        {tutorial.description && (
          <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
            {tutorial.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className={clsx(
            'px-2 py-1 text-xs font-medium rounded-full',
            getLanguageColor(tutorial.language)
          )}>
            {tutorial.language}
          </span>
          
          <Badge 
            variant={getDifficultyVariant(tutorial.difficulty)} 
            size="xs"
          >
            {tutorial.difficulty}
          </Badge>

          {estimatedHours > 0 && (
            <div className="flex items-center text-xs text-secondary-500 dark:text-secondary-400">
              <ClockIcon className="w-3 h-3 mr-1" />
              {estimatedHours}h {estimatedMinutes}m
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
          <div className="flex items-center space-x-3">
            {tutorial.rating && (
              <div className="flex items-center">
                <StarIconSolid className="w-3 h-3 text-yellow-400 mr-1" />
                <span>{tutorial.rating.toFixed(1)}</span>
              </div>
            )}
            
            {tutorial.enrolledCount && (
              <div className="flex items-center">
                <UserGroupIcon className="w-3 h-3 mr-1" />
                <span>{tutorial.enrolledCount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {tutorial.lastAccessed && (
            <span>Last: {tutorial.lastAccessed}</span>
          )}
        </div>

        {/* Progress */}
        {showProgress && tutorial.progress !== undefined && tutorial.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-secondary-600 dark:text-secondary-400">
              <span>Progress</span>
              <span>{tutorial.progress}%</span>
            </div>
            <Progress 
              value={tutorial.progress} 
              size="sm" 
              showLabel={false}
              variant="primary"
              animated
            />
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1">
              {/* Rating stars */}
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={(e) => handleRating(e, star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  {star <= rating ? (
                    <StarIconSolid className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-4 h-4 text-secondary-300 hover:text-yellow-400" />
                  )}
                </button>
              ))}
            </div>

            <Button
              variant={tutorial.progress > 0 ? "primary" : "secondary"}
              size="xs"
              disabled={tutorial.locked}
            >
              {tutorial.locked ? (
                <>
                  <LockClosedIcon className="w-3 h-3 mr-1" />
                  Locked
                </>
              ) : tutorial.progress > 0 ? (
                <>
                  <PlayIcon className="w-3 h-3 mr-1" />
                  Continue
                </>
              ) : (
                <>
                  <PlayIcon className="w-3 h-3 mr-1" />
                  Start
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent opacity-0"
        animate={isHovered ? { opacity: 1, x: ['-100%', '100%'] } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Premium indicator */}
      {tutorial.isPremium && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
          PRO
        </div>
      )}
    </MotionDiv>
  );

  if (tutorial.href || tutorial.id) {
    return (
      <Link 
        to={tutorial.href || `/tutorials/${tutorial.id}`}
        className="block"
      >
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default TutorialCard;