# Informe Fase 3 — Pantalla del temporizador

**Fecha:** 2026-04-25  
**Estado:** Completada ✓

## Resumen

Se implementó la pantalla del temporizador con todos sus estados visuales, animaciones y componentes. Es la pantalla central de la app y define la experiencia del jugador.

## Archivos creados

### Componentes del timer

| Archivo | Descripción |
|---------|-------------|
| `src/components/timer/TopProgressBar.tsx` | Barra horizontal 8dp en el top, animada con React Native Animated |
| `src/components/timer/TimerDisplay.tsx` | Número gigante Fraunces 168sp con tabular-nums |
| `src/components/timer/PlayerChip.tsx` | Pill con nombre del jugador actual en uppercase |
| `src/components/timer/NextUpRow.tsx` | Fila "Sigue" con avatar 26dp y nombre del próximo jugador |
| `src/components/timer/TimerControls.tsx` | 3 botones (reiniciar, pause/play, pasar turno) |
| `src/components/timer/VoiceHint.tsx` | Pill flotante `decí "paso"` en JetBrainsMono |
| `src/components/timer/VoiceStatusChip.tsx` | Chip con dot indicador del estado del reconocimiento de voz |

### Pantallas actualizadas

| Archivo | Cambio |
|---------|--------|
| `app/games/rummikub/timer.tsx` | Implementación completa de la pantalla del temporizador |
| `app/index.tsx` | Placeholder actualizado con CTA para navegar al timer |
| `app/_layout.tsx` | Agregado `SafeAreaProvider` para soporte de safe areas |

## Implementación técnica

### Animación de color de fondo

El fondo del timer cambia de color según el estado, con 250ms de transición suave. Se usa un `Animated.Value` que mapea a un índice de color:

```
0 → calm (#3F6B5E)    // tiempo abundante
1 → warn (#D88A2F)    // ≤20% restante
2 → alert (#B23A1F)   // timeout
3 → paused (#5C544C)  // pausado
```

La interpolación se hace con `bgAnim.interpolate({ inputRange: [0,1,2,3], outputRange: BG_COLORS })`. Se usa `useNativeDriver: false` porque se anima color (no soportado por native driver).

### Barra de progreso (TopProgressBar)

- Posición `absolute, top: 0` con `zIndex: 10` para quedar sobre todo el contenido
- Anima el ancho de 0% a 100% con `Animated.timing` linear, 100ms de delay entre ticks
- En estado `warn`: loop de pulso 800ms opacity 1↔0.85

### Animación de transición de turno

Cuando `status === 'transitioning'`:
1. Se detecta el índice del jugador saliente: `(currentPlayerIndex - 1 + players.length) % players.length`
2. Se renderizan dos `Animated.View` superpuestas simultáneamente
3. Jugador **saliente**: `translateX` de 0 a `-58%` del ancho de pantalla, opacity de 1 a 0.45
4. Jugador **entrante**: `translateX` de `+40%` a `+8%`, opacity de 0 a 1
5. Al completarse (400ms), se llama `endTransition()` que cambia `status → running`

### Flash en timeout

Al detectar la transición a `timeout`:
- Feedback háptico `NotificationFeedbackType.Error`
- Overlay rojo semi-transparente que pulsa 300ms con `Animated.sequence`

### Inicialización temporal

Mientras no existe la pantalla de Setup (Fase 5), el timer se auto-inicializa con 3 jugadores de prueba si no hay partida activa. Esto permite probar la pantalla de forma independiente.

## Decisiones de diseño

- **`useNativeDriver: false` para colores**: React Native no permite animar propiedades de color (backgroundColor) en el native driver. Se acepta el rendimiento levemente inferior a cambio de las transiciones de color.
- **`useNativeDriver: true` para transformaciones**: Las animaciones de `translateX` y `opacity` de la transición de turno usan native driver para garantizar 60fps.
- **TopProgressBar con `pointerEvents="none"`**: La barra no intercepta toques — todos los eventos pasan al contenido debajo.
- **Iconos con `@expo/vector-icons/Ionicons`**: Ícono refresh, pause, play, play-skip-forward.

## Estado visual por status

| Status | Background | TopBar | Display | Banner |
|--------|-----------|--------|---------|--------|
| running (normal) | calm | sólida | 100% opacidad | — |
| running (warn) | warn | pulsante | 100% opacidad | — |
| paused | paused | congelada | 55% opacidad | "PARTIDA EN PAUSA" |
| timeout | alert | vacía | 100% opacidad | "TIEMPO AGOTADO" |
| transitioning | calm | congelada | animando | — |

## Decisión: voz desactivada en UI (Fase 4)

El chip de voz y el VoiceHint están conectados al estado del timer pero con `voiceEnabled: false` por defecto. La integración real con `expo-speech-recognition` se hace en Fase 4. La UI ya está preparada para recibirla.
