import { useCallback, useEffect, useState } from "react";

export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setState(JSON.parse(stored) as T);
      }
    } catch (error) {
      console.warn(`Failed to read ${key} from localStorage`, error);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Failed to write ${key} to localStorage`, error);
    }
  }, [key, state, hydrated]);

  const reset = useCallback(() => setState(initial), [initial]);

  return { state, setState, hydrated, reset };
}
