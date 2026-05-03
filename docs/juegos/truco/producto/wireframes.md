# Wireframes — Truco

---

## 1. Setup

```
┌─────────────────────────────────┐  fondo: #F5F2EE
│  ←        Truco                 │  header
├─────────────────────────────────┤
│                                 │
│  EQUIPOS                        │  section label (caps, pequeño)
│ ┌─────────────────────────────┐ │
│ │  ● Nosotros          ✏️     │ │  dot terracotta + nombre + lápiz
│ │─────────────────────────────│ │  hairline
│ │  ● Ellos             ✏️     │ │  dot calm/azul + nombre + lápiz
│ └─────────────────────────────┘ │
│                                 │
│  PUNTOS PARA GANAR              │
│ ┌─────────────┐ ┌─────────────┐ │
│ │   15 pts    │ │ [ 30 pts ]  │ │  chips — el seleccionado tiene
│ └─────────────┘ └─────────────┘ │  borde terracotta + fondo suave
│                                 │
│  OPCIONES                       │
│ ┌─────────────────────────────┐ │
│ │ 🌸  Flor              ◯──  │ │  toggle off
│ │     Habilitar flor          │ │
│ │─────────────────────────────│ │
│ │ 🎤  Reconocimiento de voz   │ │
│ │     Detecta cantos por voz  │ │  toggle on
│ │                        ──●  │ │
│ └─────────────────────────────┘ │
│                                 │
│                                 │
│                 ↕ espacio flex  │
│                                 │
├─────────────────────────────────┤  borde superior hairline
│ ┌─────────────────────────────┐ │
│ │  ▶▶  Continuar partida      │ │  solo visible si hay partida
│ └─────────────────────────────┘ │  guardada — fondo calm (#3B5068)
│ ┌─────────────────────────────┐ │
│ │  ▶   Nueva partida          │ │  fondo terracotta (#C4614A)
│ └─────────────────────────────┘ │  (dice "Iniciar partida" si no hay
│                                 │   partida guardada)
└─────────────────────────────────┘
```

**Estado: editando nombre del equipo**

```
│ ┌─────────────────────────────┐ │
│ │  ● Nosotros_                │ │  input con borde inferior terracotta
│ │             ────────────    │ │  autoFocus, teclado visible
│ └─────────────────────────────┘ │
```

---

## 2. Scoreboard

### 2a. Estado normal (jugando)

```
┌─────────────────────────────────┐  fondo: #3B5068
│ 🎤 Escuchando       Mano 3     │  header — chip voz + número de mano
├────────────────┬────────────────┤
│                │                │
│  ● Nosotros    │    Ellos ●     │  dot + nombre equipo
│                │                │
│      14        │       8        │  puntaje — display semibold grande
│                │                │
│  ||||  ||||    │  ||||  |||     │  palitos tally marks
│  |||| /        │                │  4 verticales + 1 diagonal = 5 pts
│                │                │
│  las buenas    │   las malas    │  fase — caption, terciario
│                │                │
│                │                │
│                │                │
├─────────────────────────────────┤
│                                 │  CantoZone — ver estados abajo
│          [ idle ]               │
│                                 │
├─────────────────────────────────┤
│  Envido    Truco    Manual      │  fila principal — 3 botones iguales
│  Nva mano  Deshacer  Fin        │  fila secundaria — más pequeños
└─────────────────────────────────┘
```

---

### 2b. CantoZone — estado PENDING

```
├─────────────────────────────────┤
│                                 │
│        Real Envido              │  nombre del canto — display medium
│        vale 5 pts               │  puntos en juego — caption, terciario
│                                 │
│  ┌───────────┐  ┌────────────┐  │
│  │  Quiero   │  │ No quiero  │  │  Quiero: primario (terracotta)
│  └───────────┘  └────────────┘  │  No quiero: secundario (translúcido)
│                                 │
├─────────────────────────────────┤
```

---

### 2c. CantoZone — estado RESOLVING

```
├─────────────────────────────────┤
│                                 │
│   ¿Quién ganó el envido?        │  pregunta — body, blanco
│                                 │
│  ┌───────────┐  ┌────────────┐  │
│  │ Nosotros  │  │   Ellos    │  │  un botón por equipo
│  └───────────┘  └────────────┘  │  ambos secundarios (translúcidos)
│                                 │
├─────────────────────────────────┤
```

---

### 2d. CantoZone — estado CONFIRMING

```
├─────────────────────────────────┤
│                                 │
│      +5 pts para Nosotros       │  puntos a acreditar — display medium
│                                 │
│  ┌───────────┐  ┌────────────┐  │
│  │ Confirmar │  │  Cancelar  │  │  Confirmar: verde / primario
│  └───────────┘  └────────────┘  │  Cancelar: texto terciario
│                                 │
├─────────────────────────────────┤
```

---

### 2e. Palitos (tally marks) — detalle

```
  0 pts   1 pt    2 pts   3 pts   4 pts   5 pts
  [ ]     [|]     [||]    [|||]   [||||]  [||||/]

  6 pts              10 pts             14 pts
  [||||/] [|]        [||||/] [||||/]    [||||/] [||||/] [||||]
```

Cada grupo de 5 es una "mano de palitos". El puntaje total se
representa con grupos completos + palitos sueltos.

---

## 3. Summary

```
┌─────────────────────────────────┐  fondo: #3B5068
│                                 │
│                                 │
│              🏆                 │  trofeo — terracotta, 48px
│                                 │
│             Ganó                │  caption, rgba(255,255,255,0.6)
│                                 │
│           Nosotros              │  display semibold, 48sp, blanco
│                                 │
│ ┌─────────────────────────────┐ │
│ │  ● Nosotros  30 — 21  Ellos ●│ │  card puntaje final
│ └─────────────────────────────┘ │  rgba(255,255,255,0.10)
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Manos jugadas          12  │ │
│ │  Pts Nosotros           54  │ │  card estadísticas
│ │  Pts Ellos              38  │ │  rgba(255,255,255,0.06)
│ └─────────────────────────────┘ │  valores en mono medium
│                                 │
│                                 │
│                 ↕ espacio flex  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🔄  Revancha               │ │  primario — terracotta
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │      Nueva partida          │ │  secundario — translúcido blanco
│ └─────────────────────────────┘ │
│        Volver al inicio         │  texto pequeño, terciario
│                                 │
└─────────────────────────────────┘
```

---

## Flujo de navegación

```
Home
 └── /games/truco/setup
          │
          ├── [Continuar partida] ──────────────────────┐
          │                                             │
          └── [Iniciar / Nueva partida]                 │
                    │                                   │
                    ▼                                   ▼
          /games/truco/scoreboard ◄────────────────────┘
                    │
                    ├── gameStatus === 'finished'
                    │         │
                    │         ▼
                    │  /games/truco/summary
                    │         │
                    │         ├── [Revancha] ──► scoreboard
                    │         ├── [Nueva partida] ──► setup
                    │         └── [Volver al inicio] ──► /
                    │
                    └── [Fin de partida manual] ──► /
```
