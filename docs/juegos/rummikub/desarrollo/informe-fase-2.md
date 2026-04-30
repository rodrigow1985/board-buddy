# Informe Fase 2 — Lógica del temporizador

**Fecha:** 2026-04-25  
**Estado:** Completada ✓

## Resumen

Se implementó toda la lógica central de la aplicación: stores de Zustand, hooks personalizados, utilidades y una suite completa de tests automáticos. El resultado es una capa de negocio completamente testeada y lista para conectar con la UI.

## Archivos creados

### Stores (Zustand)

| Archivo | Descripción |
|---------|-------------|
| `src/store/timerStore.ts` | Máquina de estados del temporizador (núcleo de la app) |
| `src/store/gameSetupStore.ts` | Configuración de partida (jugadores, duración, voz) |
| `src/store/settingsStore.ts` | Preferencias persistidas con AsyncStorage |

### Hooks

| Archivo | Descripción |
|---------|-------------|
| `src/hooks/useCountdown.ts` | Loop de 100ms con compensación por elapsed real |
| `src/hooks/useBackgroundTimer.ts` | Compensación de tiempo cuando la app está en background |
| `src/hooks/useHaptics.ts` | Wrapper para expo-haptics con fallo silencioso |

### Utilidades

| Archivo | Descripción |
|---------|-------------|
| `src/utils/time.ts` | `formatTime`, `calcProgress`, `isWarnState`, `toMs`, `toSeconds` |
| `src/utils/players.ts` | `createPlayer`, `nextPlayerIndex`, `playerInitial`, `voicePassRate` |
| `src/constants/tokens.ts` | Design tokens completos (colores, tipografía, espaciado, etc.) |
| `src/constants/defaults.ts` | Valores por defecto de configuración |

### Tests

| Archivo | Tests |
|---------|-------|
| `src/__tests__/time.test.ts` | 15 tests — formatTime, calcProgress, isWarnState, toMs, toSeconds |
| `src/__tests__/players.test.ts` | 12 tests — createPlayer, nextPlayerIndex, playerInitial, voicePassRate |
| `src/__tests__/timerStore.test.ts` | 39 tests — máquina de estados completa |
| `src/__tests__/useCountdown.test.ts` | 4 tests — comportamiento del countdown con fake timers |

**Total: 70 tests, 100% pasando.**

## Decisiones técnicas

### Máquina de estados del timer

```
idle → running ←→ paused
         ↓
    transitioning → running (siguiente jugador)
         ↓
      timeout → timeout (mismo jugador, requiere acción manual)
```

- `warn` es un estado **derivado** (no almacenado): `timeRemainingMs / turnDurationMs <= 0.2`
- `passTurn()` registra `endReason: 'button' | 'voice'` en `turnHistory`
- `onTimeout()` **no avanza** el jugador — el jugador con timeout sigue activo hasta que se pasa manualmente

### Uniqueness de IDs de jugadores

`generatePlayerId` combina índice + timestamp + contador incremental (`_idCounter++`) para garantizar IDs únicos incluso cuando dos jugadores se crean en el mismo millisecond. Esto surgió de un fallo en tests donde `Date.now()` retornaba el mismo valor.

### useCountdown con elapsed real

En lugar de decrementar siempre `100ms` por tick, el hook captura `Date.now()` antes y después del intervalo y llama `tick(elapsed)` con el tiempo real transcurrido. Esto compensa drifts del event loop de JS.

### settingsStore con AsyncStorage

El store usa un patrón `hydrate/persist` manual (sin el middleware de Zustand) para tener control total sobre cuándo se lee/escribe AsyncStorage, evitando race conditions al iniciar la app.

## Bugs encontrados y corregidos

1. **IDs duplicados en tests**: `createPlayer` llamado en el mismo ms generaba IDs iguales → solucionado con `_idCounter`
2. **Test de rotación circular fallaba**: `passTurn()` setea `status=transitioning`, lo que bloqueaba la siguiente llamada. El test debía llamar `endTransition()` entre cada `passTurn()` para simular correctamente el flujo real

## Cobertura funcional

- ✅ Inicialización de partida con N jugadores
- ✅ Start / Pause / Resume
- ✅ Tick con decremento preciso
- ✅ Paso de turno por botón y por voz (con estadísticas separadas)
- ✅ Rotación circular de jugadores
- ✅ Timeout sin avance automático
- ✅ Reinicio de turno
- ✅ Transición animada entre turnos
- ✅ Background timer compensation
- ✅ Historial de turnos
