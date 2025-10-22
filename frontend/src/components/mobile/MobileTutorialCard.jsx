import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlayIcon,
  ClockIcon,
  StarIcon,
  BookmarkIcon,
  ShareIcon,
  CheckCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';
import SwipeContainer from '../ui/SwipeContainer';
import TouchButton from '../ui/TouchButton';
import { hapticFeedback } from '../../utils/touchInteractions';

const MobileTutorialCard = ({
  tutorial,
  onBookmark,
  onShare,
  onRate,
  onComplete,
  className = ''
}) => {
  const [isBookmarked, setIsBookmarked] = useState(tutorial.isBookmarked || false);
  const [userRating, setUserRating] = useState(tutorial.userRating || 0);
  const [showActions, setShowActions] = useState(false);

  const handleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    onBookmark?.(tutorial.id, newBookmarkState);
    hapticFeedback.light();
  };

  const handleShare = () => {
    onShare?.(tutorial);
    hapticFeedback.medium();
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    onRate?.(tutorial.id, rating);
    hapticFeedback.success();
  };

  const handleComplete = () => {
    onComplete?.(tutorial.id);
    hapticFeedback.success();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <SwipeContainer
      onSwipeRight={tutorial.progress < 100 ? handleComplete : undefined}
      onSwipeLeft={handleBookmark}
      className={className}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden touch-manipulation"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Header Image/Icon */}
        <div className="relative h-32 bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden">
          {tutorial.image ? (
            <img
              src={tutorial.image}
              alt={tutorial.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          
          {/* Status Indicators */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {tutorial.isLocked && (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                <LockClosedIcon className="w-4 h-4 text-white" />
              </div>
            )}
            {tutorial.progress >= 100 && (
              <div className="bg-green-500 rounded-full p-1.5">
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Bookmark Button */}
          <TouchButton
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm border-0 text-white hover:bg-black/50"
            onPress={handleBookmark}
            haptic="light"
          >
            {isBookmarked ? (
              <BookmarkSolid className="w-5 h-5" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </TouchButton>

          {/* Progress Bar */}
          {tutorial.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <motion.div
                className={`h-full ${getProgressColor(tutorial.progress)}`}
                initial={{ width: 0 }}
                animate={{ width: `${tutorial.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Description */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
              {tutorial.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {tutorial.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-gray-500">
                <ClockIcon className="w-4 h-4" />
                <span>{tutorial.duration || '30 min'}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty || 'Beginner'}
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchButton
                  key={star}
                  variant="ghost"
                  size="xs"
                  className="p-0 min-w-0 min-h-0 w-6 h-6"
                  onPress={() => handleRate(star)}
                  haptic="selection"
                >
                  {star <= (userRating || tutorial.rating || 0) ? (
                    <StarSolid className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-4 h-4 text-gray-300" />
                  )}
                </TouchButton>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Link to={`/tutorials/${tutorial.id}`} className="flex-1">
              <TouchButton
                variant={tutorial.progress > 0 ? 'secondary' : 'primary'}
                size="md"
                className="w-full"
                haptic="medium"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                {tutorial.progress > 0 ? 'Continue' : 'Start'}
              </TouchButton>
            </Link>
            
            <TouchButton
              variant="ghost"
              size="md"
              className="px-3 border border-gray-200"
              onPress={handleShare}
              haptic="light"
            >
              <ShareIcon className="w-4 h-4" />
            </TouchButton>
          </div>

          {/* Progress Text */}
          {tutorial.progress > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {tutorial.progress >= 100 ? 'Completed!' : `${tutorial.progress}% complete`}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Overlay */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center space-x-4 rounded-2xl"
          >
            <TouchButton
              variant="success"
              size="lg"
              onPress={handleComplete}
              haptic="success"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Complete
            </TouchButton>
            
            <TouchButton
              variant="secondary"
              size="lg"
              onPress={() => setShowActions(false)}
              haptic="light"
            >
              Cancel
            </TouchButton>
          </motion.div>
        )}
      </motion.div>
    </SwipeContainer>
  );
};

export default MobileTutorialCard;