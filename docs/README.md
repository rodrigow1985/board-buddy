# Documentación — Board Buddy

## Qué es Board Buddy

**Board Buddy** es una app móvil (React Native + Expo) que facilita juegos de mesa con turnos cronometrados como Rummikub o Scrabble. La feature central del MVP es un **temporizador por turno a pantalla completa** con **reconocimiento de voz**: decir "paso" cambia automáticamente el turno al siguiente jugador sin tocar el teléfono.

**Flujo principal:** Home → Configurar partida (tiempo, jugadores, nombres) → Temporizador en juego → Resumen de partida.

**Público:** 2 a 8 jugadores, rango etario amplio. Prioridad: claridad, botones grandes (≥48dp), nada escondido.

---

## Estructura

```
docs/
├── plataforma/          ← infraestructura compartida por todos los juegos
│   ├── vision-producto.md
│   ├── arquitectura.md
│   └── bugs/            ← bugs de hooks, stores y nav (compartidos)
└── juegos/
    └── rummikub/        ← primer juego implementado
        ├── producto/    ← especificación, flujos, wireframes
        └── desarrollo/  ← plan, backlog, informes de fases y sprints
```

---

## Plataforma

| Documento | Descripción |
|-----------|-------------|
| [vision-producto.md](./plataforma/vision-producto.md) | Visión, objetivos y alcance de Board Buddy |
| [arquitectura.md](./plataforma/arquitectura.md) | Stack, estructura de carpetas y decisiones de diseño |

### Bugs resueltos

| Bug | Título | Severidad |
|-----|--------|-----------|
| [BUG-15](./plataforma/bugs/BUG-15/) | Voz no detecta "paso" — requiresOnDeviceRecognition | Alta |
| [BUG-16](./plataforma/bugs/BUG-16/) | Segundos corren más rápido de lo real | Alta |
| [BUG-22](./plataforma/bugs/BUG-22/) | Flicker paused/listening constante | Alta |
| [BUG-25](./plataforma/bugs/BUG-25/) | Barra de navegación Android con fondo negro | Media |

---

## Juegos

### Rummikub

| Documento | Descripción |
|-----------|-------------|
| [especificacion-funcional.md](./juegos/rummikub/producto/especificacion-funcional.md) | Requerimientos funcionales detallados |
| [flujos-usuario.md](./juegos/rummikub/producto/flujos-usuario.md) | Flujos completos de usuario |
| [pantallas-wireframes.md](./juegos/rummikub/producto/pantallas-wireframes.md) | Wireframes de todas las pantallas |
| [plan-desarrollo.md](./juegos/rummikub/desarrollo/plan-desarrollo.md) | Plan de desarrollo por fases |
| [backlog-v1.md](./juegos/rummikub/desarrollo/backlog-v1.md) | Backlog del MVP |

#### Informes de desarrollo

| Documento | Descripción |
|-----------|-------------|
| [informe-fase-1.md](./juegos/rummikub/desarrollo/informe-fase-1.md) | Setup del proyecto |
| [informe-fase-2.md](./juegos/rummikub/desarrollo/informe-fase-2.md) | Lógica del temporizador |
| [informe-fase-3.md](./juegos/rummikub/desarrollo/informe-fase-3.md) | Pantalla del temporizador |
| [informe-fase-4.md](./juegos/rummikub/desarrollo/informe-fase-4.md) | Detección de voz |
| [informe-fase-5.md](./juegos/rummikub/desarrollo/informe-fase-5.md) | Configuración y persistencia |

---

## Roadmap

- [x] Rummikub — temporizador por turno con voz (MVP)
- [ ] Marcador de puntos por jugador
- [ ] Nuevo juego (en definición)
