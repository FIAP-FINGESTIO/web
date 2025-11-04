'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        setError(null)

        if(!email || !password){
            setError("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const res = await fetch('/api/login',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email,password})
            })
            
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message)
            }
            localStorage.setItem('admin_token', data.token);
            router.push('/home');
        } catch (err){
            setError((err as Error).message ?? "Erro ao fazer o login. Tente novamente.");
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center dark:bg-black p-6">
        <div className="w-full max-w-sm">
        <div className="mb-8 flex h-24 w-full items-center justify-center rounded-lg bg-gray-800 text-3xl font-bold text-white">
            (Logo)
        </div>

        <h1 className="mb-8 text-center text-2xl font-bold text-white tracking-wide">
            Faça login com sua conta
        </h1>
        <form onSubmit={handleSubmit}>{error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex flex-col space-y-6">

                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" placeholder="Email" required className="w-full rounded-lg border border-gray-700 dark:bg-black px-4 py-3 text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200"/>
                </div>
            <div>

                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">Senha</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Senha" required className="w-full rounded-lg border border-gray-700 dark:bg-black px-4 py-3 text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200"/>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="relembrar" name="relembrar" type="checkbox" className="h-4 w-4 rounded-full"/>
                        <label htmlFor="relembrar" className="ml-2 block text-sm text-gray-400">Relembrar</label>
                </div>

                <div>
                    <a href="#" className="text-sm font-bold text-yellow-500 hover:text-yellow-400">Esqueceu a senha?</a>
                </div>

            </div>
            <button type="submit" className="w-full rounded-lg bg-yellow-500 px-5 py-3 text-base font-bold text-gray-900 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900">Entrar</button>
            </div>

        </form>
            <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-700"></div>
            </div>

        <div className="flex flex-col space-y-4">
            <button type="button" className="flex w-full items-center justify-center rounded-lg border border-gray-700 dark:bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"><FcGoogle className='mr-3'/> Entrar com Google</button>
            <button type="button" className="flex w-full items-center justify-center rounded-lg border border-gray-700 dark:bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"><FaFacebook className='mr-3'/>Entrar com Facebook</button>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">Não possui conta?{' '}
            <a href="#" className="font-semibold text-yellow-500 hover:text-yellow-400">Criar nova conta</a>
        </p>
            </div>
        </div>
    );
}