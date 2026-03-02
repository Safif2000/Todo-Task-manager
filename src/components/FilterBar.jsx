// =====================================================
// components/FilterBar.jsx — Filter tabs + bulk actions
// =====================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCheck, Trash2, X, AlertCircle } from 'lucide-react';
import { useTodoState, useTodoActions } from '../context/TodoContext';
import { FILTER_OPTIONS, debounce, filterTodos } from '../utils/helpers';

/**
 * Confirmation modal for destructive bulk actions
 */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="glass-card rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 flex-shrink-0">
          <AlertCircle size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white font-display text-lg">
            Confirm Action
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-body">
            {message}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700
                     text-slate-600 dark:text-slate-300 text-sm font-medium font-body
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600
                     text-white text-sm font-medium font-body transition-colors shadow-sm"
        >
          Confirm
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/**
 * FilterBar — Contains:
 * - Real-time debounced search
 * - Filter tabs (All / Active / Done)
 * - Bulk actions (Mark all complete, Clear completed)
 */
const FilterBar = () => {
  const { filter, searchQuery, todos } = useTodoState();
  const { setFilter, setSearch, markAllComplete, clearCompleted } = useTodoActions();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search state when context searchQuery changes externally (e.g., cleared by TodoInput)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);
  const [confirmModal, setConfirmModal] = useState(null); // null | 'markAll' | 'clearCompleted'

  // Debounced search dispatch
  const debouncedSearch = useRef(
    debounce((query) => setSearch(query), 300)
  ).current;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    debouncedSearch(val);
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearch('');
  };

  // Bulk action handlers with confirmation
  const handleMarkAll = () => setConfirmModal('markAll');
  const handleClearCompleted = () => setConfirmModal('clearCompleted');

  const handleConfirm = () => {
    if (confirmModal === 'markAll') markAllComplete();
    if (confirmModal === 'clearCompleted') clearCompleted();
    setConfirmModal(null);
  };

  // Derived counts for filter labels
  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;
  const hasCompleted = completedTodos > 0;
  const hasActive = activeTodos > 0;

  return (
    <>
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          value={localSearch}
          onChange={handleSearchChange}
          placeholder="Search by title or priority..."
          className="glass-input w-full rounded-xl py-3 pl-10 pr-10 text-sm font-body
                     text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          aria-label="Search todos"
        />
        {localSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
                       text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs + Bulk Actions Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 glass-card rounded-xl p-1">
          {FILTER_OPTIONS.map(option => {
            const count = option.value === 'active'
              ? activeTodos
              : option.value === 'completed'
              ? completedTodos
              : todos.length;

            return (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  filter-tab relative px-4 py-2 rounded-lg text-sm font-medium font-body
                  transition-all duration-200 flex items-center gap-2
                  ${filter === option.value
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'
                  }
                `}
                aria-current={filter === option.value ? 'page' : undefined}
              >
                {option.label}
                {count > 0 && (
                  <span className={`
                    text-xs rounded-full px-1.5 py-0.5 font-mono leading-none
                    ${filter === option.value
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleMarkAll}
            disabled={!hasActive}
            title="Mark all as complete"
            className="tooltip flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium font-body
                       glass-card text-slate-600 dark:text-slate-300
                       hover:text-brand-600 dark:hover:text-brand-400
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            data-tooltip="Mark all complete"
          >
            <CheckCheck size={15} />
            <span className="hidden sm:inline">Mark All</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClearCompleted}
            disabled={!hasCompleted}
            title="Clear completed todos"
            className="tooltip flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium font-body
                       glass-card text-slate-600 dark:text-slate-300
                       hover:text-red-500 dark:hover:text-red-400
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            data-tooltip="Clear completed"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">Clear Done</span>
          </motion.button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            message={
              confirmModal === 'markAll'
                ? 'Mark all active tasks as completed?'
                : `Remove all ${completedTodos} completed task${completedTodos !== 1 ? 's' : ''}? This cannot be undone.`
            }
            onConfirm={handleConfirm}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterBar;
