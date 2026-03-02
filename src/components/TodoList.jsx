// =====================================================
// components/TodoList.jsx — Draggable list of todos
// =====================================================

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useTodoState, useTodoActions } from '../context/TodoContext';
import { filterTodos } from '../utils/helpers';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';

/**
 * TodoList — Renders the filtered & searchable list of todos.
 * Wraps with @hello-pangea/dnd for drag & drop reordering.
 * Shows <EmptyState> when no todos match the current filters.
 */
const TodoList = () => {
  const { todos, filter, searchQuery } = useTodoState();
  const { reorderTodos } = useTodoActions();

  // Get filtered todos for display
  const visibleTodos = filterTodos(todos, filter, searchQuery);

  /**
   * Handle drag end — only reorder if the drop is in a valid position
   * and the position actually changed.
   */
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list or no movement
    if (!destination) return;
    if (source.index === destination.index) return;

    // When filtering/searching, we need to map visible indices back to actual indices
    if (searchQuery || filter !== 'all') {
      // Get the actual IDs of the dragged items
      const draggedTodo = visibleTodos[source.index];
      const targetTodo = visibleTodos[destination.index];

      // Find their positions in the full todos array
      const actualSourceIndex = todos.findIndex(t => t.id === draggedTodo.id);
      const actualDestIndex = todos.findIndex(t => t.id === targetTodo.id);

      if (actualSourceIndex !== -1 && actualDestIndex !== -1) {
        reorderTodos(actualSourceIndex, actualDestIndex);
      }
      return;
    }

    // Normal reorder (no active filter/search)
    reorderTodos(source.index, destination.index);
  };

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              space-y-2 min-h-[80px] rounded-2xl transition-all duration-200
              ${snapshot.isDraggingOver
                ? 'ring-2 ring-brand-400/40 ring-dashed bg-brand-50/30 dark:bg-brand-900/10'
                : ''
              }
            `}
            aria-label="Todo list"
          >
            {/* Todo items */}
            <AnimatePresence mode="popLayout">
              {visibleTodos.map((todo, index) => (
                <TodoItem key={todo.id} todo={todo} index={index} />
              ))}
            </AnimatePresence>

            {provided.placeholder}

            {/* Empty state */}
            {visibleTodos.length === 0 && (
              <EmptyState filter={filter} hasSearch={hasSearch} />
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
