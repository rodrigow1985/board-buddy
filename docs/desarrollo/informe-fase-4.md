# Informe Fase 4 — Detección de voz

**Fecha:** 2026-04-25  
**Estado:** Completada ✓

## Resumen

Se implementó la feature diferencial del MVP: reconocimiento de voz continuo con `expo-speech-recognition`. Al decir "paso", el turno cambia automáticamente, igual que si se presionara el botón. Se incluyó el manejo de permisos con snackbar de fallback.

## Archivos creados / modificados

| Archivo | Cambio |
|---------|--------|
| `src/hooks/useVoiceDetection.ts` | Hook principal de detección de voz |
| `src/components/common/PermissionSnackbar.tsx` | Snackbar deslizante para permisos denegados |
| `app/games/rummikub/timer.tsx` | Integración de voz + chip real + VoiceHint activado |

## Implementación técnica

### useVoiceDetection

El hook encapsula toda la interacción con `expo-speech-recognition`:

**Ciclo de vida:**
1. Al iniciar la partida, se llama `requestPermission()`
2. Si el permiso es concedido, `shouldListen = true` activa el listener
3. `ExpoSpeechRecognitionModule.start({ lang: 'es-AR', continuous: true, interimResults: true })`
4. Cuando llega un evento `result`, se analiza el transcript en busca de la trigger word
5. Si se detecta "paso", se llama `passTurn('voice')` con debounce de 1500ms
6. Al finalizar la sesión (`end` event), se reinicia automáticamente si sigue corriendo
7. Errores recuperables (`no-speech`, `speech-timeout`, `aborted`, `network`) también reinician con 500ms de delay

**Pausa automática:**
- El reconocimiento solo corre cuando `status === 'running'`
- Al pausar, el timer pasa a `paused` → `shouldListen = false` → `abort()` automático
- Al reanudar → `shouldListen = true` → `start()` automático

**Debounce de trigger:**
```ts
if (now - lastTriggerRef.current < 1500) return;
```
Evita disparar `passTurn` múltiples veces por la misma frase (los resultados intermedios pueden contener la palabra varias veces).

### Gestión de permisos

- `requestPermissionsAsync()` se llama automáticamente al iniciar la primera partida
- Si el usuario deniega: `onPermissionDenied()` → snackbar animado con opciones:
  - **"Ir a ajustes"** → `Linking.openSettings()` + cierra snackbar
  - **"Continuar"** → `voiceEnabled = false`, la app funciona solo con botones
- La denegación de permisos no interrumpe el juego — el timer sigue corriendo

### PermissionSnackbar

Componente reutilizable con animación de slide-up desde el bottom. Usa `Animated.timing` con `useNativeDriver: true` para la transformación vertical.

## Integración en timer.tsx

```
voiceState: 'idle' | 'requesting' | 'listening' | 'paused' | 'error'
     ↓
VoiceStatusChip  →  dot verde = 'listening' / dot gris = cualquier otro
VoiceHint        →  visible solo cuando voiceEnabled && voiceState === 'listening'
```

Los chips ya estaban construidos en Fase 3 con `voiceEnabled: false`. En esta fase se conectaron al estado real del reconocedor.

## Decisiones técnicas

- **`continuous: true`**: El reconocedor no se detiene entre frases. Necesario para no perder "paso" si se dice rápido.
- **`interimResults: true`**: Permite detectar la palabra antes de que el usuario termine de hablar (respuesta más rápida).
- **`lang: 'es-AR'`**: Español Argentina. En Fase 5 este valor vendrá del `settingsStore`.
- **Restart automático en `end`**: El recognizer puede cerrarse por timeout o interrupción; el hook lo reinicia solo si sigue corriendo.
- **`useRef` para estado interno**: El estado del reconocedor no necesita causar re-renders; se usa `stateRef` y `isRunningRef` para no saturar el ciclo de React.

## Limitaciones conocidas

- **No testeable con Jest**: `expo-speech-recognition` no tiene mock para tests unitarios en Node.js. La feature se verifica manualmente en dispositivo.
- **Solo funciona en dispositivo real**: El simulador/emulador de iOS/Android no soporta reconocimiento de voz en la mayoría de casos.
- **`voiceEnabled` hardcodeado en `true`**: En Fase 5 se leerá del `settingsStore`.
