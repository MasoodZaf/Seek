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
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden touch-manipulation"
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Enhanced Header Image/Icon with Glassmorphism */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

          {tutorial.image ? (
            <img
              src={tutorial.image}
              alt={tutorial.title}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="relative flex items-center justify-center h-full">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl"
              >
                <PlayIcon className="w-10 h-10 text-white drop-shadow-lg" />
              </motion.div>
            </div>
          )}

          {/* Enhanced Status Indicators */}
          <div className="absolute top-4 left-4 flex space-x-2">
            {tutorial.isLocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/20"
              >
                <LockClosedIcon className="w-5 h-5 text-white" />
              </motion.div>
            )}
            {tutorial.progress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-2 shadow-lg border border-white/30"
              >
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>

          {/* Enhanced Bookmark Button */}
          <TouchButton
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 shadow-xl"
            onPress={handleBookmark}
            haptic="light"
          >
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              {isBookmarked ? (
                <BookmarkSolid className="w-6 h-6 text-yellow-300" />
              ) : (
                <BookmarkIcon className="w-6 h-6" />
              )}
            </motion.div>
          </TouchButton>

          {/* Enhanced Progress Bar */}
          {tutorial.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 backdrop-blur-sm">
              <motion.div
                className={`h-full shadow-lg ${getProgressColor(tutorial.progress)}`}
                initial={{ width: 0 }}
                animate={{ width: `${tutorial.progress}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
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

          {/* Enhanced Action Buttons with Glassmorphism */}
          <div className="flex space-x-3 pt-3">
            <Link to={`/tutorials/${tutorial.id}`} className="flex-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <TouchButton
                  variant={tutorial.progress > 0 ? 'secondary' : 'primary'}
                  size="md"
                  className={`w-full relative overflow-hidden ${
                    tutorial.progress > 0
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                  }`}
                  haptic="medium"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlayIcon className="w-5 h-5 mr-2" />
                  <span className="font-bold">
                    {tutorial.progress > 0 ? 'Continue' : 'Start'}
                  </span>
                </TouchButton>
              </motion.div>
            </Link>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <TouchButton
                variant="ghost"
                size="md"
                className="px-4 border-2 border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 shadow-md"
                onPress={handleShare}
                haptic="light"
              >
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </TouchButton>
            </motion.div>
          </div>

          {/* Enhanced Progress Text */}
          {tutorial.progress > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-2"
            >
              <p className={`text-sm font-bold ${
                tutorial.progress >= 100
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'text-indigo-600'
              }`}>
                {tutorial.progress >= 100 ? '✨ Completed!' : `${tutorial.progress}% complete`}
              </p>
            </motion.div>
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