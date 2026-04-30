# Informe BUG-25 — Barra de navegación de Android visible con fondo negro en timer

**Fecha:** 2026-04-27
**Commit:** `7525719`
**Issue cerrado:** rodrigow1985/board-buddy#25
**Rama:** `bug/25-navbar-android-negro`

---

## Causa raíz

Con `edgeToEdgeEnabled: true` en `app.json` (Expo SDK 54), Android extiende el contenido de la app detrás de la barra de navegación del sistema. Sin embargo, el sistema dibuja un scrim negro detrás de los botones para darles visibilidad, y ese fondo quedaba negro porque la app no configuraba `expo-navigation-bar`.

## Cambios

### `app/screens/games/rummikub/timer.tsx`

```ts
// Antes — sin configuración de nav bar, scrim negro del sistema
// (no había ningún código relacionado)

// Después — sincroniza el color de la nav bar con el estado del timer
useEffect(() => {
  if (Platform.OS !== 'android') return;
  const color = BG_COLORS[bgIndexForStatus(status, isWarn)];
  NavigationBar.setBackgroundColorAsync(color);
  NavigationBar.setButtonStyleAsync('light');
}, [status, isWarn]);
```

### `app/package.json`
- Agregado: `expo-navigation-bar ~5.0.10`

## Verificaciones

- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → 70/70 tests pasando
