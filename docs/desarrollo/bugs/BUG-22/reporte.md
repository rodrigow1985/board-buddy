# BUG-22 — Reconocimiento de voz no detecta "paso" — flicker paused/listening constante

**Issue:** rodrigow1985/board-buddy#22
**Fecha reporte:** 2026-04-26
**Severidad:** Alta
**Estado:** Abierto

---

## Descripción
El reconocimiento de voz nunca detecta "paso". El indicador de estado alterna constantemente entre "pausado" y "escuchando" sin procesar resultados de transcripción.

## Pasos para reproducir
1. Instalar build preview
2. Iniciar una partida con voz habilitada
3. Decir "paso" durante el turno de un jugador
4. Observar el chip de estado de voz

## Comportamiento esperado
El reconocedor permanece estable en "escuchando" y detecta la palabra "paso".

## Comportamiento actual
El indicador alterna constantemente entre "pausado" y "escuchando". Nunca se detecta "paso".

## Entorno
- Build: preview (EAS)
- Plataforma: Android

---

## Análisis

### Causa raíz

Dos problemas combinados en `useVoiceDetection.ts`:

#### Problema 1 — Stale closure en los event listeners nativos

`shouldListen` está en el array de deps del effect de suscripciones (línea 147):

```ts
}, [enabled, shouldListen, triggerWord, startListening, passTurn, onTrigger]);
```

Cada vez que `shouldListen` cambia — lo que ocurre en cada transición de turno
(`running → transitioning → running`) — React elimina todos los listeners nativos
y los re-registra. Durante ese ciclo:

1. Cleanup del effect de suscripciones → listeners nativos eliminados
2. Cleanup del control effect → `SpeechModule.abort()` → `isRunningRef.current = false`
3. Control effect re-ejecuta: `shouldListen = false` → `stopListening()` → estado **"paused"**
4. `shouldListen` vuelve a true → `startListening()` → estado **"listening"**

Esto explica el flicker. Además, reiniciar el reconocedor en cada cambio de turno
rompe el contexto de escucha de Android.

Los valores `shouldListen` dentro de los closures de `end`, `error` y `result`
quedan obsoletos mientras los listeners están activos, aunque el effect los re-registra.
La solución es usar una ref sincronizada en lugar de poner `shouldListen` en las deps.

#### Problema 2 — El handler de `end` reactiva tras errores fatales

Cuando Android lanza un error no-recuperable (ej. `service-not-available`):
1. `error` handler → `setVoiceState('error')`, sin reiniciar
2. `end` handler (llega justo después) → `shouldListen = true` → reinicia de todos modos

Ciclo: error fatal → end → restart → error fatal → ...

El handler de `end` no sabe si el cierre de sesión fue por error fatal,
por lo que reactiva el reconocedor en un estado no válido.

### Archivos afectados
- `app/src/hooks/useVoiceDetection.ts` — suscripciones con stale closure y lógica de reinicio tras error fatal

---

## Plan de solución

1. **Reemplazar `shouldListen` en closures por `shouldListenRef.current`**: agregar
   `const shouldListenRef = useRef(shouldListen)` y un effect que lo sincronice.
   Los event handlers usan `shouldListenRef.current` para leer el valor más reciente
   sin estar en las deps del effect de suscripciones.

2. **Eliminar `shouldListen` de las deps del effect de suscripciones**: los listeners
   nativos se registran una sola vez (por `enabled`) y no se re-crean en cada transición.

3. **Agregar `fatalErrorRef`**: booleano que el handler de `error` activa cuando el error
   no es recuperable. El handler de `end` lo consulta y, si está activo, no reinicia
   (y lo resetea para no bloquear intentos futuros manuales).
