import { useEffect, useRef } from 'react';
import { useTimerStore } from '@src/store/timerStore';

const TICK_INTERVAL_MS = 100;

/**
 * Maneja el countdown del timer.
 * Corre un setInterval a 100ms para mayor precisión,
 * pero actualiza timeRemainingMs en milisegundos reales.
 * Dispara onTimeout() cuando el tiempo llega a 0.
 */
export function useCountdown() {
  const status = useTimerStore((s) => s.status);
  const tick = useTimerStore((s) => s.tick);
  const onTimeout = useTimerStore((s) => s.onTimeout);
  const timeRemainingMs = useTimerStore((s) => s.timeRemainingMs);

  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (status !== 'running') return;

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      tick(elapsed);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [status, tick]);

  // Disparar timeout cuando el tiempo llega a 0 mientras está corriendo
  useEffect(() => {
    if (status === 'running' && timeRemainingMs <= 0) {
      onTimeout();
    }
  }, [status, timeRemainingMs, onTimeout]);
}
