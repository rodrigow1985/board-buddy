# Informe BUG-22 — Reconocimiento de voz no detecta "paso" — flicker paused/listening constante

**Fecha:** 2026-04-26
**Commit:** `6619577`
**Issue cerrado:** rodrigow1985/board-buddy#22
**Rama:** `bug/22-voz-flicker-stale-closure`

---

## Causa raíz

Dos problemas combinados en `useVoiceDetection.ts`:

**1. Stale closure / listeners inestables:** `shouldListen` en las deps del effect de suscripciones causaba que los listeners nativos se eliminaran y re-crearan en cada transición de turno. Esto provocaba un ciclo `stopListening` → `startListening` que el usuario veía como flicker paused/listening y que rompía el contexto del reconocedor de Android.

**2. Reinicio tras error fatal:** el handler de `end` reactivaba el reconocedor incluso después de errores no-recuperables porque no sabía que el cierre de sesión fue por error.

## Cambios

### `app/src/hooks/useVoiceDetection.ts`

```ts
// Antes — shouldListen en deps causa listeners inestables
useEffect(() => {
  const subs = [
    SpeechModule.addListener('end', () => {
      if (shouldListen) { ... }    // stale closure
    }),
    SpeechModule.addListener('result', (data) => {
      if (!shouldListen) return;   // stale closure
      ...
    }),
  ];
  return () => subs.forEach(s => s.remove());
}, [enabled, shouldListen, triggerWord, startListening, passTurn, onTrigger]);
//           ^^^^^^^^^^^^ re-crea listeners en cada transición de turno

// Después — ref sincronizada, listeners estables
const shouldListenRef = useRef(shouldListen);
useEffect(() => { shouldListenRef.current = shouldListen; }, [shouldListen]);

const fatalErrorRef = useRef(false);

useEffect(() => {
  const subs = [
    SpeechModule.addListener('end', () => {
      if (fatalErrorRef.current) { fatalErrorRef.current = false; return; }
      if (shouldListenRef.current) { ... }   // siempre fresco
    }),
    SpeechModule.addListener('error', (data) => {
      if (recoverable) { ... }
      else {
        fatalErrorRef.current = true;   // marca el error fatal
        setVoiceState('error');
      }
    }),
    SpeechModule.addListener('result', (data) => {
      if (!shouldListenRef.current) return;  // siempre fresco
      ...
    }),
  ];
  return () => subs.forEach(s => s.remove());
}, [enabled, triggerWord, startListening, passTurn, onTrigger]);
// shouldListen eliminado de deps — los handlers usan shouldListenRef.current
```

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
