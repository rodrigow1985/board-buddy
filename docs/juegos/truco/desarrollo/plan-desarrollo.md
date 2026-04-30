# Plan de Desarrollo — Truco Argentino

## Resumen

Marcador inteligente con reconocimiento de voz. La app escucha los cantos de la partida, muestra qué está en juego, y espera confirmación del jugador para actualizar el puntaje.

## Infraestructura reutilizable de Rummikub

| Componente | Estado | Adaptación necesaria |
|------------|--------|---------------------|
| `useVoiceDetection` | Existente | Soportar múltiples palabras clave en lugar de una sola |
| `useAudio` | Existente | Agregar sonidos nuevos (canto detectado, victoria) |
| `useHaptics` | Existente | Ninguna — se usa tal cual |
| `expo-speech-recognition` | Instalado | Ninguna |
| `expo-navigation-bar` | Instalado | Sincronizar con colores del marcador |
| Design tokens | Existentes | Agregar paleta de colores para Truco |
| Componentes common | Existentes | Reutilizar Toggle, Stepper, NavRow |
| `settingsStore` | Existente | Extender con config de Truco |
| `SplashAnimation` | Existente | Ninguna |

## Fases

| # | Fase | Dependencia | Estimación |
|---|------|-------------|------------|
| 1 | Store y modelo de datos | — | |
| 2 | Pantalla de setup | Fase 1 | |
| 3 | Marcador (UI estática) | Fase 1 | |
| 4 | Máquina de estados de cantos | Fase 1 | |
| 5 | Voz multi-palabra | Fase 4 | |
| 6 | Flujo de confirmación | Fases 3 + 4 | |
| 7 | Persistencia y resumen | Fases 3 + 6 | |

---

## Fase 1 — Store y modelo de datos

**Objetivo:** definir el store de Zustand con toda la lógica de una partida de Truco.

### Modelo de datos

```ts
interface TrucoTeam {
  name: string;
  score: number;           // 0–30
}

type TrucoPhase = 'malas' | 'buenas';

// Cantos posibles
type EnvidoLevel = 'envido' | 'real_envido' | 'falta_envido';
type TrucoLevel = 'truco' | 'retruco' | 'vale_cuatro';
type FlorLevel = 'flor' | 'contra_flor' | 'contra_flor_al_resto';

type CantoStatus = 'pending' | 'accepted' | 'rejected';

interface ActiveCanto {
  type: 'envido' | 'truco' | 'flor';
  level: EnvidoLevel | TrucoLevel | FlorLevel;
  status: CantoStatus;
  calledBy: 0 | 1;        // índice del equipo
  pointsIfAccepted: number;
  pointsIfRejected: number;
}

type HandStatus =
  | 'idle'               // sin mano activa
  | 'playing'            // mano en curso, sin cantos
  | 'canto_pending'      // se detectó un canto, esperando respuesta
  | 'resolving'          // canto resuelto, esperando confirmación de quién ganó
  | 'confirming'         // mostrando puntos a asignar, esperando confirmación
  | 'hand_complete';     // mano terminada, puntos asignados

interface TrucoHand {
  status: HandStatus;
  envidoHistory: EnvidoLevel[];       // cantos de envido acumulados
  trucoLevel: TrucoLevel | null;      // nivel actual de truco
  florPlayed: boolean;
  activeCanto: ActiveCanto | null;    // canto pendiente de respuesta
  pendingPoints: {                    // puntos esperando confirmación
    team: 0 | 1;
    amount: number;
    reason: string;
  } | null;
  accumulatedPoints: Array<{          // puntos confirmados en esta mano
    team: 0 | 1;
    amount: number;
    reason: string;
  }>;
}

interface TrucoState {
  // Configuración
  teams: [TrucoTeam, TrucoTeam];
  targetScore: 15 | 30;
  florEnabled: boolean;
  voiceEnabled: boolean;

  // Estado de la partida
  gameStatus: 'setup' | 'playing' | 'finished';
  currentHand: TrucoHand;
  handNumber: number;
  winner: 0 | 1 | null;

  // Historial
  history: Array<{
    handNumber: number;
    points: Array<{ team: 0 | 1; amount: number; reason: string }>;
  }>;
}
```

### Acciones del store

```ts
interface TrucoActions {
  // Setup
  initGame: (config: TrucoConfig) => void;

  // Mano
  startHand: () => void;
  endHand: () => void;

  // Cantos
  registerCanto: (type: 'envido' | 'truco' | 'flor', level: string, calledBy: 0 | 1) => void;
  respondCanto: (response: 'accepted' | 'rejected') => void;

  // Resolución
  assignWinner: (team: 0 | 1) => void;
  confirmPoints: () => void;
  cancelPoints: () => void;

  // Manual
  addManualPoints: (team: 0 | 1, amount: number, reason: string) => void;
  undoLastPoints: () => void;

  // Partida
  resetGame: () => void;
}
```

### Criterios de aceptación

