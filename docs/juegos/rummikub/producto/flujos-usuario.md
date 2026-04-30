# Flujos de Usuario

## Flujo 1 — Primera vez: configurar y jugar

```
Usuario abre la app por primera vez
        │
        ▼
[Home] — ve la card de Rummikub
        │
        │  Toca "Rummikub"
        ▼
[Configuración de partida]
  - Ajusta tiempo: 2:00 (ya predeterminado)
  - Ajusta jugadores: 4 (ya predeterminado)
  - Edita nombres: "Rodrigo", "Ana", "Carlos", "María"
  - Voz: ON (ya predeterminado)
        │
        │  Toca "INICIAR JUEGO"
        ▼
[Temporizador — corriendo]
  - La barra empieza a bajar para "Rodrigo"
  - El micrófono está escuchando
        │
        │  Rodrigo dice "paso"
        ▼
[Animación de transición]
  - "Rodrigo" sale por izquierda
  - "Ana" entra por derecha
  - Barra se reinicia al 100%
        │
        │  ... (continúa el juego)
        │
        │  Usuario toca [⋯] → "Terminar partida"
        ▼
[Resumen de partida]
        │
        │  Toca "Ir al inicio"
        ▼
[Home]
```

---

## Flujo 2 — Tiempo agotado y auto-reinicio

```
[Temporizador — corriendo]
  - Quedan 20 segundos: barra se vuelve naranja
  - Quedan 10 segundos: barra parpadea
        │
        │  El tiempo llega a 0:00
        ▼
[Tiempo agotado]
  - Flash rojo (300ms)
  - Vibración
  - Sonido de alerta
  - Aparece "¡Tiempo agotado!" en pantalla
        │
        │  Auto-reinicio después de 1 segundo
        ▼
[Temporizador — corriendo, mismo jugador]
  - La barra vuelve al 100% para el mismo jugador
  - El jugador puede seguir jugando
        │
        │  Jugador termina su turno diciendo "paso"
        ▼
[Transición al siguiente jugador]
```

---

## Flujo 3 — Pausa durante la partida

```
[Temporizador — corriendo]
        │
        │  Jugador toca [ ⏸ ]
        ▼
[Temporizador — pausado]
  - Barra congelada
  - Banner "PARTIDA EN PAUSA"
  - Micrófono inactivo
  - Botón cambia a [ ▶ ]
        │
        │  Jugador toca [ ▶ ]
        ▼
[Temporizador — corriendo]
  - Continúa desde donde se pausó
  - Micrófono activo nuevamente
```

---

## Flujo 4 — Reiniciar turno actual

```
[Temporizador — corriendo]
  - Rodrigo dice algo y quiere reiniciar SU turno
        │
        │  Toca [ 🔄 ]
        ▼
[Confirmación rápida] (toast no bloqueante)
  "¿Reiniciar turno de Rodrigo? [Sí] [No]"
  (desaparece en 3s sin acción = No)
        │
        │  Toca "Sí"
        ▼
[Temporizador — reiniciado para el mismo jugador]
  - La barra vuelve al 100%
  - El nombre del jugador no cambia
```

---

## Flujo 5 — Pasar turno manualmente

```
[Temporizador — corriendo]
        │
        │  Toca [ ⏭ ]
        ▼
[Animación de transición al siguiente jugador]
  - Igual que si hubiera dicho "paso"
  - Sin confirmación (acción rápida esperada)
```

---

## Flujo 6 — Error de micrófono

```
[Configuración de partida]
  - Voz: ON
        │
        │  Toca "INICIAR JUEGO"
        ▼
[Sistema solicita permiso de micrófono]
        │
        │  Usuario deniega el permiso
        ▼
[Toast / snackbar]
  "Sin acceso al micrófono. Podés usar los botones
   para pasar turno. [Ir a ajustes] [Continuar]"
        │
        ├── "Ir a ajustes" → abre config del sistema
        │
        └── "Continuar"
                │
                ▼
        [Temporizador — sin voz]
          - Ícono de micrófono con tachado rojo
          - Todo lo demás funciona normal
```

---

## Flujo 7 — Cambiar configuración durante partida

```
[Temporizador — corriendo]
        │
        │  Toca [ ⋯ ] (menú contextual)
        ▼
[Menú contextual aparece desde abajo]
  - Configuración de partida
  - Configuración global
  - Terminar partida
  - Cancelar
        │
        │  Toca "Configuración de partida"
        ▼
[Alerta]
  "Cambiar configuración pausará la partida actual.
   ¿Continuar?"
        │
        │  Confirma
        ▼
[Configuración de partida — modo edición]
  - Los cambios se aplican al siguiente turno
        │
        │  Toca "Guardar y volver"
        ▼
[Temporizador — pausado]
  - Usuario reanuda manualmente
```

---

## Flujo 8 — Recuperación tras cierre inesperado

```
Usuario cierra la app accidentalmente durante el juego
        │
        │  Reabre la app
        ▼
[Home con banner]
  "¿Continuar la partida de Rummikub?
   Turno de Ana — 1:12 restantes
   [Continuar] [Nueva partida]"
        │
        ├── "Continuar"
        │       ▼
        │   [Temporizador — pausado]
        │   (el usuario lo reanuda)
        │
        └── "Nueva partida"
                ▼
            [Configuración de partida]
            (con los parámetros de la partida anterior)
```
