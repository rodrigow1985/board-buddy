# Arquitectura

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Framework | React Native + Expo | Cross-platform (iOS/Android), ecosistema maduro, Expo simplifica builds y permisos |
| Routing | Expo Router | File-based routing, navegación nativa, deep linking gratis |
| Estado global | Zustand | Liviano, sin boilerplate, fácil de extender por módulo |
| Persistencia | AsyncStorage | Suficiente para configuración; no requiere base de datos |
| Animaciones | Reanimated 2 | Animaciones en el hilo nativo, sin janks; crítico para la barra del temporizador |
| Reconocimiento de voz | expo-speech-recognition | API consistente en iOS/Android, modo continuo soportado |
| Audio | expo-av | Reproducción del sonido de alerta al vencer el tiempo |
| Vibración | expo-haptics | Feedback táctil al vencer el tiempo |
| TypeScript | Estricto | Tipos en toda la base de código |
| Tests | Jest + RNTL | Unit tests para lógica de timer, integración para flujos críticos |

---

## Estructura de carpetas

```
temporizador-juegos/
│
├── app/                          # Expo Router — define las rutas/pantallas
│   ├── _layout.tsx               # Layout raíz: proveedores, tema
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
│   │   │   ├── TimerDisplay.tsx  # Los segundos grandes en el centro
│   │   │   ├── ProgressBar.tsx   # Barra de progreso vertical (Reanimated)
│   │   │   ├── TimerControls.tsx # Botones Pause/Reset/Skip
│   │   │   └── PlayerLabel.tsx   # Nombre del jugador actual + siguiente
│   │   ├── common/
│   │   │   ├── NumberStepper.tsx # Control +/- para tiempo y jugadores
│   │   │   ├── PlayerRow.tsx     # Fila editable de jugador en config
│   │   │   └── Toggle.tsx        # Toggle ON/OFF
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
│       ├── colors.ts             # Paleta de colores (tema claro/oscuro)
│       ├── sizes.ts              # Espaciados, tipografías
│       └── defaults.ts           # Valores predeterminados de configuración
│
├── assets/
│   ├── sounds/
│   │   └── timer-end.mp3         # Sonido al vencer el tiempo
│   ├── fonts/
│   └── images/
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
  turnDuration: number;        // segundos totales por turno (ej: 120)
  players: Player[];           // lista de jugadores en orden
  voiceEnabled: boolean;       // detección de voz activa
  triggerWord: string;         // palabra que activa el paso (ej: "paso")
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface Player {
  id: string;                  // uuid generado al crear
  name: string;                // "Rodrigo", "Jugador 2", etc.
}
```

### TimerState (estado en curso)

```typescript
interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'finished';
  currentPlayerIndex: number;  // índice en GameSetup.players
  timeRemaining: number;       // segundos restantes en este turno
  turnHistory: TurnRecord[];   // historial de la sesión
}

interface TurnRecord {
  playerId: string;
  endReason: 'voice' | 'button' | 'timeout';
  duration: number;            // segundos que duró el turno
}
```

### AppSettings (preferencias globales)

```typescript
interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'es' | 'en';
  voiceSensitivity: number;    // 0.0 - 1.0
  defaultTurnDuration: number; // para nuevas partidas
  defaultPlayerCount: number;
}
```

---

## Decisiones de diseño

### ¿Por qué Zustand y no Context/Redux?

- **Context** causa re-renders en cascada; el temporizador actualiza el estado cada segundo, lo que haría que toda la pantalla re-renderice innecesariamente.
- **Redux** agrega boilerplate injustificado para una app de este tamaño.
- **Zustand** permite subscriptions selectivas: `ProgressBar` suscribe solo a `timeRemaining`, `PlayerLabel` solo a `currentPlayerIndex`. Cada componente re-renderiza solo cuando cambia lo suyo.

### ¿Por qué Reanimated 2 para la barra?

La barra de progreso necesita 60fps sin janks. Reanimated 2 corre en el hilo de UI nativo (no en el hilo JS), por lo que `setInterval` del timer en JS no bloquea la animación.

### ¿Por qué temporizador en background?

El juego puede durar 30-60 minutos. Si el dispositivo apaga la pantalla o el usuario cambia de app momentáneamente, el timer no debe detenerse. Se usa `AppState` de React Native para detectar el cambio y compensar el tiempo transcurrido.

### Escalabilidad a nuevos juegos

Cada juego es una carpeta independiente dentro de `app/games/`. Puede tener su propio store, sus propias pantallas y sus propios hooks. La infraestructura compartida (componentes `common/`, `layout/`, `settingsStore`) es agnóstica al juego. Para agregar un nuevo juego no se toca código existente.

---

## Permisos requeridos

| Permiso | Plataforma | Uso |
|---------|------------|-----|
| `RECORD_AUDIO` | Android | Reconocimiento de voz |
| `NSMicrophoneUsageDescription` | iOS | Reconocimiento de voz |
| `NSSpeechRecognitionUsageDescription` | iOS | API de reconocimiento |
| `VIBRATE` | Android | Feedback haptic (no requiere prompt) |

---

## Consideraciones de rendimiento

- El `setInterval` del countdown corre cada 100ms (no cada 1000ms) para mayor precisión visual, pero solo actualiza el estado cuando el segundo cambia.
- La animación de la barra usa `useSharedValue` + `withTiming` de Reanimated: calcula la posición en el hilo nativo sin pasar por JS cada frame.
- El reconocimiento de voz usa un worker separado del hilo del temporizador para no introducir latencia.
