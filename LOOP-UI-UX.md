# LOOP DE AUTOMEJORA UI/UX — Black Capital

> Objetivo: cada página, sección y componente del sitio califica **10/10** en la rúbrica de abajo.
> Este documento es el protocolo. El estado vive en `UI-SCOREBOARD.md` (misma carpeta).
> Para ejecutarlo en cualquier sesión: *"Ejecuta el loop de LOOP-UI-UX.md, continúa donde va el scoreboard."*

---

## Invariantes del cliente (NO tocar jamás)

1. **Colores del branding:** negro + dorado gradiente. Exigencia del cliente; no introducir otras paletas ni "suavizar" el dorado.
2. **Tipografía** actual del sitio.
3. **El marquee del hero.**
4. **El menú de hamburguesa en TODOS los dispositivos** (también desktop — no reemplazarlo por nav horizontal).
5. **Los contadores de 0 a total** (counters animados).

## Dirección de producto y copy (libertad con rumbo)

- El sitio **NO es boutique, ni plataforma, ni premium, ni lujo**. Es la página full-stack de una inmobiliaria para cargar y mostrar su inventario. Los colores oscuros/dorados son estética impuesta, no posicionamiento de lujo — el copy no debe sonar a "exclusividad", "curaduría", "selecto" ni jerga aspiracional.
- **Se puede (y debe) modificar componentes, secciones y copy** cuando mejore el resultado.
- **Más secciones es mejor**: si una página se siente corta o vacía, agregar secciones con contenido real (proceso de compra/venta, zonas, preguntas frecuentes, equipo, datos de mercado, testimonios) es una mejora válida dentro del loop.
- **La narrativa inmobiliaria manda**: cada página debe contar una historia clara para quien compra/vende/renta — qué hay, dónde está, cuánto cuesta, quién me atiende, qué sigue. Copy directo, en español natural de México.

## Reglas duras (leer antes de cada sesión)

1. **`.env.local` apunta a Supabase de PRODUCCIÓN.** Prohibido: llamar `/api/seed`, crear/editar/borrar propiedades o leads vía UI admin para probar. Los flujos de escritura se verifican por lectura de código + typecheck/build, nunca ejecutándolos contra datos reales.
2. **Verificación visual = preview MCP en :3000** (Playwright no instala en este entorno). Cada fix visual se comprueba con snapshot/inspect/screenshot, no "a ojo de código".
   - ⚠️ **Trampa de medición conocida:** el navegador del preview tiene zoom ≠ 100%, así que `window.innerWidth` y el ancho de elementos `position: fixed` reportan valores inflados (p. ej. 483 en vez de 375) y los screenshots pueden recortar el borde derecho. **Fuente de verdad:** `document.documentElement.clientWidth` para el viewport, `matchMedia` para el breakpoint, y para detectar overflow real escanear elementos **no-fixed** cuyo `right` exceda `clientWidth` sin ancestro con `overflow` clip/hidden/auto. No reportar overflow basado en `innerWidth`/`scrollWidth` a secas.
   - Los clicks por selector pueden fallar por el mismo desfase de coordenadas; si un click "no hace nada", reintentar con `preview_eval` → `el.click()` antes de declararlo bug.
   - **El texto cortado no aparece en scans de rects:** el overflow inline de un heading no expande su `getBoundingClientRect`. Revisar además `scrollWidth > clientWidth` en h1/h2/h3.
   - **Tailwind v4 reordena las reglas dentro de `@layer utilities`:** un override con @media dentro del layer puede quedar antes que la regla base; los overrides van fuera de @layer.
   - Cerrar el drawer/lightbox tras probarlo: vaul transforma el fondo y contamina TODAS las mediciones siguientes.
3. **Gates técnicos por iteración:** `npm run typecheck` (o `tsc --noEmit`), `npm run lint` y `npm run build` deben salir en 0 antes de calificar una unidad como cerrada.
4. **Commits:** un commit local por unidad cerrada (mensaje `ui: <unidad> a 10/10 — <resumen>`). Push a `origin/main` solo con autorización explícita del usuario.
5. **No romper lo ya endurecido:** guards de admin, CSP/headers, metadata OG, cleanup de Storage. Si un cambio de UI toca esas zonas, re-verificar.

---

## Rúbrica de calificación (10 criterios binarios; nota = criterios aprobados)

Una unidad es 10/10 solo si pasa **los 10**. Sin medios puntos: pasa o no pasa.

