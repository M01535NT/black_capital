# Plan — Elevar la Home de Black Capital a Clase Mundial

> **Estado:** Propuesta de rediseño UI/UX para la página de inicio.
> **Alcance:** Solo `/` (home pública). Branding, tipografía y paleta se respetan; se reorganiza el layout y se agregan piezas críticas que faltan.
> **Audiencia:** Frontend engineers y diseñadores del equipo Black Capital.

---

## Contexto

Black Capital es una inmobiliaria premium en Tijuana posicionada como asesor de inversionistas (residencial, comercial, industrial). Su home actual ([src/app/(public)/page.tsx](../src/app/(public)/page.tsx)) es técnicamente sólida (Next.js 16, Tailwind 4, Framer Motion, sistema tipográfico fluido en Manrope, paleta gold sobre negro), pero presenta tres problemas que la mantienen en el nivel "muy profesional" en lugar de "clase mundial":

1. **Redundancia narrativa**: tres secciones distintas (videos de rutas, timeline "Por qué Black Capital", rail "De la intención al cierre") cuentan la misma historia metodológica con palabras diferentes. El visitante recibe el mismo mensaje 3 veces sin agregar evidencia nueva.
2. **Cero prueba social cualitativa**: hay contadores numéricos pero ningún testimonio, voz de cliente o caso real. Para inversionistas que evalúan a quién entregar operaciones de millones de pesos, este es el gap más grande.
3. **Hero plano y CTAs ambiguos**: el hero usa una imagen estática genérica al 35% de opacidad, sin identidad local de Tijuana. Hay 7+ CTAs distintos repartidos por la página con jerarquías visuales similares, lo que diluye la conversión.

**Alcance acordado:** reorganizar + agregar piezas críticas, manteniendo gold único (diferenciando sub-brands solo por fotografía/copy/textura), sin mostrar propiedades reales (home se queda como narrativa de marca pura).

---

## Nueva narrativa de la home (orden propuesto)

La estructura actual tiene 8 bloques. La propuesta los reduce a **7 secciones más densas y con propósito único cada una**, en este arco narrativo:

| # | Sección | Propósito narrativo | Cambio |
|---|---------|---------------------|--------|
| 1 | **Hero cinemático** | Provocar deseo + ubicar geografía + 1 CTA principal | Rediseño profundo |
| 2 | **Banda de credibilidad** (Counters) | Validar inmediatamente con números | Mover aquí + rediseñar |
| 3 | **Tres líneas de negocio** | Diferenciar verticales con identidad visual propia | Rediseño visual |
| 4 | **Testimonios / Voces** | Prueba social cualitativa | **SECCIÓN NUEVA** |
| 5 | **Metodología unificada** | Cómo trabajamos, en UNA sola sección | Fusión de 3 secciones |
| 6 | **Manifiesto / Cierre emocional** | Pull-quote + CTAs de intención | Rediseño |
| 7 | **Footer** | Cierre con engagement | Pequeñas mejoras |

---

## Detalle por sección

### 1. Hero cinemático

**Archivo:** [src/app/(public)/page.tsx:172-231](../src/app/(public)/page.tsx) + [src/components/home/HomeHeroHeadline.tsx](../src/components/home/HomeHeroHeadline.tsx)

**Problemas actuales:**
- Imagen `/hero-poster.webp` al 35% de opacidad sobre fondo negro: no se reconoce, no comunica Tijuana, no genera impacto visual.
- Dos CTAs con peso visual similar ("Ver inventario" gold + "Solicitar asesoría" ghost) compitiendo entre sí.
- Marquee inferior decorativo sin función narrativa (las cuatro frases son las mismas tres categorías repetidas + "ubicaciones estratégicas").
- Falta firma de lugar — el badge "Tijuana, Baja California" se pierde en el ruido.

