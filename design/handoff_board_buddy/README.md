# Handoff: Board Buddy — Mobile App (Android)

## Overview

**Board Buddy** es una app móvil que facilita juegos de mesa con turnos cronometrados (Rummikub, Scrabble, etc.). La feature central del MVP es un **temporizador por turno a pantalla completa** con **reconocimiento de voz**: el jugador dice "paso" y el turno cambia automáticamente al siguiente sin tocar el teléfono.

**Target stack:** React Native + Expo (Android primero).
**Audiencia:** 2 a 8 jugadores, edad 10+. Prioridad: claridad, hit-targets grandes (≥48dp), nada escondido.

**Pantallas incluidas (10):**
1. Home / Selector de juego
2. Configurar partida (tiempo, jugadores, asistencia)
3. Temporizador — corriendo (calm)
4. Temporizador — poco tiempo (≤20%)
5. Temporizador — tiempo agotado (alert)
6. Temporizador — pausado
7. Temporizador — transición de turno
8. Configuración global (Settings)
9. Editar nombre de jugador (modal inline + teclado)
10. Resumen de partida

---

## About the Design Files

Los archivos en `source/` son **referencias de diseño en HTML/JSX** — prototipos que muestran el look final y el comportamiento esperado, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en React Native + Expo** usando los patrones, librerías y estructura del codebase.

Abrí `source/Board Buddy.html` en cualquier navegador para ver todas las pantallas en un canvas pan/zoom. La toolbar trae un toggle "Tweaks" para previsualizar variantes de color y tipografía del timer.

## Fidelity

**Alta fidelidad (hi-fi).** Colores exactos, tipografías, espaciados y radios definidos. El developer debe recrear pixel-perfect ajustando proporciones a unidades de React Native (`dp` para tamaños, `sp` o `dp` para tipografía).

---

## Design Tokens

### Colors

| Token | Hex | Uso |
|---|---|---|
| `bg`        | `#FAF6F0` | Fondo principal de la app (sand) |
| `surface`   | `#FFFFFF` | Cards, inputs, sheets |
| `cream`     | `#F2EADC` | Cards inactivas, backgrounds secundarios |
| `ink`       | `#1F1A16` | Texto principal |
| `ink2`      | `#5C544C` | Texto secundario |
| `ink3`      | `#9A938A` | Hints, etiquetas |
| `hairline`  | `#E8E1D6` | Bordes y separadores |
| `terracotta`| `#C24E1B` | **Acento primario** (CTAs, focus, marca) |
| `terracottaSoft` | `#F4E2D6` | Backgrounds del acento |
| **States** |||
| `calm`      | `#3F6B5E` | Timer — tiempo abundante (forest) |
| `warn`      | `#D88A2F` | Timer — ≤20% tiempo (amber) |
| `alert`     | `#B23A1F` | Timer — tiempo agotado (brick) |
| `paused`    | `#5C544C` | Timer — pausa (desaturado) |

Avatares de jugadores rotan estos colores: `#C24E1B`, `#3F6B5E`, `#7C5C3A`, `#8A4F6B`.

### Typography

| Familia | Uso | Equivalente RN |
|---|---|---|
| **Inter** (400/500/600/700) | UI body, botones, labels | `Inter` (Expo Google Fonts) |
| **Fraunces** (300/400/500/600) | Display: títulos de pantalla, números del timer (default), nombres en summary | `Fraunces` (Expo Google Fonts) |
| **JetBrains Mono** (400/500/600) | Números tabulares (timer alt, contadores, tags), texto de "voz" | `JetBrainsMono` (Expo Google Fonts) |

**Escalas usadas:**
- Display XL (timer): `168` (default Fraunces) · `132` (mono variant) · `196` (editorial)
- Display L (titulares pantalla): `36–56`, weight 500, letter-spacing -0.6 a -1.5
- Display M (titulares cards): `22–28`, weight 500, letter-spacing -0.3 a -0.4
- Body: `15–16`, weight 400/500
- Caption: `12–13`, weight 400/500
- Overline: `11–13`, uppercase, letter-spacing 0.4–0.5

`fontVariantNumeric: 'tabular-nums'` en TODO número que cambia (timer, contadores, scores) → en RN usar `fontVariant: ['tabular-nums']`.

### Spacing

Sistema base de **4dp**. Padding de pantalla horizontal: `20–28dp`. Gap entre cards: `10–12dp`. Padding interno de cards: `16–22dp`.

### Radii

| Token | Valor | Uso |
|---|---|---|
| `sm` | `10dp` | Inputs, chips pequeños |
| `md` | `14–16dp` | Botones, cards de listado |
| `lg` | `18dp` | Cards principales, sheets |
| `pill` | `100dp` | Chips, status badges, botones de avatar |
| `circle` | radio = mitad del lado | Avatares, action buttons circulares |

