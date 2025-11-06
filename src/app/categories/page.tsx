'use client';

import { useState, useEffect, useCallback } from 'react';
import { Grid3x3, Edit, Trash2, MoreVertical, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';
import { CategoryService, Category } from '@/lib/services';
import { CreateCategoryModal } from '@/components/categories/create-category-modal';
import { EditCategoryModal } from '@/components/categories/edit-category-modal';
import { DeleteCategoryModal } from '@/components/categories/delete-category-modal';
import { PageHeader } from '@/components/ui/page-header';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getTypeName = (type: 0 | 1 | 2) => {
    switch (type) {
      case 0: return 'Renda';
      case 1: return 'Despesa';
      case 2: return 'Investimento';
      default: return 'Desconhecido';
    }
  };

  const getTypeColor = (type: 0 | 1 | 2) => {
    switch (type) {
      case 0: return 'bg-green-500'; 
      case 1: return 'bg-red-500'; 
      case 2: return 'bg-blue-500'; 
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: 0 | 1 | 2) => {
    switch (type) {
      case 0: return TrendingUp; // Renda
      case 1: return TrendingDown; // Despesa
      case 2: return PiggyBank; // Investimento
      default: return Grid3x3;
    }
  };

  const loadCategories = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await CategoryService.getAllCategoriesByUserId(user.id);
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.message || 'Erro ao carregar categorias');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user, loadCategories]);

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleCategoryCreated = () => {
    loadCategories();
  };

  const handleCategoryUpdated = () => {
    loadCategories();
    setCategoryToEdit(null);
  };

  const handleCategoryDeleted = () => {
    loadCategories();
    setCategoryToDelete(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const incomeCategories = categories.filter(cat => cat.type === 0);      // Renda
  const expenseCategories = categories.filter(cat => cat.type === 1);     // Despesa
  const investmentCategories = categories.filter(cat => cat.type === 2);  // Investimento

  const userCategories = categories.filter(cat => cat.userId === user?.id);
  const systemCategories = categories.filter(cat => cat.userId === null);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <PageHeader title="Categorias" />

          {/* Resumo das categorias */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-6">
              <p className="text-sm text-white mb-2">Total de categorias</p>
              <h1 className="text-5xl font-bold text-white mb-6">{categories.length}</h1>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                  Renda {incomeCategories.length}
                </div>
                <div className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors">
                  <TrendingDown className="w-4 h-4" />
                  Despesas {expenseCategories.length}
                </div>
                <div className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors">
                  <PiggyBank className="w-4 h-4" />
                  Investimentos {investmentCategories.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Categorias</h2>
            {user && (
              <CreateCategoryModal
                userId={user.id}
                onCategoryCreated={handleCategoryCreated}
                onError={handleError}
              />
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Card className="bg-red-900/20 border-red-500 mb-8">
              <CardContent className="p-4">
                <p className="text-red-400">{error}</p>
                <Button 
                  onClick={loadCategories}
                  className="mt-2 bg-red-600 hover:bg-red-700"
                >
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Lista de categorias */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {/* Categorias do usuário */}
              {userCategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Minhas Categorias</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userCategories.map((category) => {
                      const IconComponent = getTypeIcon(category.type);
                      return (
                        <Card key={category.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(category.type)}`}>
                                  <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-white">{category.name}</p>
                                  <p className="text-xs text-gray-400">{category.description}</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-gray-800 border-gray-600">
                                  <DropdownMenuItem 
                                    onClick={() => handleEditCategory(category)}
                                    className="text-white hover:bg-gray-700 cursor-pointer"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteCategory(category)}
                                    className="text-red-400 hover:bg-red-900/20 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Deletar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${getTypeColor(category.type)}`}></div>
                              <p className="text-gray-400">{getTypeName(category.type)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categorias do sistema */}
              {systemCategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-400">Categorias Padrão</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemCategories.map((category) => {
                      const IconComponent = getTypeIcon(category.type);
                      return (
                        <Card key={category.id} className="bg-gray-800/50 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(category.type)}`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">{category.name}</p>
                                <p className="text-xs text-gray-400">{category.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${getTypeColor(category.type)}`}></div>
                              <p className="text-gray-400">{getTypeName(category.type)} • Sistema</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {categories.length === 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Grid3x3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-4">Nenhuma categoria encontrada</p>
                    {user && (
                      <CreateCategoryModal
                        userId={user.id}
                        onCategoryCreated={handleCategoryCreated}
                        onError={handleError}
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <EditCategoryModal
          category={categoryToEdit}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onCategoryUpdated={handleCategoryUpdated}
          onError={handleError}
        />

        <DeleteCategoryModal
          category={categoryToDelete}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onCategoryDeleted={handleCategoryDeleted}
          onError={handleError}
        />

        
      </div>
    </ProtectedRoute>
  );
}