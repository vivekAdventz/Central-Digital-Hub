/**
 * Auth Context
 * -------------
 * Provides authentication state to the entire app.
 * Stores user info and token in localStorage for persistence.
 * Exposes login, adminLogin, and logout functions.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have stored auth data
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Handle Microsoft login
   * Called after MSAL returns the user's Microsoft account info
   */
  const loginWithMicrosoft = async (msalAccount) => {
    try {
      const response = await API.post('/auth/microsoft', {
        email: msalAccount.username,
        name: msalAccount.name,
        microsoftId: msalAccount.localAccountId,
      });

      const { token: jwt, user: userData } = response.data.data;

      // Store in state and localStorage
      setToken(jwt);
      setUser(userData);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  /**
   * Handle admin login with email + password
   */
  const adminLogin = async (email, password) => {
    try {
      const response = await API.post('/admin/login', { email, password });

      const { token: jwt, user: userData } = response.data.data;

      setToken(jwt);
      setUser(userData);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed.';
      return { success: false, message };
    }
  };

  /**
   * Logout — clear all auth state
   */
  const logout = () => {
    // NUCLEAR LOGOUT: Clear every single item in local storage
    localStorage.clear();
    
    // Also specifically target our keys just in case browser behavior varies
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear React state
    setToken(null);
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        loginWithMicrosoft,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
