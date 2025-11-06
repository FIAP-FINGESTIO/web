import { apiClient } from './api-client';
import { User, LoginResponse, ApiResponse } from './auth-types';

export interface Card {
  id: number;
  issuer?: string; 
  lastFourDigits?: string;      
  alias?: string;              
  shared?: string;            
  userId: number;             
  createdAt?: string;          
  updatedAt?: string; 
}

export interface CreateCardRequest {
  issuer?: string;
  lastFourDigits?: string;
  alias?: string;
  shared?: boolean;
  userId: number;
}

export interface UpdateCardRequest {
  issuer?: string;
  lastFourDigits?: string;
  alias?: string;
  shared?: boolean;
}

export interface Category {
  id: number;
  userId: number | null;        
  name: string;
  description?: string;
  type: 0 | 1 | 2;             // 0 = renda, 1 = despesa, 2 = investimento
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  type: 0 | 1 | 2;             // 0 = renda, 1 = despesa, 2 = investimento
  userId?: number; 
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  type?: 0 | 1 | 2;
}

// Transaction interfaces
export interface Transaction {
  id: number;
  description?: string;
  categoryId: number;
  userId: number;
  cardId?: number;
  amount: number;
  currency?: string;
  occurredAt: string;
  dueDate: string;
  isRecurring?: 'Y' | 'N';
  isPaid?: 'Y' | 'N';
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  card?: Card;
}

export interface CreateTransactionRequest {
  description?: string;
  categoryId: number;
  userId: number;
  cardId?: number;
  amount: number;
  currency?: string;
  occurredAt: string;
  dueDate: string;
  isRecurring?: boolean;
  isPaid?: boolean;
}

export interface UpdateTransactionRequest {
  description?: string;
  categoryId?: number;
  cardId?: number;
  amount?: number;
  currency?: string;
  occurredAt?: string;
  dueDate?: string;
  isRecurring?: boolean;
  isPaid?: boolean;
  userId?: number;
}

export interface SearchTransactionParams {
  userId?: number;
  categoryId?: number;
  cardId?: number;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  isPaid?: string;
  isRecurring?: string;
  currency?: string;
  type?: number;
}

export class AuthService {
  // Fazer login (sem token)
  static async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return await apiClient.post<LoginResponse>('/login', { email, password });
  }

  // Registrar novo usuário (sem token)
  static async register(name: string, email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return await apiClient.post<LoginResponse>('/register', { name, email, password });
  }

  // Redefinir senha (sem token)
  static async resetPassword(email: string): Promise<ApiResponse> {
    return await apiClient.post('/reset-password', { email });
  }
}

// Serviços para cartões
export class CardService {
  static async getCardsByUserId(userId: number): Promise<ApiResponse<Card[]>> {
    return await apiClient.get<Card[]>(`/card/all/${userId}`);
  }

  static async createCard(cardData: CreateCardRequest): Promise<ApiResponse<Card>> {
    return await apiClient.post<Card>('/card', cardData);
  }

  static async updateCard(id: number, cardData: UpdateCardRequest): Promise<ApiResponse<Card>> {
    return await apiClient.put<Card>(`/card/${id}`, cardData);
  }

  static async deleteCard(id: number): Promise<ApiResponse<string>> {
    return await apiClient.delete<string>(`/card/${id}`);
  }
}

// Serviços para categorias
export class CategoryService {
  // Buscar todas as categorias de um usuário (incluindo padrões do sistema)
  static async getAllCategoriesByUserId(userId: number): Promise<ApiResponse<Category[]>> {
    return await apiClient.get<Category[]>(`/category/all/${userId}`);
  }

  // Buscar categorias filtradas por tipo para um usuário
  static async getCategoriesByTypeAndUserId(type: 0 | 1 | 2, userId: number): Promise<ApiResponse<Category[]>> {
    return await apiClient.get<Category[]>(`/category/${type}/${userId}`);
  }

  // Criar uma nova categoria
  static async createCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return await apiClient.post<Category>('/category', categoryData);
  }

  // Atualizar uma categoria
  static async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return await apiClient.put<Category>(`/category/${id}`, categoryData);
  }

  // Deletar uma categoria
  static async deleteCategory(id: number): Promise<ApiResponse<string>> {
    return await apiClient.delete<string>(`/category/${id}`);
  }
}

// Transaction Service
export class TransactionService {
  // Obter transações por ID do usuário
  static async getTransactionsByUserId(userId: number): Promise<ApiResponse<Transaction[]>> {
      return await apiClient.get<Transaction[]>(`/transaction/${userId}`);
  }

  // Buscar transações com filtros
  static async searchTransactions(params: SearchTransactionParams): Promise<ApiResponse<Transaction[]>> {
      return await apiClient.get<Transaction[]>('/transaction/search', { params });
     
  }

  // Criar nova transação
  static async createTransaction(transactionData: CreateTransactionRequest): Promise<ApiResponse<Transaction>> {
      return await apiClient.post<Transaction>('/transaction', transactionData);
  }

  // Atualizar transação
  static async updateTransaction(id: number, transactionData: UpdateTransactionRequest): Promise<ApiResponse<Transaction>> {
      return await apiClient.put<Transaction>(`/transaction/${id}`, transactionData);
  }

  // Marcar transação como paga
  static async payTransaction(id: number): Promise<ApiResponse<Transaction>> {
      return await apiClient.patch<Transaction>(`/transaction/${id}/pay`);
  }

  // Deletar transação
  static async deleteTransaction(id: number): Promise<ApiResponse<void>> {
      return await apiClient.delete<void>(`/transaction/${id}`);
  }
}

export { apiClient };