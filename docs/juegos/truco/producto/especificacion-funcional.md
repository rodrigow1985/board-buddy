# Especificación Funcional — Truco Argentino

## Visión del módulo

**Marcador inteligente con reconocimiento de voz** para partidas de Truco Argentino. La app escucha los cantos de los jugadores (envido, truco, quiero, etc.), muestra en tiempo real qué está en juego y cuántos puntos hay apostados, y espera confirmación del jugador para actualizar el marcador.

No es un juego digital: es un **compañero de mesa** que lleva la cuenta por vos.

---

## RF-01 — Configuración de partida

### Parámetros configurables

| Parámetro | Tipo | Default | Restricciones |
|-----------|------|---------|---------------|
| Modalidad | Selector | Mano a mano | Mano a mano / Parejas / Tríos |
| Nombre equipo 1 | Texto | "Nosotros" | Máximo 15 caracteres |
| Nombre equipo 2 | Texto | "Ellos" | Máximo 15 caracteres |
| Flor habilitada | Booleano | Desactivado | Solo aplica si se juega con flor |
| Puntos para ganar | Selector | 30 | 15 o 30 |
| Detección de voz | Booleano | Activado | — |

### Notas
- En mano a mano se juega 1 vs 1 (sin señas, sin compañeros)
- En parejas y tríos la app no necesita saber quién es cada jugador individual, solo los equipos
- Persistencia: se guarda la última configuración

---

## RF-02 — Pantalla principal: Marcador

La pantalla central de la partida. Dividida visualmente en **dos mitades** (un equipo cada una).

### Elementos del marcador

```
┌─────────────────────────────────────────┐
│          🎙 Escuchando                  │
├───────────────────┬─────────────────────┤
│                   │                     │
│    NOSOTROS       │       ELLOS         │
│                   │                     │
│   ||||  ||||      │     ||||  ||        │
│   ||||            │                     │
│                   │                     │
│      19           │        12           │
│                   │                     │
│   ── buenas ──    │   ── malas ──       │
│                   │                     │
├───────────────────┴─────────────────────┤
│                                         │
│        [ Estado de la mano ]            │
│     ej: "Truco cantado — 2 pts"         │
│                                         │
├─────────────────────────────────────────┤
│   [+Envido]  [+Truco]  [+Manual]        │
│                                         │
│           [Fin de partida]              │
└─────────────────────────────────────────┘
```

### Detalles

- **Puntos**: se muestran en formato numérico grande + representación visual de palitos (cajitas de 5)
- **Las malas / Las buenas**: indicador de en qué mitad está cada equipo (0-14 malas, 15-29 buenas)
- **Estado de la mano**: zona central que muestra qué está en juego (ver RF-04)
- **Botones manuales**: para agregar puntos cuando la voz no captura un canto

---

## RF-03 — Reconocimiento de voz: palabras clave

La app escucha continuamente y detecta las siguientes palabras/frases:

### Cantos de envido

| Palabra clave | Acción |
|---------------|--------|
| "envido" | Registra canto de Envido |
| "real envido" | Registra canto de Real Envido |
| "falta envido" | Registra canto de Falta Envido |

### Cantos de truco

| Palabra clave | Acción |
|---------------|--------|
| "truco" | Registra canto de Truco |
| "retruco" | Registra canto de Retruco |
| "vale cuatro" | Registra canto de Vale Cuatro |

### Respuestas

| Palabra clave | Acción |
|---------------|--------|
| "quiero" | Acepta el canto pendiente |
| "no quiero" | Rechaza el canto pendiente |
| "me voy al mazo" / "mazo" | Abandona la mano |

### Flor (si está habilitada)

| Palabra clave | Acción |
|---------------|--------|
| "flor" | Registra canto de Flor |
| "contra flor" | Registra Contra Flor |

### Notas de implementación
- Se reutiliza `useVoiceDetection` adaptado para múltiples palabras clave
- La detección debe ser fuzzy: "embido" debe matchear con "envido" (es común que el reconocedor confunda letras)
- Priorizar frases compuestas: "real envido" debe detectarse como una unidad, no como "envido" solo
- Se puede usar el mismo `expo-speech-recognition` con `continuous: true`

---

## RF-04 — Estado de la mano y flujo de cantos

### Máquina de estados de la mano

```
idle ──→ envido_cantado ──→ envido_querido ──→ resolver_envido
  │            │                                      │
  │            └──→ envido_no_querido ─────────────────┤
  │                                                    │
  ├──→ truco_cantado ──→ truco_querido                 │
  │          │                │                        │
  │          │                └──→ retruco_cantado     │
  │          │                        │                │
  │          │                        └──→ ...         │
  │          │                                         │
  │          └──→ truco_no_querido                     │
  │                                                    │
  └──→ mano_terminada ←───────────────────────────────┘
```

### Zona de estado en pantalla

Cuando se detecta un canto, la zona central muestra:

**Ejemplo: flujo de envido**

```
Estado 1: "🎤 ENVIDO cantado"
          "En juego: 2 pts"
          [Quiero]  [No quiero]

Estado 2 (si quieren): "ENVIDO querido"
          "¿Quién ganó?"
          [Nosotros ▸ puntos?]  [Ellos ▸ puntos?]

Estado 3 (confirmar): "NOSOTROS gana envido"
          "+2 puntos"
          [✓ Confirmar]  [✗ Cancelar]
```

