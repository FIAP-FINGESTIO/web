'use client';

import { Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionCard } from './transaction-card';
import { CreateTransactionModal } from './create-transaction-modal';
import { Transaction, Category, Card as CardType } from '@/lib/services';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  cards: CardType[];
  userId: number;
  isLoading: boolean;
  error: string | null;
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionDelete: (transaction: Transaction) => void;
  onTransactionPay: (transaction: Transaction) => void;
  onTransactionCreated: () => void;
  onError: (error: string) => void;
  onRetry: () => void;
}

export function TransactionList({
  transactions,
  categories,
  cards,
  userId,
  isLoading,
  error,
  onTransactionEdit,
  onTransactionDelete,
  onTransactionPay,
  onTransactionCreated,
  onError,
  onRetry
}: TransactionListProps) {

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-500 mb-8">
        <CardContent className="p-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={onRetry}
            className="mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Tentar novamente
          </button>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400 mb-4">Nenhuma transação encontrada</p>
          <CreateTransactionModal
            userId={userId}
            onTransactionCreated={onTransactionCreated}
            onError={onError}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          categories={categories}
          cards={cards}
          onEdit={onTransactionEdit}
          onDelete={onTransactionDelete}
          onPay={onTransactionPay}
        />
      ))}
    </div>
  );
}