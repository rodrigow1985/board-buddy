# Informe Sprint 4 — Features

**Fecha:** 2026-04-26  
**Commit:** `e7ad43c`  
**Estado:** Completado ✓  
**Issues cerrados:** #14

---

## Resumen

Se implementó el registro del ganador al finalizar la partida. El dato vive en RAM (se borra con `reset()`). TypeScript sin errores, 70 tests pasando.

---

## Issue #14 — Registrar ganador al finalizar la partida ✓

**Archivos modificados:**
- `app/src/store/timerStore.ts`
- `app/screens/games/rummikub/summary.tsx`

### Store

Se agregaron dos elementos a `TimerState`:

```ts
winnerId: string | null;  // player.id del ganador; null si no se eligió

setWinner: (playerId: string | null) => void;
```

`INITIAL_STATE` incluye `winnerId: null` para que se limpie en cada `reset()`.

### UI en summary.tsx

**Sección "¿Quién ganó?"** — aparece antes de las stats globales, con un chip por jugador:

- El chip usa el color del jugador como borde y label coloreado
- Al tocar: se selecciona ese jugador como ganador (background pasa al color del jugador)
- Al tocar de nuevo: se deselecciona (toggle)
- Solo se puede tener un ganador a la vez

```tsx
<Pressable
  style={[
    styles.winnerChip,
    { borderColor: player.color },
    isWinner && { backgroundColor: player.color },
  ]}
  onPress={() => handleSelectWinner(player.id)}
>
  {isWinner && <Ionicons name="trophy" size={14} color="#FFFFFF" />}
  <Text style={[styles.winnerChipLabel, !isWinner && { color: player.color }]}>
    {player.name}
  </Text>
</Pressable>
```

**Destacado en la tabla de jugadores:**

- Fila del ganador: fondo tenue del color del jugador (`color + '18'` = 10% de opacidad)
- Dot reemplazado por ícono de trofeo en el color del jugador
- Nombre en bold y color del jugador

```tsx
style={[
  styles.tableRow,
  isWinner && { backgroundColor: player.color + '18' },
]}
```

### Diseño de interacción

- Toggle permite corregir errores sin buscar un botón de "limpiar"
- El ganador no bloquea ni altera el resto del resumen (stats y MVP calculan igual)
- Dato en RAM: se pierde al tocar "Nueva partida" o "Inicio" (ambos llaman a `reset()`)

---

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
- `git push origin develop` → rama actualizada
- Issue #14 cerrado en GitHub

---

## Estado del backlog

Todos los issues del backlog v1 (#6–#14) están resueltos:

| Sprint | Issues | Estado |
|--------|--------|--------|
| Sprint 1 | #6, #7, #8, #9 | ✓ Completado |
| Sprint 2 | #10, #11 | ✓ Completado |
| Sprint 3 | #12, #13 | ✓ Completado |
| Sprint 4 | #14 | ✓ Completado |
