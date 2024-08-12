import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import SearchBar from './SearchBar';
import NewTaskForm from './NewTaskForm';

import './KanbanBoard.css';

const KanbanBoard = () => {
  const initialColumns = {
    'todo': { id: 'todo', title: 'To Do', tasks: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', tasks: [] },
    'peer-review': { id: 'peer-review', title: 'Peer Review', tasks: [] },
    'done': { id: 'done', title: 'Done', tasks: [] },
  };

  const [columns, setColumns] = useState(initialColumns);
  const [filteredColumns, setFilteredColumns] = useState(initialColumns);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('kanban-tasks'));
    if (savedTasks) {
      setColumns(savedTasks);
      setFilteredColumns(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(columns));
  }, [columns]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    const destTasks = [...destColumn.tasks];

    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
      },
    });
  };

  const handleSearch = (searchTerm) => {
    const newFilteredColumns = {};
    Object.keys(columns).forEach((columnId) => {
      newFilteredColumns[columnId] = {
        ...columns[columnId],
        tasks: columns[columnId].tasks.filter((task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      };
    });
    setFilteredColumns(newFilteredColumns);
  };

  const handleAddTask = (newTask) => {
    const newTaskWithId = { ...newTask, id: `task-${Date.now()}` };
    const updatedColumns = {
      ...columns,
      'todo': {
        ...columns['todo'],
        tasks: [newTaskWithId, ...columns['todo'].tasks],
      },
    };
    setColumns(updatedColumns);
    setFilteredColumns(updatedColumns);
  };

  return (
    <div className="kanban-board">
      <SearchBar onSearch={handleSearch} />
      <NewTaskForm onAddTask={handleAddTask} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-columns">
          {Object.entries(filteredColumns).map(([columnId, column]) => (
            <Column key={columnId} column={column} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
