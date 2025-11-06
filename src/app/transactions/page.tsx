'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';
import { TransactionService, CategoryService, CardService, Transaction, Category, Card } from '@/lib/services';
import { CreateTransactionModal } from '@/components/transactions/create-transaction-modal';
import { EditTransactionModal } from '@/components/transactions/edit-transaction-modal';
import { DeleteTransactionModal } from '@/components/transactions/delete-transaction-modal';
import { TransactionSummary } from '@/components/transactions/transaction-summary';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionList } from '@/components/transactions/transaction-list';
import { PageHeader } from '@/components/ui/page-header';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Estados para modais
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    categoryId: 'all',
    cardId: 'all',
    isPaid: 'all',
    startDate: '',
    endDate: ''
  });

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const [transactionsResponse, categoriesResponse, cardsResponse] = await Promise.all([
        TransactionService.getTransactionsByUserId(user.id),
        CategoryService.getAllCategoriesByUserId(user.id),
        CardService.getCardsByUserId(user.id)
      ]);

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
        setFilteredTransactions(transactionsResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      if (cardsResponse.success && cardsResponse.data) {
        setCards(cardsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const applyFilters = useCallback(() => {
    let filtered = transactions;

    if (filters.categoryId && filters.categoryId !== 'all') {
      filtered = filtered.filter(t => t.categoryId === parseInt(filters.categoryId));
    }

    if (filters.isPaid && filters.isPaid !== 'all') {
      filtered = filtered.filter(t => 
        filters.isPaid === 'paid' ? t.isPaid === 'Y' : t.isPaid !== 'Y'
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => 
        new Date(t.occurredAt) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => 
        new Date(t.occurredAt) <= new Date(filters.endDate!)
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters, applyFilters]);

  const handlePayTransaction = async (transaction: Transaction) => {
    try {
      const response = await TransactionService.payTransaction(transaction.id);
      
      if (response.success) {
        loadData();
      } else {
        setError(response.message || 'Erro ao pagar transação');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setShowEditModal(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const handleTransactionCreated = () => {
    loadData();
  };

  const handleTransactionUpdated = () => {
    loadData();
    setTransactionToEdit(null);
  };

  const handleTransactionDeleted = () => {
    loadData();
    setTransactionToDelete(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryId: 'all',
      cardId: 'all',
      isPaid: 'all',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageHeader title="Minhas transações" />

          <TransactionSummary transactions={filteredTransactions} />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Transações</h2>
            {user && (
              <CreateTransactionModal
                userId={user.id}
                onTransactionCreated={handleTransactionCreated}
                onError={handleError}
              />
            )}
          </div>

          <TransactionFilters
            filters={filters}
            categories={categories}
            cards={cards}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          <TransactionList
            transactions={filteredTransactions}
            categories={categories}
            cards={cards}
            userId={user?.id || 0}
            isLoading={isLoading}
            error={error}
            onTransactionEdit={handleEditTransaction}
            onTransactionDelete={handleDeleteTransaction}
            onTransactionPay={handlePayTransaction}
            onTransactionCreated={handleTransactionCreated}
            onError={handleError}
            onRetry={loadData}
          />
        </div>

        <EditTransactionModal
          transaction={transactionToEdit}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onTransactionUpdated={handleTransactionUpdated}
          onError={handleError}
        />

        <DeleteTransactionModal
          transaction={transactionToDelete}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onTransactionDeleted={handleTransactionDeleted}
          onError={handleError}
        />

      
      </div>
    </ProtectedRoute>
  );
}