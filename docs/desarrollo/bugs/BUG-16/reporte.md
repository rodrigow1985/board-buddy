# BUG-16 — Los segundos pasan casi el doble de rápido

**Issue:** rodrigow1985/board-buddy#16
**Fecha reporte:** 2026-04-26
**Severidad:** Alta
**Estado:** Cerrado ✓

---

## Descripción
El countdown avanza aproximadamente al doble de la velocidad real. Un turno de 2 minutos termina en ~1 minuto real. Regresión del BUG-01 (Sprint 1), que vuelve a aparecer en la build del Sprint 2.

## Pasos para reproducir
1. Instalar la build preview más reciente
2. Iniciar una partida
3. Cronometrar con un reloj externo cuánto tarda en descontar 10 segundos

## Comportamiento esperado
10 segundos reales = 10 segundos descontados del timer.

## Comportamiento actual
10 segundos reales ≈ 20 segundos descontados.

## Entorno
- Build: preview (EAS)
- Plataforma: Android

---

## Análisis

### Causa raíz

El fix del Sprint 1 usa **elapsed incremental** (`Date.now() - lastTickRef`). Esta estrategia acumula pequeñas imprecisiones y es vulnerable a cualquier situación donde el JS thread esté ocupado (carga de assets, audio, rendering) y los callbacks del `setInterval` se acumulen y disparen en ráfaga.

El hook `useAudio` agregado en Sprint 2 carga 5 archivos de audio con `Audio.Sound.createAsync` al montar el componente. Este proceso puede bloquear brevemente el JS thread en Android, causando que los ticks de `setInterval` se acumulen. Cuando el thread se libera, los callbacks disparan en secuencia rápida. Aunque cada uno mide el elapsed desde el anterior (correcto), el promedio de `timeRemainingMs` descontado por segundo es mayor al esperado por la forma en que la app renderiza los valores intermedios.

### Archivos afectados
- `app/src/hooks/useCountdown.ts` — estrategia de tick incremental

---

## Plan de solución

Reemplazar el tick **incremental** por tick **absoluto**:
- Al iniciar cada período `running`, capturar `startedAt = Date.now()` y `remainingAtStart = timeRemainingMs`
- Cada tick calcula `remaining = remainingAtStart - (Date.now() - startedAt)`
- Llamar a una nueva acción `setTimeRemaining(remaining)` en el store

Esta estrategia es inmune a delays del JS thread porque siempre calcula contra un punto de referencia absoluto, sin acumular error.

Se agrega `setTimeRemaining` al store (acción simple que setea `timeRemainingMs` directamente).
