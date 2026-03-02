// =====================================================
// components/TodoItem.jsx — Single todo item with editing
// =====================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Check, X, GripVertical, Calendar, Flag } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useTodoActions } from '../context/TodoContext';
import {
  getPriorityConfig,
  formatDate,
  isOverdue,
  PRIORITY_OPTIONS,
} from '../utils/helpers';

/**
 * TodoItem — Renders a single todo with:
 * - Drag handle (via @hello-pangea/dnd)
 * - Inline editing of title, priority, and due date
 * - Priority badge
 * - Due date with overdue highlight
 * - Toggle, edit, delete actions
 *
 * @param {object} todo — The todo data object
 * @param {number} index — Position in the list (for Draggable)
 */
const TodoItem = ({ todo, index }) => {
  const { toggleTodo, editTodo, deleteTodo } = useTodoActions();

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [isHovered, setIsHovered] = useState(false);

  const editInputRef = useRef(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const enterEditMode = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return; // Don't save empty titles
    editTodo({
      id: todo.id,
      title: trimmed,
      priority: editPriority,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const priorityConfig = getPriorityConfig(todo.priority);
  const overdue = isOverdue(todo.dueDate) && !todo.completed;
  const formattedDate = formatDate(todo.dueDate);

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`todo-item ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.96, transition: { duration: 0.2 } }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
              glass-card rounded-2xl p-4
              ${todo.completed ? 'opacity-60' : ''}
              ${snapshot.isDragging ? 'ring-2 ring-brand-400/60' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {/* Drag Handle */}
              <div
                {...provided.dragHandleProps}
                className={`
                  mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing
                  text-slate-300 dark:text-slate-600
                  transition-colors duration-200
                  ${isHovered ? 'text-slate-400 dark:text-slate-500' : ''}
                `}
                aria-label="Drag to reorder"
              >
                <GripVertical size={16} />
              </div>

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="custom-checkbox mt-0.5 flex-shrink-0"
                aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />

              {/* Content Area */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  /* ---- EDIT MODE ---- */
                  <div className="space-y-3">
                    {/* Edit title input */}
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="glass-input w-full rounded-xl px-3 py-2 text-sm font-body
                                 text-slate-700 dark:text-slate-200"
                      maxLength={200}
                      aria-label="Edit todo title"
                    />

                    {/* Edit options row */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Priority selector */}
                      <div className="flex items-center gap-1.5">
                        <Flag size={12} className="text-slate-400" />
                        <div className="flex gap-1">
                          {PRIORITY_OPTIONS.map(opt => {
                            const cfg = getPriorityConfig(opt.value);
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setEditPriority(opt.value)}
                                className={`
                                  px-2 py-1 rounded-lg text-xs font-medium font-body border
                                  transition-all duration-150
                                  ${editPriority === opt.value
                                    ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }
                                `}
                              >
                                {opt.emoji} {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date input */}
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={e => setEditDueDate(e.target.value)}
                          className="glass-input rounded-lg px-2 py-1 text-xs font-mono
                                     text-slate-600 dark:text-slate-300"
                        />
                      </div>

                      {/* Save / Cancel */}
                      <div className="flex gap-1.5 ml-auto">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={saveEdit}
                          disabled={!editTitle.trim()}
                          className="p-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Save changes"
                        >
                          <Check size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700
                                     text-slate-600 dark:text-slate-300
                                     hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                          aria-label="Cancel editing"
                        >
                          <X size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ---- VIEW MODE ---- */
                  <div>
                    {/* Title */}
                    <p
                      className={`
                        text-sm font-medium font-body leading-relaxed break-words
                        ${todo.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                        }
                      `}
                    >
                      {todo.title}
                    </p>

                    {/* Meta row: priority badge + due date */}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {/* Priority badge */}
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                        text-xs font-medium font-body ${priorityConfig.badgeClass}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dotClass}`} />
                        {priorityConfig.label}
                      </span>

                      {/* Due date */}
                      {formattedDate && (
                        <span className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-body font-medium
                          ${overdue
                            ? 'overdue-badge'
                            : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                          }
                        `}>
                          <Calendar size={10} />
                          {formattedDate}
                          {overdue && ' · Overdue'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons — shown on hover */}
              {!isEditing && (
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1 flex-shrink-0"
                    >
                      {/* Edit button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={enterEditMode}
                        className="tooltip p-1.5 rounded-lg text-slate-400 hover:text-brand-500
                                   hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                        data-tooltip="Edit"
                        aria-label="Edit todo"
                      >
                        <Pencil size={14} />
                      </motion.button>

                      {/* Delete button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo.id)}
                        className="tooltip p-1.5 rounded-lg text-slate-400 hover:text-red-500
                                   hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        data-tooltip="Delete"
                        aria-label="Delete todo"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

export default TodoItem;
