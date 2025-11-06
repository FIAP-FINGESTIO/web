'use client';

import { useState, useEffect } from 'react';
import { FileText, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';
import { TransactionService, CategoryService, Transaction, Category } from '@/lib/services';
import { formatDateToBrazilian } from '@/lib/utils';

export default function HomePage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const [transactionsResponse, categoriesResponse] = await Promise.all([
        TransactionService.getTransactionsByUserId(user.id),
        CategoryService.getAllCategoriesByUserId(user.id)
      ]);

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular valores considerando apenas transações PAGAS
  const paidTransactions = transactions.filter(t => t.isPaid === 'Y');

  const totalExpenses = paidTransactions
    .filter(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return category?.type === 1; // Despesas
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = paidTransactions
    .filter(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return category?.type === 0; // Renda
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Investimentos pagos (para mostrar no card separado)
  const totalInvestments = paidTransactions
    .filter(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return category?.type === 2; // Investimentos
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Saldo atual: Renda - Despesas - Investimentos (investimentos diminuem o dinheiro disponível)
  const balance = totalIncome - totalExpenses - totalInvestments;

  // Pegar as últimas transações (gastos)
  const recentExpenses = transactions
    .filter(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return category?.type === 1; // Apenas despesas
    })
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getCategoryIcon = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    switch (category?.type) {
      case 0: return TrendingUp;
      case 1: return TrendingDown;
      case 2: return PiggyBank;
      default: return FileText;
    }
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    switch (category?.type) {
      case 0: return 'bg-green-500';
      case 1: return 'bg-red-500';
      case 2: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageHeader title="Meu saldo" />

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-8">
            <CardContent className="p-6">
              <p className="text-sm text-white mb-2">Saldo atual</p>
              <h1 className={`text-5xl font-bold mb-6 ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(balance)}
              </h1>
              <div className="flex gap-3">
                <div className="bg-green-500/20 px-4 py-2 rounded-lg">
                  <p className="text-xs text-green-400">Receitas</p>
                  <p className="font-semibold text-green-400">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-red-500/20 px-4 py-2 rounded-lg">
                  <p className="text-xs text-red-400">Despesas</p>
                  <p className="font-semibold text-red-400">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-4">Resumo financeiro</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-green-800 to-green-900 border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <p className="text-sm text-white">Renda Total</p>
                </div>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-800 to-red-900 border-red-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-white">Despesas Total</p>
                </div>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-800 to-blue-900 border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <PiggyBank className="w-5 h-5 text-blue-400" />
                  <p className="text-sm text-white">Investimentos</p>
                </div>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalInvestments)}</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4">Gastos recentes</h2>
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((transaction) => {
                const IconComponent = getCategoryIcon(transaction.categoryId);
                const category = categories.find(c => c.id === transaction.categoryId);
                
                return (
                  <Card key={transaction.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${getCategoryColor(transaction.categoryId)} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>{category?.name}</span>
                              <span>•</span>
                              <span>{formatDateToBrazilian(transaction.occurredAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-red-400">-{formatCurrency(transaction.amount)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Nenhuma despesa registrada</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
