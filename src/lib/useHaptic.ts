import { useCallback } from 'react';

export function useHaptic() {
  const vibrate = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Vibration not supported or permission denied — silently continue
      }
    }
  }, []);

  return { vibrate };
}
