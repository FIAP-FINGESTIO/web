import { apiClient } from './api-client';
import { User, LoginResponse, ApiResponse } from './auth-types';

export interface Card {
  id: number;
  issuer?: string; 
  lastFourDigits?: string;      
  alias?: string;              
  shared?: string;            
  ownerId: number;             
  createdAt?: string;          
  updatedAt?: string; 
}

export interface CreateCardRequest {
  issuer?: string;
  lastFourDigits?: string;
  alias?: string;
  shared?: boolean;
  ownerId: number;
}

export interface UpdateCardRequest {
  issuer?: string;
  lastFourDigits?: string;
  alias?: string;
  shared?: boolean;
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


export { apiClient };