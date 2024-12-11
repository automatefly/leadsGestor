import React, { memo } from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

interface DroppableColumnProps {
  droppableId: string;
  children: (
    provided: DroppableProvided,
    snapshot: DroppableStateSnapshot
  ) => React.ReactNode;
}

export const DroppableColumn = memo(({ droppableId, children }: DroppableColumnProps) => (
  <Droppable droppableId={droppableId}>
    {(provided, snapshot) => children(provided, snapshot)}
  </Droppable>
));

DroppableColumn.displayName = 'DroppableColumn';