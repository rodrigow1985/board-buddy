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
  - `@expo-google-fonts/inter`
  - `@expo-google-fonts/fraunces`
  - `@expo-google-fonts/jetbrains-mono`
  - `expo-font`
- [ ] Configurar Expo Router (file-based routing)
- [ ] Crear estructura de carpetas según `docs/desarrollo/arquitectura.md`
- [ ] Crear `src/constants/tokens.ts` con todos los design tokens del handoff:
  - Paleta de colores (`bg`, `surface`, `ink`, `terracotta`, `calm`, `warn`, `alert`, etc.)
  - Radii (`sm: 10`, `md: 16`, `lg: 18`, `pill: 100`)
  - Familias tipográficas (`sans: 'Inter'`, `display: 'Fraunces'`, `mono: 'JetBrainsMono'`)
  - Shadows (hairline lift y toggle thumb)
  - Hit-target mínimo (`48`)
- [ ] Configurar ESLint + TypeScript estricto (`strict: true` en tsconfig)
- [ ] Agregar `assets/sounds/timer-end.mp3` — tono suave de alerta (~1s). Conseguir antes de Fase 3.
- [ ] Verificar que corre en Expo Go y en modo web
- [ ] Commit inicial: `chore: inicializar proyecto expo con typescript`

**Criterio de aceptación:** `npx expo start` sin errores, estructura de carpetas creada, TypeScript compilando, tokens disponibles como constantes importables, archivo de sonido en su lugar.

---

## Fase 2 — Lógica del temporizador (núcleo)

**Objetivo:** El corazón de la app funcionando y testeado antes de tocar UI.

**Tareas:**
- [ ] `src/utils/time.ts` — formateo `MM:SS`, conversiones de segundos
- [ ] `src/utils/players.ts` — lógica de rotación de jugadores
- [ ] `src/store/gameSetupStore.ts` — configuración de partida (Zustand)
- [ ] `src/store/timerStore.ts` — estado del temporizador en curso (Zustand)

  El store debe modelar exactamente esta forma:
  ```ts
  // Sesión de juego
  {
    gameId: 'rummikub',
    players: [{
      id: string,
      name: string,
      color: string,           // uno de los 4 colores de avatar del handoff
      turns: number,
      passesByVoice: number,
      passesByButton: number,
    }],
    currentPlayerIndex: number,
    turnDurationMs: 120_000,
    timeRemainingMs: number,
    status: 'idle' | 'running' | 'paused' | 'timeout' | 'transitioning' | 'finished',
    startedAt: number | null,  // timestamp
  }
  ```

  Estados del timer (state machine):
  ```
  idle → running → (≤20%) warn* → timeout → running (mismo jugador, reset)
                   ↘ paused ↗
                   ↘ transitioning → running (siguiente jugador)
  ```
  *`warn` no es un estado separado en el store — es derivado de `timeRemainingMs / turnDurationMs ≤ 0.2` mientras `status === 'running'`

- [ ] `src/hooks/useCountdown.ts` — countdown con `setInterval` a 100ms, precisión al segundo. Debe disparar transición a `timeout` al llegar a 0.
- [ ] `src/hooks/useBackgroundTimer.ts` — compensación de tiempo cuando la app va a background (`AppState`)
- [ ] Tests unitarios para `useCountdown` y la lógica de rotación

**Criterio de aceptación:** El timer cuenta hacia atrás con precisión, rota jugadores correctamente, sigue corriendo si la app va a background, el estado `transitioning` se activa al pasar turno. Tests en verde.

---

## Fase 3 — Pantalla del temporizador

**Objetivo:** La pantalla principal inmersiva, fluida y con todos sus estados visuales.

**Referencia visual:** Variante A del handoff (`timer-variants.jsx` — `S3_Timer_A_Running`). Fondo full-bleed de color según estado, barra de progreso horizontal en el top.

