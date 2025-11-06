'use client';

import { useState, useEffect } from 'react';
import { Edit, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { TransactionService, CategoryService, CardService, UpdateTransactionRequest, Transaction, Category, Card } from '@/lib/services';
import { formatDateInputValue } from '@/lib/utils';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionUpdated: () => void;
  onError: (error: string) => void;
}

export function EditTransactionModal({ 
  transaction, 
  open, 
  onOpenChange, 
  onTransactionUpdated, 
  onError 
}: EditTransactionModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  const [formData, setFormData] = useState({
    description: '',
    categoryId: '',
    cardId: '',
    amount: '',
    currency: 'BRL',
    occurredAt: '',
    dueDate: '',
    isRecurring: false,
    isPaid: false,
  });

  useEffect(() => {
    if (transaction && open) {
      const convertDateToInputFormat = (dateString: string) => {
        if (!dateString) return '';
        
        if (dateString.includes('-') && dateString.length === 10) return dateString;
        
        if (dateString.includes('T')) {
          return dateString.split('T')[0];
        }
        
        if (dateString.includes('/')) {
          const [day, month, year] = dateString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        return dateString;
      };

      setFormData({
        description: transaction.description || '',
        categoryId: transaction.categoryId.toString(),
        cardId: transaction.cardId ? transaction.cardId.toString() : 'none',
        amount: transaction.amount.toString(),
        currency: transaction.currency || 'BRL',
        occurredAt: convertDateToInputFormat(transaction.occurredAt),
        dueDate: convertDateToInputFormat(transaction.dueDate),
        isRecurring: transaction.isRecurring === 'Y',
        isPaid: transaction.isPaid === 'Y',
      });

      loadCategories();
      loadCards();
    }
  }, [transaction, open]);

  const loadCategories = async () => {
    if (!transaction) return;
    try {
      const response = await CategoryService.getAllCategoriesByUserId(transaction.userId);
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadCards = async () => {
    if (!transaction) return;
    try {
      const response = await CardService.getCardsByUserId(transaction.userId);
      if (response.success && response.data) {
        setCards(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction) return;

    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    if (!formData.categoryId) {
      setError('Categoria é obrigatória');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }

    try {
      setIsEditing(true);
      setError(null);

      const formatDateForAPI = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };

      const updateData: UpdateTransactionRequest = {
        description: formData.description.trim(),
        categoryId: parseInt(formData.categoryId),
        cardId: formData.cardId && formData.cardId !== 'none' ? parseInt(formData.cardId) : undefined,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        occurredAt: formatDateForAPI(formData.occurredAt),
        dueDate: formatDateForAPI(formData.dueDate),
        isRecurring: formData.isRecurring,
        isPaid: formData.isPaid,
        userId: transaction.userId
      };

      const response = await TransactionService.updateTransaction(transaction.id, updateData);

      if (response.success) {
        onTransactionUpdated();
        onOpenChange(false);
        setError(null);
      } else {
        setError(response.message || 'Erro ao editar transação');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsEditing(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isEditing) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Transação
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Ex: Compra no supermercado, Salário, Investimento em ações..."
              className="bg-gray-900 border-gray-600 text-white"
              rows={3}
              required
              disabled={isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-categoryId">Categoria *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                disabled={isEditing}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()} className="text-white">
                      {category.name} ({category.type === 0 ? 'Renda' : category.type === 1 ? 'Despesa' : 'Investimento'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cardId">Cartão</Label>
              <Select
                value={formData.cardId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cardId: value }))}
                disabled={isEditing}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione um cartão (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="none" className="text-white">Nenhum cartão</SelectItem>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id.toString()} className="text-white">
                      {card.alias} - **** {card.lastFourDigits}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Valor *</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="bg-gray-900 border-gray-600 text-white"
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-currency">Moeda</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                disabled={isEditing}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="BRL" className="text-white">BRL (Real)</SelectItem>
                  <SelectItem value="USD" className="text-white">USD (Dólar)</SelectItem>
                  <SelectItem value="EUR" className="text-white">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-occurredAt">Data de Ocorrência *</Label>
              <Input
                id="edit-occurredAt"
                type="date"
                value={formData.occurredAt}
                onChange={(e) => setFormData(prev => ({ ...prev, occurredAt: e.target.value }))}
                className="bg-gray-900 border-gray-600 text-white"
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Data de Vencimento *</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="bg-gray-900 border-gray-600 text-white"
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
              <div>
                <Label htmlFor="edit-isRecurring" className="text-base font-medium">
                  Transação Recorrente
                </Label>
                <p className="text-sm text-gray-400">
                  Esta transação se repete mensalmente?
                </p>
              </div>
              <Switch
                id="edit-isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                disabled={isEditing}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
              <div>
                <Label htmlFor="edit-isPaid" className="text-base font-medium">
                  Transação Paga
                </Label>
                <p className="text-sm text-gray-400">
                  Esta transação já foi paga?
                </p>
              </div>
              <Switch
                id="edit-isPaid"
                checked={formData.isPaid}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => onOpenChange(false)}
              disabled={isEditing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              disabled={isEditing}
            >
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}