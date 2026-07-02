# Handoff: Sitio Black Capital — Home · Inventario · Ficha de propiedad

## Overview
Rediseño del sitio público de Black Capital (inmobiliaria en Tijuana: residencial, comercial e industrial). Este paquete cubre los tres tipos de página del flujo principal:
1. **Home** — landing con hero, métricas, líneas de negocio, metodología, propiedades destacadas, zonas, testimonios, herramientas, FAQ, contacto.
2. **Inventario** — listado de propiedades con filtros y grid de tarjetas.
3. **Ficha de propiedad** (dirección "Editorial") — página pública de una propiedad individual.

Flujo: Home → Inventario → Ficha. Reemplaza al sitio actual en `blackmx.vercel.app`.

## About the Design Files
Los archivos `.dc.html` de este paquete son **referencias de diseño creadas en HTML** (prototipos de look & feel y comportamiento), **no** código de producción. Corren sobre un runtime propio del entorno de diseño; **no** los ejecutes ni portes ese runtime.

La tarea es **recrear estos diseños en el codebase real** (aparenta **Next.js / React** — rutas `/inventario`, `/black-luxury`, imágenes `/_next/image`) usando sus patrones, componentes y sistema de estilos. Reutiliza lo que ya exista en el repo. **Es una guía visual: Claude Code debe refinar, perfeccionar y adaptar** (accesibilidad, datos reales, rendimiento, edge cases) — no clonar el HTML.

## Fidelity
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciados e interacciones son la intención final. Las **imágenes son placeholders** generados (patrones oscuros); reemplázalas por fotos reales y un mapa real.

---

## Sistema de diseño (tokens compartidos)
Los tres archivos definen los mismos tokens como variables CSS en `<body>`. Úsalos como tema global.

**Color**
- `--bg` `#050505` (fondo) · `--panel` `#0A0A0A` (sección alterna) · `--footer` `#000000`
- `--ink` `#FFFFFF` (texto/títulos) · `--muted` `#CFCBC1` (secundario) · `--line` `rgba(255,255,255,.22)` (bordes 1px)
- `--acc` `#CFA652` (oro) — RGB para alfas: `207,166,82`
- Input bg `#131210`, borde `rgba(255,255,255,.12)` · texto legal tenue `#66635D`

**Tipografía** (Google Fonts): **Archivo** display 800/900 (mayúsculas, tracking -.01 a -.03em) · **Public Sans** 400/600/700 texto y UI · mono del sistema para REF/contadores/índices.

**Escala**: hero H1 44–92px · H2 sección 26–40px · cuerpo 15–17 · specs 12–14 · eyebrow/label 9–11 en mayúsculas con letter-spacing .14–.22em.

**Espaciado**: base 4. Secciones ~56px vertical / 40–48px horizontal (24px ≤980–1000px, 16px ≤600px). Gaps 24–44px. **Radios**: 2–3px botones/badges · 4px inputs · 6px miniaturas · 8–12px tarjetas · 100px pills/avatares. **Sombras**: casi ninguna; jerarquía por líneas 1px + contraste.

**Componentes base** (comunes a las 3 páginas):
- **Nav**: barra oro 3px + wordmark BLACK/CAPITAL; enlaces mayúsculas; botón hamburguesa que abre overlay a pantalla completa. En móvil los enlaces se ocultan (solo hamburguesa).
- **Botones**: primario (fondo oro, texto `--bg`, hover `brightness(1.08)`), secundario (borde `--line`, hover borde oro), fantasma (subrayado). Mayúsculas Archivo 700, radios 2–4px.
- **Badges**: Venta (oro sólido) · Renta (blanco translúcido). **Chips**: pills con borde `--line`.
- **Tarjeta de propiedad**: imagen 180–200px con degradado + badge, zona·tipo (oro), título Archivo, specs `--muted`, línea divisoria, precio + "Ver ficha →". Hover: borde oro + `translateY(-4px)`.
- **Footer**: 4 columnas (marca, Marcas, Corporativo, Contacto) + nota LFPIORPI Art. 27.

