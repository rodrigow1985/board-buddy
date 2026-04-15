# Contributing a Board Buddy

## Flujo de trabajo con Git

### Ramas

- `main` — rama principal, siempre estable y deployable
- `feat/<nombre>` — nueva funcionalidad (ej: `feat/voice-recognition`)
- `fix/<nombre>` — corrección de bug (ej: `fix/timer-reset-crash`)
- `chore/<nombre>` — tareas de mantenimiento sin impacto funcional (ej: `chore/update-deps`)
- `docs/<nombre>` — solo documentación (ej: `docs/contributing-guide`)

Nunca trabajar directamente sobre `main`. Toda tarea parte de una rama propia.

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope opcional>): <descripción corta en imperativo>
```

Tipos válidos:

| Tipo | Cuándo usarlo |
|------|---------------|
| `feat` | Nueva funcionalidad visible para el usuario |
| `fix` | Corrección de un bug |
| `refactor` | Cambio de código sin cambiar comportamiento |
| `style` | Formato, espacios, nombres (sin lógica) |
| `test` | Agregar o corregir tests |
| `docs` | Solo documentación |
| `chore` | Build, dependencias, config |

Ejemplos:

```
feat(timer): agregar cuenta regresiva con sonido al finalizar
fix(voice): corregir detección de "paso" en palabras compuestas
refactor(store): separar slice de jugadores del slice de configuración
```

Reglas:
- Descripción en español, en modo imperativo ("agregar", no "agrega" ni "agregado")
- Máximo 72 caracteres en la primera línea
- Sin punto final

### Pull Requests

1. Crear la rama desde `main` actualizado
2. Hacer los commits siguiendo la convención
3. Abrir un PR con título en formato Conventional Commits
4. El PR debe incluir:
   - **Qué** cambia y **por qué**
   - Capturas de pantalla o video si hay cambios visuales
   - Checklist de pruebas realizadas
5. Hacer squash & merge al integrar a `main`

### Template de PR

```markdown
## ¿Qué cambia?
<!-- Descripción breve del cambio -->

## ¿Por qué?
<!-- Motivación o issue relacionado -->

## Checklist
- [ ] Probado en Android
- [ ] Probado en iOS
- [ ] Tests actualizados
- [ ] Sin warnings de TypeScript
```

---

## Estándares de código

Definidos en `CLAUDE.md`:

- TypeScript estricto en todos los archivos
- Componentes funcionales con hooks
- Nombres en inglés para código, español para comentarios de negocio
- Un componente por archivo
- Props tipadas con `interface`, no `type`

---

## Tests

Antes de abrir un PR, correr:

```bash
npx jest
```

Los tests deben pasar. Si agregás funcionalidad nueva, incluí tests para el camino feliz como mínimo.

---

## Issues

Para reportar un bug o proponer una mejora, abrir un issue con:

- **Título claro** en formato `[Bug]` o `[Feature]`
- **Descripción** del problema o propuesta
- **Pasos para reproducir** (en caso de bug)
- **Contexto**: dispositivo, versión de OS, versión de la app
