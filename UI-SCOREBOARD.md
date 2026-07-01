# UI-SCOREBOARD — Black Capital

> Estado del loop de `LOOP-UI-UX.md`. Se actualiza en el momento, unidad por unidad.
> Estados: `PENDIENTE` · `EN CURSO` · `10/10 ✅ (fecha)` · `RE-VERIFICAR` · `BLOQUEADA (causa)`
> Nota: criterios aprobados de 10 (rúbrica en LOOP-UI-UX.md). `N/V` = no verificable con justificación.

## Tier 1 — Componentes compartidos (arreglan muchas páginas de golpe)

| Unidad | Archivos clave | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Header + nav (desktop/mobile) | `layout/header/*`, `Header.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | Fixes: wrapper 72px>64px eliminado; focus-visible underline; dedupe dropdowns; dead code fuera; warning Radix drawer silenciado |
| Footer | `layout/Footer.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | Fixes: targets sociales 44px en móvil; indentación. ⚠️ DATO CLIENTE: email `contacto@blackmx.vercel.app` y URLs de redes son placeholders (contact-config.ts) |
| Sistema de botones/inputs/forms | `ui/button.tsx`, `ui/input.tsx`, `ui/form.tsx`, `ui/select.tsx`, `ui/textarea.tsx`, `public/contact-lead-form.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | ui/* shadcn stock OK; fixes en contact-lead-form: bug currentTarget post-await (P1), grid móvil 1 col, aria-labels, role=alert |
| Cards y badges | `ui/card.tsx`, `ui/badge.tsx`, `property/PropertyCard.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | Fixes: traslape badges/botones (right-28), targets 44px móvil, CTA 44px. ⚠️ DATO CLIENTE: existe "CASA EN VENTA DE PRUEBA" en inventario de producción |
| Overlays (dialog/drawer/dropdown/tooltip) | `ui/dialog.tsx`, `ui/drawer.tsx`, `ui/dropdown-menu.tsx`, `admin/admin-tooltip.tsx`, `property/DocumentCard.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | drawer ya corregido en u.1; role=alert en errores de DocumentCard; ModeToggle (dead code) eliminado. Flujo de documentos verificado por código (API de producción, no ejecutable) |
| Motion (transiciones/reveals) | `motion/*`, `ui/motion.tsx`, `ui/reveal-text.tsx`, `layout/PageTransition.tsx`, `layout/ScrollProgress.tsx` | — | PENDIENTE | respetar `prefers-reduced-motion` |
| WhatsAppFloat + toasts | `layout/WhatsAppFloat.tsx`, `ui/sonner.tsx` | — | PENDIENTE | |
| Shared section primitives | `shared/SectionHeader.tsx`, `shared/PageHero.tsx`, `shared/eyebrow.tsx`, `layout/Section.tsx` | — | PENDIENTE | |

## Tier 2 — Páginas públicas core

| Unidad | Ruta | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Home (todas sus secciones: hero, lines, featured, zones, methodology, testimonials, FAQ, tools) | `/` | — | PENDIENTE | |
| Inventario (catálogo + filtros + empty state) | `/inventario` | — | PENDIENTE | |
| Ficha de propiedad (galería, métricas, specs, agente, sticky bar, docs, mapa) | `/inventario/[slug]` | — | PENDIENTE | |
| Contacto (form de leads) | `/contacto` | — | PENDIENTE | form: verificar solo validación client-side, NO enviar leads reales |
| Herramientas (calculadora hipotecaria) | `/herramientas` | — | PENDIENTE | |
| Nosotros + historia + valores + equipo | `/nosotros/*` | — | PENDIENTE | |
| Legales | `/legal/*` | — | PENDIENTE | |

## Tier 3 — Sub-marcas (×3: business, luxury, industrial)

| Unidad | Ruta | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Black Business (home + inventario + contacto) | `/black-business/*` | — | PENDIENTE | |
| Black Luxury (home + inventario + contacto + manifesto/criteria) | `/black-luxury/*` | — | PENDIENTE | |
| Black Industrial (home + inventario + contacto) | `/black-industrial/*` | — | PENDIENTE | |

## Tier 4 — Admin

| Unidad | Ruta | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Login / setup / reset / update-password | `/admin/login` etc. | — | PENDIENTE | no probar con credenciales reales inventadas en loop infinito |
| Dashboard + sidebar + topbar | `/admin` | — | PENDIENTE | |
| Properties (lista + form new/edit) | `/admin/properties/*` | — | PENDIENTE | ⚠️ SOLO lectura visual; no guardar contra producción |
| Agents (lista + detalle + form) | `/admin/agents/*` | — | PENDIENTE | ⚠️ ídem |
| Leads (lista + detalle) | `/admin/leads/*` | — | PENDIENTE | ⚠️ ídem |
| Users + settings + account | `/admin/users`, `/admin/settings`, `/admin/account` | — | PENDIENTE | no romper guard server-side ya aplicado |

## Fase 6 — Regresión global

| Chequeo | Estado |
|---|---|
| Recorrido 375/768/1280 de Tier 2 completo | PENDIENTE |
| Consola limpia en navegación completa | PENDIENTE |
| typecheck + lint + build finales en 0 | PENDIENTE |

## Bloqueadas / N/V

_(vacío)_

## Registro de fixes por unidad

- **2026-07-01 · Overlays → 10/10.** `role="alert"` en los 3 mensajes de error de `DocumentCard.tsx` (dialog de solicitud de documentos); eliminado `mode-toggle.tsx` (dead code: sin imports y el público es dark-only vía ThemeGuard). Dialog/dropdown-menu shadcn stock OK; AdminTooltip ya tenía nombre accesible; drawer corregido en unidad 1. El flujo de documentos se verificó por lectura de código: `FormData(event.currentTarget)` se lee antes del await (sin el bug del contact form); no ejecutable en vivo porque hasta abrir el dialog dispara POST a producción. tsc 0, lint 0.

- **2026-07-01 · Cards y badges → 10/10.** En `PropertyCard.tsx`: los badges superiores (RESIDENCIAL/DESTACADA) se traslapaban con favorito/compartir en móvil → contenedor con `right-28` para que envuelvan antes de la zona de botones; favorito/compartir a 44×44 en móvil (`h-11 w-11 sm:h-9 sm:w-9`); CTA "Solicitar información" `min-h-10`→`min-h-11`. `ui/badge.tsx` y `ui/card.tsx` shadcn stock sin cambios. Verificado móvil/tablet/desktop sin traslape, tsc 0, lint 0. Nota cliente: propiedad de prueba visible en producción.

- **2026-07-01 · Sistema forms → 10/10.** Bug P1 en `contact-lead-form.tsx`: `event.currentTarget.reset()` tras el `await` lanzaba TypeError (React anula currentTarget) → todo envío EXITOSO mostraba "No se pudo enviar" aunque el lead sí se creaba; capturado `form` antes del await. Además: grid 1 col en móvil (antes 2 cols apretadas en 375px), `aria-label` en los 5 campos (solo tenían placeholder), `role="alert"` en el mensaje de error, indentación del Button. Verificado: móvil 1 col campos 285px, tablet 2 cols, validación nativa bloquea submit vacío sin tocar red, tsc 0, lint 0. NO se envió ningún lead real (Supabase producción).

- **2026-07-01 · Footer → 10/10.** Targets táctiles de redes sociales a 44×44px en móvil (`w-11 h-11 sm:w-9 sm:h-9`); indentación rota del `<li>` de horarios. Verificado: móvil (sin overflow, 44px), tablet (4 cols una fila), desktop (grid 12), tsc 0, lint 0. Pendiente de DATOS del cliente: email real y URLs reales de redes en `src/lib/contact-config.ts`.

- **2026-07-01 · Header + nav → 10/10.** (1) Eliminado div interno redundante `min-h-[72px]` que desbordaba 8px el contenedor `h-16` en móvil. (2) `focus-visible:after:scale-x-100` en navLinkBase: el underline dorado ahora indica foco de teclado. (3) `ventaDropdown`/`rentaDropdown` duplicados → `verticalesDropdown`; eliminado `corporativoLinks` (dead code). (4) `ui/drawer.tsx`: `aria-describedby={undefined}` silencia warning de Radix en consola. (5) `eslint.config.mjs`: ignora `Plantilla-layout/` y artefactos de test (lint pasaba a rojo por la plantilla de referencia). Verificado: móvil/tablet/desktop, drawer 17 links, dropdown con gradiente ok, tsc 0, lint 0.
