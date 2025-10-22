import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BrandIcon from './BrandIcon';
import { Button } from './Button';
import { successMessages, formatSuccessMessage } from '../../utils/messaging';

/**
 * Professional success notification component with encouraging messaging
 */
const SuccessNotification = ({
  type,
  data = {},
  onAction,
  onDismiss,
  autoHide = true,
  duration = 5000,
  variant = 'default',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const successConfig = formatSuccessMessage(type, data);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  const handleAction = () => {
    onAction?.(data);
    handleDismiss();
  };

  if (!isVisible) return null;

  const variants = {
    default: {
      container: 'bg-white border border-green-200 shadow-lg',
      icon: 'text-green-500',
      title: 'text-green-900',
      message: 'text-green-700',
      button: 'success'
    },
    minimal: {
      container: 'bg-green-50 border border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      message: 'text-green-700',
      button: 'success'
    },
    celebration: {
      container: 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 shadow-xl',
      icon: 'text-green-500',
      title: 'text-gray-900',
      message: 'text-gray-700',
      button: 'primary'
    },
    toast: {
      container: 'bg-white border border-green-200 shadow-2xl',
      icon: 'text-green-500',
      title: 'text-green-900',
      message: 'text-green-700',
      button: 'success'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  const getSuccessIcon = (successType) => {
    const iconMap = {
      accountCreated: 'check',
      profileUpdated: 'check',
      passwordChanged: 'check',
      tutorialCompleted: 'trophy',
      levelUp: 'star',
      streakAchieved: 'fire',
      codeSaved: 'save',
      codeShared: 'share',
      projectCreated: 'code',
      badgeEarned: 'trophy',
      milestoneReached: 'star'
    };
    
    return iconMap[successType] || 'check';
  };

  const renderCelebrationElements = () => {
    if (variant !== 'celebration') return null;

    return (
      <>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-2 left-2 w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
      </>
    );
  };

  return (
    <div className={`
      relative rounded-lg p-4 transition-all duration-300 transform
      ${currentVariant.container}
      ${isAnimating ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
      ${className}
    `}>
      {renderCelebrationElements()}
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <BrandIcon 
              name={getSuccessIcon(type)}
              size={18}
              className={currentVariant.icon}
              strokeWidth={2}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm mb-1 ${currentVariant.title}`}>
            {successConfig.title}
          </h4>
          
          <p className={`text-sm ${currentVariant.message}`}>
            {successConfig.message}
          </p>
          
          {data.details && (
            <div className="mt-2 text-xs text-gray-600">
              {Array.isArray(data.details) ? (
                <ul className="list-disc list-inside space-y-1">
                  {data.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p>{data.details}</p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              {onAction && (
                <Button
                  onClick={handleAction}
                  variant={currentVariant.button}
                  size="xs"
                >
                  {successConfig.action}
                </Button>
              )}
            </div>
            
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Dismiss notification"
            >
              <BrandIcon name="x" size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {autoHide && duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-lg transition-all duration-300"
             style={{ 
               width: '100%',
               animation: `shrink ${duration}ms linear forwards`
             }}>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Predefined success notifications for common scenarios
export const TutorialCompletedNotification = ({ tutorialName, onNextTutorial, onDismiss }) => (
  <SuccessNotification
    type="tutorialCompleted"
    data={{ tutorialName, details: [`Completed: ${tutorialName}`, 'XP earned: +50', 'Progress updated'] }}
    onAction={onNextTutorial}
    onDismiss={onDismiss}
    variant="celebration"
  />
);

export const LevelUpNotification = ({ newLevel, onViewProgress, onDismiss }) => (
  <SuccessNotification
    type="levelUp"
    data={{ newLevel, details: [`You're now Level ${newLevel}!`, 'New features unlocked', 'Keep up the great work!'] }}
    onAction={onViewProgress}
    onDismiss={onDismiss}
    variant="celebration"
    duration={7000}
  />
);

export const CodeSavedNotification = ({ projectName, onDismiss }) => (
  <SuccessNotification
    type="codeSaved"
    data={{ projectName }}
    onDismiss={onDismiss}
    variant="minimal"
    duration={3000}
  />
);

export const AchievementUnlockedNotification = ({ achievement, onViewAchievements, onDismiss }) => (
  <SuccessNotification
    type="badgeEarned"
    data={{ 
      achievement: achievement.name,
      details: [achievement.description, `Earned: ${new Date().toLocaleDateString()}`]
    }}
    onAction={onViewAchievements}
    onDismiss={onDismiss}
    variant="celebration"
    duration={8000}
  />
);

SuccessNotification.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
  onAction: PropTypes.func,
  onDismiss: PropTypes.func,
  autoHide: PropTypes.bool,
  duration: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'minimal', 'celebration', 'toast']),
  className: PropTypes.string,
};

export default SuccessNotification;