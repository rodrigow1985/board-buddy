# Plan de Desarrollo — MVP

## Fases acordadas

| # | Fase | Estado |
|---|------|--------|
| 1 | Setup del proyecto | Pendiente |
| 2 | Lógica del temporizador (núcleo) | Pendiente |
| 3 | Pantalla del temporizador | Pendiente |
| 4 | Detección de voz | Pendiente |
| 5 | Configuración de partida + persistencia | Pendiente |

---

## Fase 1 — Setup del proyecto

**Objetivo:** Tener la base del proyecto corriendo con hot reload antes de escribir lógica de negocio.

**Tareas:**
- [ ] Inicializar proyecto con `npx create-expo-app` + TypeScript
- [ ] Instalar dependencias del stack:
  - `zustand`
  - `react-native-reanimated`
  - `expo-speech-recognition`
  - `expo-av`
  - `expo-haptics`
  - `@react-native-async-storage/async-storage`
- [ ] Configurar Expo Router (file-based routing)
- [ ] Crear estructura de carpetas según `docs/desarrollo/arquitectura.md`
- [ ] Configurar ESLint + TypeScript estricto (`strict: true` en tsconfig)
- [ ] Verificar que corre en Expo Go y en modo web
- [ ] Commit inicial: `chore: inicializar proyecto expo con typescript`

**Criterio de aceptación:** `npx expo start` sin errores, estructura de carpetas creada, TypeScript compilando.

---

## Fase 2 — Lógica del temporizador (núcleo)

**Objetivo:** El corazón de la app funcionando y testeado antes de tocar UI.

**Tareas:**
- [ ] `src/utils/time.ts` — formateo `MM:SS`, conversiones de segundos
- [ ] `src/utils/players.ts` — lógica de rotación de jugadores
- [ ] `src/store/gameSetupStore.ts` — configuración de partida (Zustand)
- [ ] `src/store/timerStore.ts` — estado del temporizador en curso (Zustand)
- [ ] `src/hooks/useCountdown.ts` — countdown con `setInterval` a 100ms, precisión al segundo
- [ ] `src/hooks/useBackgroundTimer.ts` — compensación de tiempo cuando la app va a background (`AppState`)
- [ ] Tests unitarios para `useCountdown` y la lógica de rotación

**Criterio de aceptación:** El timer cuenta hacia atrás con precisión, rota jugadores correctamente, sigue corriendo si la app va a background. Tests en verde.

---

## Fase 3 — Pantalla del temporizador

**Objetivo:** La pantalla principal inmersiva, fluida y con todos sus estados visuales.

**Tareas:**
- [ ] `src/components/timer/ProgressBar.tsx` — barra vertical con Reanimated 2 (`useSharedValue` + `withTiming`)
- [ ] `src/components/timer/TimerDisplay.tsx` — segundos grandes centrados (`MM:SS`, ≥80pt)
- [ ] `src/components/timer/PlayerLabel.tsx` — nombre del jugador actual + "Sigue: X"
- [ ] `src/components/timer/TimerControls.tsx` — botones Pausar / Reiniciar turno / Pasar turno
- [ ] `app/games/rummikub/timer.tsx` — pantalla que ensambla todos los componentes
- [ ] Estados de color: verde (corriendo) → naranja (≤20% restante) → rojo (agotado)
- [ ] Animación de transición de turno: slide horizontal entre jugadores
- [ ] Flash rojo + vibración + sonido al vencer el tiempo (RF-04)
- [ ] Banner "PARTIDA EN PAUSA" en estado pausado

**Criterio de aceptación:** La pantalla se ve y siente fluida a 60fps. Todos los estados visuales funcionan. La animación de transición no tiene janks.

---

## Fase 4 — Detección de voz

**Objetivo:** La feature diferencial del MVP: pasar turno diciendo "paso".

**Tareas:**
- [ ] `src/hooks/useVoiceDetection.ts` — integración con `expo-speech-recognition` en modo continuo
- [ ] Conectar detección de "paso" al mismo action que el botón "Pasar turno"
- [ ] Indicador de estado del micrófono en la pantalla del timer (verde / gris / rojo)
- [ ] Solicitud de permisos de micrófono al iniciar la partida
- [ ] Fallback graceful si se deniegan los permisos (flujo 6 de `docs/producto/flujos-usuario.md`)
- [ ] Pausar el reconocimiento cuando el temporizador está en pausa

**Criterio de aceptación:** Decir "paso" en voz normal cambia el turno. El micrófono indica su estado. Si se deniegan los permisos, la app sigue funcionando solo con botones.

---

## Fase 5 — Configuración de partida + persistencia

**Objetivo:** El flujo completo desde home hasta el juego, con datos reales y persistidos.

**Tareas:**
- [ ] `src/store/settingsStore.ts` — preferencias globales con AsyncStorage
- [ ] `src/components/common/NumberStepper.tsx` — control +/- para tiempo y jugadores
- [ ] `src/components/common/PlayerRow.tsx` — fila editable de jugador
- [ ] `src/components/common/Toggle.tsx` — toggle ON/OFF
- [ ] `app/games/rummikub/setup.tsx` — pantalla de configuración de partida (RF-01)
- [ ] `app/games/rummikub/summary.tsx` — pantalla de resumen con historial (RF-07)
- [ ] `app/index.tsx` — home / selector de juego
- [ ] Persistencia de configuración con AsyncStorage
- [ ] Recuperación de partida tras cierre inesperado (flujo 8)

**Criterio de aceptación:** Flujo completo funcionando de punta a punta: Home → Configurar → Jugar → Resumen → Home. La configuración persiste entre sesiones.

---

## Decisiones de desarrollo

- **Config hardcodeada en Fases 2 y 3:** Usar valores fijos (`turnDuration: 120`, `players: ['Rodrigo', 'Ana']`) para no bloquear el desarrollo del timer con formularios.
- **Expo Go como entorno principal:** Desarrollo y pruebas con Expo Go en dispositivo físico. Modo web (`expo start --web`) para iteración rápida de UI.
- **Tests solo para lógica crítica:** `useCountdown` y la rotación de jugadores. No testear componentes de UI en el MVP.
