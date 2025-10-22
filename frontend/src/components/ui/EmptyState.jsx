import React from 'react';
import PropTypes from 'prop-types';
import BrandIcon from './BrandIcon';
import { Button } from './Button';

/**
 * EmptyState component with professional styling and brand elements
 */
const EmptyState = ({
  icon = 'search',
  title = 'Nothing here yet',
  description = 'Get started by taking your first action.',
  action,
  actionText = 'Get Started',
  illustration = null,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: {
      container: 'bg-white border border-gray-200',
      icon: 'text-gray-400',
      title: 'text-gray-900',
      description: 'text-gray-600'
    },
    gradient: {
      container: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100',
      icon: 'text-blue-500',
      title: 'text-gray-900',
      description: 'text-gray-700'
    },
    minimal: {
      container: 'bg-transparent',
      icon: 'text-gray-300',
      title: 'text-gray-800',
      description: 'text-gray-500'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  const renderIllustration = () => {
    if (illustration) {
      return illustration;
    }

    // Default branded illustration
    return (
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <BrandIcon 
            name={icon} 
            size={32} 
            className={currentVariant.icon}
            strokeWidth={1.5}
          />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-30"></div>
      </div>
    );
  };

  return (
    <div className={`
      flex flex-col items-center justify-center text-center p-8 rounded-xl
      ${currentVariant.container}
      ${className}
    `}>
      {renderIllustration()}
      
      <h3 className={`text-lg font-semibold mb-2 ${currentVariant.title}`}>
        {title}
      </h3>
      
      <p className={`text-sm mb-6 max-w-sm ${currentVariant.description}`}>
        {description}
      </p>
      
      {action && (
        <Button
          onClick={action}
          variant="primary"
          size="md"
          className="shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

// Predefined empty states for common scenarios
export const EmptyTutorials = ({ onCreateTutorial }) => (
  <EmptyState
    icon="tutorials"
    title="No tutorials yet"
    description="Start your coding journey by exploring our comprehensive tutorials designed for all skill levels."
    action={onCreateTutorial}
    actionText="Browse Tutorials"
    variant="gradient"
  />
);

export const EmptyPlayground = ({ onCreateProject }) => (
  <EmptyState
    icon="code"
    title="Ready to code?"
    description="Create your first project and start experimenting with code in our interactive playground."
    action={onCreateProject}
    actionText="New Project"
    variant="gradient"
  />
);

export const EmptyAchievements = ({ onStartLearning }) => (
  <EmptyState
    icon="trophy"
    title="No achievements yet"
    description="Complete tutorials and challenges to unlock achievements and track your progress."
    action={onStartLearning}
    actionText="Start Learning"
    variant="gradient"
  />
);

export const EmptySearch = ({ searchTerm, onClearSearch }) => (
  <EmptyState
    icon="search"
    title={`No results for "${searchTerm}"`}
    description="Try adjusting your search terms or browse our categories to find what you're looking for."
    action={onClearSearch}
    actionText="Clear Search"
    variant="minimal"
  />
);

export const EmptyProjects = ({ onCreateProject }) => (
  <EmptyState
    icon="code"
    title="No saved projects"
    description="Save your code snippets and projects to access them anytime, anywhere."
    action={onCreateProject}
    actionText="Create Project"
    variant="default"
  />
);

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.func,
  actionText: PropTypes.string,
  illustration: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'gradient', 'minimal']),
  className: PropTypes.string,
};

export default EmptyState;