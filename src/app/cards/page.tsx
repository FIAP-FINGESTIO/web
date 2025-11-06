'use client';

import { useState, useEffect } from 'react';
import { Users, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';
import { CardService, Card as CardType } from '@/lib/services';
import { getIssuerGradient, getTextColor, formatCardNumber, getActionButtonsColor } from '@/components/cards/card-utils';

import { CreateCardModal } from '@/components/cards/create-card-modal';
import { EditCardModal } from '@/components/cards/edit-card-modal';
import { DeleteCardModal } from '@/components/cards/delete-card-modal';
import { PageHeader } from '@/components/ui/page-header';

export default function CardsPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [cardToDelete, setCardToDelete] = useState<CardType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      setError('Erro de conexão com o servidor');
      console.error('Erro ao carregar cartões:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = (card: CardType) => {
    setCardToDelete(card);
    setShowDeleteModal(true);
  };

  const handleCardDeleted = () => {
    loadCards();
    setCardToDelete(null);
  };

  const handleCardCreated = () => {
    loadCards();
  };

  const handleCardUpdated = () => {
    loadCards();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white pb-20">

        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageHeader title="Meus cartões" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Meus cartões</h2>
            {user && (
              <CreateCardModal
                onCardCreated={handleCardCreated}
                userId={user.id.toString()}
                onError={handleError}
              />
            )}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <p className="ml-3 text-gray-400">Carregando cartões...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
              <Button
                onClick={loadCards}
                variant="outline"
                size="sm"
                className="mt-2 border-red-500 text-red-400 hover:bg-red-900/20"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoading && !error && cards.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`group relative p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 ${getIssuerGradient(card.issuer)} ${getTextColor(card.issuer)}`}
                    style={{ aspectRatio: '1.6' }}
                  >
                    <div className="absolute top-3 right-3 flex gap-1 opacity-70 hover:opacity-100 transition-opacity duration-200">
                      <EditCardModal
                        card={card}
                        onCardUpdated={handleCardUpdated}
                        onError={handleError}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-8 w-8 p-0 backdrop-blur-sm ${getActionButtonsColor(card.issuer)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="h-full">
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs opacity-80 text-white">{card.issuer}</p>
                            <p className="font-bold text-lg mt-1 text-white">{card.alias}</p>
                          </div>

                        </div>

                        <div className="space-y-2">
                          <p className="text-lg font-mono tracking-wider text-white">
                            {formatCardNumber(card.lastFourDigits)}
                          </p>
                          <div className="flex justify-between items-end">
                            {card.shared !== 'N' ? (
                              <div className="bg-white/20 p-1 rounded">
                                <Users className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-6 h-6" />
                            )}
                            <CreditCard className="w-8 h-8 opacity-60" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !error && cards.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400 text-lg font-semibold">Nenhum cartão cadastrado</p>
              <p className="text-gray-500 mb-6">Adicione seu primeiro cartão para começar</p>
              <CreateCardModal
                onCardCreated={handleCardCreated}
                userId={user.id.toString()}
                onError={handleError}
              />
            </div>
          )}
        </div>

        <DeleteCardModal
          card={cardToDelete}
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onCardDeleted={handleCardDeleted}
        />

      </div>
    </ProtectedRoute>
  );
}
