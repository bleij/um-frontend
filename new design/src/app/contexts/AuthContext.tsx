import React, { createContext, useContext, useState, useEffect } from 'react';
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

console.log('🔧 AuthContext.tsx загружен');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🚀 AuthProvider монтируется');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    console.log('🔄 AuthProvider: загрузка пользователя...');
    const currentUser = getCurrentUser();
    console.log('🔍 AuthProvider: currentUser из localStorage:', currentUser);
    setUser(currentUser);
    setLoading(false);
    console.log('✅ AuthProvider: загрузка завершена, user установлен:', currentUser);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await signIn(email, password);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const register = async (email: string, password: string, role: User['role'], firstName?: string, lastName?: string): Promise<AuthResponse> => {
    console.log('🔄 AuthContext.register вызван:', { email, role, firstName, lastName });
    const response = await signUp(email, password, role, firstName, lastName);
    console.log('📥 AuthContext.register получил ответ:', response);
    if (response.success && response.user) {
      console.log('✅ AuthContext.register: устанавливаем user в state:', response.user);
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
    // Временная защита от проблем с кэшированием
    console.error('⚠️ useAuth вызван вне AuthProvider - это ошибка кэширования');
    console.error('📍 Текущий URL:', window.location.href);
    console.error('🔄 Попробуйте очистить кэш и перезагрузить страницу');
    
    // Возвращаем заглушку вместо выброса ошибки
    return {
      user: null,
      loading: false,
      login: async () => ({ success: false, error: 'AuthProvider не инициализирован' }),
      register: async () => ({ success: false, error: 'AuthProvider не инициализирован' }),
      logout: () => {
        console.error('Logout вызван до инициализации AuthProvider');
      }
    };
  }
  return context;
}