'use client';

import { Receipt, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/lib/services';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export function TransactionSummary({ transactions }: TransactionSummaryProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const paidAmount = transactions.filter(t => t.isPaid === 'Y').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.isPaid !== 'Y').reduce((sum, t) => sum + t.amount, 0);

  const paidCount = transactions.filter(t => t.isPaid === 'Y').length;
  const pendingCount = transactions.filter(t => t.isPaid !== 'Y').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-white">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
          <p className="text-xs text-gray-400">{transactions.length} transações</p>
        </CardContent>
      </Card>

      <Card className="bg-green-600 border-green-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-5 h-5 text-white" />
            <p className="text-sm text-white">Pago</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(paidAmount)}</p>
          <p className="text-xs text-green-100">{paidCount} transações</p>
        </CardContent>
      </Card>

      <Card className="bg-orange-600 border-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <X className="w-5 h-5 text-white" />
            <p className="text-sm text-white">Pendente</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-orange-100">{pendingCount} transações</p>
        </CardContent>
      </Card>
    </div>
  );
}