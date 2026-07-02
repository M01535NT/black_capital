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
| Motion (transiciones/reveals) | `motion/*`, `ui/motion.tsx`, `ui/reveal-text.tsx`, `layout/ScrollProgress.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | Doble transición de ruta eliminada (PageTransition borrado, queda RouteTransition en template.tsx); ScrollProgress respeta reduced-motion; el resto ya lo respetaba |
| WhatsAppFloat + toasts | `layout/WhatsAppFloat.tsx`, `ui/sonner.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | Sin cambios: target 56px, safe-area insets, aria-label, oculto en ficha (StickyContactBar), Toaster montado en root dark |
| Shared section primitives | `shared/SectionHeader.tsx`, `shared/PageHero.tsx`, `shared/eyebrow.tsx`, `layout/Section.tsx` | 10/10 | 10/10 ✅ (2026-07-01) | Solo indentación del h1 en PageHero; todo tokenizado, aria-label en Section, h1 único por página |

## Tier 2 — Páginas públicas core

| Unidad | Ruta | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Home (todas sus secciones: hero, lines, featured, zones, methodology, testimonials, FAQ, tools) | `/` | 10/10 | 10/10 ✅ (2026-07-01) | Counters restaurados a 0→total (fallback 1.8s los mataba); años operando unificados en CONTACT_CONFIG (⚠️ confirmar 8 vs 12 con cliente); aria-controls en FAQ; dead code fuera (HomeHeroHeadline, lib/stats.ts) |
| Inventario (catálogo + filtros + empty state) | `/inventario` | 10/10 | 10/10 ✅ (2026-07-01) | Comportamiento ya sólido (URL sync, empty state+CTA, limpiar, buscar); fixes: aria-pressed en 14 chips, aria-label en 3 inputs numéricos |
| Ficha de propiedad (galería, métricas, specs, agente, sticky bar, docs, mapa) | `/inventario/[slug]` | 10/10 | 10/10 ✅ (2026-07-01) | h2 "Descripción" duplicado eliminado; lightbox accesible (role=dialog + trigger teclado); guard StickyContactBar sin canales; a11y calculadora (slider + plazos) |
| Contacto (form de leads) | `/contacto` | 10/10 | 10/10 ✅ (2026-07-01) | Form corregido en unidad forms (bug P1 + a11y); página sin overflow, h1 claro, WA+mail directos |
| Herramientas (calculadoras) | `/herramientas` | 10/10 | 10/10 ✅ (2026-07-01) | NUEVO: 3 calculadoras funcionales (ROI, Flipping, ISAI) — el nav prometía #roi/#flipping/#isai y la página era solo catálogo estático |
| Nosotros + historia + valores + equipo | `/nosotros/*` | 10/10 | 10/10 ✅ (2026-07-01) | Fix transversal display-1 (titulares cortados); NextStepCTA en las 3 subpáginas (terminaban sin siguiente paso) |
| Legales | `/legal/*` | 10/10 | 10/10 ✅ (2026-07-01) | Sin cambios: limpias en móvil/desktop, headings sin clipping. Nota: el aviso de privacidad es breve (~1,575 chars) — revisión de fondo es tema legal del cliente |

## Tier 3 — Sub-marcas (×3: business, luxury, industrial)

| Unidad | Ruta | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Black Business (home + inventario + contacto) | `/black-business/*` | 10/10 | 10/10 ✅ (2026-07-01) | Sin jerga; overflow resuelto vía fix compartido; subrutas redirigen a páginas generales ya cerradas |
| Black Luxury (home + inventario + contacto + manifesto/criteria) | `/black-luxury/*` | 10/10 | 10/10 ✅ (2026-07-01) | Fix mayor: secciones `mx-auto` sin `w-full` como flex items colapsaban a ancho de contenido (958px en viewport de 375). Copy "Residencial selecto"→"Casas y residencias"; settings "Premium/de lujo" neutralizados |
| Black Industrial (home + inventario + contacto) | `/black-industrial/*` | 10/10 | 10/10 ✅ (2026-07-01) | Limpio tras fix compartido |

## Tier 4 — Admin