**Cambios:**
- **Reemplazar imagen estática por loop de video** (ya existe `/hero.webm` que actualmente se usa en el carrusel de rutas — aprovecharlo aquí). Aplicar `object-cover`, `muted`/`autoplay`/`playsInline`/`loop`, encima un gradiente radial dorado sutil desde la esquina superior derecha + el gradiente actual de oscurecimiento. Mantener fallback a `/hero-poster.webp` como poster.
- **Jerarquía de CTAs a 1 + 1 + texto:**
  - Primario filled gold: "Ver inventario"
  - Secundario texto-link con underline + arrow: "Hablar con un asesor →"
  - Eliminar la apariencia de botón doble; el secundario queda como link tipográfico.
- **Reemplazar marquee inferior por una "barra de firma":** misma posición (`absolute bottom-0`), misma altura, pero en lugar de scroll infinito, mostrar 3 datos estáticos separados por divisores verticales gold: `TIJUANA · BAJA CALIFORNIA` | `RESIDENCIAL · COMERCIAL · INDUSTRIAL` | `8 AÑOS DE EXPERIENCIA`. Da firma sin caer en decoración huérfana.
- **Refinar el badge superior:** agregar un punto pulsante gold (`animate-pulse` o keyframe custom) antes del `MapPin` para señalizar "presencia activa".
- **Headline rotativo** (`HomeHeroHeadline`): mantener animación pero **agregar un underline gold delgado** debajo de la palabra rotativa que también se anima con la transición (efecto de "subrayado vivo"). Esto da el "wow factor" que falta sin romper la sobriedad.

**Reusos:**
- `HomeHeroHeadline.tsx` se mantiene, solo se ajusta el render para el underline.
- `/hero.webm` ya existe.
- `--gradient-gold` del CSS global se puede aprovechar para el overlay radial.

---

### 2. Banda de credibilidad (Counters)

**Archivo:** [src/components/home/HomeCounters.tsx](../src/components/home/HomeCounters.tsx)

**Problema actual:** los contadores aparecen en posición 4, después del carrusel de videos. El visitante pasa por 3 secciones antes de ver evidencia. En un sitio premium, la credibilidad numérica debe golpear de inmediato tras el hero.

**Cambios:**
- **Mover el componente `<HomeCounters />` justo después del hero** (antes de las tres líneas de negocio).
- **Rediseñar como "banda" delgada de ancho completo**, no como sección de 16/24 rem de padding. Reducir el `py` y eliminar el header "PRESENCIA Y RESULTADOS" para que actúe como puente visual entre el hero y la siguiente sección (el hero ya planteó la promesa, esta banda la valida).
- **Agregar el contexto emocional que falta:** bajo cada número, una micro-etiqueta de una palabra que dé sentido (`24+ Propiedades / Custodiadas`, `18,000 M² / Comercializados`, `70+ Clientes / Acompañados`, `8 Años / Operando`). El verbo emocional eleva el dato del rango "estadística fría" al rango "huella real".
- **Línea gold delgada arriba y abajo** (ya existe el pattern `bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent` en la sección "Por qué BC" — reutilizarlo aquí).

---

### 3. Tres líneas de negocio

**Archivo:** [src/app/(public)/page.tsx:233-288](../src/app/(public)/page.tsx)

**Problemas actuales:**
- Las tres cards son visualmente idénticas (mismo aspect ratio, misma posición de icono, mismo layout de copy + zonas + 2 botones). El visitante no detecta jerarquía.
- Dos botones por card ("Inventario" + "Ver línea") con el mismo peso visual = 6 CTAs simultáneos compitiendo.
- Las zonas (`Chapultepec · Zona Río · Playas`) están en el mismo color/tamaño que el copy: se pierden.

**Cambios (manteniendo gold único, diferenciación por foto/copy/textura):**
- **Layout asimétrico:** la primera card (Black Luxury) ocupa más altura/peso visual (`md:col-span-2` o aspect 4/5 sostenido en desktop), las otras dos quedan apiladas/más compactas en el lado opuesto. Esto introduce jerarquía sin romper el sistema. Patrón: hero card + 2 cards apiladas, alternable.
- **Reducir a 1 CTA por card:** solo "Ver línea →" (el inventario por categoría es un destino interno, no merece un CTA propio en home). Esto baja el ruido de 6 botones a 3.
- **Diferenciación por textura/copy** (sin color secundario):
  - **Black Luxury:** copy más aspiracional, foto con iluminación cálida atardecer, capa de grano sutil (CSS `noise` o overlay con `mix-blend-overlay`).
  - **Black Business:** copy más analítico ("flujo, visibilidad, operación" → reescribir con cifras o verbos de inversión), foto con líneas arquitectónicas claras.
  - **Black Industrial:** copy más operativo, foto con escala (gran angular), overlay levemente más oscuro para sentir solidez.
