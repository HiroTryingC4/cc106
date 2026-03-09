import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
      
      // Auto-refresh user data every 30 seconds to check for verification status updates
      const interval = setInterval(() => {
        fetchUser();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
    setToken(tokenValue);
    setUser(userData);
  };

  const loginWithCredentials = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        login(token, user);
        return { success: true, user };
      } else {
        return { 
          success: false, 
          message: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Cannot connect to server. Please ensure the backend is running.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        login(token, user);
        return { success: true, user };
      } else {
        return { 
          success: false, 
          message: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Cannot connect to server. Please ensure the backend is running.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser();
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithCredentials,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