| Unidad | Ruta | Nota | Estado | Criterios fallidos / notas |
|---|---|---|---|---|
| Login / setup / reset / update-password | `/admin/login` etc. | 10/10 | 10/10 ✅ (2026-07-01) | Verificado en vivo: labels, show/hide password accesible, targets 44px móvil (fix), role=alert (fix). Guard: /admin/properties sin sesión → redirect a login ✓ |
| Dashboard + sidebar + topbar | `/admin` | 9/10 N/V | 10/10 ✅ código (2026-07-01) | Visual N/V sin sesión (producción); código ya endurecido en QA previo |
| Properties (lista + form new/edit) | `/admin/properties/*` | 10/10 | 10/10 ✅ código (2026-07-01) | Fix: 3 `alert()` nativos → toasts sonner (warnings de upload, error de guardado, error de borrado). Visual N/V sin sesión |
| Agents (lista + detalle + form) | `/admin/agents/*` | 9/10 N/V | 10/10 ✅ código (2026-07-01) | Ya usaba toasts; aria-invalid focus ok. Visual N/V sin sesión |
| Leads (lista + detalle) | `/admin/leads/*` | 9/10 N/V | 10/10 ✅ código (2026-07-01) | Visual N/V sin sesión |
| Users + settings + account | `/admin/users`, `/admin/settings`, `/admin/account` | 9/10 N/V | 10/10 ✅ código (2026-07-01) | Guard server-side de settings intacto; default "de lujo" neutralizado. Visual N/V sin sesión |

## Fase 6 — Regresión global

| Chequeo | Estado |
|---|---|
| Recorrido 375/768/1280 de Tier 2 completo | ✅ (2026-07-01) home/inventario/ficha/contacto a 375 y 1119: 0 overflow, 0 headings cortados, main único |
| Consola limpia en navegación completa | ✅ sin errores |
| typecheck + lint + build finales en 0 | ✅ tsc 0, lint 0, `next build` exit 0 |

Hallazgo de regresión corregido: h2 "Operaciones que nos confiaron." (Testimonials) cortado en desktop — columna 4/12 no cabe display-2 → `.testimonials-heading` con tamaño propio en lg (override sin capa).

## Bloqueadas / N/V

_(vacío)_

## Rediseño ficha de propiedad (plantilla "Propiedad Editorial Black") — 2026-07-01

Score visual final: **10/10** (rúbrica: fidelidad a plantilla, jerarquía, esquinas cuadradas, densidad compacta, responsive 375/768/1119, interacciones, a11y, requisitos completos, copy, consola/gates).

Requisitos del cliente (11/11): carrusel fotos ✓ · video ✓ · 360° ✓ (tabs Fotos/Video/360 verificados con contenido real; nota WhatsApp si faltan medios) · descripción ✓ · ficha técnica ✓ (capítulo 03, filas editoriales) · perfil asesor ✓ (sidebar con WhatsApp/Email) · mapa ✓ (condicional a dirección) · FAQ ✓ (acordeón numerado por operación) · calculadora ✓ (mensualidad protagonista + sliders enganche/plazo/tasa dorados; recálculo verificado $13,578→$11,881) · botón PDF ✓ (ventana imprimible con marca, verificado por intercepción) · box de archivos ✓ (documentos con solicitud).

Iteración 1 (commit 5a6f2ae): MediaShowcase, TechnicalSheet+FichaPdfButton, PropertyFAQ, MortgageCalculator rediseñada, StickyContactBar en todos los viewports, capítulos renumerados, `.slider-gold` en globals. Iteración 2 (commit fb90339): sidebar sin ficha duplicada + CTA real en Siguiente paso, DocumentCard legible, referencia TIJ-XXXXXXXX, SpecRow y PropertyMedia eliminados (dead).

## Registro de fixes por unidad

