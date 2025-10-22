import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/playground';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
    }
    
    setLoading(false);
  };
  
  const demoCredentials = [
    {
      email: 'admin@seek.com',
      password: 'admin123456',
      role: 'Admin',
      name: 'Admin User',
      icon: '👑',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Full access to all features'
    },
    {
      email: 'test@seek.com',
      password: 'test123456',
      role: 'Student',
      name: 'Test User',
      icon: '👤',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Standard user experience'
    },
  ];

  const handleQuickLogin = async (credentials) => {
    setFormData({ email: credentials.email, password: credentials.password });
    setLoading(true);
    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error handling is in the login function
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-3xl font-bold">S</span>
          </div>
          <h2 className="text-4xl font-bold text-secondary-900 mb-2">
            Welcome to Seek
          </h2>
          <p className="text-secondary-600 text-lg">
            Sign in to continue your coding journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-8 shadow-xl">
            {/* Quick Login Section - Prominent */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-secondary-800 mb-1">Quick Login</h3>
                <p className="text-sm text-secondary-500">Try Seek instantly with demo accounts</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {demoCredentials.map((cred, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickLogin(cred);
                    }}
                    disabled={loading}
                    className={`${cred.bgColor} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{cred.icon}</div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-lg">{cred.name}</div>
                        <div className="text-sm opacity-90">{cred.description}</div>
                        <div className="text-xs opacity-75 mt-1">{cred.email}</div>
                      </div>
                      <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
                        {cred.role}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-secondary-500 font-medium">Or sign in with credentials</span>
              </div>
            </div>

            {/* Manual Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                name="email"
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={EnvelopeIcon}
                animate
              />

              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={LockClosedIcon}
                showPasswordToggle
                animate
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xs text-secondary-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;