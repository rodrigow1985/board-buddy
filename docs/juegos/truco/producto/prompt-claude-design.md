# Prompt para Claude Design — Truco

---

Diseñá las pantallas de **Truco** para una app móvil de juegos de mesa llamada **Board Buddy** (React Native / Expo). El stack visual usa StyleSheet nativo, sin librerías de UI externas.

---

## Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `calm` | `#3B5068` | Fondo oscuro (scoreboard, summary) |
| `terracotta` | `#C4614A` | Acento primario, CTA, equipo 1 |
| `bg` | `#F5F2EE` | Fondo claro (setup) |
| `surface` | `#FFFFFF` | Cards en modo claro |
| `ink` | `#1A1A2E` | Texto principal en modo claro |

Sobre fondo oscuro:
- Texto primario: `#FFFFFF`
- Texto secundario: `rgba(255,255,255,0.6)`
- Texto terciario: `rgba(255,255,255,0.4)`
- Superficie translúcida: `rgba(255,255,255,0.10–0.15)`

---

## Tipografía

- **Display** (semibold / medium): puntajes grandes, nombre del ganador, títulos
- **Sans** (regular / medium / semibold): etiquetas, botones, navegación
- **Mono** (medium): valores estadísticos

---

## Principios de interacción

- Opacity 0.7 al presionar cualquier botón
- Chips: borde coloreado + fondo suave al seleccionar
- Inputs: borde inferior `terracotta` al editar
- Todos los botones mínimo **48dp de alto**
- Esquinas: **pill** para CTAs, **lg (16dp)** para cards

---

## Pantallas

### 1. Setup

Fondo claro (`#F5F2EE`). Flujo de configuración antes de empezar.

**Elementos:**
- Header: botón back (izquierda) + título "Truco" (centrado)
- **Sección Equipos**: dos filas, cada una con un dot de color (terracotta / calm), nombre editable del equipo (máx. 15 caracteres), ícono de lápiz
- **Sección Puntos para ganar**: dos chips horizontales — "15 pts" y "30 pts". El seleccionado tiene borde terracotta y fondo suave
- **Sección Opciones**: dos toggles — "Flor" (con subtítulo "Habilitar el canto de flor") y "Reconocimiento de voz" (con subtítulo "Detecta cantos por voz")
- **CTAs fijos al fondo** (aparecen según estado):
  - Si hay partida guardada: botón "Continuar partida" (fondo calm/azul) encima del botón principal
  - Siempre visible: botón primario "Iniciar partida" (fondo terracotta) — cambia a "Nueva partida" si hay partida guardada

---

### 2. Scoreboard

Fondo oscuro (`#3B5068`). Pantalla principal durante la partida. Inmersiva, sin navegación visible.

**Header (fila superior):**
- Izquierda: chip de estado de voz (ícono micrófono + texto "Escuchando" / "Pausado")
- Derecha: texto "Mano N"

**Marcador (ocupa la mayor parte de la pantalla):**
- Dos paneles lado a lado divididos por una línea vertical sutil
- Cada panel contiene:
  - Dot de color + nombre del equipo (arriba)
  - Número de puntaje grande (centro, display semibold)
  - **Palitos estilo tally marks argentinos** debajo del número: 4 palitos verticales y 1 diagonal cruzándolos = 5 puntos. Los palitos se van llenando de a uno por punto
  - Etiqueta de fase debajo: "las malas" (0–14 pts) o "las buenas" (15–29 pts)

**CantoZone (centro, entre marcador y controles):**
Zone dinámica que cambia según el estado del canto activo. Cuatro estados:

- **Idle**: vacío o indicación sutil de "esperando canto"
- **Pending** (canto cantado, esperando respuesta): nombre del canto (ej. "Real Envido"), puntos en juego (ej. "vale 5 pts"), botones "Quiero" (primario) y "No quiero" (secundario)
- **Resolving** (envido querido, hay que saber quién ganó): texto "¿Quién ganó el envido?" + dos botones, uno por equipo
- **Confirming** (puntos listos para confirmar): texto "+5 pts para [equipo]", botones "Confirmar" (verde) y "Cancelar"

**Controles manuales (fondo):**
- Fila principal: tres botones iguales — "Envido", "Truco", "Manual"
- Fila secundaria (más pequeña): "Nueva mano", "Deshacer", "Fin de partida"

---

### 3. Summary

Fondo oscuro (`#3B5068`). Pantalla de fin de partida.

**Elementos de arriba a abajo:**
- Ícono de trofeo (acento terracotta)
- Texto pequeño "Ganó"
- Nombre del equipo ganador en display grande (48–56sp, blanco)
- **Card de puntaje final**: fila con dot equipo 1 + nombre + puntaje — guión — puntaje + nombre + dot equipo 2
- **Card de estadísticas** (fondo más sutil):
  - Manos jugadas: N
  - Pts [equipo 1]: N
  - Pts [equipo 2]: N
- **Tres acciones al fondo**:
  1. "Revancha" — botón primario (terracotta) con ícono de refresh
  2. "Nueva partida" — botón secundario (translúcido blanco)
  3. "Volver al inicio" — botón de texto pequeño (terciario)

---

## Contexto adicional

- La app ya tiene un juego implementado (Rummikub) con el mismo lenguaje visual. Las pantallas de Truco deben verse como parte de la misma app.
- El scoreboard debe sentirse **inmersivo**: pantalla completa, sin distracciones, fácil de operar con una mano mientras se sostienen cartas con la otra.
- Los palitos (tally marks) son un elemento cultural importante: los jugadores argentinos están acostumbrados a llevar el puntaje así en papel. Es un diferenciador visual clave.
