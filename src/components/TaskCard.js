import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import './TaskCard.css';

const TaskCard = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
