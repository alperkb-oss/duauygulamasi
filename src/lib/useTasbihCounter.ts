import { useState, useCallback, useRef } from 'react';

type UseTasbihCounterOptions = {
  storageKey?: string;
  initialCount?: number;
  maxCount?: number;
  onIncrement?: (newCount: number) => void;
  onDecrement?: (newCount: number) => void;
  onReset?: () => void;
};

export function useTasbihCounter(options: UseTasbihCounterOptions = {}) {
  const {
    storageKey,
    initialCount = 0,
    maxCount,
    onIncrement,
    onDecrement,
    onReset,
  } = options;

  const loadCount = (): number => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return initialCount;
  };

  const [count, setCount] = useState<number>(loadCount);
  const onIncrementRef = useRef(onIncrement);
  const onDecrementRef = useRef(onDecrement);
  const onResetRef = useRef(onReset);
  onIncrementRef.current = onIncrement;
  onDecrementRef.current = onDecrement;
  onResetRef.current = onReset;

  const persist = (value: number) => {
    if (storageKey) {
      localStorage.setItem(storageKey, String(value));
    }
  };

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = maxCount !== undefined ? Math.min(prev + 1, maxCount) : prev + 1;
      persist(next);
      onIncrementRef.current?.(next);
      return next;
    });
  }, [maxCount]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = Math.max(prev - 1, 0);
      persist(next);
      onDecrementRef.current?.(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    persist(0);
    onResetRef.current?.();
  }, []);

  return { count, increment, decrement, reset };
}
