'use client';

import { useState, useEffect } from 'react';
import { Plus, Receipt, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { TransactionService, CategoryService, CardService, CreateTransactionRequest, Category, Card } from '@/lib/services';
import { getCurrentDateForInput } from '@/lib/utils';

interface CreateTransactionModalProps {
  userId: number;
  onTransactionCreated: () => void;
  onError: (error: string) => void;
}

export function CreateTransactionModal({ userId, onTransactionCreated, onError }: CreateTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  const [formData, setFormData] = useState({
    description: '',
    categoryId: '',
    cardId: '',
    amount: '',
    currency: 'BRL',
    occurredAt: getCurrentDateForInput(),
    dueDate: getCurrentDateForInput(),
    isRecurring: false,
    isPaid: false,
  });

  // Carregar categorias e cartões quando abrir o modal
  useEffect(() => {
    if (open) {
      loadCategories();
      loadCards();
    }
  }, [open, userId]);

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getAllCategoriesByUserId(userId);
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadCards = async () => {
    try {
      const response = await CardService.getCardsByUserId(userId);
      if (response.success && response.data) {
        setCards(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setIsCreating(true);
      setError(null);

      const formatDateForAPI = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };

      const transactionData: CreateTransactionRequest = {
        description: formData.description.trim(),
        categoryId: parseInt(formData.categoryId),
        userId: userId,
        cardId: formData.cardId && formData.cardId !== 'none' ? parseInt(formData.cardId) : undefined,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        occurredAt: formatDateForAPI(formData.occurredAt),
        dueDate: formatDateForAPI(formData.dueDate),
        isRecurring: formData.isRecurring,
        isPaid: formData.isPaid,
      };

      const response = await TransactionService.createTransaction(transactionData);

      if (response.success) {
        onTransactionCreated();
        setOpen(false);
        resetForm();
        setError(null);
      } else {
        setError(response.message || 'Erro ao criar transação');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      categoryId: '',
      cardId: '',
      amount: '',
      currency: 'BRL',
      occurredAt: getCurrentDateForInput(),
      dueDate: getCurrentDateForInput(),
      isRecurring: false,
      isPaid: false,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isCreating) {
      setOpen(newOpen);
      if (!newOpen) {
        setError(null);
        resetForm();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Nova Transação
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Ex: Compra no supermercado, Salário, Investimento em ações..."
              className="bg-slate-900 border-slate-600 text-white"
              rows={3}
              required
              disabled={isCreating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                disabled={isCreating}
              >
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-600">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()} className="text-white">
                      {category.name} ({category.type === 0 ? 'Renda' : category.type === 1 ? 'Despesa' : 'Investimento'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardId">Cartão</Label>
              <Select
                value={formData.cardId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cardId: value }))}
                disabled={isCreating}
              >
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione um cartão (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-600">
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
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="bg-slate-900 border-slate-600 text-white"
                required
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                disabled={isCreating}
              >
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-600">
                  <SelectItem value="BRL" className="text-white">BRL (Real)</SelectItem>
                  <SelectItem value="USD" className="text-white">USD (Dólar)</SelectItem>
                  <SelectItem value="EUR" className="text-white">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occurredAt">Data de Ocorrência *</Label>
              <Input
                id="occurredAt"
                type="date"
                value={formData.occurredAt}
                onChange={(e) => setFormData(prev => ({ ...prev, occurredAt: e.target.value }))}
                className="bg-slate-900 border-slate-600 text-white"
                required
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="bg-slate-900 border-slate-600 text-white"
                required
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <Label htmlFor="isRecurring" className="text-base font-medium">
                  Transação Recorrente
                </Label>
                <p className="text-sm text-gray-400">
                  Esta transação se repete mensalmente?
                </p>
              </div>
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                disabled={isCreating}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div>
                <Label htmlFor="isPaid" className="text-base font-medium">
                  Transação Paga
                </Label>
                <p className="text-sm text-gray-400">
                  Esta transação já foi paga?
                </p>
              </div>
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              disabled={isCreating}
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Criando...
                </div>
              ) : (
                'Criar Transação'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}