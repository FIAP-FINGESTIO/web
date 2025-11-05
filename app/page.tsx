'use client';

import { useState } from 'react';
import { Home, CreditCard, Grid3x3, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useAuth();

  const expenses = [
    { id: 1, name: 'Spotify', date: '15 ABR 2025', amount: 20, color: 'bg-purple-500' },
    { id: 2, name: 'Netflix', date: '14 ABR 2025', amount: 45, color: 'bg-red-500' },
    { id: 3, name: 'Uber', date: '13 ABR 2025', amount: 33, color: 'bg-pink-500' },
    { id: 4, name: 'iFood', date: '12 ABR 2025', amount: 68, color: 'bg-orange-500' },
    { id: 5, name: 'Amazon', date: '11 ABR 2025', amount: 157, color: 'bg-orange-600' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm text-white">Olá, {user?.name || user?.email?.split('@')[0]}</p>
                <p className="text-base text-white">Meu saldo</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              onClick={logout}
            >
              Sair
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 mb-8">
            <CardContent className="p-6">
              <p className="text-sm text-white mb-2">Despesas planejadas</p>
              <h1 className="text-5xl font-bold mb-6">R$ 1.345,23</h1>
              <div className="flex gap-3">
                <Button className="bg-red-500 hover:bg-red-600 text-white font-medium">
                  Atualizar R$ 645
                </Button>
                <Button className="bg-pink-500 hover:bg-pink-600 text-white font-medium">
                  Contas R$ 645
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-4">Minha renda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <p className="text-sm text-white mb-2">Salário</p>
                <p className="text-2xl font-bold">R$ 3.000</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <p className="text-sm text-white mb-2">Hora extra</p>
                <p className="text-2xl font-bold">R$ 149</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <p className="text-sm text-white mb-2">Investimentos</p>
                <p className="text-2xl font-bold">R$ 3.000</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4">Meus gastos</h2>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Card key={expense.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${expense.color} rounded-lg flex items-center justify-center`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{expense.name}</p>
                        <p className="text-sm text-gray-400">{expense.date}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold">R$ {expense.amount}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-around py-4">
              <Link href="/" className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <Home className="w-6 h-6" />
              </Link>
              <Link href="/cards" className={`flex flex-col items-center gap-1 ${activeTab === 'cards' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <CreditCard className="w-6 h-6" />
              </Link>
              <Link href="/categories" className="flex flex-col items-center gap-1 text-gray-400">
                <Grid3x3 className="w-6 h-6" />
              </Link>
              <Link href="/reports" className="flex flex-col items-center gap-1 text-gray-400">
                <FileText className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
}
