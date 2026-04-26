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

  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== 'running') return;

    // Inicializamos lastTickRef al primer tick real del intervalo,
    // no al montar el efecto, para evitar que tiempo de setup
    // se cuente como tiempo de juego (causa BUG-01: segundos rápidos).
    lastTickRef.current = null;

    const interval = setInterval(() => {
      const now = Date.now();
      if (lastTickRef.current === null) {
        // Primer tick: solo establecemos la marca de tiempo sin descontar
        lastTickRef.current = now;
        return;
      }
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
