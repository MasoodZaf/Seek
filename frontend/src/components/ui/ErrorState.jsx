import React from 'react';
import PropTypes from 'prop-types';
import BrandIcon from './BrandIcon';
import { Button } from './Button';
import { errorMessages, formatErrorMessage } from '../../utils/messaging';

/**
 * Professional error state component with helpful messaging
 */
const ErrorState = ({
  error,
  onRetry,
  onGoBack,
  variant = 'default',
  showDetails = false,
  className = ''
}) => {
  const formattedError = typeof error === 'string' 
    ? { type: error } 
    : formatErrorMessage(error);

  const errorConfig = errorMessages[formattedError.type] || errorMessages.serverError;

  const variants = {
    default: {
      container: 'bg-white border border-red-200 text-center',
      icon: 'text-red-500',
      title: 'text-red-900',
      message: 'text-red-700',
      button: 'error'
    },
    minimal: {
      container: 'bg-transparent text-center',
      icon: 'text-red-400',
      title: 'text-gray-900',
      message: 'text-gray-600',
      button: 'primary'
    },
    inline: {
      container: 'bg-red-50 border border-red-200 text-left',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'error'
    },
    toast: {
      container: 'bg-white border border-red-200 shadow-lg text-left',
      icon: 'text-red-500',
      title: 'text-red-900',
      message: 'text-red-700',
      button: 'error'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  const getErrorIcon = (errorType) => {
    const iconMap = {
      networkError: 'warning',
      serverError: 'x',
      timeoutError: 'warning',
      loginFailed: 'warning',
      sessionExpired: 'info',
      unauthorized: 'warning',
      codeExecutionFailed: 'code',
      compilationError: 'warning',
      runtimeError: 'warning',
      fileUploadFailed: 'upload',
      fileTooLarge: 'warning',
      unsupportedFormat: 'warning'
    };
    
    return iconMap[errorType] || 'warning';
  };

  const renderActions = () => {
    const actions = [];
    
    if (onRetry) {
      actions.push(
        <Button
          key="retry"
          onClick={onRetry}
          variant={currentVariant.button}
          size="sm"
          className="mr-2"
        >
          {errorConfig.action || 'Try Again'}
        </Button>
      );
    }
    
    if (onGoBack) {
      actions.push(
        <Button
          key="back"
          onClick={onGoBack}
          variant="secondary"
          size="sm"
        >
          Go Back
        </Button>
      );
    }
    
    return actions.length > 0 ? (
      <div className="flex justify-center space-x-2 mt-4">
        {actions}
      </div>
    ) : null;
  };

  return (
    <div className={`
      rounded-lg p-6
      ${currentVariant.container}
      ${className}
    `}>
      <div className={variant === 'inline' || variant === 'toast' ? 'flex items-start space-x-3' : 'flex flex-col items-center'}>
        <div className={variant === 'inline' || variant === 'toast' ? 'flex-shrink-0' : 'mb-4'}>
          <div className={`
            ${variant === 'inline' || variant === 'toast' ? 'w-6 h-6' : 'w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'}
          `}>
            <BrandIcon 
              name={getErrorIcon(formattedError.type)}
              size={variant === 'inline' || variant === 'toast' ? 20 : 24}
              className={currentVariant.icon}
              strokeWidth={2}
            />
          </div>
        </div>
        
        <div className={variant === 'inline' || variant === 'toast' ? 'flex-1 min-w-0' : ''}>
          <h3 className={`font-semibold mb-2 ${currentVariant.title}`}>
            {errorConfig.title}
          </h3>
          
          <p className={`text-sm mb-4 ${currentVariant.message}`}>
            {errorConfig.message}
          </p>
          
          {showDetails && formattedError.details && (
            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border overflow-auto">
                {JSON.stringify(formattedError.details, null, 2)}
              </pre>
            </details>
          )}
          
          {variant !== 'toast' && renderActions()}
        </div>
        
        {variant === 'toast' && renderActions()}
      </div>
    </div>
  );
};

// Predefined error states for common scenarios
export const NetworkError = ({ onRetry }) => (
  <ErrorState
    error="networkError"
    onRetry={onRetry}
    variant="default"
  />
);

export const CodeExecutionError = ({ error, onRetry }) => (
  <ErrorState
    error={{ type: 'codeExecutionFailed', details: error }}
    onRetry={onRetry}
    variant="inline"
    showDetails={true}
  />
);

export const LoginError = ({ onRetry }) => (
  <ErrorState
    error="loginFailed"
    onRetry={onRetry}
    variant="minimal"
  />
);

export const FileUploadError = ({ error, onRetry }) => (
  <ErrorState
    error={{ type: 'fileUploadFailed', details: error }}
    onRetry={onRetry}
    variant="inline"
  />
);

export const SessionExpiredError = ({ onLogin }) => (
  <ErrorState
    error="sessionExpired"
    onRetry={onLogin}
    variant="default"
  />
);

ErrorState.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onRetry: PropTypes.func,
  onGoBack: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'minimal', 'inline', 'toast']),
  showDetails: PropTypes.bool,
  className: PropTypes.string,
};

export default ErrorState;