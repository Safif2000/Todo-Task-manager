// =====================================================
// components/TodoInput.jsx — Add new todo form
// =====================================================

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, Calendar, Flag } from 'lucide-react';
import { useTodoActions, useTodoState } from '../context/TodoContext';
import { PRIORITY_OPTIONS, getPriorityConfig } from '../utils/helpers';

/** Minimum date for the date picker (today) */
const getTodayString = () => new Date().toISOString().split('T')[0];

/**
 * TodoInput — Form to add a new todo.
 * Supports title, priority selection, and optional due date.
 * Keyboard: Enter to submit, Escape to clear.
 * Expandable panel for priority + date options.
 */
const TodoInput = () => {
  const { addTodo, setSearch } = useTodoActions();
  const { searchQuery } = useTodoState();

  // Form state
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const inputRef = useRef(null);

  /**
   * Validates and submits the new todo
   */
  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    addTodo({ title: trimmed, priority, dueDate: dueDate || null });

    // Clear search so the new task is visible
    if (searchQuery) setSearch('');

    // Reset form
    setTitle('');
    setDueDate('');
    setPriority('medium');
    setShowOptions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setTitle('');
      setShowOptions(false);
    }
  };

  const currentPriority = getPriorityConfig(priority);
  const isReady = title.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl p-4 space-y-3"
    >
      {/* Main Input Row */}
      <div className="flex items-center gap-3">
        {/* Priority dot indicator */}
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${currentPriority.dotClass} cursor-pointer`}
          onClick={() => setShowOptions(v => !v)}
          title="Click to set options"
        />

        {/* Title input */}
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task... (Press Enter)"
          className="glass-input flex-1 rounded-xl px-4 py-3 text-sm font-body
                     text-slate-700 dark:text-slate-200"
          aria-label="New todo title"
          maxLength={200}
        />

        {/* Options toggle */}
        <motion.button
          onClick={() => setShowOptions(v => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="tooltip p-2.5 rounded-xl glass-card text-slate-500 dark:text-slate-400
                     hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          data-tooltip="Options"
          aria-label="Toggle options"
        >
          <motion.div
            animate={{ rotate: showOptions ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>

        {/* Submit button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!isReady}
          whileHover={isReady ? { scale: 1.05 } : {}}
          whileTap={isReady ? { scale: 0.95 } : {}}
          className="btn-gradient relative flex items-center gap-2 px-5 py-3 rounded-xl
                     text-white text-sm font-semibold font-body
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Add todo"
        >
          <Plus size={16} className="relative z-10" />
          <span className="relative z-10 hidden sm:inline">Add</span>
        </motion.button>
      </div>

      {/* Expandable Options Panel */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-4 pt-2 pb-1 border-t border-slate-200/50 dark:border-slate-700/50">

              {/* Priority Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 font-body flex items-center gap-1">
                  <Flag size={11} />
                  Priority
                </label>
                <div className="flex items-center gap-2">
                  {PRIORITY_OPTIONS.map(opt => {
                    const cfg = getPriorityConfig(opt.value);
                    const isSelected = priority === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        onClick={() => setPriority(opt.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium font-body
                          border transition-all duration-200
                          ${isSelected
                            ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} shadow-sm`
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }
                        `}
                        aria-pressed={isSelected}
                      >
                        {opt.emoji} {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 font-body flex items-center gap-1">
                  <Calendar size={11} />
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  min={getTodayString()}
                  onChange={e => setDueDate(e.target.value)}
                  className="glass-input rounded-lg px-3 py-1.5 text-sm font-body font-mono
                             text-slate-600 dark:text-slate-300"
                  aria-label="Due date"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoInput;