### Shadows

Mínimas, dos niveles:
- **Hairline lift** (cards activas): `0 1px 0 rgba(0,0,0,.02), 0 6px 18px rgba(31,26,22,.04)`
- **Toggle thumb**: `0 1px 3px rgba(0,0,0,.18)`

### Hit-targets

Mínimo **48dp** en TODO botón. Action buttons del timer: `64dp` de alto. CTA principal: `56dp`. Stepper buttons: `44dp` (acompañados de áreas tappables más grandes en el padre).

---

## Screens

### 1. Home / Selector de juego
- **Layout vertical**, scroll desde arriba.
- **Header** (28px padding): "Hola" overline (`ink3`, 13px) + "Board Buddy" en Fraunces 36px. A la derecha, botón circular 44dp con ícono de settings.
- **Resume banner** (cuando hay partida en curso): card con `bg = terracottaSoft`, padding 16/18, ícono play en círculo terracotta + "Continuar partida" + subtítulo "Turno de [nombre] · [tiempo] restantes" + chevron derecho. Margen `0 20px 16px`.
- **Sección "Juegos"**: header (uppercase, 13px ink, weight 600) + contador "1 disponible" (12px ink3).
- **Game cards**: lista vertical, gap 12dp.
  - **Activa** (Rummikub): bg `surface`, border hairline, shadow lift, ícono cuadrado 56dp con bg `terracotta`/icon blanco, título Fraunces 22, badge "MVP" en pill terracottaSoft+terracotta texto, subtítulo 13px ink2, chevron derecho.
  - **Inactivas** (próximamente): bg `cream`, opacity 0.55, sin chevron, ícono gris.
- **Footer stats** (border-top hairline): 3 columnas — Partidas (14), Horas (9.2), Pasos por voz (78%). Valores en Fraunces 22, labels uppercase 11px ink3.

### 2. Configurar partida
- **TopNav**: back button (40dp circular) + subtítulo "Rummikub" (overline) + título "Nueva partida" (Fraunces 24).
- **Scrollable content** con secciones espaciadas por `FieldLabel` (overline 12px ink2, margin-top 24).
- **Tiempo por turno** — `Stepper`: card surface con borde hairline, padding 14/16, button `−` outline + valor central en JetBrainsMono 30px tabular + button `+` filled terracotta. Hint "ajustes de 15s".
- **Número de jugadores** — Stepper (mismo patrón), valor "4", hint "2 a 8".
- **Jugadores** — lista en card surface, separadores hairline. Cada row: avatar circular 36dp con inicial (color rota), nombre 16px weight 500, botón edit a la derecha (icono pencil 16px ink2).
- **Asistencia** — toggles. Cada row: ícono cuadrado 36dp en `cream`, título 15px + subtítulo 12px ink3, toggle a la derecha.
  - Detección de voz · "Decí 'paso' para cambiar turno" · ON
  - Sonido al vencer · "Tono suave de alerta" · ON
  - Vibración · OFF
- **Sticky CTA** (border-top): botón 56dp full-width terracotta con ícono play + "Iniciar partida".

