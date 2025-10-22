import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BrandIcon from './BrandIcon';
import { Button } from './Button';

/**
 * Professional social sharing component with multiple platform support
 */
const SocialShare = ({
  url = window.location.href,
  title = 'Check out what I built on Seek!',
  description = 'Learning to code with Seek\'s professional platform',
  hashtags = ['coding', 'learning', 'SeekLearning'],
  via = 'SeekLearning',
  variant = 'default',
  showLabels = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = encodeURIComponent(hashtags.join(','));

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}&via=${via}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      handleCopyLink();
      return;
    }

    if (platform === 'native' && navigator.share) {
      navigator.share({
        title,
        text: description,
        url
      }).catch(console.error);
      return;
    }

    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const platforms = [
    {
      name: 'twitter',
      label: 'Twitter',
      icon: 'share',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      name: 'facebook',
      label: 'Facebook',
      icon: 'share',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-700'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: 'share',
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-blue-800'
    },
    {
      name: 'reddit',
      label: 'Reddit',
      icon: 'share',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600'
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      icon: 'share',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600'
    },
    {
      name: 'telegram',
      label: 'Telegram',
      icon: 'share',
      color: 'bg-blue-400 hover:bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      name: 'email',
      label: 'Email',
      icon: 'share',
      color: 'bg-gray-500 hover:bg-gray-600',
      textColor: 'text-gray-600'
    }
  ];

  const variants = {
    default: 'grid grid-cols-4 gap-3',
    compact: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col space-y-2',
    minimal: 'flex space-x-2'
  };

  const renderPlatformButton = (platform) => {
    if (variant === 'minimal') {
      return (
        <button
          key={platform.name}
          onClick={() => handleShare(platform.name)}
          className={`
            p-2 rounded-full transition-colors duration-200
            ${platform.color} text-white
            hover:scale-105 transform
          `}
          title={`Share on ${platform.label}`}
        >
          <BrandIcon name={platform.icon} size={16} />
        </button>
      );
    }

    return (
      <button
        key={platform.name}
        onClick={() => handleShare(platform.name)}
        className={`
          flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-gray-200
          hover:border-gray-300 transition-all duration-200 hover:scale-105 transform
          ${variant === 'compact' ? 'text-sm' : ''}
        `}
      >
        <BrandIcon name={platform.icon} size={20} className={platform.textColor} />
        {showLabels && (
          <span className={`font-medium ${platform.textColor}`}>
            {platform.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`${className}`}>
      <div className={variants[variant]}>
        {platforms.map(renderPlatformButton)}
        
        {/* Native Share (if supported) */}
        {navigator.share && (
          <button
            onClick={() => handleShare('native')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-105 transform"
          >
            <BrandIcon name="share" size={20} className="text-purple-600" />
            {showLabels && (
              <span className="font-medium text-purple-600">Share</span>
            )}
          </button>
        )}
        
        {/* Copy Link */}
        <button
          onClick={() => handleShare('copy')}
          className={`
            flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 transform
            ${copied 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <BrandIcon 
            name={copied ? 'check' : 'copy'} 
            size={20} 
            className={copied ? 'text-green-600' : 'text-gray-600'} 
          />
          {showLabels && (
            <span className={`font-medium ${copied ? 'text-green-600' : 'text-gray-600'}`}>
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

// Predefined sharing components for common scenarios
export const CodeSnippetShare = ({ code, language, title }) => {
  const shareUrl = `${window.location.origin}/share/code?code=${encodeURIComponent(code)}&lang=${language}`;
  const shareTitle = title || `Check out my ${language} code on Seek!`;
  const shareDescription = `I just wrote some ${language} code on Seek. Take a look!`;

  return (
    <SocialShare
      url={shareUrl}
      title={shareTitle}
      description={shareDescription}
      hashtags={['coding', language, 'SeekLearning']}
      variant="compact"
    />
  );
};

export const AchievementShare = ({ achievement }) => {
  const shareTitle = `🏆 I just earned the "${achievement.name}" badge on Seek!`;
  const shareDescription = `${achievement.description} Join me in learning to code!`;

  return (
    <SocialShare
      title={shareTitle}
      description={shareDescription}
      hashtags={['achievement', 'coding', 'learning', 'SeekLearning']}
      variant="default"
    />
  );
};

export const TutorialCompletionShare = ({ tutorial }) => {
  const shareTitle = `✅ Just completed "${tutorial.title}" on Seek!`;
  const shareDescription = `I'm learning ${tutorial.language} and making great progress. Check out Seek's interactive tutorials!`;

  return (
    <SocialShare
      title={shareTitle}
      description={shareDescription}
      hashtags={['tutorial', tutorial.language, 'learning', 'SeekLearning']}
      variant="default"
    />
  );
};

export const ProjectShare = ({ project }) => {
  const shareUrl = `${window.location.origin}/projects/${project.id}`;
  const shareTitle = `🚀 Check out my project "${project.name}" built on Seek!`;
  const shareDescription = `I built this ${project.language} project using Seek's code playground. Try it yourself!`;

  return (
    <SocialShare
      url={shareUrl}
      title={shareTitle}
      description={shareDescription}
      hashtags={['project', project.language, 'coding', 'SeekLearning']}
      variant="default"
    />
  );
};

export const MinimalShare = ({ url, title }) => (
  <SocialShare
    url={url}
    title={title}
    variant="minimal"
    showLabels={false}
  />
);

SocialShare.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  hashtags: PropTypes.arrayOf(PropTypes.string),
  via: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact', 'vertical', 'minimal']),
  showLabels: PropTypes.bool,
  className: PropTypes.string,
};

export default SocialShare;