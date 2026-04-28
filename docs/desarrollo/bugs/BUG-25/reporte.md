# BUG-25 — Barra de navegación de Android visible con fondo negro en timer

**Issue:** rodrigow1985/board-buddy#25
**Fecha reporte:** 2026-04-27
**Severidad:** Media
**Estado:** Abierto

---

## Descripción
En la pantalla del timer, la barra de navegación de Android (botones |||, O, <) aparece superpuesta sobre el contenido, y debajo de los botones hay una barra negra sólida que no pertenece al diseño de la app.

## Pasos para reproducir
1. Instalar build preview en Android con navegación de 3 botones
2. Iniciar una partida
3. Observar la parte inferior de la pantalla del timer

## Comportamiento esperado
La barra de navegación de Android es transparente y el color de fondo de la app se extiende detrás de los botones sin mostrar un bloque negro.

## Comportamiento actual
- Los 3 botones de navegación del sistema son visibles como overlay
- Debajo de los botones hay una barra negra sólida

## Entorno
- Build: preview (EAS)
- Plataforma: Android (3-button navigation)

---

## Análisis

### Causa raíz

Con `edgeToEdgeEnabled: true` en `app.json` (Expo SDK 54), el contenido de la app se extiende detrás de la barra de navegación del sistema. Sin embargo:

1. Android agrega un scrim oscuro/negro detrás de los botones de navegación para darles visibilidad
2. La app no usa `expo-navigation-bar` para configurar ese fondo como transparente
3. El color de la barra de navegación del sistema queda como negro opaco en lugar de transparente

### Archivos afectados
- `app/app.json` — `edgeToEdgeEnabled: true` activo sin configuración de navigation bar
- `app/screens/games/rummikub/timer.tsx` — pantalla que necesita sincronizar el color de la nav bar

---

## Plan de solución

1. **Instalar `expo-navigation-bar`** para controlar el estilo de la barra de navegación de Android
2. **En `timer.tsx`**: usar `NavigationBar.setBackgroundColorAsync` para sincronizar el color de la barra de navegación con el estado del timer (verde, amarillo, rojo, gris)
3. **Estilo de botones**: usar `NavigationBar.setButtonStyleAsync('light')` para que los iconos sean blancos (legibles sobre fondos oscuros)
