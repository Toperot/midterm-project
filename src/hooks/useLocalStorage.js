import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state in localStorage.
 * @param {string} key - The key to use for localStorage.
 * @param {any} initialValue - The initial state value.
 * @returns {[any, function]} - The state and a function to set the state.
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
};

