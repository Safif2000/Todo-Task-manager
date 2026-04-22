// =====================================================
// hooks/useLocalStorage.js — Persistent storage hook
// =====================================================

import { useState, useEffect } from 'react';
import { safeJsonParse } from '../utils/helpers';

/**
 * Custom hook to sync state with localStorage.
 * Handles JSON serialization, deserialization, and graceful
 * fallback if storage is empty or contains corrupted data.
 *
 * @param {string} key — localStorage key
 * @param {*} initialValue — Default value if key doesn't exist
 * @returns {[*, Function]} [storedValue, setValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Initialize state from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? safeJsonParse(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Update state and sync to localStorage
   * Accepts both a value or an updater function (like useState)
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function for functional updates
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to write key "${key}":`, error);
    }
  };

  /**
   * Remove the key from localStorage and reset to initialValue
   */
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove key "${key}":`, error);
    }
  };

  // Sync across tabs / windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        setStoredValue(safeJsonParse(event.newValue, initialValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
