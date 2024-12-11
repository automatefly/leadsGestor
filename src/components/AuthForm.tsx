import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Mail, Lock, UserPlus, LogIn, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { initializeOrganization } from '../lib/initializeDb';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<AuthFormData>();
  const password = watch('password');

  const onSubmit = async (data: AuthFormData) => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        if (data.password !== data.confirmPassword) {
          setError('As senhas não coincidem');
          setLoading(false);
          return;
        }

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        
        if (data.name) {
          // Update profile with name
          await updateProfile(userCredential.user, {
            displayName: data.name
          });

          // Initialize organization and user data
          await initializeOrganization(userCredential.user.uid, data.name);
        }

        // User will be automatically logged in by Firebase
      }
      reset();
    } catch (err: any) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Este email já está em uso'
          : err.code === 'auth/invalid-email'
          ? 'Email inválido'
          : err.code === 'auth/weak-password'
          ? 'A senha deve ter pelo menos 6 caracteres'
          : 'Erro ao autenticar. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  {...register('name', { required: !isLogin })}
                  className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-sm">Nome é obrigatório</span>
              )}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                {...register('email', { 
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                })}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">Email inválido</span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                {...register('password', { 
                  required: true,
                  minLength: 6
                })}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="******"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                A senha deve ter pelo menos 6 caracteres
              </span>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: !isLogin,
                    validate: value => value === password || 'As senhas não coincidem'
                  })}
                  className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="******"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Aguarde...</span>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            reset();
            setError('');
          }}
          className="mt-4 text-blue-500 hover:text-blue-600 text-sm w-full text-center"
        >
          {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
        </button>
      </div>
    </div>
  );
}