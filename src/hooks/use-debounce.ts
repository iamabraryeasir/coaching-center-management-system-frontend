import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a fast-changing value.
 *
 * @template T - The type of value to debounce
 * @param value - The input value to debounce
 * @param delay - Debounce duration in milliseconds (default: 500ms)
 * @returns The debounced value after delay has elapsed
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
