import React from 'react';
import { Column as ColumnType, Lead } from '../../types';
import { DroppableWrapper } from './DroppableWrapper';
import { ColumnHeader } from './ColumnHeader';
import { ColumnContent } from './ColumnContent';

interface ColumnProps {
  column: ColumnType;
  leads: Lead[];
}

export function Column({ column, leads }: ColumnProps) {
  const columnLeads = leads.filter(lead => lead.columnId === column.id);
  const backgroundColor = column.backgroundColor || 'rgb(243 244 246)'; // Default to gray-100

  return (
    <div 
      className="p-4 rounded-lg w-80 flex flex-col min-h-[500px]"
      style={{ backgroundColor }}
      data-column-id={column.id}
    >
      <ColumnHeader
        columnId={column.id}
        title={column.title}
        itemCount={columnLeads.length}
        backgroundColor={backgroundColor}
      />
      <DroppableWrapper id={column.id}>
        {(provided, snapshot) => (
          <ColumnContent
            provided={provided}
            snapshot={snapshot}
            leads={columnLeads}
          />
        )}
      </DroppableWrapper>
    </div>
  );
}