| # | Criterio | Cómo se verifica |
|---|----------|------------------|
| 1 | **Sin bugs funcionales** — todo elemento interactivo hace lo que promete; sin errores en consola | `preview_console_logs` limpio + interacción con `preview_click`/`preview_fill` |
| 2 | **Responsive móvil (375px)** — sin overflow horizontal, sin texto cortado, targets táctiles ≥44px | `preview_resize` mobile + snapshot + `document.body.scrollWidth <= innerWidth` |
| 3 | **Responsive tablet (768px)** — layout intencional, no un desktop apretado ni un móvil estirado | `preview_resize` tablet + screenshot |
| 4 | **Desktop (1280px+)** — jerarquía visual clara, sin líneas de texto >75ch, sin huecos raros | screenshot + inspect de max-width |
| 5 | **Tamaños y espaciado consistentes** — escala tipográfica y de spacing del design system, sin valores mágicos que desentonen entre secciones vecinas | `preview_inspect` de font-size/margin/padding + lectura del código |
| 6 | **Estética + narrativa** — negro/dorado consistente, radios y sombras coherentes; copy directo de inmobiliaria (sin tono lujo/boutique); la página cuenta una historia completa al visitante y no se siente vacía (ref: `Sistema Diseno Black-Capital.pdf`, `Plantilla-layout/` e Invariantes) | comparación visual + inspect de tokens + lectura crítica del copy |
| 7 | **Dark mode** (si la unidad lo soporta) — contraste correcto, sin fondos/textos invisibles | `preview_resize` con `colorScheme: dark` + inspect de contraste |
| 8 | **Accesibilidad** — headings jerárquicos, alt/aria-label presentes, foco visible, contraste AA | `preview_snapshot` (árbol de accesibilidad) + inspect |
| 9 | **Estados no ideales** — loading, vacío, error y datos incompletos no rompen el layout | lectura de código (guards, fallbacks) + simulación donde sea seguro |
| 10 | **Calidad de código** — sin duplicación evitable, sin CSS muerto, sin `any` nuevos, componentes con una responsabilidad, sin console.log | lectura de código + lint |

---

## Inventario de unidades

El scoreboard (`UI-SCOREBOARD.md`) lista las unidades en orden de prioridad:
primero componentes compartidos (arreglan muchas páginas de golpe), luego páginas públicas por tráfico, luego sub-marcas, luego admin.

---

## EL LOOP

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 0 · PREPARAR (una vez por sesión)                      │
│  - Leer UI-SCOREBOARD.md → tomar la primera unidad < 10     │
│  - preview_start del dev server; confirmar :3000 responde   │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 1 · ANALIZAR la unidad                                 │
│  - Leer el código fuente completo de la unidad               │
│  - Renderizarla en 375 / 768 / 1280 y dark mode              │
│  - snapshot + console_logs + network (failed) + inspect      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 2 · IDENTIFICAR hallazgos                              │
│  - Cada hallazgo con: evidencia concreta (medida, screenshot,│
│    línea de código), criterio de la rúbrica que viola        │
│  - Sin evidencia verificable → no es hallazgo, se descarta   │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 3 · CLASIFICAR                                         │
│  - Severidad: P0 roto · P1 se ve mal / molesta · P2 pulido   │
│  - Alcance: local (solo esta unidad) o transversal (token,   │
│    componente compartido) → lo transversal se arregla en su  │
│    unidad dueña, no con parches locales                      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 4 · CORREGIR                                           │
│  - En orden P0 → P1 → P2, editando el código fuente          │
│  - Tras cada fix: re-verificar con la misma herramienta que  │
│    encontró el problema (mismo viewport, mismo selector)     │
│  - Gates: typecheck + lint + build en 0                      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FASE 5 · CALIFICAR                                          │
│  - Pasar la rúbrica completa (los 10 criterios) desde cero,  │
│    con evidencia fresca — no reciclar la de Fase 1           │
│  - Anotar nota y criterios fallidos en UI-SCOREBOARD.md      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
                 ¿Nota == 10/10?
                  │           │
        NO ───────┘           └─────── SÍ
        │                              │
        ▼                              ▼
┌───────────────────────┐   ┌─────────────────────────────────┐
│  RETORNO DIRIGIDO      │   │  CERRAR unidad                  │
│  - Falló criterio      │   │  - Marcar 10/10 en scoreboard   │
│    técnico (1,9,10) →  │   │    con fecha y evidencia        │
│    volver a FASE 4     │   │  - Commit local                 │
│  - Falló visual        │   │  - ¿Quedan unidades < 10?       │
│    (2-8) → volver a    │   │    SÍ → FASE 1 con la siguiente │
│    FASE 1 (re-analizar,│   │    NO → FASE 6                  │
│    el diagnóstico pudo │   └─────────────────────────────────┘
│    ser incompleto)     │
│  - 3 intentos sin      │
│    pasar → marcar      │
│    BLOQUEADA con causa │
│    y seguir; reportar  │
│    al usuario al final │
└───────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FASE 6 · PASADA GLOBAL DE REGRESIÓN (cuando todo está 10)   │
│  - Recorrer las páginas principales en los 3 viewports:      │
│    los fixes transversales pudieron mover algo ya cerrado    │
│  - Consola limpia en navegación completa; build final en 0   │
│  - Si algo regresó a < 10 → esa unidad vuelve a FASE 1       │
│  - Si todo sigue en 10 → META ALCANZADA: reporte final con   │
│    resumen de fixes por unidad y pedir autorización de push  │
└─────────────────────────────────────────────────────────────┘
```

### Reglas anti-estancamiento

- **Máximo 3 ciclos** Fase 4↔5 por unidad; al tercero se marca `BLOQUEADA` con la causa exacta y el loop continúa con la siguiente unidad. Las bloqueadas se reportan juntas al usuario.
- **La nota nunca se infla.** Si un criterio no se pudo verificar (p. ej. requiere escribir en producción), se marca `N/V` con justificación; una unidad con `N/V` puede cerrarse en 10 solo si el criterio es inverificable por las Reglas duras, no por pereza.
- **Un fix transversal reabre unidades:** si se toca un token global, un componente `ui/` o `layout/`, todas las unidades ya cerradas que lo consumen bajan a estado `RE-VERIFICAR` en el scoreboard.
- **El scoreboard se actualiza en el momento**, no al final de la sesión — es lo que permite retomar el loop entre sesiones sin perder estado.
