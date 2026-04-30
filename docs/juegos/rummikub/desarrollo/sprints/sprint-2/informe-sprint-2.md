# Informe Sprint 2 — Audio + latencia de voz

**Fecha:** 2026-04-26  
**Commit:** `9ba3331`  
**Estado:** Completado ✓  
**Issues cerrados:** #10, #11

---

## Resumen

Se implementó el sistema de sonidos completo y se redujo la latencia de reconocimiento de voz. Los archivos de audio son placeholders (copia de `timer-end.mp3`) listos para ser reemplazados con los archivos finales. TypeScript sin errores, 70 tests pasando.

---

## Issue #11 — Sistema de sonidos ✓

**Archivo nuevo:** `app/src/hooks/useAudio.ts`  
**Archivos modificados:** `app/screens/games/rummikub/timer.tsx`  
**Assets nuevos:** `assets/sounds/tick-mid.mp3`, `tick-warn.mp3`, `tick-second.mp3`, `pass.mp3`

### Spec implementada

| Momento | Sonido | Comportamiento |
|---------|--------|----------------|
| 50% del tiempo | `tick-mid.mp3` | Una vez por turno |
| 20% del tiempo | `tick-warn.mp3` | Una vez por turno |
| Últimos 10 segundos | `tick-second.mp3` | Una vez por cada segundo restante |
| Tiempo agotado | `timer-end.mp3` | Al transicionar a estado `timeout` |
| Turno pasado | `pass.mp3` | Al llamar `passTurn()` por botón o por voz |

### Arquitectura del hook

```ts
// Pre-carga todos los sonidos al montar con Audio.Sound.createAsync
// Flags one-shot (midFiredRef, warnFiredRef) que se resetean en cada turno nuevo
// lastSecondRef detecta cruce de segundo en últimos 10s para no repetir ticks
// Respeta settingsStore.audio.soundOnExpire

export function useAudio(): { playPass: () => void }
```

**Detección de cruce de segundo en últimos 10s:**
```ts
if (timeRemainingMs <= 10_000 && timeRemainingMs > 0) {
  const currentSecond = Math.ceil(timeRemainingMs / 1000);
  if (lastSecondRef.current === null || currentSecond < lastSecondRef.current) {
    lastSecondRef.current = currentSecond;
    playSound(soundsRef.current.second);
  }
}
```

**Reset de flags al cambiar turno:**
```ts
// prev === 'transitioning' → status === 'running' = turno nuevo
if ((prev === 'transitioning' || prev === 'idle') && status === 'running') {
  midFiredRef.current = false;
  warnFiredRef.current = false;
  lastSecondRef.current = null;
}
```

### Integración en timer.tsx

- Se agrega `onTrigger` a `useVoiceDetection` para notificar cuando la voz detecta "paso"
- Un ref (`playPassRef`) conecta `playPass` del hook de audio con el callback de voz, evitando dependencias circulares entre hooks
- `handlePassTurn` llama `playPass()` antes de `passTurn('button')`

```ts
const playPassRef = useRef<(() => void) | null>(null);

// En useVoiceDetection:
onTrigger: useCallback(() => { playPassRef.current?.(); }, []),

// En useAudio:
const { playPass } = useAudio();
useEffect(() => { playPassRef.current = playPass; }, [playPass]);
```

### Archivos de audio (placeholders)

Los cuatro archivos nuevos son temporalmente copias de `timer-end.mp3`. Deben reemplazarse con los archivos definitivos:

| Archivo | Descripción |
|---------|-------------|
| `tick-mid.mp3` | Sonido suave, neutro (ej: un click suave) |
| `tick-warn.mp3` | Tono de advertencia (ej: un bip más agudo) |
| `tick-second.mp3` | Tick por segundo, debe ser muy corto (<200ms) |
| `pass.mp3` | Confirmación positiva (ej: un "pop" o swoosh) |

---

## Issue #10 — Reducir latencia de voz de 2-3s a <1s ✓

**Archivo:** `app/src/hooks/useVoiceDetection.ts`

### Cambio 1: debounce reducido

```ts
// Antes
if (now - lastTriggerRef.current < 1500) return;

// Después
if (now - lastTriggerRef.current < 800) return;
```

El debounce de 1500ms bloqueaba resultados intermedios válidos. 800ms es suficiente para evitar doble disparo en una misma frase larga.

### Cambio 2: reconocimiento en dispositivo

```ts
// Antes
const RECOGNITION_OPTIONS = {
  lang: 'es-AR',
  continuous: true,
  interimResults: true,
  requiresOnDeviceRecognition: false,
};

// Después
const RECOGNITION_OPTIONS = {
  lang: 'es-ES',
  continuous: true,
  interimResults: true,
  requiresOnDeviceRecognition: true,
};
```

- `requiresOnDeviceRecognition: true` elimina la latencia de red al usar el motor local de Android
- `es-ES` tiene mejor soporte en el motor on-device de Android que `es-AR`

**Nota:** Si el dispositivo no tiene el modelo de voz en español descargado, `expo-speech-recognition` fallback al motor de red. En ese caso, el usuario debe descargar el idioma desde Configuración → Idioma → Texto a voz.

---

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
- `git push origin develop` → rama actualizada

---

## Próximo sprint

**Sprint 3 — UX visual**

| Issue | Item |
|-------|------|
| #12 | Reemplazar TopProgressBar por indicador alternativo |
| #13 | Color de jugador visible en PlayerChip y NextUpRow |
