import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jt_token'));
  const [loading, setLoading] = useState(false);

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('jt_token', token);
      // Restore user from localStorage
      const savedUser = localStorage.getItem('jt_user');
      if (savedUser && !user) setUser(JSON.parse(savedUser));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('jt_token');
      localStorage.removeItem('jt_user');
    }
  }, [token]);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('jt_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('jt_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