- [ ] `trucoStore` creado con estado inicial y todas las acciones
- [ ] Lógica de cálculo de puntos según tablas del reglamento
- [ ] Transiciones de `HandStatus` validadas (no se puede cantar truco si hay envido pendiente sin resolver)
- [ ] Detección de victoria (equipo llega a targetScore)
- [ ] Tests unitarios para: cálculo de puntos envido, truco, falta envido, transiciones de estado
- [ ] `npx tsc --noEmit` sin errores

---

## Fase 2 — Pantalla de setup

**Objetivo:** pantalla de configuración para iniciar una partida de Truco.

### Elementos de UI

- Selector de modalidad (mano a mano / parejas / tríos) — visual, no afecta lógica del marcador
- Nombres de equipos (2 inputs)
- Toggle de Flor
- Selector de puntos (15 o 30)
- Toggle de voz
- Botón "Iniciar partida"

### Criterios de aceptación

- [ ] Pantalla en `screens/games/truco/setup.tsx`
- [ ] Configuración se persiste en AsyncStorage
- [ ] Al abrir, carga la última configuración usada
- [ ] Botón inicia partida y navega al marcador
- [ ] Reutilizar componentes common existentes (Toggle, Stepper, NavRow)

---

## Fase 3 — Marcador (UI estática)

**Objetivo:** pantalla principal del marcador con puntos de ambos equipos, sin lógica de cantos todavía.

### Layout

La pantalla se divide en:
1. **Header**: chip de voz (reutilizar `VoiceStatusChip`) + número de mano
2. **Marcador**: dos mitades (un equipo cada una) con puntos en número + palitos
3. **Zona de estado**: área central para mostrar cantos activos (vacía por ahora)
4. **Controles**: botones de acción

### Visualización de puntos

- Número grande (tipografía serif como en el timer)
- Palitos debajo: cajitas de 5 (4 palitos + diagonal)
- Indicador "malas" / "buenas" debajo del puntaje
- Color de fondo cambia cuando un equipo entra en las buenas

### Criterios de aceptación

- [ ] Pantalla en `screens/games/truco/scoreboard.tsx`
- [ ] Marcador muestra puntos de ambos equipos
- [ ] Palitos se renderizan correctamente (0 a 30)
- [ ] Indicador malas/buenas funciona
- [ ] Botones +Envido, +Truco, +Manual presentes (sin lógica aún)
- [ ] Botón "Fin de partida" navega a summary
- [ ] Nav bar de Android sincronizada con color de fondo
- [ ] StatusBar light

---

## Fase 4 — Máquina de estados de cantos

**Objetivo:** implementar la lógica completa de cantos con UI interactiva en la zona de estado.

### Flujos principales

**Envido:**
1. Se detecta/registra canto → zona muestra "ENVIDO — 2 pts en juego" + botones [Quiero] [No quiero] [Subir]
2. Si quieren → "¿Quién ganó el envido?" + botones [Equipo 1] [Equipo 2]
3. Se selecciona ganador → "Equipo X +2 pts" + [Confirmar] [Cancelar]
4. Confirmar → puntos se suman al marcador

**Truco:**
1. Se detecta/registra canto → "TRUCO — 2 pts en juego" + [Quiero] [No quiero] [Retruco]
2. Si quieren → se guarda el nivel, la mano continúa
3. Al terminar la mano → "¿Quién ganó la mano?" + [Equipo 1] [Equipo 2]
4. Confirmar → puntos del nivel de truco se suman

**Cantos encadenados (envido → truco en misma mano):**
1. Se resuelve envido primero
2. Luego se puede cantar truco
3. Al final de la mano se suman ambos

### Validaciones de estado

- Envido solo se puede cantar antes de que se cante truco
- Truco solo se puede escalar en orden: truco → retruco → vale cuatro
- Flor anula envido (si está habilitada)
- No se puede cantar nada si hay un canto pendiente de respuesta

### Criterios de aceptación

- [ ] Zona de estado muestra el canto activo con puntos en juego
- [ ] Botones de respuesta (quiero/no quiero/subir) funcionan
- [ ] Flujo completo de resolución con confirmación
- [ ] Cantos encadenados (envido + truco en misma mano) funcionan
- [ ] Validaciones de orden (no truco antes de resolver envido pendiente)
- [ ] Animaciones de transición entre estados (fade/slide)
- [ ] Tests para todas las combinaciones de cantos y respuestas

---

## Fase 5 — Voz multi-palabra

**Objetivo:** adaptar `useVoiceDetection` para detectar múltiples palabras clave del Truco.

### Cambios en useVoiceDetection

Actualmente el hook detecta una sola `triggerWord`. Necesita soportar:

```ts
// Opción: generalizar el hook
interface UseVoiceDetectionOptions {
  enabled: boolean;
  triggers: Array<{
    word: string;
    aliases?: string[];     // variaciones fonéticas
    onDetected: () => void;
  }>;
  onPermissionDenied?: () => void;
}
```

### Palabras y aliases

| Palabra | Aliases (errores comunes del reconocedor) |
|---------|------------------------------------------|
| envido | embido, en vido, emvido |
| real envido | real embido |
| falta envido | falta embido |
| truco | — |
| retruco | re truco |
| vale cuatro | vale 4 |
| quiero | — |
| no quiero | — |
| flor | — |
| contra flor | — |
| mazo | me voy al mazo |

