import React from 'react';
import PropTypes from 'prop-types';
import BrandIcon from './BrandIcon';
import { getProgressMessage, getStreakMessage } from '../../utils/messaging';

/**
 * Progress message component with encouraging and motivating copy
 */
const ProgressMessage = ({
  type = 'progress',
  percentage = 0,
  streakDays = 0,
  customMessage = '',
  showIcon = true,
  variant = 'default',
  className = ''
}) => {
  const getMessage = () => {
    switch (type) {
      case 'progress':
        return customMessage || getProgressMessage(percentage);
      case 'streak':
        return customMessage || getStreakMessage(streakDays);
      case 'encouragement':
        return customMessage || "You're doing great! Keep up the excellent work.";
      case 'milestone':
        return customMessage || "Congratulations on reaching this milestone! 🎉";
      default:
        return customMessage || "Keep going! Every step counts.";
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'progress':
        return percentage >= 90 ? 'trophy' : percentage >= 50 ? 'star' : 'fire';
      case 'streak':
        return 'fire';
      case 'encouragement':
        return 'star';
      case 'milestone':
        return 'trophy';
      default:
        return 'star';
    }
  };

  const variants = {
    default: {
      container: 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200',
      icon: 'text-blue-500',
      message: 'text-gray-700'
    },
    minimal: {
      container: 'bg-transparent',
      icon: 'text-blue-400',
      message: 'text-gray-600'
    },
    celebration: {
      container: 'bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-200',
      icon: 'text-orange-500',
      message: 'text-gray-800'
    },
    inline: {
      container: 'bg-blue-50 border-l-4 border-blue-400',
      icon: 'text-blue-500',
      message: 'text-blue-800'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  const renderProgressBar = () => {
    if (type !== 'progress' || percentage === 0) return null;

    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderStreakIndicator = () => {
    if (type !== 'streak' || streakDays === 0) return null;

    return (
      <div className="mt-3 flex items-center space-x-2">
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(streakDays, 7) }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
          {streakDays > 7 && (
            <span className="text-xs text-gray-600 ml-2">+{streakDays - 7} more</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`
      rounded-lg p-4 transition-all duration-300
      ${currentVariant.container}
      ${className}
    `}>
      <div className="flex items-start space-x-3">
        {showIcon && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
              <BrandIcon 
                name={getIcon()}
                size={18}
                className={currentVariant.icon}
                strokeWidth={2}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${currentVariant.message}`}>
            {getMessage()}
          </p>
          
          {renderProgressBar()}
          {renderStreakIndicator()}
        </div>
      </div>
    </div>
  );
};

// Predefined progress messages for common scenarios
export const LearningProgressMessage = ({ percentage }) => (
  <ProgressMessage
    type="progress"
    percentage={percentage}
    variant="default"
  />
);

export const StreakMessage = ({ streakDays }) => (
  <ProgressMessage
    type="streak"
    streakDays={streakDays}
    variant="celebration"
  />
);

export const EncouragementMessage = ({ message }) => (
  <ProgressMessage
    type="encouragement"
    customMessage={message}
    variant="minimal"
  />
);

export const MilestoneMessage = ({ milestone }) => (
  <ProgressMessage
    type="milestone"
    customMessage={`🎯 Milestone reached: ${milestone}`}
    variant="celebration"
  />
);

export const InlineProgressMessage = ({ percentage, message }) => (
  <ProgressMessage
    type="progress"
    percentage={percentage}
    customMessage={message}
    variant="inline"
    showIcon={false}
  />
);

ProgressMessage.propTypes = {
  type: PropTypes.oneOf(['progress', 'streak', 'encouragement', 'milestone']),
  percentage: PropTypes.number,
  streakDays: PropTypes.number,
  customMessage: PropTypes.string,
  showIcon: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'minimal', 'celebration', 'inline']),
  className: PropTypes.string,
};

export default ProgressMessage;