'use client';

import { useAuth } from '@/providers/auth-provider';
import { Home, CreditCard, Grid3x3, Receipt, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavigationProps {
    className?: string;
}

export function BottomNavigation({ className = '' }: BottomNavigationProps) {
    // Todos os hooks devem ser chamados SEMPRE na mesma ordem
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    
    // Returns condicionais só após todos os hooks
    if (isLoading) {
        return null;
    }

    if (!user) {
        return null;
    }

    const navItems = [
        {
            href: '/',
            icon: Home,
            label: 'Home',
            isActive: pathname === '/'
        },
        {
            href: '/cards',
            icon: CreditCard,
            label: 'Cartões',
            isActive: pathname === '/cards'
        },
        {
            href: '/categories',
            icon: Grid3x3,
            label: 'Categorias',
            isActive: pathname === '/categories'
        },
        {
            href: '/transactions',
            icon: Receipt,
            label: 'Transações',
            isActive: pathname === '/transactions'
        },
    ];

    return (
        <nav className={`fixed bottom-4 left-4 right-4 ${className}`}>
            <div className="max-w-md mx-auto">
                <div className="bg-gray-800/90 backdrop-blur-md rounded-full border border-gray-700/50 shadow-xl">
                    <div className="flex justify-around items-center py-3 px-2">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                                        item.isActive 
                                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                                >
                                    <IconComponent className="w-6 h-6" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}