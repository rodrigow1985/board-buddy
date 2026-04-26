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

**Severidad:** Alta  
**Descripción:** El countdown avanza más rápido que un segundo real. Un turno de 2 minutos termina antes de los 2 minutos reales.

**Causa probable:** El hook `useCountdown` usa `setInterval` cada 100ms y descuenta el `elapsed` real. El problema puede estar en que el timer se inicia en `idle` y hay un primer tick inmediato, o en que el `elapsed` acumula más de lo esperado por múltiples efectos que se disparan al montar.

**Solución propuesta:**
- Revisar el momento exacto en que `lastTickRef` se inicializa en `useCountdown`
- Asegurarse de que el primer tick no cuenta tiempo desde el montaje del componente sino desde que `status` pasa a `running`
- Agregar logs de diagnóstico para medir la diferencia entre tiempo real y tiempo descontado

**Archivos afectados:** `app/src/hooks/useCountdown.ts`

---

### BUG-02 — No hay sonido en ningún evento

**Severidad:** Alta  
**Descripción:** No suena nada cuando termina el tiempo, ni en ningún otro momento. El archivo `timer-end.mp3` existe pero nunca se reproduce.

**Causa probable:** La integración con `expo-av` nunca fue implementada (quedó pendiente de Fase 3). El store llama a `onTimeout()` pero no hay ningún hook que escuche ese evento y reproduzca audio.

**Solución propuesta:** Crear `useAudio` hook con `expo-av` (o `expo-audio` si SDK 54 lo prefiere). Ver BUG-02 en sección de sonidos para spec completa.

**Archivos afectados:** `app/src/hooks/` (nuevo hook), `app/screens/games/rummikub/timer.tsx`

---

### BUG-03 — Latencia de 2-3 segundos después de decir "paso"

**Severidad:** Media  
**Descripción:** Desde que el jugador dice "paso" hasta que el turno cambia, pasan 2-3 segundos. Interrumpe el flujo del juego.

**Causa probable:**
1. `interimResults: true` está activo pero el pipeline de reconocimiento de Android tarda en emitir el primer resultado parcial
2. El debounce de 1500ms en `lastTriggerRef` podría estar bloqueando resultados intermedios que deberían disparar inmediatamente

**Solución propuesta:**
- Bajar el debounce de 1500ms a 800ms (tiempo suficiente para evitar doble disparo, más corto para mejorar respuesta)
- Escuchar el evento `result` con `isFinal: false` también, no solo los finales
- Evaluar si `lang: 'es-AR'` vs `'es-ES'` afecta la velocidad del motor de reconocimiento en el dispositivo

**Archivos afectados:** `app/src/hooks/useVoiceDetection.ts`

---

### BUG-04 — Voz no reconoce "paso" cuando el tiempo se agotó

**Severidad:** Media  
**Descripción:** Cuando el temporizador llega a 0 y queda en estado `timeout`, decir "paso" no tiene efecto. Solo funciona el botón.

**Causa probable:** `shouldListen` se calcula como `enabled && permissionRef.current === true && status === 'running'`. El estado `timeout` no está incluido, por lo que el reconocedor se pausa automáticamente.

**Solución propuesta:**
```ts
const shouldListen = enabled && permissionRef.current === true 
  && (status === 'running' || status === 'timeout');
```
La voz debe seguir activa en `timeout` para que el jugador pueda ceder el turno sin tocar el celular.

**Archivos afectados:** `app/src/hooks/useVoiceDetection.ts`

---

### BUG-05 — Chip muestra "Pausado" después de la transición de turno

**Severidad:** Baja  
**Descripción:** Cuando el turno cambia y termina la animación de transición, el chip de voz muestra "Pausado" en lugar de "Escuchando", aunque la voz vuelve a funcionar poco después.

**Causa probable:** `stateRef.current` en `useVoiceDetection` no causa re-renders (es un ref, no state). El componente no se actualiza cuando el reconocedor reinicia. El chip lee `voiceState` que apunta a `stateRef.current` pero como es un ref el valor no se propaga al render.

**Solución propuesta:** Convertir `stateRef` a `useState` para que los cambios de estado del reconocedor provoquen re-renders del chip. Usar `useCallback` para los setters y mantener los refs solo para las flags de control interno (`isRunningRef`, `lastTriggerRef`).

**Archivos afectados:** `app/src/hooks/useVoiceDetection.ts`, `app/screens/games/rummikub/timer.tsx`

---

### BUG-06 — Botón "Pasar turno" requiere dos toques después del timeout

**Severidad:** Alta  
**Descripción:** Cuando el tiempo se agota, el primer toque al botón "Pasar turno" no cambia de jugador. Hay que tocarlo dos veces. El primer toque solo "descarta" el timeout sin avanzar.

**Causa probable:** En `handlePassTurn`:
```ts
} else if (status === 'timeout') {
  haptics.impact(Haptics.ImpactFeedbackStyle.Medium);
  endTransition();   // ← solo cierra el timeout, no pasa turno
}
```
Se llama a `endTransition()` en lugar de `passTurn('button')`. La intención era separar los dos eventos pero desde la perspectiva del usuario son la misma acción.

**Solución propuesta:**
```ts
} else if (status === 'timeout') {
  haptics.impact(Haptics.ImpactFeedbackStyle.Medium);
  passTurn('button');   // pasa el turno directamente
}
```
`passTurn` ya maneja la transición internamente.

**Archivos afectados:** `app/screens/games/rummikub/timer.tsx`

---

## Mejoras de UX

