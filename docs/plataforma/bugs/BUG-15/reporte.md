# BUG-15 — Reconocimiento de voz no detecta "paso"

**Issue:** rodrigow1985/board-buddy#15
**Fecha reporte:** 2026-04-26
**Severidad:** Alta
**Estado:** Cerrado ✓

---

## Descripción
La detección de voz no funciona en la build preview. Decir "paso" no cambia de turno. Regresión introducida en Sprint 2.

## Pasos para reproducir
1. Instalar la build preview más reciente
2. Iniciar una partida con voz habilitada
3. Decir "paso" durante el turno de un jugador

## Comportamiento esperado
El turno cambia al siguiente jugador.

## Comportamiento actual
No pasa nada. El turno no cambia.

## Entorno
- Build: preview (EAS)
- Plataforma: Android

---

## Análisis

### Causa raíz

En Sprint 2 se cambió `requiresOnDeviceRecognition: false` → `true` para reducir latencia. El problema: si el dispositivo **no tiene el modelo de idioma español instalado** para reconocimiento on-device, Android falla silenciosamente **sin fallback a red**. El reconocedor arranca pero nunca emite resultados.

```ts
// Sprint 2 — CAUSA DEL BUG
const RECOGNITION_OPTIONS = {
  lang: 'es-ES',
  requiresOnDeviceRecognition: true,  // ← si no hay modelo on-device, falla sin error
  ...
};
```

### Archivos afectados
- `app/src/hooks/useVoiceDetection.ts` — línea de `RECOGNITION_OPTIONS`

---

## Plan de solución

Revertir `requiresOnDeviceRecognition: true` → `false`.

Con `false`, Android intenta on-device primero y si no tiene el modelo usa la red. La latencia puede ser un poco mayor que on-device puro pero el reconocimiento funciona en cualquier dispositivo.

El cambio de `lang: 'es-AR'` → `'es-ES'` se **mantiene**: `es-ES` tiene mejor cobertura en el motor de red de Android también.
