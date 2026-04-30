# Visión del Producto

## Problema que resuelve

Los juegos de mesa que tienen turno cronometrado (Rummikub, Scrabble, ajedrez casual, etc.) requieren que alguien esté pendiente del reloj o del teléfono, lo que interrumpe la experiencia de juego. Además, el paso de turno verbal —como decir "paso" en Rummikub— exige que otro jugador esté atento para reiniciar el cronómetro manualmente.

## Propuesta de valor

Una app que:
1. **Automatiza el control del tiempo** por turno, liberando a todos los jugadores para concentrarse en el juego.
2. **Detecta comandos de voz** ("paso") para cambiar de turno sin tocar el teléfono.
3. **Crece junto a la mesa**: cada juego popular puede tener su propio módulo con reglas específicas.

## Usuarios objetivo

- Jugadores habituales de mesa que buscan facilidad, no complejidad.
- Grupos de 2 a 8 personas.
- Rango de edad amplio: debe ser intuitivo para alguien que nunca usó la app.

## Principios de diseño

| Principio | Descripción |
|-----------|-------------|
| **Inmersivo** | La pantalla del temporizador no distrae: muestra solo lo que importa |
| **Táctil y claro** | Botones grandes, tipografía legible, sin menus escondidos |
| **Confiable** | El cronómetro no se puede detener accidentalmente |
| **Silencioso** | La detección de voz no interrumpe la conversación del juego |
| **Escalable** | Nuevo juego = nuevo módulo, sin romper lo existente |

## MVP — Alcance

El MVP entrega **únicamente** el temporizador para Rummikub:

- Configuración del tiempo por turno (predeterminado: 2 minutos)
- Configuración del número de jugadores (2 a 8)
- Nombres opcionales para cada jugador
- Temporizador visual a pantalla completa con animación de cuenta regresiva
- Detección de la palabra "paso" por micrófono para cambiar de turno
- Cambio de turno también con botón manual
- Pausa y reanudación
- Reset manual del turno actual
- Al terminar el tiempo: efecto visual + sonido suave + auto-reinicio del turno del mismo jugador

## Fuera del MVP

- Historial de partidas
- Estadísticas por jugador
- Otros juegos
- Modo multijugador en red
- Personalización de temas visuales
