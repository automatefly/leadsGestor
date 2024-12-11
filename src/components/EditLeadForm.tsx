import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import { Lead } from '../types';

interface EditLeadFormProps {
  lead: Lead;
  onClose: () => void;
}

interface FormData {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  systemValue: number;
}

export function EditLeadForm({ lead, onClose }: EditLeadFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      clientName: lead.clientName,
      companyName: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      systemValue: lead.systemValue,
    }
  });
  
  const updateLead = useBoardStore(state => state.updateLead);

  const onSubmit = async (data: FormData) => {
    await updateLead(lead.id, data);
    onClose();
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

        <h2 className="text-xl font-semibold mb-6">Editar Lead</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Cliente
            </label>
            <input
              {...register('clientName', { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            />
            {errors.systemValue && (
              <span className="text-red-500 text-sm">Valor inválido</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}