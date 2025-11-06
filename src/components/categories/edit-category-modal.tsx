'use client';

import { useState, useEffect } from 'react';
import { Edit, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryService, Category, UpdateCategoryRequest } from '@/lib/services';

interface EditCategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryUpdated: () => void;
  onError: (error: string) => void;
}

export function EditCategoryModal({ 
  category, 
  open, 
  onOpenChange, 
  onCategoryUpdated, 
  onError 
}: EditCategoryModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 1 as 0 | 1 | 2,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        type: category.type,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) return;

    if (!formData.name.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    try {
      setIsEditing(true);
      setError(null);

      const updateData: UpdateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
      };

      const response = await CategoryService.updateCategory(category.id, updateData);

      if (response.success) {
        onCategoryUpdated();
        onOpenChange(false);
        setError(null);
      } else {
        setError(response.message || 'Erro ao editar categoria');
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
      <DialogContent className="bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Categoria
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome da Categoria *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Alimentação, Salário, Ações..."
              className="bg-gray-900 border-gray-600 text-white"
              required
              disabled={isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição opcional..."
              className="bg-gray-900 border-gray-600 text-white"
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">Tipo *</Label>
            <Select
              value={formData.type.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: parseInt(value) as 0 | 1 | 2 }))}
              disabled={isEditing}
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
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}