---

## Página 1 — HOME (`Home Black Capital v1a.dc.html`)
**Propósito**: presentar la firma y encaminar a inventario/contacto.
**Secciones (en orden)**:
1. **Nav** con enlaces (Inicio, Inventario, Venta▾, Renta▾, Herramientas, Nosotros) + teléfono + CTA "Asesoría" (WhatsApp) + hamburguesa.
2. **Hero** a dos columnas: eyebrow, H1 "Representación inmobiliaria con criterio.", subcopy, CTAs (Ver inventario / Hablar con asesor), y strip de sellos (LFPIORPI, Revisión documental). Columna derecha imagen vertical. Debajo, **marquee** animado (zona, líneas, años, cumplimiento).
3. **Métricas** con **contadores animados 0→total** (24 propiedades, 18,000 m², 70 clientes, 8 años). Nota: dispararlos al montar con fallback por timer (no depender solo de IntersectionObserver).
4. **Tres líneas de negocio** como lista editorial numerada (01 Black Luxury / 02 Black Business / 03 Black Industrial) con thumb + zonas + "Ver línea →".
5. **Metodología** — línea de tiempo horizontal de 4 pasos (círculos numerados, conector oro).
6. **Propiedades seleccionadas** — grid de 3 tarjetas.
7. **Zonas** — lista de corredores con conteo + mapa placeholder con pines.
8. **Voces** — 3 testimonios en tarjetas.
9. **Herramientas** — 3 tarjetas (valuación, revisión documental, comparables).
10. **FAQ** — acordeón (una abierta).
11. **Contacto/manifiesto** — botones de objetivo + formulario.
12. **Footer**.
**Responsive**: ≤1000px nav colapsa a hamburguesa, hero a 1 col, métricas 2×2, timeline 2×2 (sin conector), grids a 2 col; ≤680px casi todo a 1 col, oculta teléfono del nav, tipos más chicos.

## Página 2 — INVENTARIO (`Inventario Black Capital.dc.html`)
**Propósito**: listar y filtrar propiedades; entrada a cada ficha.
**Layout**: Nav → Header (eyebrow, H1 "Propiedades disponibles", subtitle) → **barra de filtros fija** → grid → "Cargar más" → Footer.
**Filtros** (barra sticky bajo el nav): segmento **Operación** (Todo/Venta/Renta) + pills **Tipo** (Todos/Residencial/Comercial/Industrial) + **contador de resultados** ("N propiedades"). Al filtrar, el grid muestra solo las coincidencias; pill activa se rellena de oro. En producción sumar: buscador por texto, filtro de zona, rango de precio y orden.
**Grid**: 3 columnas (2 en ≤980px, 1 en ≤600px) de tarjetas de propiedad; cada tarjeta enlaza a la ficha. Estado vacío: mensaje "Sin resultados…".
**State**: `op` ('Todo'|'Venta'|'Renta'), `tipo` ('Todos'|'Residencial'|'Comercial'|'Industrial'), `menuOpen`. Lista de propiedades por fetch (mock en el prototipo: 9 items con op, tipo, zona, título, precio, specs, img).

