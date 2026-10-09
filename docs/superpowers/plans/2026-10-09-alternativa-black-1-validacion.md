# Validación de Alternativa Black 1

## Alcance entregado

Portada con búsqueda y secciones compactas; navegación directa y panel de guardados; catálogo con zona, moneda y filtros rápidos; fichas reorganizadas; páginas de segmento consistentes; nueva página de propietarios; contacto contextual; Nosotros consolidado y cuatro calculadoras seleccionables. Se actualizaron enlaces canónicos y sitemap.

Las fuentes globales, los estilos globales y los datos de inmuebles no se modificaron. Las pruebas de formularios interceptan las solicitudes: no se generaron contactos, solicitudes documentales ni mensajes reales.

## Evidencia

- `npm run lint`: aprobado.
- `npx tsc --noEmit --incremental false`: aprobado.
- `npm run build`: aprobado con certificados del sistema habilitados para descargar las fuentes originales. Compilación en `.next/alternative-build`, aislada del servidor de desarrollo.
- 16 comprobaciones contra el servidor local de producción: aprobadas (rutas, redirecciones, SEO, cabeceras y protección de administración).
- Suite Chromium: 90 casos. En la ejecución integrada, 85 aprobados y uno omitido por ausencia de documentos publicados en la primera ficha. Cuatro casos requirieron ajustar esperas: tres esperaban carga de recursos externos en Black Business y uno coincidía con dos árboles durante la transición de ruta de Nosotros. Las comprobaciones funcionales no se redujeron: ahora esperan DOM/fuentes y un único destino de navegación; la comprobación posterior de siete casos relacionados pasó completa.
- Fichas: seis pruebas adicionales aprobadas con servidor de datos local de solo lectura, además de las comprobaciones con el catálogo disponible.
- Inspección visual y pruebas de geometría en 320, 390, 1024 y 1440 px. Se corrigieron recortes de titulares, controles y contadores sin cambiar sus tamaños tipográficos.
- Revisión independiente: corregidos foco de los paneles, estilos tipográficos que habían variado en contacto y enlaces guardados que podían quedar obsoletos al cambiar el slug.

Capturas y registros de esta sesión: `/workspace/alternativa-black-1/` (artefactos locales, no se incluyen en Git). No se fusiona con main ni se despliega a producción.
