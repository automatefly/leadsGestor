import React, { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Lead } from '../types';
import { User, Building2, Mail, Phone, DollarSign } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  index: number;
}

export const LeadCard = memo(({ lead, index }: LeadCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm mb-2 border border-gray-200 transition-all ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : 'hover:shadow-md'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <span className="font-medium">{lead.clientName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{lead.companyName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-500" />
              <a href={`mailto:${lead.email}`} className="text-sm text-blue-500 hover:text-blue-600">
                {lead.email}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{lead.phone}</span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <DollarSign size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(lead.systemValue)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

LeadCard.displayName = 'LeadCard';