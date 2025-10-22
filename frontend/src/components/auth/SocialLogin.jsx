import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BrandIcon from '../ui/BrandIcon';
import { Button } from '../ui/Button';

/**
 * Professional social login component with multiple providers
 */
const SocialLogin = ({
  onLogin,
  providers = ['google', 'github', 'microsoft'],
  variant = 'default',
  showDivider = true,
  className = ''
}) => {
  const [loading, setLoading] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoading(provider);
    try {
      await onLogin(provider);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setLoading(null);
    }
  };

  const providerConfig = {
    google: {
      name: 'Google',
      icon: 'search', // Using search as placeholder for Google icon
      color: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
      iconColor: 'text-red-500'
    },
    github: {
      name: 'GitHub',
      icon: 'code',
      color: 'bg-gray-900 text-white hover:bg-gray-800',
      iconColor: 'text-white'
    },
    microsoft: {
      name: 'Microsoft',
      icon: 'info', // Using info as placeholder for Microsoft icon
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      iconColor: 'text-white'
    },
    facebook: {
      name: 'Facebook',
      icon: 'share',
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      iconColor: 'text-white'
    },
    twitter: {
      name: 'Twitter',
      icon: 'share',
      color: 'bg-blue-400 text-white hover:bg-blue-500',
      iconColor: 'text-white'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: 'share',
      color: 'bg-blue-700 text-white hover:bg-blue-800',
      iconColor: 'text-white'
    }
  };

  const renderProviderButton = (providerId) => {
    const provider = providerConfig[providerId];
    if (!provider) return null;

    const isLoading = loading === providerId;

    if (variant === 'minimal') {
      return (
        <button
          key={providerId}
          onClick={() => handleSocialLogin(providerId)}
          disabled={isLoading}
          className={`
            p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 transform
            ${provider.color}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          `}
          title={`Continue with ${provider.name}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <BrandIcon name={provider.icon} size={20} className={provider.iconColor} />
          )}
        </button>
      );
    }

    return (
      <Button
        key={providerId}
        onClick={() => handleSocialLogin(providerId)}
        disabled={isLoading}
        variant="secondary"
        size="lg"
        className={`
          w-full justify-center space-x-3 transition-all duration-200 hover:scale-[1.02] transform
          ${provider.color}
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <BrandIcon name={provider.icon} size={20} className={provider.iconColor} />
        )}
        <span className="font-medium">
          Continue with {provider.name}
        </span>
      </Button>
    );
  };

  const renderDivider = () => {
    if (!showDivider) return null;

    return (
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {variant === 'minimal' ? (
        <div className="flex justify-center space-x-3">
          {providers.map(renderProviderButton)}
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map(renderProviderButton)}
        </div>
      )}
      
      {renderDivider()}
    </div>
  );
};

// Predefined social login configurations
export const GoogleLogin = ({ onLogin, loading }) => (
  <SocialLogin
    onLogin={onLogin}
    providers={['google']}
    showDivider={false}
    loading={loading}
  />
);

export const GitHubLogin = ({ onLogin, loading }) => (
  <SocialLogin
    onLogin={onLogin}
    providers={['github']}
    showDivider={false}
    loading={loading}
  />
);

export const CompactSocialLogin = ({ onLogin }) => (
  <SocialLogin
    onLogin={onLogin}
    providers={['google', 'github', 'microsoft']}
    variant="minimal"
    showDivider={true}
  />
);

export const FullSocialLogin = ({ onLogin }) => (
  <SocialLogin
    onLogin={onLogin}
    providers={['google', 'github', 'microsoft', 'facebook']}
    variant="default"
    showDivider={true}
  />
);

// Social login benefits component
export const SocialLoginBenefits = () => (
  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
    <h4 className="text-sm font-semibold text-blue-900 mb-2">
      Why use social login?
    </h4>
    <ul className="text-xs text-blue-800 space-y-1">
      <li className="flex items-center space-x-2">
        <BrandIcon name="check" size={12} className="text-blue-600" />
        <span>Faster sign-up process</span>
      </li>
      <li className="flex items-center space-x-2">
        <BrandIcon name="check" size={12} className="text-blue-600" />
        <span>No need to remember another password</span>
      </li>
      <li className="flex items-center space-x-2">
        <BrandIcon name="check" size={12} className="text-blue-600" />
        <span>Secure authentication</span>
      </li>
      <li className="flex items-center space-x-2">
        <BrandIcon name="check" size={12} className="text-blue-600" />
        <span>Sync your profile information</span>
      </li>
    </ul>
  </div>
);

// Privacy notice component
export const SocialLoginPrivacy = () => (
  <div className="mt-4 text-xs text-gray-600 text-center">
    <p>
      By continuing, you agree to our{' '}
      <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
        Terms of Service
      </a>{' '}
      and{' '}
      <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
        Privacy Policy
      </a>
    </p>
    <p className="mt-1">
      We'll never post to your social media accounts without permission.
    </p>
  </div>
);

SocialLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(PropTypes.string),
  variant: PropTypes.oneOf(['default', 'minimal']),
  showDivider: PropTypes.bool,
  className: PropTypes.string,
};

export default SocialLogin;