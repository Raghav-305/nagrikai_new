import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiClient } from '@utils/apiClient';
import type { User, AuthResponse } from '@types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string, role: string) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist token and user to localStorage whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const register = async (name: string, email: string, password: string, role: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register({
        name,
        email,
        password,
        role,
      });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.msg || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.msg || 'Login failed';
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

  const contextValue: AuthContextType = {
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
