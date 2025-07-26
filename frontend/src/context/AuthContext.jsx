import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext.jsx useEffect: Initial token:', { token, loading });
    if (!token) {
      console.log('AuthContext.jsx: No token found, setting loading to false');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Note: Backend uses POST /api/users/profile, but should be GET
        const res = await axios.post('/api/users/profile', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('AuthContext.jsx: Profile fetched successfully:', res.data);
        setUser({ _id: res.data._id, name: res.data.fullName, email: res.data.email });
      } catch (err) {
        console.error('AuthContext.jsx: Profile fetch failed:', err.response?.data || err.message);
        setUser(null); // Reset user but keep token
      } finally {
        console.log('AuthContext.jsx: Setting loading to false after profile fetch');
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('AuthContext.jsx: Profile fetch timeout, forcing loading to false');
        setLoading(false);
      }
    }, 5000);

    fetchProfile();

    return () => clearTimeout(timeoutId);
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('AuthContext.jsx: Attempting login with:', { email });
      const res = await axios.post('/api/users/login', { email, password });
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser({ _id: res.data.user._id, name: res.data.user.fullName, email: res.data.user.email });
      console.log('AuthContext.jsx: Login successful, token set:', newToken);
      return res.data.user;
    } catch (err) {
      console.error('AuthContext.jsx: Login failed:', err.response?.data || err.message);
      throw new Error(err.response?.data?.error?.message || 'Failed to log in');
    }
  };

  const logout = () => {
    console.log('AuthContext.jsx: Logging out');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};