# Backlog v1 — Bugs y mejoras post-prueba en dispositivo

**Fecha:** 2026-04-26  
**Origen:** Prueba manual en dispositivo Android (Development Build)  
**Rama:** develop

---

## Resumen ejecutivo

Se realizó la primera prueba completa de la app en dispositivo real. El flujo principal funciona: el timer corre, la detección de voz reconoce "paso" y cambia de turno, la UI es legible. Se identificaron 9 puntos a corregir o mejorar, distribuidos entre bugs de lógica, problemas de UX y nuevas funcionalidades.

---

## Bugs

### BUG-01 — Segundos pasan más rápido de lo real

**Issue:** rodrigow1985/board-buddy#8  
**Severidad:** Alta  
**Descripción:** El countdown avanza más rápido que un segundo real. Un turno de 2 minutos termina antes de los 2 minutos reales.

**Causa probable:** El hook `useCountdown` usa `setInterval` cada 100ms y descuenta el `elapsed` real. El problema puede estar en que `lastTickRef` se inicializa en el montaje del componente, antes de que `status` pase a `running`, acumulando tiempo extra en el primer tick.

**Archivos afectados:** `app/src/hooks/useCountdown.ts`

---

### BUG-02 — No hay sonido en ningún evento

**Issue:** rodrigow1985/board-buddy#11  
**Severidad:** Alta  
**Descripción:** No suena nada cuando termina el tiempo, ni en ningún otro momento. La integración con `expo-av` nunca fue implementada.

**Archivos afectados:** `app/src/hooks/` (nuevo hook), `app/screens/games/rummikub/timer.tsx`

---

### BUG-03 — Latencia de 2-3 segundos después de decir "paso"

**Issue:** rodrigow1985/board-buddy#10  
**Severidad:** Media  
**Descripción:** Desde que el jugador dice "paso" hasta que el turno cambia, pasan 2-3 segundos.

**Causa probable:** Debounce de 1500ms demasiado largo + latencia del pipeline de reconocimiento de Android.

**Archivos afectados:** `app/src/hooks/useVoiceDetection.ts`

---

### BUG-04 — Voz no reconoce "paso" cuando el tiempo se agotó

**Issue:** rodrigow1985/board-buddy#7  
**Severidad:** Media  
**Descripción:** En estado `timeout`, decir "paso" no tiene efecto porque `shouldListen` solo se activa para `status === 'running'`.

**Fix:**
```ts
const shouldListen = enabled && permissionRef.current === true 
  && (status === 'running' || status === 'timeout');
```

**Archivos afectados:** `app/src/hooks/useVoiceDetection.ts`

---

### BUG-05 — Chip muestra "Pausado" después de la transición de turno

**Issue:** rodrigow1985/board-buddy#9  
**Severidad:** Baja  
**Descripción:** El chip de voz muestra "Pausado" brevemente después de cada cambio de turno porque `stateRef` es un ref y no causa re-renders.

**Fix:** Convertir `stateRef` a `useState`.

**Archivos afectados:** `app/src/hooks/useVoiceDetection.ts`

---

### BUG-06 — Botón "Pasar turno" requiere dos toques después del timeout

**Issue:** rodrigow1985/board-buddy#6  
**Severidad:** Alta  
**Descripción:** El primer toque solo descarta el timeout sin avanzar al siguiente jugador. Se debe llamar `passTurn('button')` en lugar de `endTransition()`.

**Archivos afectados:** `app/screens/games/rummikub/timer.tsx`

---

## Mejoras de UX

### UX-01 — Reemplazar TopProgressBar por indicador de progreso alternativo

**Issue:** rodrigow1985/board-buddy#12  
**Prioridad:** Media  
**Descripción:** La barra de 8dp en el top no se percibe bien. Opciones: borde animado, degradé de fondo, arco circular, o directamente sin indicador (confiando en color + número).

---

### UX-02 — Sistema de sonidos en múltiples momentos

**Issue:** rodrigow1985/board-buddy#11  
**Prioridad:** Alta  

| Momento | Sonido |
|---------|--------|
| 50% del tiempo | `tick-mid.mp3` (una vez) |
| 20% del tiempo | `tick-warn.mp3` (una vez) |
| Últimos 10 segundos | `tick-second.mp3` (cada segundo) |
| Tiempo agotado | `timer-end.mp3` |
| Paso exitoso | `pass.mp3` |

---

### UX-03 — Color de jugador visible en el temporizador

**Issue:** rodrigow1985/board-buddy#13  
**Prioridad:** Media  
**Descripción:** El `PlayerChip` debería usar `player.color` como fondo para diferenciar visualmente cada turno.

---

### UX-04 — Registro del ganador al finalizar la partida

**Issue:** rodrigow1985/board-buddy#14  
**Prioridad:** Baja  
**Descripción:** Selector de ganador en `summary.tsx`. Dato en RAM (no persiste). Preparado para futura integración con auth de usuarios.

---

## Plan de implementación

### Sprint 1 — Bugs críticos

| Issue | Item | Esfuerzo |
|-------|------|----------|
| #6 | BUG-06: Doble toque en timeout | XS |
| #7 | BUG-04: Voz en timeout | XS |
| #8 | BUG-01: Segundos rápidos | S |
| #9 | BUG-05: Chip "Pausado" post-transición | S |

### Sprint 2 — Audio + voz

| Issue | Item | Esfuerzo |
|-------|------|----------|
| #11 | BUG-02 + UX-02: Sistema de sonidos | M |
| #10 | BUG-03: Latencia de voz | S |

### Sprint 3 — UX visual

| Issue | Item | Esfuerzo |
|-------|------|----------|
| #12 | UX-01: Reemplazar TopProgressBar | M |
| #13 | UX-03: Color de jugador | S |

### Sprint 4 — Features

| Issue | Item | Esfuerzo |
|-------|------|----------|
| #14 | UX-04: Registro del ganador | M |
