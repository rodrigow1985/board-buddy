import { useEffect } from 'react';
import { useTimerStore } from '@src/store/timerStore';

const TICK_INTERVAL_MS = 100;

/**
 * Maneja el countdown del timer.
 * Usa un punto de referencia absoluto (startedAt) para calcular el tiempo
 * restante, en lugar de acumular elapsed incremental. Esto es inmune a
 * delays del JS thread (carga de assets, audio) que causaban BUG-16.
 */
export function useCountdown() {
  const status = useTimerStore((s) => s.status);
  const setTimeRemaining = useTimerStore((s) => s.setTimeRemaining);
  const onTimeout = useTimerStore((s) => s.onTimeout);
  const timeRemainingMs = useTimerStore((s) => s.timeRemainingMs);

  useEffect(() => {
    if (status !== 'running') return;

    // Capturamos el punto de referencia absoluto al inicio del período running.
    // useTimerStore.getState() lee el valor actual sin suscripción reactiva.
    const startedAt = Date.now();
    const remainingAtStart = useTimerStore.getState().timeRemainingMs;

    const interval = setInterval(() => {
      const remaining = remainingAtStart - (Date.now() - startedAt);
      setTimeRemaining(remaining);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [status, setTimeRemaining]);

  // Disparar timeout cuando el tiempo llega a 0 mientras está corriendo
  useEffect(() => {
    if (status === 'running' && timeRemainingMs <= 0) {
      onTimeout();
    }
  }, [status, timeRemainingMs, onTimeout]);
}
