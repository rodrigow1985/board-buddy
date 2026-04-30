# Informe BUG-15 — Reconocimiento de voz no detecta "paso"

**Fecha:** 2026-04-26
**Commit:** `c67dbfc`
**Issue cerrado:** rodrigow1985/board-buddy#15
**Rama:** `bug/15-voz-no-detecta-paso`

---

## Causa raíz

En Sprint 2 se cambió `requiresOnDeviceRecognition: false` → `true` para reducir latencia. Si el dispositivo no tiene el modelo de idioma español instalado para reconocimiento on-device, Android falla silenciosamente sin fallback a red. El reconocedor arranca pero nunca emite resultados.

## Cambios

### `app/src/hooks/useVoiceDetection.ts`

```ts
// Antes (Sprint 2 — causa del bug)
const RECOGNITION_OPTIONS = {
  lang: 'es-ES',
  continuous: true,
  interimResults: true,
  requiresOnDeviceRecognition: true,
};

// Después (fix BUG-15)
const RECOGNITION_OPTIONS = {
  lang: 'es-ES',
  continuous: true,
  interimResults: true,
  requiresOnDeviceRecognition: false,
};
```

Con `false`, Android intenta on-device primero; si no tiene el modelo, usa la red. Funciona en cualquier dispositivo. El cambio `lang: es-ES` se mantiene (mejor cobertura que `es-AR` también en red).

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
