// src/lib/auth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  email: string;
  [key: string]: any; // Allow for additional user properties
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = authAPI.getUser();
      const isAuth = authAPI.isAuthenticated();
      
      if (isAuth && storedUser) {
        setUser(storedUser);
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      
      return { 
        success: false, 
        message: response.message || 'Login failed' 
      };
    } catch (error) {
      console.error('Auth context login error:', error);
      return { 
        success: false, 
        message: 'An error occurred during login',
        error 
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  // Protected route handling
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    // If not loading and not authenticated and not on login page, redirect to login
    if (!isLoading && !user && currentPath !== '/login') {
      navigate('/login');
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (!isLoading && user && currentPath === '/login') {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;