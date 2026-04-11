import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../lib/users';
import { getCurrentUser, signIn, signOut, signUp, AuthResponse } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, role: User['role'], firstName?: string, lastName?: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await signIn(email, password);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const register = async (email: string, password: string, role: User['role'], firstName?: string, lastName?: string): Promise<AuthResponse> => {
    const response = await signUp(email, password, role, firstName, lastName);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    signOut();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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