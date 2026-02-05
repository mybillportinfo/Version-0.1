'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, subscribeToAuth, loginUser, registerUser, logoutUser } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(getAuthErrorMessage(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await registerUser(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(getAuthErrorMessage(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, clearError }}>
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

function getAuthErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('auth/email-already-in-use')) {
    return 'This email is already registered. Please sign in instead.';
  }
  if (errorMessage.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (errorMessage.includes('auth/weak-password')) {
    return 'Password must be at least 6 characters.';
  }
  if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/wrong-password') || errorMessage.includes('auth/invalid-credential')) {
    return 'Invalid email or password.';
  }
  if (errorMessage.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }
  return errorMessage;
}
