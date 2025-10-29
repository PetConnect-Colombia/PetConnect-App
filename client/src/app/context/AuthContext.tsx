'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getMyProfile } from '@/services/auth.service';
import { useAlert } from './AlertContext';
import { useLoader } from './LoaderContext';

// Define the shape of the user object and the context
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export a custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check session
  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await getMyProfile();
          setUser(profile.user);
        } catch (error) {
          console.error('Session check failed', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    showLoader();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.token);
      setUser(res.user);
      showAlert('success', 'Login exitoso.');
      return res;
    } catch (error) {
      showAlert('error', 'Usuario o contraseña incorrectos.');
      throw error;
    } finally {
      hideLoader();
    }
  };

  const register = async (name: string, email: string, password: string) => {
    showLoader();
    try {
      const res = await registerUser({ name, email, password });
      if (res.token) {
        showAlert('success', 'Registro exitoso. Por favor, inicia sesión.');
      }
      return res;
    } catch (error) {
      showAlert('error', 'Error en el registro.');
      throw error;
    } finally {
      hideLoader();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optional: redirect to login page
    window.location.href = '/home';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