## Página 3 — FICHA DE PROPIEDAD (`Propiedad Editorial Black.dc.html`)
**Propósito**: página pública de una propiedad; implementar como **plantilla parametrizable** (datos por props/fetch, no hardcodeados). Propiedad ejemplo: "Residencia Chapultepec".
**Layout**: Nav fija translúcida + **barra de acción inferior fija** (precio + Llamar + Agendar). Hero full-bleed; luego shell centrado (máx 1400px) con **índice lateral fijo** (220px, capítulos 01–08) + contenido.
**Secciones (capítulos)**:
- **Hero full-bleed**: imagen a pantalla casi completa, badges, H1 gigante en 2 líneas, barra de datos (Precio oro / Recámaras / Baños / Construcción) + indicador de scroll.
- **01 · Galería** — escenario multimedia con **pestañas Fotos / Video / 360°**. Fotos: imagen principal + flechas ‹ › + contador + miniaturas (activa borde oro). Video: play animado. 360°: hotspots + pills de habitación (Sala/Cocina/Recámara/Terraza) que cambian la vista + "Arrastra para explorar".
- **02 · La propiedad** — descripción + chips + lista de specs (terreno, construcción, estac., REF).
- **03 · Ficha técnica** — **pestañas** (Interiores/Acabados/Exteriores/Seguridad); cada una lista clave→valor a 2 columnas. Fondo `--panel`.
- **04 · Ubicación** — mapa placeholder con pin + tarjetas de tiempos (Club Campestre 4', Zona Río 7', Garita 15', Aeropuerto 18').
- **05 · Financiamiento** — mensualidad gigante (oro) + **barra enganche/financiado** + 3 sliders (Enganche 10–40% · Plazo 5–25 años · Tasa 8–14%). Fórmula `M = P·r/(1−(1+r)^−n)`, `r=tasa/1200`, `n=años·12`, `P=precio−enganche`. Fondo `--panel`.
- **06 · Tu asesor** — avatar + cita + credencial (AMPI) + WhatsApp/Llamar/Correo.
- **07 · Preguntas** — acordeón numerado (una abierta). Fondo `--panel`.
- **08 · Agenda** — formulario (Nombre, Teléfono, Email) con `:focus` oro + CTA.
- **Footer**.
**Controles de tema (opcionales, en el prototipo)**: Acento (Oro/Bronce/Esmeralda/Acero/Borgoña), Contraste (Suave/Medio/Alto/Máximo), Drama del hero (Cinematográfico/Estándar/Compacto). Son variantes de marca; no obligatorios.
**Responsive**: ≤1000px oculta índice lateral, 2col→1col, padding 24px; ≤600px hero 76vh, H1 44px, escenario 300px.

---

## Interactions & Behavior (resumen)
- Overlay de menú (todas las páginas).
- Home: contadores animados; acordeón FAQ; hovers.
- Inventario: filtros por operación y tipo actualizan grid + contador en vivo.
- Ficha: pestañas de galería y de ficha técnica; carrusel de fotos (wrap-around); selector de habitación 360°; calculadora en vivo; acordeón FAQ; barra de acción inferior fija; índice con scroll a anclas.
- Hover: enlaces `--muted`→`--ink`; botón oro → brillo; botón borde → borde oro. `:focus` inputs → borde oro. Transiciones 0.2s.

## State Management
- Global por página: `menuOpen`.
- Home: índice de FAQ abierta; valores de contadores (animados).
- Inventario: `op`, `tipo`, lista (fetch).
- Ficha: `media` (fotos/video/360), índice de foto, índice de habitación, `ficha` (categoría), FAQ abierta, `enganche/plazo/tasa`. Datos de propiedad por props/fetch.

## Assets
- `assets/hero.png`, `prop-residencial.png`, `prop-comercial.png`, `prop-industrial.png`, `zona-mapa.png`, `linea-*.png` — **placeholders** oscuros. Reemplazar por fotos reales de cada propiedad y un mapa real (Google/Mapbox).
- Fuentes: Archivo + Public Sans (Google Fonts).
- Sin librería de íconos: flechas, +/−, play, pines dibujados con CSS/caracteres — sustituir por el set de íconos del codebase.

## Files
- `Home Black Capital v1a.dc.html` — home.
- `Inventario Black Capital.dc.html` — listado con filtros.
- `Propiedad Editorial Black.dc.html` — ficha de propiedad (plantilla).
- `assets/` — imágenes placeholder.
Cada `.dc.html` es solo referencia visual; no se ejecuta en el repo.
