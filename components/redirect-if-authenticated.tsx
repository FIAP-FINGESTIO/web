'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function RedirectIfAuthenticated({ children, redirectTo = '/' }: RedirectIfAuthenticatedProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('👤 Usuário já está logado, redirecionando...');
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Se estiver autenticado, não mostrar o conteúdo (aguardando redirecionamento)
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-black">
        <div className="text-white">Redirecionando...</div>
      </div>
    );
  }

  return <>{children}</>;
}