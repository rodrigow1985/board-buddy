import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTimerStore } from '@src/store/timerStore';

/**
 * Compensa el tiempo transcurrido cuando la app vuelve del background.
 * Usa Date.now() para calcular exactamente cuánto tiempo pasó.
 */
export function useBackgroundTimer() {
  const status = useTimerStore((s) => s.status);
  const tick = useTimerStore((s) => s.tick);
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        // App va a segundo plano — guardar timestamp
        if (status === 'running') {
          backgroundedAt.current = Date.now();
        }
      } else if (nextState === 'active') {
        // App vuelve al primer plano
        if (status === 'running' && backgroundedAt.current !== null) {
          const elapsed = Date.now() - backgroundedAt.current;
          tick(elapsed);
          backgroundedAt.current = null;
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [status, tick]);
}
