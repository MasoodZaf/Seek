import React from 'react';
import PropTypes from 'prop-types';

/**
 * BrandedLoading component with professional styling and brand elements
 */
const BrandedLoading = ({ 
  size = 'md', 
  variant = 'spinner',
  message = '',
  showLogo = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const SpinnerLoader = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
      <div className="absolute inset-1 rounded-full border border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
    </div>
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
    </div>
  );

  const PulseLoader = () => (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-pulse opacity-75`}></div>
  );

  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-3/4"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-1/2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md w-5/6"></div>
    </div>
  );

  const BrandLoader = () => (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl animate-ping opacity-20"></div>
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'skeleton':
        return <SkeletonLoader />;
      case 'brand':
        return <BrandLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {showLogo && variant !== 'brand' && (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      )}
      
      {renderLoader()}
      
      {message && (
        <p className="text-sm text-gray-600 text-center font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

BrandedLoading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'skeleton', 'brand']),
  message: PropTypes.string,
  showLogo: PropTypes.bool,
  className: PropTypes.string,
};

export default BrandedLoading;