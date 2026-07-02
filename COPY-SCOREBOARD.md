# COPY-SCOREBOARD — Black Capital

> Loop de reescritura página por página. Regla: una página solo pasa a la siguiente cuando obtiene **10/10 ✅**.

## Rúbrica 10/10

Cada página suma 1 punto por criterio cumplido:

1. **Claridad inmediata:** se entiende la propuesta en menos de 10 segundos.
2. **Lenguaje de cliente:** usa palabras naturales para comprador, vendedor, arrendatario o inversionista.
3. **Beneficio visible:** traduce features/proceso a resultado práctico.
4. **CTA claro:** verbo + siguiente paso concreto + baja fricción.
5. **Sin verbose:** frases cortas, una idea por bloque, sin relleno.
6. **Baja repetición:** no abusa de `activo`, `operación`, `ruta`, `valor comercial`, `criterios`.
7. **Confianza local:** mantiene Tijuana/Baja California cuando aporta contexto.
8. **Claims seguros:** no promete precio, venta rápida, plusvalía, crédito, demanda ni resultados no comprobados.
9. **Tono premium sobrio:** serio y elegante sin sonar legalista, frío ni vendehumo.
10. **Coherencia UI/SEO:** copy encaja en componentes existentes y conserva keywords útiles.

## Scoreboard por página

| Orden | Página / unidad | Archivos principales | Score | Estado | Notas |
|---:|---|---|---:|---|---|
| 1 | Home | `src/app/(public)/page.tsx`, `src/components/home/*` | 10/10 ✅ | COMPLETADA | Hero claro, FAQs cortas, CTAs concretos, jerga reducida; búsqueda de términos críticos sin hallazgos públicos. |
| 2 | Inventario | `src/app/(public)/inventario/page.tsx`, `src/components/public/catalog-filter.tsx` | 10/10 ✅ | COMPLETADA | Hero y empty state claros; filtros con microcopy directo; sin jerga crítica en catálogo/filtros. |
| 3 | Ficha de propiedad | `src/app/(public)/inventario/[slug]/page.tsx`, `src/components/property/*` | 10/10 ✅ | COMPLETADA | Microcopy de ficha, documentos y FAQ simplificado; claims financieros/legales suavizados; búsqueda crítica sin hallazgos. |
| 4 | Contacto | `src/app/(public)/contacto/page.tsx`, `src/components/public/contact-lead-form.tsx` | 10/10 ✅ | COMPLETADA | Hero orientado al usuario, formulario más natural, CTAs concretos; búsqueda crítica sin hallazgos. |
| 5 | Herramientas | `src/app/(public)/herramientas/page.tsx`, `src/components/tools/*` | 10/10 ✅ | COMPLETADA | Titulares más directos, cálculos tratados como estimaciones, CTA de orientación; búsqueda crítica sin hallazgos. |
| 6 | Nosotros | `src/app/(public)/nosotros/page.tsx`, `src/app/(public)/nosotros/*/page.tsx` | 10/10 ✅ | COMPLETADA | Hero y subpáginas menos institucionales, valores más claros; búsqueda crítica sin hallazgos. |
| 7 | Submarcas | `src/lib/sub-brand-config.tsx`, `/black-*` wrappers | 10/10 ✅ | COMPLETADA | Luxury/Business/Industrial con copy más directo; CTAs más naturales; búsqueda crítica sin hallazgos en config/hero. |
| 8 | Legales | `src/app/(public)/legal/*/page.tsx` | 10/10 ✅ | COMPLETADA | Textos legales más cortos y claros sin cambiar el fondo; único “garantiza” queda en disclaimer legal negativo. |
| 9 | Navegación/Footer/Global | `src/components/layout/*`, metadata, configs | 10/10 ✅ | COMPLETADA | Footer, metadata, navegación, CTAs globales y componentes compartidos alineados; búsqueda crítica pública sin hallazgos de copy problemático. |

## Registro de iteraciones

- 2026-07-02 · Scoreboard creado. Se inicia por Home.
- 2026-07-02 · Todas las unidades públicas quedan en 10/10 antes de commit.
