'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, CreditCard as CreditCardIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardService, Card as CardType } from '@/lib/services';
import { useAuth } from '@/providers/auth-provider';

interface DeleteCardModalProps {
  card: CardType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCardDeleted?: () => void;
}

export function DeleteCardModal({ card, open, onOpenChange, onCardDeleted }: DeleteCardModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getIssuerColor = (issuer?: string) => {
    if (!issuer) return 'bg-gray-500';
    
    const lowerIssuer = issuer.toLowerCase();
    if (lowerIssuer.includes('nubank')) return 'bg-purple-500';
    if (lowerIssuer.includes('itau') || lowerIssuer.includes('itaú')) return 'bg-orange-500';
    if (lowerIssuer.includes('banco do brasil') || lowerIssuer.includes('bb')) return 'bg-yellow-600';
    if (lowerIssuer.includes('santander')) return 'bg-red-500';
    if (lowerIssuer.includes('bradesco')) return 'bg-red-600';
    if (lowerIssuer.includes('caixa')) return 'bg-blue-600';
    return 'bg-gray-500';
  };

  const handleDelete = async () => {
    if (!user || !card) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await CardService.deleteCard(card.id);

      if (response.success) {
        onOpenChange(false);
        onCardDeleted?.();
      } else {
        setError(response.message || 'Erro ao excluir cartão');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            Excluir Cartão
          </DialogTitle>
        </DialogHeader>
        
        {/* Aviso */}
        <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium mb-1">
              Ação irreversível
            </p>
            <p className="text-red-300 text-sm">
              Esta ação não pode ser desfeita. O cartão será permanentemente removido do sistema.
            </p>
          </div>
        </div>

        {/* Preview do cartão que será excluído */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Cartão que será excluído:</p>
          <Card className="bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  getIssuerColor(card.issuer)
                }`}>
                  <CreditCardIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {card.alias}
                  </p>
                  <p className="text-sm text-gray-400">
                    **** {card.lastFourDigits}
                  </p>
                  <p className="text-xs text-gray-500">
                    {card.issuer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Excluindo...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Cartão
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}