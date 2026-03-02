// =====================================================
// utils/helpers.js — Utility functions for the app
// =====================================================

/**
 * Generate a unique ID using timestamp + random string
 * @returns {string} Unique ID
 */
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Format a date string to a human-readable form
 * @param {string} dateStr — ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Normalize to compare just dates
  const dateOnly = date.toDateString();
  const todayOnly = now.toDateString();
  const tomorrowOnly = tomorrow.toDateString();

  if (dateOnly === todayOnly) return 'Today';
  if (dateOnly === tomorrowOnly) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Check if a date is overdue (in the past and not today)
 * @param {string} dateStr — ISO date string
 * @returns {boolean}
 */
export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  // Set both to start of day for comparison
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return date < now;
};

/**
 * Get the color class for a priority level
 * @param {'low'|'medium'|'high'} priority
 * @returns {object} Tailwind classes for bg, text, border
 */
export const getPriorityConfig = (priority) => {
  const configs = {
    low: {
      label: 'Low',
      dotClass: 'priority-low',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderClass: 'border-emerald-200 dark:border-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    medium: {
      label: 'Medium',
      dotClass: 'priority-medium',
      textClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
      borderClass: 'border-amber-200 dark:border-amber-800',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    high: {
      label: 'High',
      dotClass: 'priority-high',
      textClass: 'text-red-600 dark:text-red-400',
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      borderClass: 'border-red-200 dark:border-red-800',
      badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  };
  return configs[priority] || configs.low;
};

/**
 * Debounce a function call
 * @param {Function} fn — Function to debounce
 * @param {number} delay — Debounce delay in ms
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Calculate todo statistics from a list of todos
 * @param {Array} todos
 * @returns {object} Stats object
 */
export const calculateStats = (todos) => {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const overdue = todos.filter(t => !t.completed && isOverdue(t.dueDate)).length;

  return { total, completed, pending, percentage, overdue };
};

/**
 * Filter todos based on active filter and search query
 * @param {Array} todos
 * @param {'all'|'active'|'completed'} filter
 * @param {string} searchQuery
 * @returns {Array} Filtered todos
 */
export const filterTodos = (todos, filter, searchQuery) => {
  let filtered = [...todos];

  // Apply status filter
  if (filter === 'active') {
    filtered = filtered.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  }

  // Apply search filter (search by title + priority)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.priority.toLowerCase().includes(query)
    );
  }

  return filtered;
};

/**
 * Safely parse JSON with a fallback value
 * @param {string} jsonString
 * @param {*} fallback
 * @returns {*} Parsed value or fallback
 */
export const safeJsonParse = (jsonString, fallback) => {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Reorder an array by moving an item from one index to another
 * @param {Array} list
 * @param {number} startIndex
 * @param {number} endIndex
 * @returns {Array} Reordered array
 */
export const reorderList = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/** Priority sort order for display */
export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/** All filter options */
export const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
];

/** Priority options */
export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', emoji: '🟢' },
  { value: 'medium', label: 'Medium', emoji: '🟡' },
  { value: 'high', label: 'High', emoji: '🔴' },
];
