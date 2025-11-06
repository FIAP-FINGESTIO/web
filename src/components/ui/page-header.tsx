'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showLogout = true, 
  className = '' 
}: PageHeaderProps) {
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
          {getInitials(user?.name)}
        </div>
        <div>
          <p className="text-sm text-white">
            Olá, {user?.name || 'Usuário'}
          </p>
          <p className="text-base text-white font-semibold">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {showLogout && (
        <Button 
          variant="outline" 
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          onClick={logout}
        >
          Sair
        </Button>
      )}
    </div>
  );
}