**Tareas:**
- [ ] Cargar fuentes en `app/_layout.tsx` con `useFonts()` de Expo Google Fonts (Inter, Fraunces, JetBrainsMono). Bloquear render hasta que las fuentes estén listas (`SplashScreen.preventAutoHideAsync`).
- [ ] `src/components/timer/TopProgressBar.tsx` — barra horizontal 8dp en `position: absolute, top: 0`. Fondo `rgba(0,0,0,.18)`, fill blanco, animada con **Reanimated 2** (`useSharedValue` + `withTiming`, easing linear). *Barra horizontal, NO vertical.*
- [ ] `src/components/timer/TimerDisplay.tsx` — número gigante en Fraunces 168sp, `fontVariant: ['tabular-nums']`, color blanco. Opacity 0.55 en estado pausado.
- [ ] `src/components/timer/PlayerChip.tsx` — pill con nombre en uppercase, bg `rgba(0,0,0,.18)`, border `rgba(255,255,255,.18)`.
- [ ] `src/components/timer/NextUpRow.tsx` — label "Sigue" + avatar 26dp con inicial + nombre.
- [ ] `src/components/timer/TimerControls.tsx` — 3 botones de 64dp de alto, radius 18. Primario (bg blanco, ícono ink), secundarios (bg `rgba(255,255,255,.16)`, ícono blanco). El primario alterna entre pause/play según estado.
- [ ] `src/components/timer/VoiceHint.tsx` — pill flotante bottom-right `decí "paso"` en JetBrainsMono 11sp.
- [ ] `app/games/rummikub/timer.tsx` — pantalla que ensambla todos los componentes
- [ ] Estados de color via tokens: `calm` → `warn` (≤20%) → `alert` (timeout) → `paused`
- [ ] Transición de color de fondo entre estados: 250ms ease-in-out
- [ ] Animación warn: pulso suave en la barra (opacity 1↔0.85, 800ms loop)
- [ ] Animación de transición de turno (Pantalla 7):
  - Render simultáneo de dos slots con `Animated.View`
  - Jugador saliente: `translateX(-58%)`, opacity 0.45
  - Jugador entrante: `translateX(8%)`, opacity 1, timer reiniciado a 2:00
  - Duración 400ms ease-out; botones con opacity 0.6 durante la transición
- [ ] Flash rojo + vibración + sonido al vencer el tiempo (estado `alert`, 300ms)
- [ ] Banner "PARTIDA EN PAUSA" en estado pausado (pill `rgba(255,255,255,.14)`)
- [ ] Chip top-left: "Escuchando" (dot verde `#7BE0A8`) / "Pausado" (dot blanco/opaco) / "Cambiando turno" (durante transición)

**Criterio de aceptación:** La pantalla se ve y siente fluida a 60fps. Todos los estados visuales funcionan. Las fuentes Fraunces y JetBrainsMono se renderizan correctamente. La animación de transición no tiene janks.

---

## Fase 4 — Detección de voz

**Objetivo:** La feature diferencial del MVP: pasar turno diciendo "paso".

**Librería elegida:** `expo-speech-recognition`. Compatible con Expo managed workflow, soporta modo continuo en Android e iOS sin configuración nativa adicional.

**Tareas:**
- [ ] `src/hooks/useVoiceDetection.ts` — integración con la librería elegida en modo continuo
- [ ] Conectar detección de "paso" al mismo action que el botón "Pasar turno"
- [ ] Actualizar chip top-left según estado real del listener (verde / gris)
- [ ] Solicitud de permisos de micrófono al iniciar la partida
- [ ] Fallback graceful si se deniegan los permisos: snackbar "Sin acceso al micrófono. Podés usar los botones para pasar turno." con acciones [Ir a ajustes] [Continuar]
- [ ] Pausar el reconocimiento cuando `status === 'paused'`

