# Arquitectura

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Framework | React Native + Expo | Cross-platform (iOS/Android), ecosistema maduro, Expo simplifica builds y permisos |
| Routing | Expo Router | File-based routing, navegación nativa, deep linking gratis |
| Estado global | Zustand | Liviano, sin boilerplate, fácil de extender por módulo |
| Persistencia | AsyncStorage | Suficiente para configuración; no requiere base de datos |
| Animaciones | Reanimated 2 | Animaciones en el hilo nativo, sin janks; crítico para la barra del temporizador |
| Reconocimiento de voz | expo-speech-recognition | API consistente en iOS/Android, modo continuo soportado, compatible con Expo managed workflow |
| Audio | expo-av | Reproducción del sonido de alerta al vencer el tiempo |
| Vibración | expo-haptics | Feedback táctil al vencer el tiempo |
| Tipografía | @expo-google-fonts/inter, /fraunces, /jetbrains-mono | Fuentes del diseño; cargadas con `useFonts()` de expo-font |
| TypeScript | Estricto | Tipos en toda la base de código |
| Tests | Jest + RNTL | Unit tests para lógica de timer, integración para flujos críticos |

---

## Estructura de carpetas

```
board-buddy/
│
├── app/                          # Expo Router — define las rutas/pantallas
│   ├── _layout.tsx               # Layout raíz: carga de fuentes, proveedores, SplashScreen
│   ├── index.tsx                 # Home / selector de juego
│   ├── settings.tsx              # Configuración global
│   └── games/
│       └── rummikub/
│           ├── _layout.tsx       # Layout del módulo Rummikub
│           ├── setup.tsx         # Configuración de partida
│           ├── timer.tsx         # Pantalla del temporizador (pantalla principal)
│           └── summary.tsx       # Resumen de partida
│
├── src/
│   ├── components/               # Componentes de UI reutilizables
│   │   ├── timer/
│   │   │   ├── TopProgressBar.tsx  # Barra horizontal 8dp, top: 0 (Reanimated 2)
│   │   │   ├── TimerDisplay.tsx    # Número gigante Fraunces 168sp, tabular-nums
│   │   │   ├── PlayerChip.tsx      # Pill con nombre del jugador actual
│   │   │   ├── NextUpRow.tsx       # "Sigue" + avatar + nombre siguiente jugador
│   │   │   ├── TimerControls.tsx   # Botones Pause/Reset/Skip (64dp alto)
│   │   │   └── VoiceHint.tsx       # Pill flotante bottom-right "decí 'paso'"
│   │   ├── common/
│   │   │   ├── NumberStepper.tsx   # Control +/- para tiempo y jugadores
│   │   │   ├── PlayerRow.tsx       # Fila editable de jugador en config
│   │   │   ├── ToggleRow.tsx       # Fila con ícono + título + toggle
│   │   │   ├── Toggle.tsx          # Toggle ON/OFF 46×28dp
│   │   │   ├── NavRow.tsx          # Fila label + valor + chevron (Settings)
│   │   │   ├── Slider.tsx          # Slider de sensibilidad de voz
│   │   │   ├── GameCard.tsx        # Card de juego en Home
│   │   │   └── Stat.tsx            # Valor Fraunces + label overline (footer Home)
│   │   └── layout/
│   │       └── ScreenContainer.tsx
│   │
│   ├── store/                    # Zustand stores
│   │   ├── timerStore.ts         # Estado del temporizador en curso
│   │   ├── gameSetupStore.ts     # Configuración de la partida actual
│   │   └── settingsStore.ts      # Preferencias globales (persiste)
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useCountdown.ts       # Lógica del countdown con setInterval
│   │   ├── useVoiceDetection.ts  # Integración expo-speech-recognition
│   │   ├── useHaptics.ts         # Feedback táctil
│   │   └── useBackgroundTimer.ts # Timer que sigue en background
│   │
│   ├── utils/
│   │   ├── time.ts               # Formateo MM:SS, conversiones
│   │   └── players.ts            # Lógica de rotación de jugadores
│   │
│   └── constants/
│       ├── tokens.ts             # Design tokens unificados: colores, radii, tipografía, shadows, spacing
│       └── defaults.ts           # Valores predeterminados de configuración
│
├── assets/
│   ├── sounds/
│   │   └── timer-end.mp3         # Sonido al vencer el tiempo (~1s, tono suave)
│   ├── fonts/                    # (vacío — fuentes vienen de @expo-google-fonts)
│   └── images/
│
├── design/
│   └── handoff_board_buddy/      # Archivos de referencia visual (no son código de producción)
│       ├── README.md
│       └── source/               # screens.jsx, timer-variants.jsx, etc.
│
├── docs/                         # Esta carpeta
├── CLAUDE.md
├── app.json
├── package.json
└── tsconfig.json
```

---

## Modelo de datos

