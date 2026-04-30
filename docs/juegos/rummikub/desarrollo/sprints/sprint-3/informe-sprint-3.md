# Informe Sprint 3 — UX visual

**Fecha:** 2026-04-26  
**Commit:** `5e97a79`  
**Estado:** Completado ✓  
**Issues cerrados:** #12, #13

---

## Resumen

Dos cambios visuales enfocados en claridad y diferenciación por jugador. TypeScript sin errores, 70 tests pasando.

---

## Issue #12 — Reemplazar TopProgressBar ✓

**Opción implementada:** Opción 4 — sin indicador explícito de progreso.

**Motivo:** El color de fondo ya comunica el estado del tiempo con tres niveles visuales:
- `Colors.calm` (verde) → tiempo normal
- `Colors.warn` (amarillo) → menos del 33% restante
- `Colors.alert` (rojo) → tiempo agotado

Sumado al número grande del timer, el jugador recibe feedback suficiente sin necesidad de un elemento adicional. Menos elementos = pantalla más limpia e inmersiva.

**Cambios:**
- `timer.tsx`: removidas las líneas de `<TopProgressBar .../>`, import de `TopProgressBar`, import de `calcProgress` y la variable `progress`
- `TopProgressBar.tsx` se mantiene en el proyecto como referencia — puede restaurarse si en pruebas de dispositivo se decide que el número solo no es suficiente

---

## Issue #13 — Color de jugador en PlayerChip ✓

**Archivos:** `app/src/components/timer/PlayerChip.tsx`, `app/screens/games/rummikub/timer.tsx`

**Antes:**
```ts
// PlayerChip solo recibía name, fondo gris para todos
interface Props { name: string; }
// backgroundColor: 'rgba(0,0,0,0.18)'
```

**Después:**
```ts
// PlayerChip recibe el color del jugador
interface Props { name: string; color: string; }
// backgroundColor: color (del player.color)
```

Los colores por jugador, asignados en `createPlayer`:
| Jugador | Color |
|---------|-------|
| 1 | `#C24E1B` (terracotta) |
| 2 | `#3F6B5E` (verde oscuro) |
| 3 | `#7C5C3A` (marrón) |
| 4 | `#8A4F6B` (morado) |

El chip del jugador saliente en la animación de transición también usa su color, lo que hace la animación más legible.

El `NextUpRow` ya usaba `player.color` en el avatar circular — no necesitó cambios.

---

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
- `git push origin develop` → rama actualizada

---

## Próximo sprint

**Sprint 4 — Features**

| Issue | Item |
|-------|------|
| #14 | Registrar ganador al finalizar la partida |
