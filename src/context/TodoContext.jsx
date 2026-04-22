// =====================================================
// context/TodoContext.jsx — Global state & actions
// =====================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import todoReducer, { initialState, TODO_ACTIONS } from './TodoReducer';
import { safeJsonParse } from '../utils/helpers';

// Storage key for todos state
const STORAGE_KEY = 'tasko-state-v1';

// ---- Context Definitions ----
const TodoStateContext = createContext(null);
const TodoDispatchContext = createContext(null);

/**
 * Load persisted state from localStorage with graceful fallback
 */
const loadPersistedState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = safeJsonParse(raw, null);
    if (!parsed || !Array.isArray(parsed.todos)) return initialState;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
};

/**
 * TodoProvider — Wraps the app and provides todo state + actions.
 * Uses useReducer for predictable updates and syncs to localStorage
 * on every state change.
 */
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, undefined, loadPersistedState);

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[TodoContext] Failed to persist state:', err);
    }
  }, [state]);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};

/**
 * useTodoState — Access the current todo state
 * Must be used within <TodoProvider>
 */
export const useTodoState = () => {
  const context = useContext(TodoStateContext);
  if (!context) throw new Error('useTodoState must be used within TodoProvider');
  return context;
};

/**
 * useTodoDispatch — Access the dispatch function for raw action dispatch
 * Must be used within <TodoProvider>
 */
export const useTodoDispatch = () => {
  const context = useContext(TodoDispatchContext);
  if (!context) throw new Error('useTodoDispatch must be used within TodoProvider');
  return context;
};

/**
 * useTodoActions — Returns memoized action creators for clean component usage.
 * Abstracts dispatch calls behind descriptive function names.
 */
export const useTodoActions = () => {
  const dispatch = useTodoDispatch();

  return {
    addTodo: useCallback((payload) =>
      dispatch({ type: TODO_ACTIONS.ADD, payload }), [dispatch]),

    editTodo: useCallback((payload) =>
      dispatch({ type: TODO_ACTIONS.EDIT, payload }), [dispatch]),

    deleteTodo: useCallback((id) =>
      dispatch({ type: TODO_ACTIONS.DELETE, payload: { id } }), [dispatch]),

    toggleTodo: useCallback((id) =>
      dispatch({ type: TODO_ACTIONS.TOGGLE, payload: { id } }), [dispatch]),

    reorderTodos: useCallback((startIndex, endIndex) =>
      dispatch({ type: TODO_ACTIONS.REORDER, payload: { startIndex, endIndex } }), [dispatch]),

    markAllComplete: useCallback(() =>
      dispatch({ type: TODO_ACTIONS.MARK_ALL_COMPLETE }), [dispatch]),

    clearCompleted: useCallback(() =>
      dispatch({ type: TODO_ACTIONS.CLEAR_COMPLETED }), [dispatch]),

    setFilter: useCallback((filter) =>
      dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filter } }), [dispatch]),

    setSearch: useCallback((query) =>
      dispatch({ type: TODO_ACTIONS.SET_SEARCH, payload: { query } }), [dispatch]),
  };
};
