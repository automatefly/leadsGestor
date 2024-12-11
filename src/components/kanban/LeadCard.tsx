import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Lead } from '../../types';
import { User, Building2, Mail, Phone, DollarSign, Pencil, ChevronDown, ChevronUp, MessageSquare, MessageSquarePlus } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { EditLeadForm } from '../EditLeadForm';
import { LeadNotes } from './LeadNotes';

interface LeadCardProps {
  lead: Lead;
  index: number;
}

export function LeadCard({ lead, index }: LeadCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const toggleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Draggable draggableId={lead.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white p-4 rounded-lg shadow-sm mb-2 border border-gray-200 transition-all ${
              snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : 'hover:shadow-md'
            }`}
            style={provided.draggableProps.style}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="font-medium truncate">{lead.clientName}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={toggleEdit}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      title="Editar lead"
                    >
                      <Pencil size={14} className="text-gray-500" />
                    </button>
                    <button
                      onClick={toggleNotes}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      title={showNotes ? "Ocultar notas" : "Mostrar notas"}
                    >
                      {showNotes ? (
                        <MessageSquare size={14} className="text-blue-500" />
                      ) : (
                        <MessageSquarePlus size={14} className="text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={toggleExpand}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      title={isExpanded ? "Recolher" : "Expandir"}
                    >
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{lead.companyName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        {lead.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{lead.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(lead.systemValue)}
                      </span>
                    </div>
                  </div>
                )}

                {showNotes && (
                  <div className="mt-3 border-t pt-3" onClick={e => e.stopPropagation()}>
                    <LeadNotes leadId={lead.id} notes={lead.notes || []} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {showEditForm && (
        <EditLeadForm
          lead={lead}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}