**Ejemplo: flujo de truco**

```
Estado 1: "🎤 TRUCO cantado"
          "En juego: 2 pts"
          [Quiero]  [No quiero]  [Retruco]

Estado 2 (no quieren): "Truco no querido"
          "¿Quién cantó?"
          [Nosotros +1]  [Ellos +1]
          [✓ Confirmar]  [✗ Cancelar]
```

### Acumulación de puntos

En una misma mano se pueden acumular puntos de envido + truco:

```
Envido querido → Nosotros gana envido (+2)
Truco querido → Retruco querido → Ellos gana retruco (+3)

Resultado de la mano:
  Nosotros: +2 (envido)
  Ellos: +3 (retruco)
```

---

## RF-05 — Puntos en juego según canto

### Envido

| Secuencia de cantos | Si quieren | Si no quieren |
|---------------------|-----------|---------------|
| Envido | 2 pts | 1 pt al que cantó |
| Envido + Envido | 4 pts | 2 pts al que cantó |
| Envido + Real Envido | 5 pts | 2 pts al que cantó |
| Envido + Envido + Real Envido | 7 pts | 4 pts al que cantó |
| Real Envido | 3 pts | 1 pt al que cantó |
| Falta Envido | Puntos restantes para ganar | 1 pt al que cantó |
| Envido + Falta Envido | Puntos restantes para ganar | 2 pts al que cantó |

### Truco

| Canto | Si quieren | Si no quieren |
|-------|-----------|---------------|
| Truco | 2 pts | 1 pt al que cantó |
| Truco → Retruco | 3 pts | 2 pts al que cantó |
| Truco → Retruco → Vale Cuatro | 4 pts | 3 pts al que cantó |

### Flor (si habilitada)

| Situación | Puntos |
|-----------|--------|
| Flor sin respuesta | 3 pts directos |
| Flor + Contra Flor | 6 pts al ganador |
| Flor + Contra Flor al Resto | Puntos restantes para ganar |

---

## RF-06 — Controles manuales

Para cuando la voz no captura un canto o los jugadores prefieren marcar a mano:

### Botón "+Envido"
Abre un mini-flujo manual:
1. ¿Qué se cantó? → Envido / Real Envido / Falta Envido
2. ¿Lo quisieron? → Sí / No
3. Si sí: ¿Quién ganó? → Equipo 1 / Equipo 2
4. Confirmar → suma puntos

### Botón "+Truco"
1. ¿Hasta dónde se cantó? → Truco / Retruco / Vale Cuatro
2. ¿Lo quisieron? → Sí / No
3. Si sí: ¿Quién ganó? → Equipo 1 / Equipo 2
4. Confirmar → suma puntos

### Botón "+Manual"
Agrega puntos arbitrarios a cualquier equipo (para corregir errores).

### Botón "Deshacer"
Deshace la última operación de puntos (con confirmación).

---

## RF-07 — Fin de partida

### Condición de victoria
Un equipo llega a **30 puntos** (o 15 si se eligió partida corta).

### Pantalla de victoria
- Equipo ganador en grande
- Puntaje final de ambos equipos
- Historial resumido de la partida (cuántas manos, quién cantó más truco, etc.)
- Botón "Nueva partida" (mantiene equipos) y "Volver al inicio"

---

## RF-08 — Feedback visual y sonoro

| Evento | Visual | Sonoro | Háptico |
|--------|--------|--------|---------|
| Canto detectado por voz | Banner animado con el canto | Tono suave de confirmación | Vibración corta |
| Puntos confirmados | Animación de puntos sumándose | — | — |
| Equipo entra en "las buenas" | Cambio de color/estilo del marcador | Sonido de logro | Vibración media |
| Victoria | Pantalla completa con animación | Sonido de victoria | Vibración larga |
| Error de detección / corrección | Flash naranja | — | — |

---

## RF-09 — Persistencia

- **Partida en curso**: se guarda automáticamente. Si la app se cierra, se puede retomar.
- **Historial**: registro de partidas anteriores (opcional para v2).
- **Configuración**: se persiste igual que en Rummikub (AsyncStorage).

---

## Pantallas del módulo

| Pantalla | Ruta propuesta |
|----------|---------------|
| Configuración de partida | `screens/games/truco/setup.tsx` |
| Marcador principal | `screens/games/truco/scoreboard.tsx` |
| Resumen de partida | `screens/games/truco/summary.tsx` |

---

## Diferencias clave vs. Rummikub

| Aspecto | Rummikub | Truco |
|---------|----------|-------|
| Función principal | Temporizador de turno | Marcador de puntos |
| Voz detecta | 1 palabra ("paso") | ~15 palabras/frases |
| Estado de la mano | Simple (running/paused/timeout) | Complejo (máquina de estados con cantos) |
| Puntuación | No hay | Sistema de 30 puntos con malas/buenas |
| Confirmación | Automática (pasa turno) | Manual (el jugador confirma los puntos) |
| Controles manuales | No necesarios | Esenciales como fallback |
