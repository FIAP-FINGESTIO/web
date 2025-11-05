'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, User } from '@/lib/auth-types';
import { apiClient } from '@/lib/api-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      
      const response = await apiClient.post<User>('/auth/login', { email, password });
      
      
      if (response.success && response.data) {
        const userData: User = response.data;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        console.log('✅ Login realizado com sucesso:', userData);
        return { success: true };
      } else {
        console.error('❌ Erro no login:', response.message);
        return { success: false, error: response.message || 'Erro ao fazer login' };
      }
    } catch (error: any) {
      console.error('🚨 Erro de conexão:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}