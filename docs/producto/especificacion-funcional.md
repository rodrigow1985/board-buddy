# Especificación Funcional

## Módulo 1: Temporizador (MVP)

---

### RF-01 — Configuración de partida

**Descripción:** Antes de iniciar el temporizador, el usuario configura los parámetros de la partida.

**Parámetros configurables:**

| Parámetro | Tipo | Valor predeterminado | Restricciones |
|-----------|------|---------------------|---------------|
| Tiempo por turno | Minutos : Segundos | 2:00 | Mínimo 0:10 / Máximo 10:00 |
| Cantidad de jugadores | Número | 4 | Mínimo 2 / Máximo 8 |
| Nombres de jugadores | Texto | "Jugador 1", "Jugador 2"… | Opcional, máximo 20 caracteres |
| Detección de voz | Booleano | Activado | — |
| Palabra de paso | Texto | "paso" | Solo una palabra, máximo 15 caracteres |
| Sonido al vencer el tiempo | Booleano | Activado | — |
| Vibración al vencer el tiempo | Booleano | Activado | — |

**Persistencia:** La configuración se guarda automáticamente. Al reabrir la app, se carga la última configuración usada.

---

### RF-02 — Pantalla del temporizador

**Descripción:** Pantalla principal durante la partida. Ocupa toda la pantalla del dispositivo.

**Elementos visuales:**

1. **Barra de progreso vertical** (fondo de pantalla): ocupa el 100% del alto. Al inicio del turno está llena. Se vacía de arriba hacia abajo conforme pasa el tiempo. Cuando llega al fondo = tiempo agotado.
2. **Nombre del jugador actual** — centrado en la parte superior, tipografía grande.
3. **Tiempo restante en segundos** — centrado en el medio de la pantalla, tipografía muy grande (≥80pt), mostrando `MM:SS`.
4. **Indicador de jugador siguiente** — texto pequeño en la parte inferior mostrando quién juega después.
5. **Botones de control** — debajo del tiempo, fila horizontal:
   - **Pausar / Reanudar** (ícono play/pause)
   - **Reiniciar turno** (ícono reset/loop)
   - **Pasar turno** (ícono flecha adelante)

**Estados del temporizador:**

| Estado | Color de fondo | Comportamiento |
|--------|---------------|----------------|
| Corriendo | Azul/verde intenso | Barra se vacía suavemente |
| Poco tiempo (≤20% restante) | Amarillo/naranja | Barra parpadea suavemente |
| Tiempo agotado | Rojo | Flash de pantalla + vibración + sonido |
| Pausado | Gris | Barra congelada, ícono pause visible |

**Transición de turno:**
- Al pasar turno (voz o botón): animación de slide horizontal hacia el siguiente jugador
- El nombre del jugador saliente sale por la izquierda, el entrante entra por la derecha
- La barra se reinicia inmediatamente al 100%

---

### RF-03 — Detección de voz

**Descripción:** La app escucha continuamente durante la partida y detecta la palabra configurada ("paso" por defecto).

**Comportamiento:**

1. El reconocimiento de voz se activa automáticamente al iniciar la partida (si está habilitado en config).
2. Escucha en modo continuo en segundo plano.
3. Al detectar "paso": se ejecuta exactamente la misma acción que presionar el botón "Pasar turno".
4. Feedback visual discreto: ícono de micrófono en esquina superior derecha indica estado (activo / pausado / error).
5. Si hay un error de permisos o el micrófono no está disponible, se muestra un aviso y la app sigue funcionando sin voz.
6. El reconocimiento de voz se pausa cuando el temporizador está en pausa.

**Estados del micrófono:**

| Estado | Ícono | Descripción |
|--------|-------|-------------|
| Escuchando | Micrófono verde | Todo OK |
| Pausado | Micrófono gris | Temporizador en pausa |
| Error | Micrófono rojo con ! | Sin permisos o error de hardware |
| Desactivado | Micrófono tachado | Usuario desactivó en config |

---

### RF-04 — Fin de tiempo

**Descripción:** Qué ocurre cuando el contador llega a 0:00.

**Secuencia:**
1. Flash rojo en toda la pantalla (300ms)
2. Vibración (si habilitada)
3. Sonido de alerta suave (si habilitado)
4. El nombre del jugador actual permanece visible
5. Después de 1 segundo: **el temporizador se reinicia automáticamente** para el mismo jugador (no pasa al siguiente)
6. El jugador debe decir "paso" o tocar el botón para ceder el turno

**Justificación:** En Rummikub, agotar el tiempo no significa perder el turno automáticamente; el jugador puede seguir si elige hacerlo.

---

### RF-05 — Pausa global

**Descripción:** Congela el temporizador del turno actual sin perder el estado.

**Comportamiento:**
- El tiempo restante queda congelado
- La barra de progreso queda congelada
- El micrófono deja de escuchar
- El botón cambia a "Reanudar"
- Al reanudar: continúa exactamente desde donde se pausó

---

### RF-06 — Historial de turno (sesión)

**Descripción:** Durante la partida, se lleva un registro en memoria (no persistido) de:
- Cuántos turnos jugó cada jugador
- Si el turno terminó por "paso" (voz), botón, o tiempo agotado

Este historial se usa para mostrar un resumen al finalizar la partida. No se guarda entre sesiones en el MVP.

---

### RF-07 — Fin de partida

**Descripción:** El usuario puede terminar la partida en cualquier momento.

**Acción:** Botón "Terminar partida" accesible desde el menú contextual (tres puntos en esquina) durante el juego.

**Al terminar:**
1. Muestra pantalla de resumen con el historial de la sesión
2. Botón "Nueva partida" (vuelve a configuración con los mismos parámetros)
3. Botón "Inicio" (vuelve al home de la app)

---

## Reglas de negocio

- No se puede iniciar partida con menos de 2 jugadores.
- El temporizador no puede iniciarse si está en configuración (debe volver a la pantalla de juego).
- Si la app pasa a segundo plano, el temporizador sigue corriendo (comportamiento de timer en background).
- Si la app se cierra inesperadamente y se reabre durante una partida, se muestra opción de "Continuar partida" o "Nueva partida".
