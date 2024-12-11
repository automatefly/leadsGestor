import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X, Palette, Trash2 } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';

interface ColumnHeaderProps {
  columnId: string;
  title: string;
  itemCount: number;
  backgroundColor: string;
}

export function ColumnHeader({ columnId, title, itemCount, backgroundColor }: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const { updateColumn, deleteColumn } = useBoardStore();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (newTitle.trim() && newTitle !== title) {
      await updateColumn(columnId, { title: newTitle.trim() });
    } else {
      setNewTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  const handleColorChange = async (color: string) => {
    await updateColumn(columnId, { backgroundColor: color });
    setShowColorPicker(false);
  };

  const handleDelete = async () => {
    if (itemCount > 0) {
      alert('Não é possível excluir uma coluna que contém leads. Mova os leads para outra coluna primeiro.');
      return;
    }
    await deleteColumn(columnId);
    setShowDeleteConfirm(false);
  };

  const predefinedColors = [
    '#f3f4f6', // gray-100
    '#fee2e2', // red-100
    '#fef3c7', // yellow-100
    '#dcfce7', // green-100
    '#dbeafe', // blue-100
    '#f3e8ff', // purple-100
    '#ffe4e6', // pink-100
  ];

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
        />
        <button
          onClick={handleSave}
          className="p-1 hover:bg-green-100 rounded-full transition-colors"
          title="Salvar"
        >
          <Check size={16} className="text-green-600" />
        </button>
        <button
          onClick={() => {
            setNewTitle(title);
            setIsEditing(false);
          }}
          className="p-1 hover:bg-red-100 rounded-full transition-colors"
          title="Cancelar"
        >
          <X size={16} className="text-red-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="font-semibold text-gray-700 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              title="Editar nome da coluna"
            >
              <Pencil size={14} className="text-gray-500" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Mudar cor da coluna"
              >
                <Palette size={14} className="text-gray-500" />
              </button>
              {showColorPicker && (
                <div
                  ref={colorPickerRef}
                  className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg z-10 flex gap-1"
                >
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color === backgroundColor ? 'Cor atual' : 'Escolher cor'}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
              title="Excluir coluna"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        </div>
        <span className="text-sm bg-white/50 px-2 py-1 rounded">
          {itemCount}
        </span>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-6">
              {itemCount > 0
                ? 'Não é possível excluir uma coluna que contém leads. Mova os leads para outra coluna primeiro.'
                : 'Tem certeza que deseja excluir esta coluna?'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={itemCount > 0}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}