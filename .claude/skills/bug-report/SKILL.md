---
name: bug-report
description: Workflow completo para reportar, documentar, implementar y cerrar bugs en Board Buddy. Crea la estructura de carpetas, el issue de GitHub, la rama y el informe final.
---

# Bug Report — Workflow

Workflow para tratar bugs que el usuario reporta durante las pruebas de la app.

## Cuándo usar este skill

Invocar `/bug-report` cuando el usuario describe algo que falla, se comporta distinto a lo esperado, o produce un error en pantalla.

---

## Paso 1 — Determinar el ID del bug

1. Revisar los issues abiertos/cerrados en GitHub para determinar el próximo número:
   ```
   mcp__github__list_issues (owner: rodrigow1985, repo: board-buddy, state: all)
   ```
2. El ID del bug será el número del issue que se va a crear (no inventarlo antes).
3. Revisar si ya existe una carpeta en `docs/desarrollo/bugs/` para no duplicar.

---

## Paso 2 — Recopilar información del bug

Si el usuario no la proporcionó, preguntar:
- **¿Qué estabas haciendo cuando ocurrió?** (pasos para reproducir)
- **¿Qué esperabas que pasara?**
- **¿Qué pasó en cambio?** (incluir mensaje de error exacto si lo hay)
- **¿En qué dispositivo / versión de la app?**

---

## Paso 3 — Crear el issue en GitHub

Crear el issue con este template:

```markdown
## Descripción
[Qué falla, en qué pantalla, bajo qué condición]

## Pasos para reproducir
1. ...
2. ...
3. ...

## Comportamiento esperado
[Qué debería pasar]

## Comportamiento actual
[Qué pasa en cambio / error exacto]

## Entorno
- Dispositivo: [modelo]
- Android / iOS: [versión]
- Build: [development / preview / production]

## Causa probable
[Análisis inicial si se puede deducir del reporte]
```

Labels sugeridos: `bug` + severidad (`prioridad-alta` / `prioridad-media` / `prioridad-baja`)

---

## Paso 4 — Crear la carpeta del bug

Estructura en `docs/desarrollo/bugs/BUG-{número}/`:

```
docs/desarrollo/bugs/
└── BUG-{número}/
    ├── reporte.md        ← se crea ahora
    └── informe.md        ← se crea al cierre
```

### Template de `reporte.md`

```markdown
# BUG-{número} — {título}

**Issue:** rodrigow1985/board-buddy#{número}
**Fecha reporte:** {fecha}
**Severidad:** Alta / Media / Baja
**Estado:** Abierto

---

## Descripción
{descripción del bug}

## Pasos para reproducir
1. ...

## Comportamiento esperado
{qué debería pasar}

## Comportamiento actual
{qué pasa}

## Entorno
- Dispositivo: {modelo}
- SO: Android {versión} / iOS {versión}
- Build: {tipo}

---

## Análisis

### Causa raíz
{completar durante la investigación}

### Archivos afectados
- `{archivo}:{línea}` — {por qué}

---

## Plan de solución
{describir el approach antes de implementar}
```

---

## Paso 5 — Crear la rama

```bash
git checkout develop
git pull origin develop
git checkout -b bug/{número}-{slug-del-titulo}
```

Ejemplos de nombres:
- `bug/15-timer-no-para-en-pausa`
- `bug/16-voz-no-detecta-paso-en-timeout`

**¿Conviene una rama por bug?**
Sí. Permite:
- Revisar el fix aislado antes de mergear
- Revertir sin afectar otros cambios
- PR limpio por bug (fácil de leer en GitHub)
- Cherry-pick si hace falta llevar el fix a otra rama

---

## Paso 6 — Investigar y corregir

1. Leer los archivos afectados antes de modificar
2. Reproducir mentalmente el bug rastreando el flujo de código
3. Documentar la causa raíz en `reporte.md` → sección "Análisis"
4. Implementar el fix mínimo necesario (no refactorizar alrededor)
5. Correr TypeScript y tests:
   ```bash
   cd app && npx tsc --noEmit
   cd app && npx jest --no-coverage
   ```

---

## Paso 7 — Commit en la rama del bug

```bash
git add {archivos modificados}
git commit -m "fix(BUG-{número}): {descripción corta del fix}

{explicación de causa raíz y approach}

Issue: #{número}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Paso 8 — Crear el informe de cierre

Crear `docs/desarrollo/bugs/BUG-{número}/informe.md`:

```markdown
# Informe BUG-{número} — {título}

**Fecha:** {fecha}
**Commit:** `{hash}`
**Issue cerrado:** rodrigow1985/board-buddy#{número}
**Rama:** `bug/{número}-{slug}`

---

## Causa raíz
{explicación técnica concisa}

## Cambios

### `{archivo}`
```ts
// Antes
{código anterior}

// Después
{código nuevo}
```

## Verificaciones
- `npx tsc --noEmit` → sin errores
- `npx jest --no-coverage` → {N}/N tests pasando
```

---

## Paso 9 — Push, PR y cierre

```bash
git push origin bug/{número}-{slug}
```

Crear PR hacia `develop`:
- Título: `fix(BUG-{número}): {título del bug}`
- Body: referencia al issue y resumen del fix

Cerrar el issue en GitHub:
```
mcp__github__update_issue (state: closed)
```

Actualizar `reporte.md` → Estado: **Cerrado ✓**

---

## Paso 10 — Subir docs a main

Subir `docs/desarrollo/bugs/BUG-{número}/` al branch `main` vía MCP (sin código):
```
mcp__github__create_or_update_file (branch: main)
```

---

## Resumen rápido

```
/bug-report → recopilar info → crear issue → crear carpeta + reporte.md
           → rama bug/N-slug → investigar → fix → tsc + jest
           → commit → informe.md → push → PR → cerrar issue → docs a main
```
