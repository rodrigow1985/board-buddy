# Documentación — Board Buddy

## Qué es Board Buddy

**Board Buddy** es una app móvil (React Native + Expo) que facilita juegos de mesa con turnos cronometrados como Rummikub o Scrabble. La feature central del MVP es un **temporizador por turno a pantalla completa** con **reconocimiento de voz**: decir "paso" cambia automáticamente el turno al siguiente jugador sin tocar el teléfono.

**Flujo principal:** Home → Configurar partida (tiempo, jugadores, nombres) → Temporizador en juego → Resumen de partida.

**Pantalla clave — el temporizador:**
- Ocupa toda la pantalla, diseño inmersivo
- Una barra de progreso vertical que se vacía de arriba hacia abajo
- El tiempo restante en tipografía gigante (≥80pt) centrada
- Nombre del jugador actual + "Sigue: [próximo jugador]"
- 3 botones grandes: Pausar / Reiniciar turno / Pasar turno
- Estados de color: **azul/verde** (tiempo abundante) → **naranja** (≤20% restante, barra pulsa) → **flash rojo** (tiempo agotado)
- Ícono de micrófono en esquina: verde (escuchando), gris (pausado)
- Al vencer el tiempo: flash rojo + vibración + sonido, auto-reinicia el mismo jugador

**Público:** 2 a 8 jugadores, rango etario amplio. Prioridad: claridad, botones grandes (≥48dp), nada escondido.

## Producto

| Documento | Descripción |
|-----------|-------------|
| [vision-producto.md](./producto/vision-producto.md) | Visión, objetivos y alcance del producto |
| [especificacion-funcional.md](./producto/especificacion-funcional.md) | Requerimientos funcionales detallados |
| [pantallas-wireframes.md](./producto/pantallas-wireframes.md) | Wireframes de todas las pantallas |
| [flujos-usuario.md](./producto/flujos-usuario.md) | Flujos completos de usuario |

## Desarrollo

| Documento | Descripción |
|-----------|-------------|
| [arquitectura.md](./desarrollo/arquitectura.md) | Stack, estructura de carpetas y decisiones de diseño |
| [plan-desarrollo.md](./desarrollo/plan-desarrollo.md) | Plan de desarrollo por fases con criterios de aceptación |

---

## Estado del MVP

**Fase actual:** Setup del proyecto (Fase 1 de 5)

### Módulos planificados (roadmap)

- [x] Temporizador por turno con voz — **MVP en progreso**
- [ ] Marcador de puntos por jugador
- [ ] Juego: Truco
- [ ] Juego: Generala
- [ ] Juego: Uno
- [ ] Multijugador en red local
