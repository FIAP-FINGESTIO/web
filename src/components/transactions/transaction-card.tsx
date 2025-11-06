'use client';

import { MoreVertical, Edit, Trash2, Check, TrendingUp, TrendingDown, PiggyBank, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Transaction, Category, Card as CardType } from '@/lib/services';
import { formatDateToBrazilian } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  categories: Category[];
  cards: CardType[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onPay: (transaction: Transaction) => void;
}

export function TransactionCard({ 
  transaction, 
  categories, 
  cards, 
  onEdit, 
  onDelete, 
  onPay 
}: TransactionCardProps) {
  
  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return formatDateToBrazilian(dateString);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const getCategoryType = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.type;
  };

  const getCardName = (cardId?: number) => {
    if (!cardId) return 'Dinheiro';
    const card = cards.find(c => c.id === cardId);
    return card ? `${card.alias} - **** ${card.lastFourDigits}` : 'Cartão não encontrado';
  };

  const getCategoryIcon = (type?: 0 | 1 | 2) => {
    switch (type) {
      case 0: return TrendingUp;
      case 1: return TrendingDown;
      case 2: return PiggyBank;
      default: return Receipt;
    }
  };

  const getCategoryColor = (type?: 0 | 1 | 2) => {
    switch (type) {
      case 0: return 'text-green-500';
      case 1: return 'text-red-500';
      case 2: return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const categoryType = getCategoryType(transaction.categoryId);
  const CategoryIconComponent = getCategoryIcon(categoryType);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        {/* Layout mobile-first com flex-col */}
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
          
          {/* Header com ícone e informações principais */}
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-700 flex items-center justify-center ${getCategoryColor(categoryType)} flex-shrink-0`}>
              <CategoryIconComponent className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm md:text-base truncate">{transaction.description}</h3>
              <div className="text-xs md:text-sm text-gray-400 mt-1 space-y-1 md:space-y-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{getCategoryName(transaction.categoryId)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="truncate">{getCardName(transaction.cardId)}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.occurredAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Valor e badges - em linha separada no mobile */}
          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
            <div className="text-left md:text-right">
              <p className="font-semibold text-lg md:text-xl text-white">{formatCurrency(transaction.amount, transaction.currency)}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge 
                  variant={transaction.isPaid === 'Y' ? 'default' : 'secondary'}
                  className={`text-xs ${transaction.isPaid === 'Y' ? 'bg-green-600' : 'bg-orange-600'}`}
                >
                  {transaction.isPaid === 'Y' ? 'Pago' : 'Pendente'}
                </Badge>
                {transaction.isRecurring === 'Y' && (
                  <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                    Recorrente
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white flex-shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-600">
                <DropdownMenuItem 
                  onClick={() => onEdit(transaction)}
                  className="text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                {transaction.isPaid !== 'Y' && (
                  <DropdownMenuItem 
                    onClick={() => onPay(transaction)}
                    className="text-green-400 hover:bg-green-900/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como Pago
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(transaction)}
                  className="text-red-400 hover:bg-red-900/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}