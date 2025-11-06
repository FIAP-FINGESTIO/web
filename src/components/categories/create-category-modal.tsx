'use client';

import { useState } from 'react';
import { Plus, Tag, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryService, CreateCategoryRequest } from '@/lib/services';

interface CreateCategoryModalProps {
  userId: number;
  onCategoryCreated: () => void;
  onError: (error: string) => void;
}

export function CreateCategoryModal({ userId, onCategoryCreated, onError }: CreateCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 1 as 0 | 1 | 2, // Default: despesa
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const categoryData: CreateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        userId: userId,
      };

      const response = await CategoryService.createCategory(categoryData);

      if (response.success) {
        onCategoryCreated();
        setOpen(false);
        setFormData({
          name: '',
          description: '',
          type: 1,
        });
        setError(null);
      } else {
        setError(response.message || 'Erro ao criar categoria');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isCreating) {
      setOpen(newOpen);
      if (!newOpen) {
        setError(null);
        setFormData({
          name: '',
          description: '',
          type: 1,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar categoria
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Nova Categoria
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Alimentação, Salário, Ações..."
              className="bg-gray-900 border-gray-600 text-white"
              required
              disabled={isCreating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição opcional..."
              className="bg-gray-900 border-gray-600 text-white"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: parseInt(value) as 0 | 1 | 2 }))}
              disabled={isCreating}
            >
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-600">
                <SelectItem value="0" className="text-white">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Renda
                  </div>
                </SelectItem>
                <SelectItem value="1" className="text-white">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    Despesa
                  </div>
                </SelectItem>
                <SelectItem value="2" className="text-white">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-blue-500" />
                    Investimento
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
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
                'Criar Categoria'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}