'use client';

import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Card as CardType } from '@/lib/services';

interface TransactionFiltersProps {
  filters: {
    search: string;
    categoryId: string;
    cardId: string;
    isPaid: string;
    startDate: string;
    endDate: string;
  };
  categories: Category[];
  cards: CardType[];
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function TransactionFilters({ 
  filters, 
  categories, 
  cards, 
  onFiltersChange, 
  onClearFilters 
}: TransactionFiltersProps) {
  
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange((prev: TransactionFiltersProps['filters']) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por descrição..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 bg-gray-900 border-gray-600 text-white"
              />
            </div>
          </div>

          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleFilterChange('categoryId', value)}
          >
            <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              <SelectItem value="all" className="text-white">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()} className="text-white">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.cardId}
            onValueChange={(value) => handleFilterChange('cardId', value)}
          >
            <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Cartão" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              <SelectItem value="all" className="text-white">Todos</SelectItem>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id.toString()} className="text-white">
                  {card.alias} - **** {card.lastFourDigits}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.isPaid}
            onValueChange={(value) => handleFilterChange('isPaid', value)}
          >
            <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              <SelectItem value="all" className="text-white">Todos</SelectItem>
              <SelectItem value="S" className="text-white">Pago</SelectItem>
              <SelectItem value="N" className="text-white">Pendente</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={onClearFilters}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}