### UX-01 — Reemplazar TopProgressBar por indicador de progreso alternativo

**Prioridad:** Media  
**Descripción:** La barra horizontal de 8dp en el top de pantalla no se percibe bien en el dispositivo. El usuario no la nota como indicador de tiempo.

**Opciones a explorar:**
1. **Borde animado** — un borde que rodea la pantalla y se "vacía" en sentido horario
2. **Fondo con degradé** — el color de fondo se oscurece progresivamente conforme pasa el tiempo
3. **Timer como arco circular** — el número grande mantiene su posición central pero un arco circular alrededor se vacía
4. **Sin indicador explícito** — confiar solo en el número grande y los colores de estado (calm → warn → alert)

**Recomendación:** Evaluar la Opción 4 primero. Si el color + número grande son suficientemente informativos, menos elementos = menos ruido visual.

**Archivos afectados:** `app/src/components/timer/TopProgressBar.tsx` (eliminar o refactorizar), `app/screens/games/rummikub/timer.tsx`

---

### UX-02 — Sistema de sonidos en múltiples momentos

**Prioridad:** Alta  
**Descripción:** Agregar audio como capa de feedback temporal, complementando el visual.

**Spec de sonidos:**

| Momento | Sonido | Descripción |
|---------|--------|-------------|
| 50% del tiempo | `tick-mid.mp3` | Sonido suave, solo una vez |
| 20% del tiempo | `tick-warn.mp3` | Tono de advertencia, solo una vez |
| Últimos 10s | `tick-second.mp3` | Tick por cada segundo (10 veces) |
| Tiempo agotado | `timer-end.mp3` | Ya existe en assets |
| Paso exitoso | `pass.mp3` | Confirmación corta al cambiar turno |

**Implementación:**
- Crear `app/src/hooks/useAudio.ts` con `expo-av` (`Audio.Sound`)
- Pre-cargar los sonidos al iniciar la partida
- Respetar el setting `audio.soundOnExpire` del `settingsStore`
- Los ticks de los últimos 10 segundos solo si `timeRemainingMs <= 10_000` y `status === 'running'`

**Archivos afectados:** `app/src/hooks/useAudio.ts` (nuevo), `app/screens/games/rummikub/timer.tsx`, `assets/sounds/` (agregar archivos)

---

### UX-03 — Color de jugador visible en el temporizador

**Prioridad:** Media  
**Descripción:** Todos los turnos se ven iguales. No hay diferenciación visual entre jugadores más allá del nombre.

**Propuesta:**
- El `PlayerChip` (pill con el nombre) usa el `player.color` como fondo en lugar del semitransparente genérico
- El `NextUpRow` (fila "Sigue") también muestra el avatar con el color del siguiente jugador
- Los colores de avatar ya están definidos: `#C24E1B`, `#3F6B5E`, `#7C5C3A`, `#8A4F6B` (se asignan en `createPlayer`)

**Archivos afectados:** `app/src/components/timer/PlayerChip.tsx`, `app/src/components/timer/NextUpRow.tsx`

---

### UX-04 — Registro del ganador al finalizar la partida

**Prioridad:** Baja (MVP+)  
**Descripción:** Al terminar, el jugador que organizó la partida debería poder marcar quién ganó. En esta versión los datos se borran al cerrar la app; en el futuro se podrían persistir con usuarios.

**Spec:**
- En `summary.tsx`: agregar botón/selector "¿Quién ganó?" con chips de cada jugador
- El ganador se destaca en la tabla de resultados con una corona 🏆 o color especial
- Los datos del ganador se guardan en `timerStore.winner` (en RAM, se borra al reiniciar)
- Estructura futura: cuando haya auth, este campo se persistiría en backend

**Archivos afectados:** `app/screens/games/rummikub/summary.tsx`, `app/src/store/timerStore.ts`

---

## Plan de implementación

### Sprint 1 — Bugs críticos (hacer primero)

| # | Item | Esfuerzo | Archivos |
|---|------|----------|---------|
| 1 | BUG-06: Doble toque en timeout | XS | `timer.tsx` |
| 2 | BUG-04: Voz en timeout | XS | `useVoiceDetection.ts` |
| 3 | BUG-01: Segundos rápidos | S | `useCountdown.ts` |
| 4 | BUG-05: Chip "Pausado" post-transición | S | `useVoiceDetection.ts` |

### Sprint 2 — Audio + voz

| # | Item | Esfuerzo | Archivos |
|---|------|----------|---------|
| 5 | BUG-02 + UX-02: Sistema de sonidos | M | nuevo hook + assets |
| 6 | BUG-03: Latencia de voz | S | `useVoiceDetection.ts` |

### Sprint 3 — UX visual

| # | Item | Esfuerzo | Archivos |
|---|------|----------|---------|
| 7 | UX-01: Reemplazar TopProgressBar | M | `TopProgressBar.tsx`, `timer.tsx` |
| 8 | UX-03: Color de jugador en timer | S | `PlayerChip.tsx`, `NextUpRow.tsx` |

### Sprint 4 — Features

| # | Item | Esfuerzo | Archivos |
|---|------|----------|---------|
| 9 | UX-04: Registro del ganador | M | `summary.tsx`, `timerStore.ts` |

---

## Criterios de aceptación generales

- Todos los bugs críticos (Sprint 1) resueltos antes de mostrar la app a otros usuarios
- Los sonidos deben poder silenciarse desde Settings
- La latencia de voz debe ser menor a 1 segundo desde que se dice "paso"
- El chip de voz siempre refleja el estado real del reconocedor
