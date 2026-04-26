# Temporizador Juegos — CLAUDE.md

## Descripción del proyecto

App móvil en React Native para facilitar juegos de mesa. El MVP es un temporizador por turno con reconocimiento de voz para detectar la palabra "paso" y cambiar de jugador automáticamente.

## Stack tecnológico

- **Framework:** React Native con Expo (managed workflow)
- **Navegación:** Expo Router (file-based routing)
- **Estado global:** Zustand
- **Estilos:** StyleSheet nativo de React Native (sin librerías externas de UI)
- **Voz:** `expo-speech-recognition`
- **Animaciones:** Reanimated 2 (hilo nativo); Animated API solo para transiciones simples
- **Tests:** Jest + React Native Testing Library

## Estructura del proyecto

```
board-buddy/
├── app/                         # Expo Router
│   ├── _layout.tsx              # Carga de fuentes, proveedores
│   ├── index.tsx                # Home / selector de juego
│   ├── settings.tsx             # Configuración global
│   └── games/rummikub/
│       ├── setup.tsx            # Configuración de partida
│       ├── timer.tsx            # Temporizador (pantalla principal)
│       └── summary.tsx          # Resumen de partida
├── src/
│   ├── components/
│   │   ├── timer/               # TopProgressBar, TimerDisplay, PlayerChip, etc.
│   │   └── common/              # Toggle, Stepper, GameCard, NavRow, Slider, etc.
│   ├── store/                   # timerStore, gameSetupStore, settingsStore
│   ├── hooks/                   # useCountdown, useVoiceDetection, useBackgroundTimer
│   ├── utils/                   # time.ts, players.ts
│   └── constants/               # tokens.ts (design tokens), defaults.ts
├── assets/sounds/               # timer-end.mp3
├── design/handoff_board_buddy/  # Referencia visual (no es código de producción)
└── docs/                        # Documentación
```

## Convenciones de código

- TypeScript estricto en todos los archivos
- Componentes funcionales con hooks
- Nombres en inglés para código, español para comentarios de negocio
- Un componente por archivo
- Props tipadas con `interface`, no `type`

## Principios de UX

- La pantalla del temporizador debe ser **inmersiva**: ocupa toda la pantalla
- Feedback visual inmediato para cada interacción
- Botones grandes y fáciles de tocar (mínimo 48×48 dp)
- Colores con significado: verde = corriendo, amarillo = poco tiempo, rojo = agotado
- El reconocimiento de voz debe ser silencioso (sin interrupciones sonoras al jugador)

## Escalabilidad

Cada juego nuevo se incorpora como un módulo independiente dentro de `app/games/` con su propia configuración en el store de Zustand. La configuración global (tiempo por turno, número de jugadores, etc.) se persiste con `AsyncStorage`.

## Comandos útiles

```bash
npx expo start          # Servidor de desarrollo
npx expo start --ios    # Simulador iOS
npx expo start --android # Emulador Android
npx jest                # Tests
cd app && eas build --profile preview --platform android  # APK de prueba
```

## Workflow de bugs

Usar `/bug-report` cuando el usuario reporta algo que falla. El skill crea:
- `docs/desarrollo/bugs/BUG-{N}/reporte.md` — descripción y análisis
- `docs/desarrollo/bugs/BUG-{N}/informe.md` — fix y verificación (al cierre)
- Issue en GitHub con labels de severidad
- Rama `bug/{N}-{slug}` para aislar el fix
- PR hacia `develop` al terminar