### 3. Temporizador — corriendo (calm) **[PANTALLA HERO]**
**Full-bleed inmersivo. NO mostrar status bar como en otras pantallas — fondo oscuro full-screen.**
- **Bg = `calm` (#3F6B5E)**, color blanco.
- **Top horizontal progress bar**: 8dp de alto, `position: absolute top:0`, fondo `rgba(0,0,0,.18)`, fill blanco animado de 100%→0% durante el turno. Transition `width .3s linear`.
- **Top chrome** (padding 20):
  - Chip "Escuchando" (pill, bg `rgba(255,255,255,.14)`): dot 8dp verde `#7BE0A8` + label uppercase 12px weight 600.
  - Botón ⋯ a la derecha (44dp circular, `rgba(255,255,255,.14)`).
- **Centro vertical**:
  - **Player chip**: pill grande `rgba(0,0,0,.18)` con border `rgba(255,255,255,.18)`, padding 10/24, nombre uppercase 16px weight 600.
  - **Timer gigante**: Fraunces 168px, weight 400, letter-spacing -6, line-height 0.9, tabular-nums, color blanco. (Esta es la `bb-timer-display` que el tweak puede cambiar de familia/tamaño.)
  - **Sigue**: row con label "Sigue" (uppercase 13px white/65) + avatar 26dp con inicial + nombre 16px weight 500.
- **Action buttons** (3 botones, gap 12, padding bottom 28): cada uno 64dp alto, radius 18.
  - Primario (Pausar): bg blanco, ícono ink.
  - Secundarios (Reiniciar, Pasar): bg `rgba(255,255,255,.16)`, ícono blanco.
- **Voice hint**: pill flotante bottom-right "decí 'paso'" en JetBrainsMono 11px sobre `rgba(0,0,0,.25)`.

### 4. Temporizador — poco tiempo (≤20%)
Mismo layout que estado calm, **bg cambia a `warn` (#D88A2F)**, progress sigue bajando. Animación sugerida: pulso suave del bar (opacity 1↔0.85, 800ms) cuando entra en este estado. El timer puede parpadear (opacity 1↔0.7, 800ms).

### 5. Temporizador — tiempo agotado
- **Bg = `alert` (#B23A1F)**, full screen flash 300ms al llegar a 0:00.
- Sin top bar de progreso.
- Centro: chip "RODRIGO" + "0:00" en Fraunces 168.
- **Toast inferior**: pill blanca con ícono reloj alert + "¡Tiempo agotado!" en weight 700.
- "auto-reinicio en 1s" en JetBrainsMono 13px white/70.
- Border interno 8dp `rgba(255,255,255,.08)` (efecto de pulso visual).
- **Comportamiento**: vibración + sonido + auto-reinicia el mismo jugador a 100% después de 1s.

### 6. Temporizador — pausado
Misma layout que calm pero **bg = `paused` (#5C544C)**, timer con opacity 0.55, dot del chip en gris, banner adicional "PARTIDA EN PAUSA" en pill `rgba(255,255,255,.14)`. Botón primario cambia de pause a play.

### 7. Temporizador — transición de turno
Animación ~400ms al cambiar de jugador. Render simultáneo de:
- Jugador saliente: `translateX(-58%)`, opacity 0.45.
- Jugador entrante: `translateX(8%)`, opacity 1, ya con timer reiniciado a 2:00.
- Chip "Cambiando turno" en lugar del usual "Escuchando".
- Dots de progreso debajo (4 dots, segundo activo) — indicador de motion.
- Action buttons con opacity 0.6 (deshabilitados durante transición).

**En React Native** usar `Animated.View` con dos slots horizontales y animar `translateX` sincronizado.

### 8. Configuración global (Settings)
- **TopNav**: "Configuración".
- Secciones (mismo patrón `FieldLabel` + card):
  - **General**: Tema (Sistema), Idioma (Español), Tamaño de texto (Mediano). Todas filas tipo `NavRow` (label + valor + chevron).
  - **Voz**:
    - Toggle "Detección activada" ON.
    - Input "Palabra de paso": label sobre input bg/hairline, valor "paso" en JetBrainsMono 16px + cursor blink.
    - Slider "Sensibilidad": header con label + valor "Media" → track 4dp hairline + fill terracotta + thumb 24dp blanco con borde 2dp terracotta. Labels "Baja" / "Alta" en 11px ink3.
  - **Notificaciones**: Sonido al vencer + Vibración (toggles).
  - **Acerca de**: Versión 1.0.0 (disabled), Reportar problema, Términos y privacidad.

### 9. Editar nombre (modal inline)
- Pantalla de Setup pero la 2ª row de jugadores está expandida en modo edición:
  - Bg `cream`.
  - Overline "Editando jugador 2".
  - Avatar + input con border 2dp terracotta + cursor blinking + botón ✕ a la derecha.
- Botones inferiores: "Cancelar" (outline) + "Aceptar" (terracotta).
- Mock de teclado QWERTY abajo (en RN se usa el sistema, no replicar).

### 10. Resumen de partida
- **Header**: overline "Rummikub" + título Fraunces 36 "Fin de partida" + meta "34 minutos · 28 turnos · 20 pasos".
- **Tabla de jugadores** (card surface):
  - Cada row 16/18 padding. Winner: bg `terracottaSoft`. Medal emoji en columna 28dp + nombre weight 600 + meta JetBrainsMono "X turnos · Y voz · Z botón" + número de turnos en Fraunces 24 a la derecha.
  - Orden: Rodrigo 🥇 (8t · 6 voz), Ana 🥈 (7t · 5 voz), Carlos (6t · 4 botón), María (7t · 5 voz).
- **MVP highlight** (card cream): ícono mic en círculo terracotta + "78% de los pasos por voz" + sub.
- **Footer CTAs**: "Inicio" (outline, flex 1) + "Nueva partida" (terracotta, flex 1.4) con ícono play.

---

## Interactions & Behavior

### Voice recognition
- Activar al iniciar timer; pausar al pausar el timer.
- Reconocer la palabra trigger ("paso" por default; configurable). Sensibilidad ajustable.
- Si sin permisos: mostrar snackbar "Sin acceso al micrófono. Podés usar los botones para pasar turno." con acciones [Ir a ajustes] [Continuar].
- Indicador visual: chip "Escuchando" verde / "Pausado" gris en top-left.

### Timer states (state machine)
```
idle → running → (≤20%) warn → timeout → running (mismo jugador, reset)
                 ↘ paused ↗
                 ↘ transition → running (siguiente jugador)
```
- **calm → warn** cuando `progress ≤ 0.2`.
- **timeout**: 300ms flash rojo + vibration + sound, mensaje 1s, auto-restart mismo jugador.
- **transition**: animación 400ms slide horizontal, reinicia timer, avanza al siguiente jugador.

### Animaciones
| Elemento | Duración | Easing | Propiedad |
|---|---|---|---|
| Top progress bar | continuous | linear | width |
| State color transition | 250ms | ease-in-out | bg color |
| Warn pulse | 800ms loop | ease-in-out | opacity 1↔0.85 |
| Timeout flash | 300ms | ease-out | bg → alert |
| Turn transition | 400ms | ease-out | translateX |
| Toggle thumb | 180ms | ease | left position |

### Confirmaciones
- **Reiniciar turno**: toast no bloqueante "¿Reiniciar turno de [nombre]? [Sí] [No]" — auto-dismiss 3s = No.
- **Pasar turno** (botón): sin confirmación.
- **Terminar partida** (desde menú ⋯): alert modal.
- **Cambiar config durante partida**: alert "Cambiará pausará la partida. ¿Continuar?".

### Recovery
Al abrir la app si hay partida en curso (persistida): mostrar banner en Home "¿Continuar la partida de [juego]? Turno de [nombre] — [tiempo] restantes" con [Continuar] [Nueva partida].

---

## State Management

```ts
// Game session
{
  gameId: 'rummikub',
  players: [{ id, name, color, turns: 0, passesByVoice: 0, passesByButton: 0 }],
  currentPlayerIndex: number,
  turnDurationMs: 120_000,        // 2:00 default
  timeRemainingMs: number,
  status: 'idle'|'running'|'paused'|'timeout'|'transitioning'|'finished',
  startedAt: timestamp,
}

// Settings (persisted)
{
  voice: { enabled: bool, triggerWord: 'paso', sensitivity: 0.5 },
  audio:  { soundOnExpire: bool, vibration: bool },
  ui:     { theme: 'system'|'light'|'dark', language: 'es'|'en', textSize: 'sm'|'md'|'lg' },
}
```

Persistir en `AsyncStorage` o `expo-secure-store`. Al cerrar app durante partida, guardar snapshot completo para recovery.

---

## Component breakdown (sugerido)

```
<Frame> — wrapper full-screen, status bar handling
<TopNav title subtitle action>
<GameCard title subtitle active badge onPress>
<Stepper value onIncrement onDecrement hint>
<PlayerRow name index editable onEdit>
<ToggleRow icon title subtitle value onChange>
<NavRow label value onPress disabled>
<Slider value onChange labels>
<Toggle value onChange>

<TurnTimer
  variant="A"|"B"|"C"|"D"          // A es el default
  state="calm"|"warn"|"alert"|"paused"|"transitioning"
  timeMs={number}
  totalMs={number}
  player={{ name, ... }}
  next={{ name, ... }}
  onPause / onResume / onRestart / onSkip
  onVoicePass                       // callback cuando se detecta "paso"
/>
```

Las 4 variantes del timer comparten la misma API; sólo cambia el render. La variante A (Wall, forest fullbleed) es la que se eligió como default.

---

## Files

En `source/`:
- **`Board Buddy.html`** — entry point. Abrir en navegador para ver todo el sistema en un canvas.
- **`screens.jsx`** — Home, Setup, Settings, Edit, Summary + tokens en `BB`. **Empezar acá para los tokens y atoms.**
- **`timer-variants.jsx`** — Las 4 variantes del timer + estados (running, low-time, timeout, paused, transition).
- **`app.jsx`** — Root: arma el design canvas y el panel de Tweaks.
- `design-canvas.jsx`, `tweaks-panel.jsx` — solo presentación; no son parte del producto.

---

## Notas finales

- **Mantener tabular-nums siempre** en cualquier número que cambie en pantalla (evita "saltos" de ancho).
- **Hit targets ≥48dp**, sin excepciones — la app es para 10+ años y se usa con manos sucias de fichas.
- **El timer es la pantalla más importante**. Inmersividad > consistencia con el resto de la app. Status bar puede absorberse en el bg de color.
- **Reconocimiento de voz**: usar `@react-native-voice/voice` o `expo-speech-recognition`. El indicador "Escuchando" debe reflejar el estado real del listener.
