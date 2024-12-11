import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

export function AddColumnButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const addColumn = useBoardStore(state => state.addColumn);

  const handleSave = async () => {
    if (title.trim()) {
      await addColumn(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg w-80 h-min">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome da coluna"
            className="flex-1 p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
            title="Salvar"
          >
            <Check size={20} className="text-green-600" />
          </button>
          <button
            onClick={() => {
              setTitle('');
              setIsAdding(false);
            }}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
            title="Cancelar"
          >
            <X size={20} className="text-red-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="bg-white/50 hover:bg-white/80 border-2 border-dashed border-gray-300 p-4 rounded-lg w-80 h-min flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
    >
      <Plus size={20} />
      <span>Adicionar Coluna</span>
    </button>
  );
}