- **Zonas como chips**, no como texto inline: cada zona en un pill pequeño con border `white/12`. Da estructura y permite escanear.
- **Hover impactante:** además del `scale-105` actual, agregar un revelar de un párrafo extra (oculto por default) con un dato distintivo de cada línea (`"+18 operaciones cerradas en 2025"`, etc.), aparece con fade + slide-up al hover en desktop, siempre visible en mobile.

---

### 4. Testimonios / Voces  *(SECCIÓN NUEVA)*

**Archivo nuevo:** `src/components/home/Testimonials.tsx`

**Por qué:** la ausencia de prueba social cualitativa es el gap más grande para llegar a "clase mundial". Inversionistas que ven 8 años / 70 clientes / 18,000 m² quieren leer una voz humana antes de pedir asesoría.

**Diseño propuesto:**
- **Sección de fondo `bg-white/[0.02]` con líneas gold superior e inferior** (mismo patrón que la sección "Por qué BC" actual, así mantenemos coherencia del sistema).
- **Layout:** encabezado a la izquierda (`property-tag-type` "Voces" + `text-display-2` "Quienes nos confiaron operaciones."), a la derecha grid de 3 testimonios.
- **Cards de testimonio sin foto** (más sobrio, más premium — al estilo Sotheby's / Berkshire Hathaway HomeServices):
  - Comillas grandes en gold (`text-6xl`, `gold-ink`, `opacity-30`) como elemento decorativo al inicio
  - Quote en `text-body-lg` (`text-white/85`)
  - Separador delgado
  - Inicial + apellido inicial + rol genérico anonimizado (`"M. R. — Propietario residencial, Chapultepec"`, `"L. F. — Inversionista industrial, Otay"`, `"A. G. — Familia compradora, Zona Río"`)
- **Sin slider:** 3 testimonios fijos visibles en desktop (grid de 3), apilados en mobile. Evita el patrón "carrusel de testimonios" que se siente plantilla.
- **Si en algún momento se consiguen testimoniales reales completos**, el componente recibe `items` como prop para escalar.

**Reusos:** estilos `property-tag-type`, `gold-ink`, `text-display-2`, `text-body-lg` ya existentes.

---

### 5. Metodología unificada

**Archivos a fusionar:**
- [src/app/(public)/page.tsx:290-343](../src/app/(public)/page.tsx) (Carrusel de video / Rutas)
- [src/app/(public)/page.tsx:347-369](../src/app/(public)/page.tsx) + [src/components/home/WhyBlackCapitalTimeline.tsx](../src/components/home/WhyBlackCapitalTimeline.tsx)
- [src/app/(public)/page.tsx:371-400](../src/app/(public)/page.tsx) (Service Process Rail)

**Problema actual:** estas 3 secciones cubren ~600 líneas de pantalla y comunican esencialmente "tenemos método". Diluyen el impacto en lugar de potenciarlo.

**Propuesta de fusión — una sola sección "Metodología" con dos modos:**

- **Encabezado fuerte:** `property-tag-type` "Metodología Black Capital" + `display-2` "Información, criterio, cierre." + subcopy.
- **Cuerpo en 2 columnas en desktop** (`lg:grid-cols-12`):
  - **Columna izquierda (`lg:col-span-5`):** timeline vertical sticky de 4 pasos basada en `whyBlackCapital` (01 Conocimiento local → 02 Diagnóstico → 03 Estrategia → 04 Cierre). Es la espina del método. Reusar la animación scroll-driven de `WhyBlackCapitalTimeline` pero adaptada a vertical sticky con scroll-snap por paso.
  - **Columna derecha (`lg:col-span-7`):** para cada paso de la timeline, mostrar un video corto con poster (los actuales `/hero.webm` + posters de las rutas) que cambia conforme el visitante avanza por la timeline. Implementación: al hacer `scrollIntoView` cada paso, se actualiza un `useState` que controla qué video se reproduce arriba. El video se queda sticky a la derecha mientras la timeline avanza.
- **En mobile:** colapsa a stacked — 4 bloques verticales, cada uno con su video arriba + texto del paso abajo, sin sticky.
- **Eliminar el rail "De la intención al cierre"** (5 palabras sueltas Diagnóstico/Revisión/Valor/Estrategia/Cierre): es el mismo mensaje que la timeline. Su contenido se absorbe en los 4 pasos.

**Resultado:** el visitante ve 1 sección rica e interactiva en lugar de 3 secciones que repiten el mensaje. Es donde más se gana en "clase mundial" — esta es la pieza que diferencia a Stripe/Linear/Vercel de sitios genéricos.

**Reusos:**
- `WhyBlackCapitalTimeline` se refactoriza para variante vertical sticky.
- Posters `/hero-luxury.webp`, `/hero-business.webp`, `/industrial-hero.webp`, `/hero-industrial.webp` ya existen.
- Easing `[0.22, 1, 0.36, 1]` ya en uso.

---

### 6. Manifiesto + Intent CTAs

**Archivo:** [src/app/(public)/page.tsx:402-427](../src/app/(public)/page.tsx)

**Problema actual:** la sección "Elige cómo quieres iniciar" presenta 4 botones intent-based en un grid 2x2. Es funcional pero no cierra la narrativa con fuerza emocional.

**Cambios:**
- **Antes del grid de 4 CTAs**, agregar un **pull-quote tipográfico grande** (manifiesto de marca): una frase de 1-2 líneas en `text-display-2` con palabras clave en `gold-ink`. Ejemplo de tono: *"No vendemos metros cuadrados. Construimos decisiones que pasan el tiempo."* — el usuario decide el copy exacto.
- **Bajo el pull-quote**, el grid de 4 intents se mantiene pero rediseñado:
  - **Layout de 4 en una sola fila en desktop** (`lg:grid-cols-4`), no 2x2.
  - Cada card más alta, con un **número delgado** arriba (`01`, `02`, `03`, `04` en `property-tag-type gold-ink`), el label en `text-display-4`, y el arrow más grande abajo a la derecha (no inline).
  - Hover: el background pasa de `bg-background/70` a un sutil gradiente gold (`from-transparent to-[var(--color-accent)]/10`), border se intensifica.

**Resultado:** la página cierra con una afirmación de marca + 4 acciones claras, en lugar de cerrar con 4 botones desnudos.

---

### 7. Footer

**Archivo:** [src/components/layout/Footer.tsx](../src/components/layout/Footer.tsx)

**Cambios mínimos** (no es prioridad alta, pero suma):
- Antes del logo + columnas, agregar una **línea gold delgada full-width** + un **pull-quote pequeño** (`text-display-4`, `gold-ink`, ~1 línea) que retome el manifiesto. Cierra la página con la misma voz con que abrió.
- El disclaimer LFPIORPI subir su contraste de `text-white/40` (probable) a `text-white/55` para que cumpla compliance visual sin perder discreción.

---

## Sistema de botones unificado (regla transversal)

Establecer y aplicar consistentemente **3 niveles de CTA** en toda la home:

- **Primario** — `brushed-gold premium-cta` filled gold, `min-h-[50px]`, uppercase. Solo 1 por sección máximo. (Hero "Ver inventario", Sub-brand cards "Ver línea →" condicional, manifiesto final).
- **Secundario** — Link tipográfico con `text-white` + underline animado en hover + `ArrowRight` inline. Sin border, sin background. (Hero "Hablar con un asesor", Footer links).
- **Terciario** — Bordered ghost con `border-white/12`, sin background. Solo para zonas neutras donde el primario ya está en uso. (Intent CTAs).

Eliminar el patrón actual de bordered con `border-[var(--color-accent)]/45` que compite con el gold filled.

---

## Cambios de microinteracción (transversales)

- **Scroll-reveal en cada section:** usar `IntersectionObserver` o `motion.div` con `whileInView` para fade-up sutil de cada bloque al entrar al viewport. Easing y duración consistentes con los actuales (`[0.22, 1, 0.36, 1]`, 600-700ms). Esto se aplica también a las secciones que hoy son estáticas.
- **Cursor "premium"** opcional: en desktop, sobre elementos clickeables, un dot custom o aumentar `cursor-pointer` con un sutil ring gold via CSS — solo si no es invasivo. Evaluar al final.
- **Respeto a `prefers-reduced-motion`:** ya está manejado en componentes existentes; mantener disciplina al agregar nuevas animaciones (todas deben tener fallback estático).

---

## Archivos críticos a modificar

| Archivo | Tipo de cambio |
|---------|----------------|
| `src/app/(public)/page.tsx` | Reorden + rediseño de hero + integración de nuevas secciones + eliminación de "Service Process Rail" + manifiesto |
| `src/components/home/HomeHeroHeadline.tsx` | Agregar underline gold animado bajo palabra rotativa |
| `src/components/home/HomeCounters.tsx` | Rediseño como banda delgada + verbos emocionales bajo cada número |
| `src/components/home/WhyBlackCapitalTimeline.tsx` | Refactor a variante vertical sticky + sincronización con videos a la derecha |
| `src/components/home/Testimonials.tsx` | **Crear nuevo** componente |
| `src/components/layout/Footer.tsx` | Pull-quote superior + ajuste de contraste disclaimer |
| `src/app/globals.css` | Si se necesita: keyframe del underline del headline + utility para chips de zonas |

**Componentes no usados que NO se tocan en este plan** (`InventoryShowcase`, `TrackRecord`, `InvestmentTabs`, `Hero` antiguo, `InventoryClient`, `MethodologyTimeline`, `ValuesAccordion`): quedan disponibles para iteraciones futuras o para `/inventario` / sub-brand pages.

---

## Verificación

1. **Build:** `npm run build` debe pasar sin errores de tipos ni warnings nuevos.
2. **Visual desktop:** `npm run dev`, abrir `http://localhost:3000` en Chrome a 1440px y 1920px. Verificar:
   - Hero: video se reproduce muted/loop, badge pulsa, underline gold se mueve con el headline rotativo, jerarquía 1+1 de CTAs.
   - Banda de credibilidad: 4 números con verbos abajo, líneas gold arriba/abajo, animación count-up se dispara al entrar al viewport.
   - Sub-brands: layout asimétrico (Luxury más grande), 1 CTA por card, hover revela el dato extra.
   - Testimonios: 3 cards limpias con comillas gold decorativas.
   - Metodología: timeline vertical sticky a la izquierda, video sticky cambiando a la derecha al hacer scroll.
   - Manifiesto: pull-quote grande con palabras gold + 4 intent cards en fila.
3. **Visual mobile:** DevTools a 375px (iPhone SE) y 414px (iPhone Plus). Verificar que la metodología colapsa correctamente a stacked, las sub-brands en carrusel snap mantienen jerarquía, los intent CTAs apilan limpio.
4. **`prefers-reduced-motion`:** con la flag activada en DevTools, ninguna sección debe animarse de forma intrusiva (count-up va directo al número final, headline rotativo se queda en una palabra, video hero queda en poster, scroll-reveals no aplican).
5. **Accesibilidad rápida:** tab por la página completa — todos los CTAs reciben foco visible (ring gold), orden de tabulación lógico, contraste WCAG AA mínimo en disclaimers.
6. **Performance:** Lighthouse en build de producción — objetivo mantener Performance ≥ 90 (el hero video debe estar comprimido y con `preload="metadata"` o `preload="none"` + poster).

---

## Orden de implementación sugerido

Si se decide implementar, este orden permite validar la dirección visual antes de tocar todo:

1. **Hero cinemático** (mayor impacto inmediato, prueba de dirección visual)
2. **Banda de credibilidad** reposicionada
3. **Metodología unificada** (fusión de 3 secciones → 1)
4. **Testimonios** (sección nueva)
5. **Sub-brands rediseñadas** + **Manifiesto + Intent CTAs**
6. **Footer** + sistema de botones transversal