### Prioridad de detección

Cuando el transcript contiene múltiples matches, priorizar frases más largas:
1. "real envido" > "envido"
2. "falta envido" > "envido"
3. "vale cuatro" > "truco"
4. "contra flor" > "flor"
5. "no quiero" > "quiero"

### Criterios de aceptación

- [ ] `useVoiceDetection` refactorizado para múltiples triggers
- [ ] El hook de Rummikub sigue funcionando (no romper backwards compat)
- [ ] Detección fuzzy con aliases
- [ ] Prioridad de frases compuestas sobre simples
- [ ] Debounce entre detecciones (evitar doble registro)
- [ ] Tests unitarios para matching de palabras

---

## Fase 6 — Flujo de confirmación

**Objetivo:** integrar voz + máquina de estados + marcador en un flujo completo.

### Flujo voz → confirmación

```
Voz detecta "envido"
  → trucoStore.registerCanto('envido', 'envido', teamIndex)
    → zona de estado muestra "ENVIDO cantado — 2 pts en juego"
      → Voz detecta "quiero" / jugador toca [Quiero]
        → zona muestra "¿Quién ganó?"
          → jugador selecciona equipo
            → zona muestra "+2 pts a [equipo]"
              → jugador toca [Confirmar]
                → marcador se actualiza con animación
```

### Detalle: ¿quién cantó?

Cuando la voz detecta un canto, la app no sabe qué equipo cantó. Opciones:

**Opción A (simple, recomendada para v1):** asumir que el equipo que tiene el teléfono es siempre el mismo. Agregar un toggle rápido "¿Quién cantó?" que por defecto alterna.

**Opción B:** no preguntar quién cantó en los cantos, solo al resolver ("¿Quién ganó?"). Los puntos de "no quiero" se asignan con un toque al equipo que cantó.

### Criterios de aceptación

- [ ] Voz detecta cantos y dispara flujo automáticamente
- [ ] Fallback manual siempre disponible (botones +Envido, +Truco)
- [ ] Confirmación obligatoria antes de sumar puntos
- [ ] Animación de puntos sumándose al marcador
- [ ] Sonido y háptico al confirmar puntos
- [ ] Se puede cancelar/corregir en cualquier paso del flujo

---

## Fase 7 — Persistencia y resumen

**Objetivo:** guardar partida en curso y mostrar resumen al terminar.

### Persistencia

- El estado completo del store se persiste en AsyncStorage
- Al abrir la app, si hay partida en curso, ofrecer retomar o empezar nueva
- Se guarda después de cada confirmación de puntos

### Pantalla de resumen

- `screens/games/truco/summary.tsx`
- Equipo ganador en grande con animación
- Puntaje final
- Estadísticas: manos jugadas, cantos por equipo, envidos/trucos ganados
- Botones: "Revancha" (misma config) / "Nueva partida" / "Inicio"

### Criterios de aceptación

- [ ] Partida se guarda automáticamente
- [ ] Al reabrir, ofrece retomar partida en curso
- [ ] Pantalla de resumen con estadísticas
- [ ] Detección de victoria dispara pantalla de resumen automáticamente
- [ ] "Revancha" inicia nueva partida manteniendo equipos

---

## Estructura de archivos propuesta

```
screens/games/truco/
├── setup.tsx                    # Configuración de partida
├── scoreboard.tsx               # Marcador principal
└── summary.tsx                  # Resumen de partida

src/
├── store/
│   └── trucoStore.ts            # Estado y lógica de la partida
├── hooks/
│   └── useVoiceDetection.ts     # Refactorizado para multi-palabra (compartido)
├── components/
│   └── truco/
│       ├── ScorePanel.tsx        # Un panel de equipo (puntos + palitos)
│       ├── TallyMarks.tsx        # Visualización de palitos/cajitas
│       ├── CantoZone.tsx         # Zona central de estado de cantos
│       ├── CantoButtons.tsx      # Botones de respuesta (quiero/no quiero/subir)
│       ├── ConfirmDialog.tsx     # Diálogo de confirmación de puntos
│       └── ManualControls.tsx    # Botones manuales (+envido, +truco, +manual)
└── utils/
    └── truco.ts                 # Cálculo de puntos, validaciones de cantos
```

---

## Orden de trabajo recomendado

```
Fase 1 (store) ──→ Fase 2 (setup) ──→ Fase 3 (marcador UI)
                                              │
                                              ▼
                   Fase 4 (máquina de estados + UI de cantos)
                                              │
                                              ▼
                   Fase 5 (voz multi-palabra)
                                              │
                                              ▼
                   Fase 6 (integración voz + confirmación)
                                              │
                                              ▼
                   Fase 7 (persistencia + resumen)
```

Las fases 1-3 se pueden iterar rápido para tener algo funcional en pantalla. La fase 4 es el núcleo de la lógica. La fase 5 es la adaptación de voz. Las fases 6-7 son integración y polish.