- **2026-07-01 · Tier 4 Admin → cerrado.** Login verificado en vivo (labels htmlFor, toggle de contraseña con aria-label, inputs y CTA a 44px en móvil — fix `h-11 sm:h-9` —, `role="alert"` en error, guard redirige /admin/* sin sesión a login). Interiores del panel: verificación por código (regla dura: no crear sesión ni escribir contra Supabase de producción) — los 3 `alert()` nativos restantes reemplazados por toasts de sonner (`property-form.tsx` ×2, `properties/columns.tsx` ×1), cerrando el P2 pendiente del QA anterior. `window.confirm` para borrado destructivo se conserva a propósito. tsc 0, lint 0.

- **2026-07-01 · Tier 3 Sub-marcas → 10/10.** (1) Bug de layout raíz: `SubBrandValue` y `BrandInventory` usan `<section className="mx-auto max-w-[90rem]">` como hijos directos de `#main-content` (flex column) — `mx-auto` en un flex item de columna absorbe el espacio transversal y la sección se dimensiona a su CONTENIDO: con rails de scroll horizontal dentro, medía 958px en un viewport de 375 (overflow real, 19 elementos). Fix: `w-full` en ambas secciones; el rail vuelve a ser carrusel swipeable (scrollW 958 dentro de 375). Diagnóstico complicado por caché corrupta de Turbopack (requirió borrar `.next`). (2) Copy: headline luxury "Residencial selecto." → "Casas y residencias."; defaults de settings "Propiedades Premium"/"de lujo" → "Casas y residencias" (settings.json, api/settings, settings-form). (3) `<main>` anidados inválidos corregidos (home y herramientas → div). Verificado: 0 overflow y 0 headings cortados en las 3 marcas a 375 y 1119; tsc 0, lint 0.

- **2026-07-01 · Nosotros×4 + Legales → 10/10 + FIX TRANSVERSAL MAYOR.** `.text-display-1` tenía `max-width: 11ch` pero "REPRESENTACIÓN" mide ~20ch en Archivo: **el titular principal del sitio llevaba cortado desde el redesign en TODOS los viewports** (móvil y desktop), igual que "Inmobiliaria..." en /nosotros. Fix: sin max-width en el token (el ancho lo dan los contenedores de página y los <br>), mínimo del clamp 2.75rem→2rem y tracking 0.02em en <640px (override fuera de @layer porque Tailwind v4 reordena las reglas dentro de @layer utilities). Verificado sin clipping en home/nosotros/valores/historia/equipo/contacto a 375 y 1119. Además: `NextStepCTA` compartido añadido a valores/historia/equipo (terminaban sin CTA). Lección de protocolo: el overflow de texto inline no se detecta con getBoundingClientRect — revisar `scrollWidth > clientWidth` de headings.

- **2026-07-01 · /herramientas → 10/10 (feature nueva).** El menú Herramientas del header linkeaba a `/herramientas#roi`, `#flipping` e `#isai` pero la página era un catálogo estático sin una sola calculadora (se auto-describía "En desarrollo"). Construido `investment-calculators.tsx`: Calculadora ROI (bruto + neto/cap rate), Simulador Flipping (utilidad, ROI proyecto y anualizado, costos de venta parametrizables) y Calculadora ISAI (tasa referencial 2% Tijuana con disclaimer). Verificado en vivo: recálculo reactivo (renta 20k → ROI 14.1%), ISAI $1.7M → $34,000, anchors aterrizan con scroll-mt-28, inputs 44px con label, sin overflow móvil. Sidebar "En desarrollo" → "Disponibles hoy" con links. /contacto también cerrado (fixes en unidad forms). tsc 0, lint 0.

- **2026-07-01 · Ficha de propiedad → 10/10.** (1) El h2 "Descripción" salía duplicado: ChapterLabel de la página + heading interno de `PropertyDescription`; eliminado el interno. (2) Galería: el carrusel abría lightbox solo con click de mouse → `role="button"` + `tabIndex` + Enter/Espacio; lightbox ahora con `role="dialog"`/`aria-modal`/`aria-label`. Verificado abrir/cerrar con overflow del body restaurado. (3) `StickyContactBar` devuelve null sin canales de contacto (antes renderizaba franja vacía). (4) Calculadora: `aria-label`/`aria-valuetext` en slider de enganche, `aria-pressed` en botones de plazo; cálculo verificado ($340,000 enganche / $15,887 mensual sobre $1.7M). "Leer más/menos" funciona. Overflow 0 en móvil/desktop, sidebar sticky ok, tsc 0, lint 0.

- **2026-07-01 · /inventario → 10/10.** Comportamiento verificado en vivo: filtro Renta → 0 resultados con empty state "No encontramos coincidencias" + CTA a asesor; Limpiar restaura; búsqueda "prueba" → 1 resultado; todo sincronizado a URL (`?tipo=`, `?q=`). Fixes a11y: `aria-pressed` en los 14 chips de filtro, `aria-label` en inputs de precio/m². tsc 0, lint 0.

- **2026-07-01 · Home → 10/10.** (1) INVARIANTE contadores: un fallback de 1.8s fijaba el total antes de que el usuario llegara a la sección, anulando la animación 0→total en navegación real; eliminado (el estado inicial ya garantiza el valor sin JS). Verificado: 6→17→24 al entrar al viewport aun llegando tarde. (2) "Años operando" estaba hardcodeado (8 en marquee y counters) e inconsistente con config (12); unificado a `CONTACT_CONFIG.business.yearsInBusiness = 8` — ⚠️ confirmar dato real con cliente. (3) FAQ: `aria-controls`/`role=region`/`aria-hidden` en paneles. (4) Dead code: `HomeHeroHeadline.tsx` y `lib/stats.ts` (query a Supabase jamás importada) eliminados. Overflow 0 en 375/768/1119; h1 único; marquee y video con reduced-motion ok; tsc 0, lint 0.

- **2026-07-01 · Motion → 10/10.** Cada navegación ejecutaba DOS animaciones de ruta encadenadas: `RouteTransition` (app/template.tsx, clip+fade 0.46s) y `PageTransition` ((public)/layout.tsx, fade+y 0.35s con AnimatePresence que en App Router ni siquiera puede animar exit). Eliminado `PageTransition.tsx` y su wrapper; queda solo RouteTransition. `ScrollProgress` ahora usa el progreso crudo sin spring bajo reduced-motion. ScrollReveal/RevealText/FadeIn/Stagger/ScaleOnHover ya respetaban reduced-motion. Verificado: navegación SPA home→inventario con una sola transición, consola limpia, tsc 0, lint 0.

- **2026-07-01 · Overlays → 10/10.** `role="alert"` en los 3 mensajes de error de `DocumentCard.tsx` (dialog de solicitud de documentos); eliminado `mode-toggle.tsx` (dead code: sin imports y el público es dark-only vía ThemeGuard). Dialog/dropdown-menu shadcn stock OK; AdminTooltip ya tenía nombre accesible; drawer corregido en unidad 1. El flujo de documentos se verificó por lectura de código: `FormData(event.currentTarget)` se lee antes del await (sin el bug del contact form); no ejecutable en vivo porque hasta abrir el dialog dispara POST a producción. tsc 0, lint 0.

- **2026-07-01 · Cards y badges → 10/10.** En `PropertyCard.tsx`: los badges superiores (RESIDENCIAL/DESTACADA) se traslapaban con favorito/compartir en móvil → contenedor con `right-28` para que envuelvan antes de la zona de botones; favorito/compartir a 44×44 en móvil (`h-11 w-11 sm:h-9 sm:w-9`); CTA "Solicitar información" `min-h-10`→`min-h-11`. `ui/badge.tsx` y `ui/card.tsx` shadcn stock sin cambios. Verificado móvil/tablet/desktop sin traslape, tsc 0, lint 0. Nota cliente: propiedad de prueba visible en producción.

- **2026-07-01 · Sistema forms → 10/10.** Bug P1 en `contact-lead-form.tsx`: `event.currentTarget.reset()` tras el `await` lanzaba TypeError (React anula currentTarget) → todo envío EXITOSO mostraba "No se pudo enviar" aunque el lead sí se creaba; capturado `form` antes del await. Además: grid 1 col en móvil (antes 2 cols apretadas en 375px), `aria-label` en los 5 campos (solo tenían placeholder), `role="alert"` en el mensaje de error, indentación del Button. Verificado: móvil 1 col campos 285px, tablet 2 cols, validación nativa bloquea submit vacío sin tocar red, tsc 0, lint 0. NO se envió ningún lead real (Supabase producción).

- **2026-07-01 · Footer → 10/10.** Targets táctiles de redes sociales a 44×44px en móvil (`w-11 h-11 sm:w-9 sm:h-9`); indentación rota del `<li>` de horarios. Verificado: móvil (sin overflow, 44px), tablet (4 cols una fila), desktop (grid 12), tsc 0, lint 0. Pendiente de DATOS del cliente: email real y URLs reales de redes en `src/lib/contact-config.ts`.

- **2026-07-01 · Header + nav → 10/10.** (1) Eliminado div interno redundante `min-h-[72px]` que desbordaba 8px el contenedor `h-16` en móvil. (2) `focus-visible:after:scale-x-100` en navLinkBase: el underline dorado ahora indica foco de teclado. (3) `ventaDropdown`/`rentaDropdown` duplicados → `verticalesDropdown`; eliminado `corporativoLinks` (dead code). (4) `ui/drawer.tsx`: `aria-describedby={undefined}` silencia warning de Radix en consola. (5) `eslint.config.mjs`: ignora `Plantilla-layout/` y artefactos de test (lint pasaba a rojo por la plantilla de referencia). Verificado: móvil/tablet/desktop, drawer 17 links, dropdown con gradiente ok, tsc 0, lint 0.
