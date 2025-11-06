'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { TransactionService, Transaction } from '@/lib/services';
import { formatDateToBrazilian } from '@/lib/utils';

interface DeleteTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionDeleted: () => void;
  onError: (error: string) => void;
}

export function DeleteTransactionModal({ 
  transaction, 
  open, 
  onOpenChange, 
  onTransactionDeleted, 
  onError 
}: DeleteTransactionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      setIsDeleting(true);
      
      const response = await TransactionService.deleteTransaction(transaction.id);
      
      if (response.success) {
        onTransactionDeleted();
        onOpenChange(false);
      } else {
        onError(response.message || 'Erro ao deletar transação');
      }
    } catch (error: any) {
      onError('Erro de conexão com o servidor');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(newOpen);
    }
  };

  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return formatDateToBrazilian(dateString);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-600 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            Deletar Transação
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 space-y-2">
            <div>
              Tem certeza que deseja deletar esta transação?
            </div>
            {transaction && (
              <div className="bg-gray-900/50 p-3 rounded-lg mt-3">
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-400">
                  Valor: {formatCurrency(transaction.amount, transaction.currency)}
                </p>
                <p className="text-sm text-gray-400">
                  Data: {formatDate(transaction.occurredAt)}
                </p>
                {transaction.category && (
                  <p className="text-sm text-gray-400">
                    Categoria: {transaction.category.name}
                  </p>
                )}
              </div>
            )}
            <p className="text-sm text-red-400 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            disabled={isDeleting}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deletando...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}