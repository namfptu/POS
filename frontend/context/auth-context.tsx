"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '@/lib/api'; // Alias imports

interface AuthContextType {
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  role: string | null;
  accessToken: string | null; // Changed from 'token' to 'accessToken'
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // Changed from 'token' to 'accessToken' state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token'); // Get stored token from localStorage
    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setAccessToken(storedToken); // Set accessToken from stored token
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiLogin(credentials);
      setUser(response.user);
      setRole(response.user.role);
      setAccessToken(response.accessToken); // Save accessToken
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('token', response.accessToken); // Save accessToken to localStorage under 'token' key
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await apiRegister(userData);
      setUser(response.user);
      setRole(response.user.role);
      setAccessToken(response.accessToken); // Save accessToken
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('token', response.accessToken); // Save accessToken to localStorage under 'token' key
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setAccessToken(null); // Clear accessToken
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, accessToken, login, register, logout }}> {/* Pass accessToken */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

