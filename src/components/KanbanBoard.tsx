import React, { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Column } from './kanban/Column';
import { LeadForm } from './LeadForm';
import { Header } from './Header';
import { useBoardStore } from '../store/boardStore';
import { Plus, Loader2 } from 'lucide-react';
import { AddColumnButton } from './kanban/AddColumnButton';
import { useAuthStore } from '../store/authStore';

export function KanbanBoard() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { columns, leads, loading, error, fetchBoard, moveLead } = useBoardStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.organizationId) {
      fetchBoard();
    }
  }, [user?.organizationId, fetchBoard]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      moveLead(draggableId, source.droppableId, destination.droppableId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Gestão de Leads</h2>
            <button
              onClick={() => setShowLeadForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar Lead
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {sortedColumns.map(column => (
                <Column
                  key={column.id}
                  column={column}
                  leads={leads.filter(lead => lead.columnId === column.id)}
                />
              ))}
              <AddColumnButton />
            </div>
          </DragDropContext>

          {showLeadForm && <LeadForm onClose={() => setShowLeadForm(false)} />}
        </div>
      </div>
    </div>
  );
}