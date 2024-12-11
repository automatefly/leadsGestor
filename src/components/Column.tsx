import React, { memo } from 'react';
import { LeadCard } from './LeadCard';
import { DroppableColumn } from './DroppableColumn';
import { Column as ColumnType, Lead } from '../types';

interface ColumnProps {
  column: ColumnType;
  leads: Lead[];
}

export const Column = memo(({ column, leads }: ColumnProps) => {
  const columnLeads = leads.filter(lead => lead.columnId === column.id);

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-80 flex flex-col min-h-[500px]">
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
        <span>{column.title}</span>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded">
          {columnLeads.length}
        </span>
      </h3>
      
      <DroppableColumn droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 transition-all ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {columnLeads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </DroppableColumn>
    </div>
  );
});

Column.displayName = 'Column';