'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';

export default function NotFound() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="mb-8 flex justify-center">
                    <Image
                        src="/logo.svg"
                        alt="Fingestio Logo"
                        width={120}
                        height={60}
                        className="object-contain"
                    />
                </div>

                <Card className="bg-gray-800 border-gray-700 mb-8">
                    <CardContent className="p-8">
                        <div className="mb-6">
                            <h1 className="text-6xl font-bold text-yellow-500 mb-2">404</h1>
                            <h2 className="text-2xl font-semibold text-white mb-4">Página não encontrada</h2>
                            <p className="text-gray-400 text-lg">
                                A página que você está procurando não existe ou foi movida.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push('/')}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Voltar ao início
                            </Button>

                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className="w-full border-gray-600 text-gray-700 hover:bg-gray-700"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Página anterior
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {user && (
                    <div className="text-sm text-gray-400">
                        <p>Precisa de ajuda? Acesse nossos links principais:</p>
                        <div className="flex justify-center gap-4 mt-3">
                            <button
                                onClick={() => router.push('/transactions')}
                                className="text-yellow-500 hover:text-yellow-400 transition-colors"
                            >
                                Transações
                            </button>
                            <span className="text-gray-600">•</span>
                            <button
                                onClick={() => router.push('/categories')}
                                className="text-yellow-500 hover:text-yellow-400 transition-colors"
                            >
                                Categorias
                            </button>
                            <span className="text-gray-600">•</span>
                            <button
                                onClick={() => router.push('/cards')}
                                className="text-yellow-500 hover:text-yellow-400 transition-colors"
                            >
                                Cartões
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}