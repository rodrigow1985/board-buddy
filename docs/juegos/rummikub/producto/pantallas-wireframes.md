# Pantallas y Wireframes

Convenciones:
- `[ ]` = botón o elemento interactivo
- `|` = borde de pantalla
- `░` = área con color de fondo
- `▓` = barra de progreso (llena)
- `·` = barra de progreso (vacía / consumida)
- `〇` = ícono circular
- `---` = separador visual

---

## Pantalla 1 — Home / Selector de juego

Pantalla inicial de la app. Punto de entrada para seleccionar qué juego/módulo usar.

```
┌─────────────────────────────┐
│                             │
│   🎲  Juegos de Mesa        │
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   ⏱  Rummikub         │  │
│  │   Temporizador        │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   ✚  Nuevo juego      │  │
│  │   (próximamente)      │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│                             │
│              ⚙              │
│         Configuración       │
└─────────────────────────────┘
```

**Elementos:**
- Logo / nombre de la app en la parte superior
- Cards de juegos disponibles (solo Rummikub en MVP)
- Cards de futuros juegos en estado "próximamente" (atenuados)
- Acceso a configuración global

---

## Pantalla 2 — Configuración de partida

Se accede desde el Home al tocar una card de juego, o desde el juego tocando "Nueva partida".

```
┌─────────────────────────────┐
│  ←   Configurar partida     │
├─────────────────────────────┤
│                             │
│  Tiempo por turno           │
│  ┌───────────────────────┐  │
│  │   -    2 : 00    +    │  │
│  └───────────────────────┘  │
│                             │
│  Número de jugadores        │
│  ┌───────────────────────┐  │
│  │   -       4      +    │  │
│  └───────────────────────┘  │
│                             │
│  Jugadores                  │
│  ┌───────────────────────┐  │
│  │  👤  Jugador 1   [✎] │  │
│  │  👤  Jugador 2   [✎] │  │
│  │  👤  Jugador 3   [✎] │  │
│  │  👤  Jugador 4   [✎] │  │
│  └───────────────────────┘  │
│                             │
│  Detección de voz           │
│  Palabra: "paso"      [ON]  │
│                             │
│  Sonido al vencer   [ON]    │
│  Vibración          [ON]    │
│                             │
│  ┌───────────────────────┐  │
│  │    ▶  INICIAR JUEGO   │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Interacciones:**
- `[+]` / `[-]` en tiempo por turno: incrementa/decrementa de a 15 segundos
- `[+]` / `[-]` en jugadores: agrega o quita la última fila de jugadores
- `[✎]` en cada jugador: abre inline un campo de texto para editar el nombre
- Toggle de voz, sonido y vibración: ON/OFF
- `INICIAR JUEGO`: navega a la pantalla del temporizador

---

## Pantalla 3 — Temporizador (estado: corriendo, tiempo abundante)

Pantalla principal durante la partida. Ocupa toda la pantalla incluyendo notch/status bar.

```
┌─────────────────────────────┐
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← barra llena (inicio de turno)
▓                           ▓
▓                           ▓
▓                           ▓
▓                           ▓
▓      ┌─────────────┐      ▓
▓      │  RODRIGO    │      ▓
▓      └─────────────┘      ▓
▓                           ▓
▓                           ▓
▓         1 : 47            ▓  ← tiempo grande, centrado
▓                           ▓
▓                           ▓
▓   [ ⏸ ]  [ 🔄 ]  [ ⏭ ]   ▓  ← botones grandes
▓                           ▓
▓       Sigue: Ana          ▓  ← siguiente jugador
▓                           ▓
▓                        🎙 ▓  ← ícono micrófono (esquina)
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
└─────────────────────────────┘
```

**Color de fondo:** Azul intenso / Verde azulado  
**Barra:** Ocupa todo el ancho, se vacía de arriba hacia abajo  
**Tiempo:** ~80-96pt, blanco, negrita  
**Nombre jugador actual:** ~24pt, blanco, negrita, con fondo semitransparente redondeado  

---

## Pantalla 4 — Temporizador (estado: poco tiempo restante)

Cuando queda ≤ 20% del tiempo (en un turno de 2min: ≤24 segundos).

```
┌─────────────────────────────┐
·····························  ← barra consumida (arriba)
·                           ·
·                           ·
·                           ·
·                           ·
·                           ·
·                           ·
·                           ·
·      ┌─────────────┐      ·
·      │  RODRIGO    │      ·
·      └─────────────┘      ·
·                           ·
·          0 : 18           ·  ← tiempo parpadeando
·                           ·
·   [ ⏸ ]  [ 🔄 ]  [ ⏭ ]  ·
·                           ·
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← barra restante (abajo, naranja)
└─────────────────────────────┘
```

**Color de fondo:** Fondo oscuro, la barra restante se vuelve naranja/ámbar  
**Tiempo:** Parpadeo suave (opacity 1.0 ↔ 0.7, período 800ms)  
**Barra:** Se torna naranja, pulsa levemente

---

## Pantalla 5 — Temporizador (estado: tiempo agotado)

Dura ~1 segundo antes del auto-reinicio del mismo jugador.

```
┌─────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← FLASH ROJO — toda la pantalla
│▓                           ▓│
│▓                           ▓│
│▓      ┌─────────────┐      ▓│
│▓      │  RODRIGO    │      ▓│
│▓      └─────────────┘      ▓│
│▓                           ▓│
│▓         0 : 00            ▓│
│▓                           ▓│
│▓   [ ⏸ ]  [ 🔄 ]  [ ⏭ ]  ▓│
│▓                           ▓│
│▓     ¡Tiempo agotado!      ▓│
│▓                           ▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────────┘
```

**Color:** Toda la pantalla en rojo intenso por 300ms, luego transición suave a azul con reinicio  
**Mensaje:** "¡Tiempo agotado!" aparece debajo del tiempo  
**Auto-reinicio:** 1 segundo después, la barra vuelve al 100% para el mismo jugador

---

## Pantalla 6 — Temporizador (estado: pausado)

```
┌─────────────────────────────┐
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓                           ▓
▓                           ▓  ← barra parcialmente vacía
▓                           ▓     (congelada)
·                           ·
·      ┌─────────────┐      ·
·      │  RODRIGO    │      ·
·      └─────────────┘      ·
·                           ·
·         1 : 12            ·  ← tiempo gris (no parpadea)
·                           ·
·   [ ▶ ]  [ 🔄 ]  [ ⏭ ]   ·  ← primer botón cambia a "Play"
·                           ·
·  ⏸  PARTIDA EN PAUSA      ·  ← banner de pausa
·                           ·
└─────────────────────────────┘
```

**Color:** Todo el fondo se desatura (gris azulado)  
**Banner:** "PARTIDA EN PAUSA" con fondo semitransparente oscuro  
**Micrófono:** Ícono gris (inactivo)  
**Botón play/pause:** Cambia a ícono de play (triángulo)

---

## Pantalla 7 — Transición de turno

Animación breve (~400ms) al pasar de jugador. No es una pantalla estática sino una animación:

```
ANTES (sale Rodrigo):                    DESPUÉS (entra Ana):

