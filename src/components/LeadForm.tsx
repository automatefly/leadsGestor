import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

interface LeadFormProps {
  onClose: () => void;
}

interface FormData {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  systemValue: number;
}

export function LeadForm({ onClose }: LeadFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { addLead, columns } = useBoardStore();

  const onSubmit = async (data: FormData) => {
    // Get the first column by order
    const firstColumn = [...columns].sort((a, b) => a.order - b.order)[0];
    
    if (firstColumn) {
      await addLead({
        ...data,
        columnId: firstColumn.id
      });
      onClose();
    } else {
      console.error('No columns available');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Adicionar Novo Lead</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Cliente
            </label>
            <input
              {...register('clientName', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Nome completo do cliente"
            />
            {errors.clientName && (
              <span className="text-red-500 text-sm">Campo obrigatório</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <input
              {...register('companyName', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da empresa"
            />
            {errors.companyName && (
              <span className="text-red-500 text-sm">Campo obrigatório</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email inválido</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              {...register('phone', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="(00) 00000-0000"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">Campo obrigatório</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor do Sistema
            </label>
            <input
              type="number"
              step="0.01"
              {...register('systemValue', { required: true, min: 0 })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            {errors.systemValue && (
              <span className="text-red-500 text-sm">Valor inválido</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Adicionar Lead
          </button>
        </form>
      </div>
    </div>
  );
}