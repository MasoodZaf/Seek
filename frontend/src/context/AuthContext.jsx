import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
      
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
      
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
};

// Configure axios defaults - use proxy in development, env variable in production
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_URL || '/api/v1')
  : '/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';

// Token management functions
const getStoredToken = () => {
  return localStorage.getItem('accessToken');
};

const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const setStoredRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

// Set token on app initialization if it exists
const existingToken = getStoredToken();
if (existingToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axios.get('/auth/profile');
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user: response.data.data.user } 
      });
    } catch (error) {
      // Handle session expiration specifically
      if (error.response?.data?.code === 'SESSION_EXPIRED') {
        dispatch({ type: 'AUTH_LOGOUT' });
        // Don't show error toast for session expiration - it's normal in demo mode
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: null });
      }
    }
  };
  
  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      
      const { user, tokens } = response.data.data;
      
      // Store tokens
      setStoredToken(tokens.accessToken);
      setStoredRefreshToken(tokens.refreshToken);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user } 
      });
      
      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true, user };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  
  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await axios.post('/auth/register', userData);
      
      const { user, tokens } = response.data.data;
      
      // Store tokens
      setStoredToken(tokens.accessToken);
      setStoredRefreshToken(tokens.refreshToken);
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user } 
      });
      
      toast.success(`Welcome to Seek, ${user.firstName}!`);
      return { success: true, user };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || [];
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      
      if (errors.length > 0) {
        errors.forEach(err => toast.error(err.message));
      } else {
        toast.error(errorMessage);
      }
      
      return { success: false, error: errorMessage, errors };
    }
  };
  
  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await axios.post('/auth/logout', {});
    } catch (error) {
      // Continue with logout even if server call fails
    } finally {
      // Always clear local tokens and state
      setStoredToken(null);
      setStoredRefreshToken(null);
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Logged out successfully');
    }
  };
  
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      const updatedUser = response.data.data.user;
      
      dispatch({ 
        type: 'AUTH_UPDATE_USER', 
        payload: updatedUser 
      });
      
      toast.success('Profile updated successfully');
      return { success: true, user: updatedUser };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('/auth/password', {
        currentPassword,
        newPassword,
      });
      
      toast.success('Password changed successfully. Please login again.');
      
      // Force logout after password change
      dispatch({ type: 'AUTH_LOGOUT' });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return { success: true };
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  
  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };
  
  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a safe default instead of throwing to prevent app crashes
    return {
      user: null,
      isAuthenticated: false,
      loading: true,
      error: 'Context not available',
      login: () => Promise.reject('Context not available'),
      register: () => Promise.reject('Context not available'),
      logout: () => Promise.reject('Context not available'),
      updateUser: () => {},
      clearError: () => {}
    };
  }
  return context;
};

export default AuthContext;