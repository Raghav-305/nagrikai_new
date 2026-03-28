import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@utils/apiClient';

// Plain-JS implementation to avoid Vite import-analysis failing on AuthContext.tsx.
// Keep this as the runtime entry for `./context/AuthContext` imports.

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const register = async (name, email, password, role, department) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register({ name, email, password, role, department });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err?.response?.data?.msg || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err?.response?.data?.msg || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const contextValue = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
