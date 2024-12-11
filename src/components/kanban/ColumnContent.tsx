import React from 'react';
import { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { LeadCard } from './LeadCard';
import { Lead } from '../../types';

interface ColumnContentProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  leads: Lead[];
}

export function ColumnContent({ provided, snapshot, leads }: ColumnContentProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`flex-1 transition-all ${
        snapshot.isDraggingOver ? 'bg-blue-50' : ''
      }`}
    >
      {leads.map((lead, index) => (
        <LeadCard key={lead.id} lead={lead} index={index} />
      ))}
      {provided.placeholder}
    </div>
  );
}