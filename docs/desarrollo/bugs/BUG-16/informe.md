# Informe BUG-16 — Los segundos pasan casi el doble de rápido

**Fecha:** 2026-04-26
**Commit:** `6f6699a`
**Issue cerrado:** rodrigow1985/board-buddy#16
**Rama:** `bug/16-segundos-rapidos`

---

## Causa raíz

El tick incremental de Sprint 1 (`elapsed = Date.now() - lastTickRef`) acumula error cuando el JS thread se bloquea. El hook `useAudio` agregado en Sprint 2 carga 5 archivos con `Audio.Sound.createAsync` al montar, bloqueando brevemente el thread en Android. Los callbacks del `setInterval` se acumulan y disparan en ráfaga al liberarse, haciendo que el timer avance ~2x más rápido.

## Cambios

### `app/src/store/timerStore.ts`

```ts
// Agregado a la interfaz y createActions
setTimeRemaining: (ms: number) => void;

// Implementación
setTimeRemaining: (ms: number) =>
  set((s) => {
    if (s.status !== 'running') return {};
    return { timeRemainingMs: Math.max(0, ms) };
  }),
```

### `app/src/hooks/useCountdown.ts`

```ts
// Antes — tick incremental (vulnerable a delays del JS thread)
const lastTickRef = useRef<number | null>(null);
useEffect(() => {
  if (status !== 'running') return;
  lastTickRef.current = null;
  const interval = setInterval(() => {
    const now = Date.now();
    if (lastTickRef.current === null) { lastTickRef.current = now; return; }
    const elapsed = now - lastTickRef.current;
    lastTickRef.current = now;
    tick(elapsed);
  }, TICK_INTERVAL_MS);
  return () => clearInterval(interval);
}, [status, tick]);

// Después — timestamp absoluto (inmune a delays del JS thread)
useEffect(() => {
  if (status !== 'running') return;
  const startedAt = Date.now();
  const remainingAtStart = useTimerStore.getState().timeRemainingMs;
  const interval = setInterval(() => {
    const remaining = remainingAtStart - (Date.now() - startedAt);
    setTimeRemaining(remaining);
  }, TICK_INTERVAL_MS);
  return () => clearInterval(interval);
}, [status, setTimeRemaining]);
```

Cada tick calcula el tiempo restante contra un punto de referencia fijo. No importa cuántos ticks se acumulen — el resultado siempre es correcto.

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
