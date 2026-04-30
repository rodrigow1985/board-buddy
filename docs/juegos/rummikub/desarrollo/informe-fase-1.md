# Informe — Fase 1: Setup del proyecto

**Fecha:** 2026-04-25  
**Commit:** `5dd3b5f`  
**Estado:** ✅ Completada

---

## Qué se implementó

### Stack final

| Capa | Versión |
|------|---------|
| Expo SDK | 54.0.33 |
| React Native | 0.81.5 |
| React | 19.1.0 |
| Expo Router | 6.0.23 |
| Reanimated | **4.1.1** (no 2/3 — ver nota) |
| TypeScript | 5.9.2 |

### Archivos creados

- `package.json` — todas las dependencias instaladas, Jest configurado
- `app.json` — nombre "Board Buddy", permisos de micrófono (Android + iOS), colores de splash (`#FAF6F0`)
- `tsconfig.json` — `strict: true`, path aliases `@/*` y `@src/*`
- `babel.config.js` — preset expo + plugin `react-native-worklets/plugin`
- `src/constants/tokens.ts` — design tokens completos: Colors, Fonts, FontWeights, FontSizes, Spacing, Radii, Shadows, HitTargets, Animations
- `src/constants/defaults.ts` — valores predeterminados de configuración
- `app/_layout.tsx` — carga de las 11 variantes de fuente (Fraunces, Inter, JetBrainsMono), SplashScreen bloqueante
- `app/index.tsx`, `app/settings.tsx` — placeholders Home y Settings
- `app/games/rummikub/_layout.tsx`, `setup.tsx`, `timer.tsx`, `summary.tsx` — placeholders del módulo Rummikub

### Estructura de carpetas creada

```
app/games/rummikub/
src/components/timer/
src/components/common/
src/components/layout/
src/store/
src/hooks/
src/utils/
src/constants/
assets/images/      (íconos default del template)
assets/sounds/      (timer-end.mp3)
```

---

## Decisiones tomadas durante la fase

### Reanimated 4 en lugar de 2/3

El template de Expo SDK 54 incluye `react-native-reanimated@4.1.1` y `react-native-worklets@0.5.1`. En Reanimated 4, los worklets se movieron a un paquete separado. La API pública (`useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`) es compatible hacia atrás — el código de Fase 3 no cambia.

La configuración de Babel cambió: en lugar de `react-native-reanimated/plugin` se usa `react-native-worklets/plugin`.

### expo-speech-recognition v3.1.3

La versión `^4.5.0` que estaba en el plan no existe aún. Se usa `3.1.3` (latest en npm). La API es la misma.

### reactCompiler desactivado

El template SDK 54 incluía `experiments.reactCompiler: true` en `app.json`. Se removió para evitar comportamientos inesperados con Zustand y Reanimated en fases tempranas.

---

## Verificaciones realizadas

- `npx tsc --noEmit` → sin errores
- `npm install` → 528 paquetes, sin errores críticos (19 advisories de bajo/moderado impacto, ninguno en dependencias directas)
- Estructura de carpetas creada y verificada
- Fuentes registradas en `_layout.tsx`

---

## Pendiente antes de primera ejecución en dispositivo

- Configurar `.gitignore` para `node_modules/` y `.expo/`
- Reemplazar íconos default del template con assets reales de Board Buddy
- Ejecutar en Expo Go para verificar carga de fuentes en dispositivo físico

---

## Próxima fase

**Fase 2 — Lógica del temporizador (núcleo)**  
Ver rodrigow1985/board-buddy#2
