export const getIssuerColor = (issuer?: string): string => {
  if (!issuer) return 'bg-gray-600';
  
  const lowerIssuer = issuer.toLowerCase();
  
  if (lowerIssuer.includes('nubank')) return 'bg-purple-600';
  
  if (lowerIssuer.includes('itau') || lowerIssuer.includes('itaú')) return 'bg-orange-500';
  
  if (lowerIssuer.includes('banco do brasil') || lowerIssuer.includes('bb')) return 'bg-yellow-600';
  
  if (lowerIssuer.includes('santander')) return 'bg-red-600';
  
  if (lowerIssuer.includes('bradesco')) return 'bg-red-700';
  
  if (lowerIssuer.includes('caixa')) return 'bg-blue-700';
  
  if (lowerIssuer.includes('inter')) return 'bg-orange-600';
  
  if (lowerIssuer.includes('c6')) return 'bg-gray-800';
  
  if (lowerIssuer.includes('pan')) return 'bg-green-600';
  
  if (lowerIssuer.includes('safra')) return 'bg-blue-800';
  
  if (lowerIssuer.includes('btg')) return 'bg-yellow-700';
  
  if (lowerIssuer.includes('sicoob')) return 'bg-green-700';
  
  if (lowerIssuer.includes('sicredi')) return 'bg-teal-600';
  
  if (lowerIssuer.includes('next')) return 'bg-pink-600';
  
  if (lowerIssuer.includes('xp')) return 'bg-orange-700';
  
  if (lowerIssuer.includes('picpay')) return 'bg-emerald-500';
  
  if (lowerIssuer.includes('paypal')) return 'bg-blue-600';
  
  if (lowerIssuer.includes('mercado pago')) return 'bg-cyan-600';
  
  if (lowerIssuer.includes('will')) return 'bg-indigo-600';
  if (lowerIssuer.includes('neon')) return 'bg-blue-500';
  if (lowerIssuer.includes('original')) return 'bg-green-800';
  
  if (lowerIssuer.includes('visa')) return 'bg-blue-600';
  if (lowerIssuer.includes('master')) return 'bg-red-600';
  if (lowerIssuer.includes('american express') || lowerIssuer.includes('amex')) return 'bg-blue-800';
  if (lowerIssuer.includes('elo')) return 'bg-yellow-500';
  
  return 'bg-gray-600';
};

export const getIssuerGradient = (issuer?: string): string => {
  if (!issuer) return 'bg-gradient-to-br from-gray-600 to-gray-800';
  
  const lowerIssuer = issuer.toLowerCase();
  
  if (lowerIssuer.includes('nubank')) {
    return 'bg-gradient-to-br from-purple-500 to-purple-800';
  }
  
  if (lowerIssuer.includes('itau') || lowerIssuer.includes('itaú')) {
    return 'bg-gradient-to-br from-orange-400 to-orange-700';
  }
  
  if (lowerIssuer.includes('banco do brasil') || lowerIssuer.includes('bb')) {
    return 'bg-gradient-to-br from-yellow-400 to-yellow-700';
  }
  
  if (lowerIssuer.includes('santander')) {
    return 'bg-gradient-to-br from-red-500 to-red-800';
  }
  
  if (lowerIssuer.includes('bradesco')) {
    return 'bg-gradient-to-br from-red-600 to-red-900';
  }
  
  if (lowerIssuer.includes('caixa')) {
    return 'bg-gradient-to-br from-blue-600 to-blue-900';
  }
  
  if (lowerIssuer.includes('inter')) {
    return 'bg-gradient-to-br from-orange-500 to-orange-800';
  }
  
  if (lowerIssuer.includes('c6')) {
    return 'bg-gradient-to-br from-gray-700 to-black';
  }
  
  if (lowerIssuer.includes('pan')) {
    return 'bg-gradient-to-br from-green-500 to-green-800';
  }
  
  if (lowerIssuer.includes('safra')) {
    return 'bg-gradient-to-br from-blue-700 to-blue-950';
  }
  
  if (lowerIssuer.includes('btg')) {
    return 'bg-gradient-to-br from-yellow-600 to-black';
  }
  
  if (lowerIssuer.includes('sicoob')) {
    return 'bg-gradient-to-br from-green-600 to-green-900';
  }
  
  if (lowerIssuer.includes('sicredi')) {
    return 'bg-gradient-to-br from-teal-500 to-teal-800';
  }
  
  if (lowerIssuer.includes('next')) {
    return 'bg-gradient-to-br from-pink-500 to-purple-800';
  }
  
  if (lowerIssuer.includes('xp')) {
    return 'bg-gradient-to-br from-orange-600 to-orange-900';
  }
  
  if (lowerIssuer.includes('picpay')) {
    return 'bg-gradient-to-br from-emerald-400 to-emerald-700';
  }
  
  if (lowerIssuer.includes('paypal')) {
    return 'bg-gradient-to-br from-blue-500 to-blue-800';
  }
  
  if (lowerIssuer.includes('mercado pago')) {
    return 'bg-gradient-to-br from-cyan-500 to-blue-700';
  }
  
  if (lowerIssuer.includes('will')) {
    return 'bg-gradient-to-br from-indigo-500 to-indigo-800';
  }
  
  if (lowerIssuer.includes('neon')) {
    return 'bg-gradient-to-br from-blue-400 to-blue-700';
  }
  
  if (lowerIssuer.includes('original')) {
    return 'bg-gradient-to-br from-green-700 to-green-950';
  }
  
  if (lowerIssuer.includes('visa')) {
    return 'bg-gradient-to-br from-blue-500 to-blue-800';
  }
  
  if (lowerIssuer.includes('master')) {
    return 'bg-gradient-to-br from-red-500 to-orange-600';
  }
  
  if (lowerIssuer.includes('american express') || lowerIssuer.includes('amex')) {
    return 'bg-gradient-to-br from-blue-800 to-gray-900';
  }
  
  if (lowerIssuer.includes('elo')) {
    return 'bg-gradient-to-br from-yellow-400 to-orange-500';
  }
  
  return 'bg-gradient-to-br from-gray-600 to-gray-800';
};

export const formatCardNumber = (lastFourDigits?: string): string => {
  return `**** **** **** ${lastFourDigits || '****'}`;
};

export const commonIssuers = [
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
  'Next',
  'XP Investimentos',
  'Sicoob',
  'Sicredi',
  'PicPay',
  'Neon',
  'Will Bank',
  'Original',
  'PayPal',
  'Mercado Pago',
  'Outro'
];

export const getTextColor = (issuer?: string): string => {
  if (!issuer) return 'text-white';
  
  const lowerIssuer = issuer.toLowerCase();
  
  if (lowerIssuer.includes('banco do brasil') || 
      lowerIssuer.includes('bb') ||
      lowerIssuer.includes('elo') ||
      lowerIssuer.includes('picpay')) {
    return 'text-black';
  }
  
  return 'text-white';
};

export const getActionButtonsColor = (issuer?: string): string => {
  if (!issuer) return 'text-white/80 hover:text-white hover:bg-white/20';
  
  const lowerIssuer = issuer.toLowerCase();
  
  if (lowerIssuer.includes('banco do brasil') || 
      lowerIssuer.includes('bb') ||
      lowerIssuer.includes('elo')) {
    return 'text-black/80 hover:text-black hover:bg-black/20';
  }
  
  if (lowerIssuer.includes('picpay')) {
    return 'text-white/80 hover:text-white hover:bg-white/20';
  }
  
  return 'text-white/80 hover:text-white hover:bg-white/20';
};