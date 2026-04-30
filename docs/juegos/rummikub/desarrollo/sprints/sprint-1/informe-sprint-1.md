# Informe Sprint 1 — Bugs críticos

**Fecha:** 2026-04-26  
**Commit:** `e2805c7`  
**Estado:** Completado ✓  
**Issues cerrados:** #6, #7, #8, #9

---

## Resumen

Se resolvieron los 4 bugs críticos identificados en la primera prueba en dispositivo Android. Todos los fixes están en un único commit atómico. TypeScript sin errores, 70 tests pasando.

---

## BUG-06 — Botón "Pasar turno" requiere dos toques después del timeout ✓

**Issue:** rodrigow1985/board-buddy#6  
**Archivo:** `app/screens/games/rummikub/timer.tsx`

**Problema raíz:** En `handlePassTurn`, el caso `timeout` llamaba a `endTransition()` que solo reinicia el timer del mismo jugador sin avanzar al siguiente. Además, `passTurn()` en el store rechazaba el estado `timeout` porque solo aceptaba `running` y `paused`.

**Cambios:**

En `timer.tsx`:
```ts
// Antes
} else if (status === 'timeout') {
  endTransition();
}

// Después
} else if (status === 'timeout') {
  passTurn('button');
}
```

En `timerStore.ts` — guard ampliado:
```ts
// Antes
if (s.status !== 'running' && s.status !== 'paused') return {};

// Después
if (s.status !== 'running' && s.status !== 'paused' && s.status !== 'timeout') return {};
```

---

## BUG-04 — Voz no reconoce "paso" cuando el tiempo se agotó ✓

**Issue:** rodrigow1985/board-buddy#7  
**Archivo:** `app/src/hooks/useVoiceDetection.ts`

**Problema raíz:** `shouldListen` excluía el estado `timeout`, por lo que el reconocedor se pausaba automáticamente al llegar a 0.

**Cambio:**
```ts
// Antes
const shouldListen = enabled && permissionRef.current === true && status === 'running';

// Después
const shouldListen = enabled && permissionRef.current === true
  && (status === 'running' || status === 'timeout');
```

---

## BUG-01 — Los segundos avanzan más rápido que el tiempo real ✓

**Issue:** rodrigow1985/board-buddy#8  
**Archivo:** `app/src/hooks/useCountdown.ts`

**Problema raíz:** `lastTickRef` se inicializaba con `Date.now()` al ejecutar el `useEffect`, pero entre que React monta el efecto, inicializa el intervalo y dispara el primer callback, pasan varios cientos de ms que se contaban como tiempo de juego real.

**Solución:** El primer tick del intervalo solo establece la marca de tiempo sin descontar tiempo. El descuento empieza a partir del segundo tick.

```ts
// Antes
lastTickRef.current = Date.now();
const interval = setInterval(() => {
  const now = Date.now();
  const elapsed = now - lastTickRef.current;
  lastTickRef.current = now;
  tick(elapsed);
}, TICK_INTERVAL_MS);

// Después
lastTickRef.current = null;
const interval = setInterval(() => {
  const now = Date.now();
  if (lastTickRef.current === null) {
    lastTickRef.current = now; // primer tick: solo marca tiempo
    return;
  }
  const elapsed = now - lastTickRef.current;
  lastTickRef.current = now;
  tick(elapsed);
}, TICK_INTERVAL_MS);
```

**Efecto:** El primer tick real ocurre ~100ms después de que el intervalo se establece, eliminando el elapsed fantasma de setup.

---

## BUG-05 — Chip muestra "Pausado" después de la transición de turno ✓

**Issue:** rodrigow1985/board-buddy#9  
**Archivo:** `app/src/hooks/useVoiceDetection.ts`

**Problema raíz:** El estado del reconocedor se guardaba en un `ref` (`stateRef`). Los refs no provocan re-renders en React, así que aunque el reconocedor volvía a `'listening'` después de la transición, el componente `VoiceStatusChip` nunca se actualizaba visualmente.

**Solución:** Reemplazar `stateRef` por `useState`. Los refs de control interno (`isRunningRef`, `permissionRef`, `lastTriggerRef`) se mantienen como refs porque no necesitan re-renders.

```ts
// Antes
const stateRef = useRef<VoiceDetectionState>(SpeechModule ? 'idle' : 'unavailable');
// ... stateRef.current = 'listening' en cada cambio

// Después
const [voiceState, setVoiceState] = useState<VoiceDetectionState>(
  SpeechModule ? 'idle' : 'unavailable'
);
// ... setVoiceState('listening') en cada cambio
```

---

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
- `git push origin develop` → rama actualizada

---

## Próximo sprint

**Sprint 2 — Audio + latencia de voz**

| Issue | Item |
|-------|------|
| #11 | Sistema de sonidos (50%, 20%, últimos 10s, timeout, paso) |
| #10 | Reducir latencia de voz de 2-3s a <1s |
