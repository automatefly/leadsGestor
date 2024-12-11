import React, { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { Note } from '../../types';
import { Send, Trash2 } from 'lucide-react';
import { formatRelativeDate } from '../../utils/format';

interface LeadNotesProps {
  leadId: string;
  notes: Note[];
}

export function LeadNotes({ leadId, notes }: LeadNotesProps) {
  const [newNote, setNewNote] = useState('');
  const { addNote, deleteNote } = useBoardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newNote.trim()) {
      await addNote(leadId, newNote.trim());
      setNewNote('');
    }
  };

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteNote(leadId, noteId);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3 max-h-40 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 p-2 rounded text-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="whitespace-pre-wrap break-words">{note.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {note.createdBy.name} • {formatRelativeDate(note.createdAt)}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, note.id)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                title="Excluir nota"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Adicionar nota..."
          className="flex-1 text-sm p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onClick={e => e.stopPropagation()}
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Enviar nota"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}