import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const AuthContext = createContext();

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    console.log('Decoded JWT payload:', decoded); // Debug log
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      console.log('Initial user from token:', decoded); // Debug log
      return decoded;
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      const payload = decodeToken(token);
      if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
        console.log('Token expired or invalid');
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      } else {
        console.log('Setting user from token:', payload); // Debug log
        setUser(payload);
      }
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await axios.post('/api/auth/login', credentials);
    const jwt = res.data.token;
    localStorage.setItem('token', jwt);
    setToken(jwt);
    const decoded = decodeToken(jwt);
    console.log('User logged in:', decoded); // Debug log
    setUser(decoded);
    return res;
  };

  const register = async (payload) => {
    return axios.post('/api/auth/register', payload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;

  // Debug log on every render
  useEffect(() => {
    console.log('Current user state:', user);
    console.log('User role:', user?.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