┌──────────────────┐           ┌──────────────────┐
▓                  ▓  ──────▶  ░                  ░
▓    RODRIGO       ▓           ░       ANA         ░
▓    1 : 47        ▓           ░       2 : 00      ░
▓                  ▓           ░                   ░
└──────────────────┘           └──────────────────┘
    sale por izquierda             entra por derecha
```

**Animación:** Slide horizontal. El contenido del turno saliente se desliza hacia la izquierda fuera de pantalla, el entrante viene desde la derecha. La barra se reinicia al 100% al mismo tiempo.

---

## Pantalla 8 — Configuración global (Settings)

Accesible desde el Home o desde el menú durante una partida.

```
┌─────────────────────────────┐
│  ←   Configuración          │
├─────────────────────────────┤
│                             │
│  GENERAL                    │
│  ─────────────────────────  │
│  Tema                       │
│  Oscuro              [  ▶] │
│                             │
│  Idioma                     │
│  Español             [  ▶] │
│                             │
│  VOZ                        │
│  ─────────────────────────  │
│  Detección activada   [ON]  │
│                             │
│  Palabra de paso            │
│  ┌────────────────────────┐ │
│  │  paso                  │ │
│  └────────────────────────┘ │
│                             │
│  Sensibilidad de voz        │
│  Baja   ●────────────  Alta │
│                             │
│  NOTIFICACIONES             │
│  ─────────────────────────  │
│  Sonido al vencer    [ON]   │
│  Vibración           [ON]   │
│                             │
│  ACERCA DE                  │
│  ─────────────────────────  │
│  Versión 1.0.0              │
│  Reportar problema    [  ▶] │
│                             │
└─────────────────────────────┘
```

---

## Pantalla 9 — Editar nombre de jugador (modal inline)

Se activa al tocar `[✎]` en la pantalla de configuración de partida.

```
┌─────────────────────────────┐
│  ←   Configurar partida     │
├─────────────────────────────┤
│  ...                        │
│                             │
│  Jugadores                  │
│  ┌───────────────────────┐  │
│  │  👤  Jugador 1   [✎] │  │
│  │  ┌─────────────────┐  │  │ ← campo de texto expandido
│  │  │  Rodrigo      ✕ │  │  │
│  │  └─────────────────┘  │  │
│  │  👤  Jugador 3   [✎] │  │
│  │  👤  Jugador 4   [✎] │  │
│  └───────────────────────┘  │
│                             │
│   ┌──────────┐              │
│   │  Aceptar │              │
│   └──────────┘              │
│                             │
│  ...                        │
└─────────────────────────────┘
```

**Teclado:** Se eleva desde abajo al activarse el campo  
**Confirmación:** Enter o botón "Aceptar"  
**Cancelar:** Teclado baja sin guardar (toque fuera del modal o ✕)

---

## Pantalla 10 — Resumen de partida

Aparece al finalizar la partida.

```
┌─────────────────────────────┐
│                             │
│        Fin de partida       │
│         Rummikub            │
│                             │
├─────────────────────────────┤
│                             │
│  Jugador       Turnos  Pasos│
│  ────────────────────────── │
│  🥇 Rodrigo      8     6v  │
│  🥈 Ana          7     5v  │
│     Carlos       6     4b  │
│     María        7     5v  │
│                             │
│  v = voz  b = botón         │
│                             │
│  Tiempo total: 34 min       │
│                             │
├─────────────────────────────┤
│                             │
│  [ 🔄  Nueva partida  ]     │
│                             │
│  [ 🏠  Ir al inicio   ]     │
│                             │
└─────────────────────────────┘
```

**Datos mostrados por jugador:**
- Nombre
- Cantidad de turnos jugados
- Cantidad de veces que pasó (indicando si fue por voz o botón)

---

## Mapa de navegación

```
Home
 ├── [ Card: Rummikub ] ──▶ Configuración de partida
 │                               │
 │                               ▼
 │                          Temporizador (en juego)
 │                               │
 │                         [ ⋯ Menú ] ──▶ Configuración global
 │                               │
 │                         [ Terminar ]
 │                               │
 │                               ▼
 │                          Resumen de partida
 │                               │
 │                    ┌──────────┴──────────┐
 │                    ▼                     ▼
 │              Nueva partida           Ir al inicio
 │              (Config. de partida)     (Home)
 │
 └── [ ⚙ Config. ] ──▶ Configuración global
```
