import React, { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  authAPI, 
  storeTokens, 
  clearTokens, 
  isAuthenticated as checkAuth,
  getErrorMessage 
} from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check auth on mount
  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to restore session:', err);
          clearTokens();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      storeTokens(response.access_token, response.refresh_token);
      const userData = await authAPI.getCurrentUser();
      
      setUser(userData);
      navigate('/dashboard'); // Auto-redirect after login
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.signup({ name, email, password });
      
      storeTokens(response.access_token, response.refresh_token);
      const userData = await authAPI.getCurrentUser();
      
      setUser(userData);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) await authAPI.logout(refreshToken);
    } finally {
      clearTokens();
      setUser(null);
      navigate('/');
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};