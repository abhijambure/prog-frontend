import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = useState(true);

  // Setup default headers for requests
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await authAPI.getMe();
      setUser(profile);
      localStorage.setItem('role', profile.role);
      setRole(profile.role);
    } catch (err) {
      console.error('Failed to load profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { access_token, role: userRole } = await authAPI.login(email, password);
    localStorage.setItem('token', access_token);
    localStorage.setItem('role', userRole);
    
    setToken(access_token);
    setRole(userRole);
    return userRole;
  };

  const register = async (email, password, userRole = 'student') => {
    await authAPI.register(email, password, userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, register, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
