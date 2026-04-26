# Informe Fase 5 — Configuración de partida + persistencia

**Fecha:** 2026-04-26  
**Estado:** Completada ✓

## Resumen

Se implementó el flujo completo de la aplicación: Home → Setup → Timer → Summary → Home. Todos los componentes comunes del sistema de diseño fueron construidos, las preferencias persisten en AsyncStorage y el banner de resume aparece cuando hay una partida en curso.

## Archivos creados / modificados

### Componentes comunes

| Archivo | Descripción |
|---------|-------------|
| `src/components/common/Toggle.tsx` | Toggle 46×28dp animado. ON: terracotta, OFF: gris. Animación 180ms. |
| `src/components/common/NumberStepper.tsx` | Stepper con valor JetBrainsMono 30sp, botón − outline y + terracotta |
| `src/components/common/PlayerRow.tsx` | Fila de jugador: avatar 36dp + nombre + botón editar |
| `src/components/common/ToggleRow.tsx` | Ícono + título + subtítulo + Toggle |
| `src/components/common/NavRow.tsx` | Label + valor opcional + chevron. Para Settings |
| `src/components/common/Stat.tsx` | Valor en Fraunces 22 + label overline 11sp |
| `src/components/common/GameCard.tsx` | Card de juego activa/inactiva con shadow cross-platform |

### Pantallas

| Archivo | Cambio |
|---------|--------|
| `app/games/rummikub/setup.tsx` | Pantalla de configuración completa |
| `app/games/rummikub/summary.tsx` | Resumen de partida con tabla + MVP card |
| `app/index.tsx` | Home con resume banner, game cards, stats footer |
| `app/settings.tsx` | Configuración global con voz, audio, idioma |
| `app/games/rummikub/timer.tsx` | voiceEnabled desde settingsStore + botón "Fin de partida" |

## Flujo implementado

```
Home ──────────────────────────────────────────────────────────────────
  │  Pulsar "Jugar Rummikub"
  ↓
Setup ────────────────────────────────────────────────────────────────
  │  Elegir duración, jugadores, voz → "Iniciar partida"
  │  → initGame(players, turnDurationMs) + router.replace('/timer')
  ↓
Timer (Fase 3+4) ─────────────────────────────────────────────────────
  │  Juego en curso. "Fin de partida" →
  ↓
Summary ──────────────────────────────────────────────────────────────
  │  "Nueva partida" → Setup | "Inicio" → Home (con reset)
  ↓
Home (con resume banner si partida interrumpida) ──────────────────────
```

## Componentes de UI

### Toggle
- 46×28dp, animación con `Animated.Value` (native driver para translateX, non-native para color)
- Thumb blanco 22dp con shadow
- ON: `Colors.terracotta` (#C24E1B) / OFF: #D9D2C5

### NumberStepper
- Botón `−` outline con borde `hairline`, bg `surface`
- Botón `+` filled terracotta
- Valor en `JetBrainsMono_600SemiBold` 30sp con `fontVariant: ['tabular-nums']`

### Setup Screen
- `KeyboardAvoidingView` para el inline edit de nombres de jugadores
- Opciones de duración como chips seleccionables (1/2/3/5 min)
- Edición inline de nombres: toca el ícono lapiz → input autoFocus → blur/done cierra
- Validación: alerta si hay nombres duplicados antes de iniciar

### Summary Screen
- Card de stats globales: Turnos / Tiempo total / % Por voz
- MVP card (terracottaSoft) con el jugador que más pasos por voz acumuló
- Tabla de jugadores con columnas: Jugador / Turnos / Botón / Voz
- Valores de voz en `terracotta` para destacarlos visualmente

### Home Screen
- Resume banner: aparece cuando `timerStatus ∈ {running, paused, timeout}` y hay jugadores
- Muestra: turno de [nombre] · [tiempo] restantes
- Navega a `/timer` sin resetear el store (la partida continúa)

## Persistencia

- `settingsStore.hydrate()` se llama al montar `HomeScreen`
- Datos guardados en AsyncStorage bajo clave `@board_buddy_settings`
- El timer store **no** persiste (en RAM) — la partida se pierde si se mata el proceso
  - El resume banner solo funciona mientras la app sigue en memoria/background

## Fix técnico: `Shadows.card`

Los tokens tenían `Shadows.cardIOS` y `Shadows.cardAndroid` por separado. Al usar `Platform.select` dentro de `StyleSheet.create`, TypeScript exigía que ambos objetos tuvieran la misma forma, lo que causaba errores de tipo. La solución fue agregar `Shadows.card` al objeto de tokens con ambas propiedades combinadas:

```ts
card: {
  shadowColor: '#1F1A16',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.04,
  shadowRadius: 18,
  elevation: 2,           // Android ignora shadow*, iOS ignora elevation
}
```

## Bugs corregidos post-implementación

### Infinite re-render al iniciar partida

**Causa:** `useTimerStore((s) => ({ pause, resume, passTurn, ... }))` retorna un objeto nuevo en cada render → Zustand lo detecta como cambio de estado → loop infinito.

**Fix:** Usar `useTimerStore.getState()` para obtener acciones (referencias estables en Zustand). Complementado con `useCallback` para `onPermissionDenied` y patrón `useRef` para `requestPermission` en effects.

### Mezcla de native/non-native driver en TopProgressBar

**Causa:** `pulseAnim` (opacity) usaba `useNativeDriver: true` pero se aplicaba al mismo `Animated.View` que `widthAnim` (width), que requiere `useNativeDriver: false`. React Native no permite mezclar drivers en el mismo nodo.

**Fix:** Cambiar `pulseAnim` a `useNativeDriver: false` en todas sus animaciones.
