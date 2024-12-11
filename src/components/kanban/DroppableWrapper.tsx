import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { DroppableProps } from '@hello-pangea/dnd';

interface DroppableWrapperProps {
  id: string;
  children: DroppableProps['children'];
}

export function DroppableWrapper({ id, children }: DroppableWrapperProps) {
  return (
    <Droppable droppableId={id}>
      {children}
    </Droppable>
  );
}