'use client';

import { useState, useEffect } from 'react';
import { Home, CreditCard as CreditCardIcon, Grid3x3, FileText, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';
import { CardService, Card as CardType } from '@/lib/services';

export default function CardsPage() {
  const [activeTab, setActiveTab] = useState('cards');
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);

  const loadCards = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      
      const response = await CardService.getCardsByUserId(user.id);
      
      if (response.success && response.data) {
        setCards(response.data);
      } else {
        setError(response.message || 'Erro ao carregar cartões');
      }
    } catch (error: any) {
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (lastFourDigits?: string) => {
    return lastFourDigits ? `**** ${lastFourDigits}` : '**** ****';
  };

  const getIssuerColor = (issuer?: string) => {
    if (!issuer) return 'bg-gray-500';
    
    const lowerIssuer = issuer.toLowerCase();
    if (lowerIssuer.includes('nubank')) return 'bg-purple-500';
    if (lowerIssuer.includes('itau') || lowerIssuer.includes('itaú')) return 'bg-orange-500';
    if (lowerIssuer.includes('banco do brasil') || lowerIssuer.includes('bb')) return 'bg-yellow-600';
    if (lowerIssuer.includes('santander')) return 'bg-red-500';
    if (lowerIssuer.includes('bradesco')) return 'bg-red-600';
    if (lowerIssuer.includes('caixa')) return 'bg-blue-600';
    return 'bg-slate-500';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm text-white">Olá, {user?.name}</p>
                <p className="text-base text-white">Meus cartões</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              onClick={logout}
            >
              Sair
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 mb-8">
            <CardContent className="p-6">
              <p className="text-sm text-white mb-2">Total de cartões</p>
              <h1 className="text-5xl font-bold mb-6">{cards.length}</h1>
              <div className="flex gap-3">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium">
                  Pessoais {cards.filter(card => card.shared === 'N').length}
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-medium">
                  Compartilhados {cards.filter(card => card.shared === 'S').length}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Meus cartões</h2>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar cartão
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {error && (
            <Card className="bg-red-900/20 border-red-500 mb-8">
              <CardContent className="p-4">
                <p className="text-red-400">{error}</p>
                <Button 
                  onClick={loadCards}
                  className="mt-2 bg-red-600 hover:bg-red-700"
                >
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && (
            <div className="space-y-4 mb-8">
              {cards.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <CreditCardIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-4">Você ainda não possui cartões cadastrados</p>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar primeiro cartão
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                cards.map((card) => (
                  <Card key={card.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getIssuerColor(card.issuer)}`}>
                            <CreditCardIcon className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold">{card.alias || 'Cartão sem nome'}</p>
                            <p className="text-sm text-gray-400">{formatCardNumber(card.lastFourDigits)}</p>
                            <p className="text-xs text-gray-500">{card.issuer}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {card.shared === 'S' && (
                            <div className="flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded text-xs text-green-400">
                              <Users className="w-3 h-3" />
                              Compartilhado
                            </div>
                          )}
                          <p className="text-xs text-gray-400">
                            ID: {card.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${card.shared === 'S' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <p className="text-gray-400">
                          {card.shared === 'S' ? 'Cartão compartilhado' : 'Cartão pessoal'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(cards.map(card => card.issuer).filter(Boolean))).map((issuer) => (
                <Card key={issuer} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded ${getIssuerColor(issuer)}`}></div>
                      <p className="font-medium">{issuer}</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {cards.filter(card => card.issuer === issuer).length}
                    </p>
                    <p className="text-xs text-gray-400">cartões</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-around py-4">
              <Link href="/" className="flex flex-col items-center gap-1 text-gray-400">
                <Home className="w-6 h-6" />
              </Link>
              <Link href="/cards" className={`flex flex-col items-center gap-1 ${activeTab === 'cards' ? 'text-yellow-500' : 'text-gray-400'}`}>
                <CreditCardIcon className="w-6 h-6" />
              </Link>
              <Link href="/categories" className="flex flex-col items-center gap-1 text-gray-400">
                <Grid3x3 className="w-6 h-6" />
              </Link>
              <Link href="/reports" className="flex flex-col items-center gap-1 text-gray-400">
                <FileText className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
}