### GameSetup (configuración de partida)

```typescript
interface GameSetup {
  turnDurationMs: number;      // milisegundos por turno (ej: 120_000)
  players: Player[];           // lista de jugadores en orden
  voiceEnabled: boolean;       // detección de voz activa
  triggerWord: string;         // palabra que activa el paso (ej: "paso")
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface Player {
  id: string;                  // uuid generado al crear
  name: string;                // "Rodrigo", "Jugador 2", etc.
  color: string;               // uno de los 4 colores de avatar: #C24E1B | #3F6B5E | #7C5C3A | #8A4F6B
}
```

### TimerState (estado en curso)

```typescript
interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'timeout' | 'transitioning' | 'finished';
  currentPlayerIndex: number;  // índice en GameSetup.players
  timeRemainingMs: number;     // milisegundos restantes en este turno
  turnHistory: TurnRecord[];   // historial de la sesión (en memoria, no persiste)
  startedAt: number | null;    // timestamp de inicio de la sesión
}

// warn no es un estado del store — se deriva:
// isWarn = timeRemainingMs / turnDurationMs <= 0.2 && status === 'running'

interface TurnRecord {
  playerId: string;
  endReason: 'voice' | 'button' | 'timeout';
  durationMs: number;          // milisegundos que duró el turno
}
```

### AppSettings (preferencias globales)

```typescript
interface AppSettings {
  voice: {
    enabled: boolean;
    triggerWord: string;       // "paso" por defecto
    sensitivity: number;       // 0.0 - 1.0
  };
  audio: {
    soundOnExpire: boolean;
    vibration: boolean;
  };
  ui: {
    theme: 'system' | 'light' | 'dark';
    language: 'es' | 'en';
    textSize: 'sm' | 'md' | 'lg';
  };
}
```

---

## Decisiones de diseño

### ¿Por qué Zustand y no Context/Redux?

- **Context** causa re-renders en cascada; el temporizador actualiza el estado cada segundo, lo que haría que toda la pantalla re-renderice innecesariamente.
- **Redux** agrega boilerplate injustificado para una app de este tamaño.
- **Zustand** permite subscriptions selectivas: `TopProgressBar` suscribe solo a `timeRemainingMs`, `PlayerChip` solo a `currentPlayerIndex`. Cada componente re-renderiza solo cuando cambia lo suyo.

### ¿Por qué Reanimated 2 para la barra de progreso?

La `TopProgressBar` es una barra horizontal que corre continuamente durante toda la partida. Reanimated 2 ejecuta la animación en el hilo de UI nativo (no en el hilo JS), por lo que el `setInterval` del timer en JS no bloquea la animación. Se usa `useSharedValue` + `withTiming` con easing lineal.

> La barra es **horizontal** (8dp de alto, `position: absolute, top: 0`), no vertical. El diseño final elegido es la Variante A del handoff.

### ¿Por qué `timeRemainingMs` en milisegundos y no segundos?

El `setInterval` corre cada 100ms para mayor precisión. Guardar en ms evita conversiones y permite detectar el umbral del 20% con precisión (`timeRemainingMs / turnDurationMs ≤ 0.2`).

### ¿Por qué temporizador en background?

El juego puede durar 30-60 minutos. Si el dispositivo apaga la pantalla o el usuario cambia de app momentáneamente, el timer no debe detenerse. Se usa `AppState` de React Native para detectar el cambio y compensar el tiempo transcurrido con `Date.now()`.

### Escalabilidad a nuevos juegos

Cada juego es una carpeta independiente dentro de `app/games/`. Puede tener su propio store, sus propias pantallas y sus propios hooks. La infraestructura compartida (componentes `common/`, `layout/`, `settingsStore`) es agnóstica al juego. Para agregar un nuevo juego no se toca código existente.

---

## Permisos requeridos

| Permiso | Plataforma | Uso |
|---------|------------|-----|
| `RECORD_AUDIO` | Android | Reconocimiento de voz |
| `NSMicrophoneUsageDescription` | iOS | Reconocimiento de voz |
| `NSSpeechRecognitionUsageDescription` | iOS | API de reconocimiento |
| `VIBRATE` | Android | Feedback haptic (no requiere prompt al usuario) |

Configurar en `app.json` bajo `expo.android.permissions` (Android) y `expo.ios.infoPlist` (iOS) antes de correr en dispositivo físico.

---

## Consideraciones de rendimiento

- El `setInterval` del countdown corre cada 100ms para mayor precisión visual, pero solo actualiza el estado cuando el segundo cambia.
- La animación de la barra usa `useSharedValue` + `withTiming` de Reanimated 2: calcula la posición en el hilo nativo sin pasar por JS cada frame.
- El reconocimiento de voz corre en un proceso separado del sistema operativo; `expo-speech-recognition` expone callbacks que se procesan en el hilo JS sin afectar la animación.
