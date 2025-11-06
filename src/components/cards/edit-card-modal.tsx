'use client';

import { useState, useEffect } from 'react';
import { Edit, CreditCard as CreditCardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card as CardType, CardService, UpdateCardRequest } from '@/lib/services';
import { getActionButtonsColor } from './card-utils';

interface EditCardModalProps {
  card: CardType;
  onCardUpdated: () => void;
  onError: (error: string) => void;
}

const commonIssuers = [
  'Nubank',
  'Banco do Brasil',
  'Itaú',
  'Santander',
  'Bradesco',
  'Caixa Econômica Federal',
  'Inter',
  'C6 Bank',
  'Banco Pan',
  'Banco Safra',
  'BTG Pactual',
  'Sicoob',
  'Sicredi',
  'Outro'
];

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

export function EditCardModal({ card, onCardUpdated, onError }: EditCardModalProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    issuer: '',
    lastFourDigits: '',
    alias: '',
    shared: false,
  });

  useEffect(() => {
    if (card) {
      setFormData({
        issuer: card.issuer ?? '',
        lastFourDigits: card.lastFourDigits ?? '',
        alias: card.alias ?? '',
        shared: card.shared == 'Y' ? true : false,
      });
    }
  }, [card]);

  const validateForm = () => {
    if (!formData.issuer.trim()) {
      setError('Por favor, selecione ou digite o emissor do cartão');
      return false;
    }

    if (!formData.lastFourDigits.trim()) {
      setError('Por favor, digite os últimos 4 dígitos do cartão');
      return false;
    }

    if (formData.lastFourDigits.length !== 4) {
      setError('Os últimos dígitos devem ter exatamente 4 números');
      return false;
    }

    if (!/^\d{4}$/.test(formData.lastFourDigits)) {
      setError('Os últimos dígitos devem conter apenas números');
      return false;
    }

    if (!formData.alias.trim()) {
      setError('Por favor, digite um nome/apelido para o cartão');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsUpdating(true);
      setError(null);

      const updateData: UpdateCardRequest = {
        issuer: formData.issuer.trim(),
        lastFourDigits: formData.lastFourDigits.trim(),
        alias: formData.alias.trim(),
        shared: formData.shared,
      };

      const response = await CardService.updateCard(card.id, updateData);

      if (response.success) {
        onCardUpdated();
        setOpen(false);
        setError(null);
      } else {
        setError(response.message || 'Erro ao atualizar cartão');
      }
    } catch (error: any) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isUpdating) {
      setOpen(newOpen);
      if (!newOpen) {
        setError(null);
        if (card) {
          setFormData({
            issuer: card.issuer ?? '',
            lastFourDigits: card.lastFourDigits ?? '',
            alias: card.alias ?? '',
            shared: card.shared == 'Y' ? true : false,
          });
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={`h-8 w-8 p-0 backdrop-blur-sm ${getActionButtonsColor(card.issuer)}`}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5" />
            Editar Cartão
          </DialogTitle>
        </DialogHeader>
        
        <Card className="bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                formData.issuer ? getIssuerColor(formData.issuer) : 'bg-gray-500'
              }`}>
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {formData.alias || 'Nome do cartão'}
                </p>
                <p className="text-sm text-gray-400">
                  **** {formData.lastFourDigits || '****'}
                </p>
                <p className="text-xs text-gray-500">
                  {formData.issuer || 'Emissor'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-issuer">Emissor do Cartão *</Label>
            <Select
              value={formData.issuer}
              onValueChange={(value) => setFormData(prev => ({ ...prev, issuer: value }))}
              disabled={isUpdating}
            >
              <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                <SelectValue placeholder="Selecione o emissor" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-600">
                {commonIssuers.map((issuer) => (
                  <SelectItem key={issuer} value={issuer} className="text-white hover:bg-gray-700">
                    {issuer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.issuer === 'Outro' && (
              <Input
                placeholder="Digite o nome do emissor"
                value={formData.issuer === 'Outro' ? '' : formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                disabled={isUpdating}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-lastFourDigits">Últimos 4 Dígitos *</Label>
            <Input
              id="edit-lastFourDigits"
              type="text"
              maxLength={4}
              placeholder="1234"
              value={formData.lastFourDigits}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, lastFourDigits: value }));
              }}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
              disabled={isUpdating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-alias">Nome/Apelido do Cartão *</Label>
            <Input
              id="edit-alias"
              type="text"
              placeholder="Ex: Cartão do Trabalho, Nubank Principal..."
              value={formData.alias}
              onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <Label htmlFor="edit-shared" className="text-base font-medium">
                Cartão Compartilhado
              </Label>
              <p className="text-sm text-gray-400">
                Este cartão é usado por outras pessoas da família/empresa?
              </p>
            </div>
            <Switch
              id="edit-shared"
              checked={formData.shared}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shared: checked }))}
              disabled={isUpdating}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={() => setOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}