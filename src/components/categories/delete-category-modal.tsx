'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CategoryService, Category } from '@/lib/services';

interface DeleteCategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryDeleted: () => void;
  onError: (error: string) => void;
}

const getTypeName = (type: 0 | 1 | 2) => {
  switch (type) {
    case 0: return 'Renda';
    case 1: return 'Despesa';
    case 2: return 'Investimento';
    default: return 'Desconhecido';
  }
};

export function DeleteCategoryModal({ 
  category, 
  open, 
  onOpenChange, 
  onCategoryDeleted, 
  onError 
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    try {
      setIsDeleting(true);
      
      const response = await CategoryService.deleteCategory(category.id);
      
      if (response.success) {
        onCategoryDeleted();
        onOpenChange(false);
      } else {
        onError(response.message || 'Erro ao deletar categoria');
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

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-600 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            Deletar Categoria
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Tem certeza que deseja deletar a categoria <strong>{category?.name}</strong>?
            <br />
            <span className="text-sm text-gray-400">
              Tipo: {category && getTypeName(category.type)}
            </span>
            <br /><br />
            Esta ação não pode ser desfeita e pode afetar transações existentes.
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