**Criterio de aceptación:** Decir "paso" en voz normal cambia el turno. El chip indica el estado real. Si se deniegan los permisos, la app sigue funcionando solo con botones.

---

## Fase 5 — Configuración de partida + persistencia

**Objetivo:** El flujo completo desde home hasta el juego, con datos reales y persistidos.

**Tareas:**
- [ ] `src/store/settingsStore.ts` — preferencias globales con AsyncStorage. Shape:
  ```ts
  {
    voice: { enabled: boolean, triggerWord: 'paso', sensitivity: 0.5 },
    audio: { soundOnExpire: boolean, vibration: boolean },
    ui:    { theme: 'system'|'light'|'dark', language: 'es'|'en', textSize: 'sm'|'md'|'lg' },
  }
  ```
- [ ] `src/components/common/NumberStepper.tsx` — control +/−. Valor en JetBrainsMono 30sp tabular. Botón `−` outline, botón `+` filled terracotta, ambos 44dp.
- [ ] `src/components/common/PlayerRow.tsx` — fila editable: avatar circular 36dp con inicial (color rota entre los 4 del handoff) + nombre + botón edit.
- [ ] `src/components/common/ToggleRow.tsx` — fila con ícono 36dp en cream, título + subtítulo, toggle a la derecha.
- [ ] `src/components/common/Toggle.tsx` — toggle 46×28dp. ON: terracotta, OFF: `#D9D2C5`. Thumb 22dp blanco con shadow. Animación 180ms.
- [ ] `src/components/common/NavRow.tsx` — fila label + valor opcional + chevron. Para Settings.
- [ ] `src/components/common/Slider.tsx` — track 4dp hairline + fill terracotta + thumb 24dp blanco con borde terracotta. Para sensibilidad de voz.
- [ ] `src/components/common/GameCard.tsx` — card de juego en Home. Activa: bg surface + shadow lift + ícono terracotta. Inactiva: bg cream, opacity 0.55.
- [ ] `src/components/common/Stat.tsx` — valor en Fraunces 22 + label overline 11sp. Para footer de Home.
- [ ] `app/games/rummikub/setup.tsx` — pantalla de configuración de partida
- [ ] `app/games/rummikub/summary.tsx` — resumen con tabla de jugadores (desglose voz/botón por jugador) + card MVP highlight (% pasos por voz)
- [ ] `app/index.tsx` — Home con: header "Board Buddy" en Fraunces 36, game cards, footer stats (Partidas / Horas / Pasos por voz)
- [ ] Resume banner en Home — card terracottaSoft con "Continuar partida · Turno de [nombre] · [tiempo] restantes". Solo visible cuando hay partida persistida en curso.
- [ ] Persistencia de configuración y sesión con AsyncStorage
- [ ] Recuperación de partida tras cierre inesperado (flujo 8)

**Criterio de aceptación:** Flujo completo de punta a punta: Home → Configurar → Jugar → Resumen → Home. La configuración persiste entre sesiones. El resume banner aparece si se cierra y reabre la app con una partida en curso.

---

## Decisiones de desarrollo

- **Config hardcodeada en Fases 2 y 3:** Usar valores fijos (`turnDuration: 120`, `players: ['Rodrigo', 'Ana']`) para no bloquear el desarrollo del timer con formularios.
- **Expo Go como entorno principal:** Desarrollo y pruebas con Expo Go en dispositivo físico. Modo web (`expo start --web`) para iteración rápida de UI.
- **Tests solo para lógica crítica:** `useCountdown` y la rotación de jugadores. No testear componentes de UI en el MVP.
- **Variante de timer:** Se elige la **Variante A** ("Wall", forest green, barra horizontal) como diseño del timer. Las variantes B, C y D quedan documentadas en el handoff como alternativas futuras.
- **Librería de voz:** `expo-speech-recognition`. Elegida por compatibilidad con Expo managed workflow y soporte de modo continuo en Android e iOS sin config adicional.
