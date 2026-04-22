// =====================================================
// context/TodoReducer.js — Pure reducer for todo state
// =====================================================

import { generateId, reorderList } from '../utils/helpers';

// ---- Action Types ---- (constants to avoid typos)
export const TODO_ACTIONS = {
  ADD: 'ADD_TODO',
  EDIT: 'EDIT_TODO',
  DELETE: 'DELETE_TODO',
  TOGGLE: 'TOGGLE_TODO',
  REORDER: 'REORDER_TODOS',
  MARK_ALL_COMPLETE: 'MARK_ALL_COMPLETE',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  SET_FILTER: 'SET_FILTER',
  SET_SEARCH: 'SET_SEARCH',
};

/**
 * Initial state shape
 */
export const initialState = {
  todos: [],
  filter: 'all',
  searchQuery: '',
};

/**
 * Pure reducer function for all todo state changes.
 * Each case is immutable — returns a new state object.
 *
 * @param {object} state — Current state
 * @param {object} action — { type, payload }
 * @returns {object} New state
 */
const todoReducer = (state, action) => {
  switch (action.type) {

    case TODO_ACTIONS.ADD: {
      // Create a new todo with all required fields
      const newTodo = {
        id: generateId(),
        title: action.payload.title.trim(),
        priority: action.payload.priority || 'medium',
        dueDate: action.payload.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        todos: [newTodo, ...state.todos], // New todos appear at top
      };
    }

    case TODO_ACTIONS.EDIT: {
      // Update a specific todo's fields
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? {
                ...todo,
                title: action.payload.title.trim(),
                priority: action.payload.priority,
                dueDate: action.payload.dueDate,
              }
            : todo
        ),
      };
    }

    case TODO_ACTIONS.DELETE: {
      // Remove the todo with the given id
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }

    case TODO_ACTIONS.TOGGLE: {
      // Flip the completed status
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    }

    case TODO_ACTIONS.REORDER: {
      // Re-order todos after drag & drop
      const { startIndex, endIndex } = action.payload;
      return {
        ...state,
        todos: reorderList(state.todos, startIndex, endIndex),
      };
    }

    case TODO_ACTIONS.MARK_ALL_COMPLETE: {
      // Mark every todo as completed
      return {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, completed: true })),
      };
    }

    case TODO_ACTIONS.CLEAR_COMPLETED: {
      // Remove all completed todos
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    }

    case TODO_ACTIONS.SET_FILTER: {
      return { ...state, filter: action.payload.filter };
    }

    case TODO_ACTIONS.SET_SEARCH: {
      return { ...state, searchQuery: action.payload.query };
    }

    default:
      return state;
  }
};

export default todoReducer;
