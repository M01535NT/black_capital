# Plan de implementación — Alternativa Black 1

Especificación: `docs/superpowers/specs/2026-10-09-alternativa-black-1.md`.

## Trabajo independiente

1. Portada: componentes de `home` y página de inicio. Reorganizar secciones, buscador compacto, tarjetas de segmentos, proceso compacto, carrusel controlado y testimonios manuales. Mantener estilos tipográficos y datos.
2. Propietarios y contacto: nueva página, contexto de formularios y errores. Pruebas de interacción con API interceptada; nunca insertar leads reales.
3. Nosotros y herramientas: consolidar contenido y redirecciones; selector de cuatro calculadoras con enlaces directos. Pruebas funcionales.
4. Ficha y segmentos: redistribución de resumen/galería/secciones, medios condicionales, contacto móvil y orden común de páginas de segmento.
5. Integración principal: navegación/pie, filtros de catálogo, guardados sincronizados y compartición de ficha. Pruebas de los recorridos antes de implementar lógica.

Cada responsable limita ediciones a su dominio y comunica contratos compartidos. No realiza commits, operaciones Git ni cambios de dependencias. Se reutiliza el servidor local y cada prueba usa su propio directorio de resultados. Los archivos `.agents/` y `skills-lock.json` preexistentes quedan fuera del cambio.

## Integración y validación

- Revisar contratos de parámetros (`tipo`, `uso`, `zona`, `moneda`, `precioMin`, `precioMax`, `objetivo`, `brand`, `property_id`).
- Actualizar expectativas antiguas únicamente cuando cambie el comportamiento aprobado.
- Ejecutar lint, TypeScript, compilación y Playwright con Chromium del sistema.
- Revisar capturas de escritorio y móvil y navegación de teclado.
- Obtener revisión independiente del cambio completo, corregir hallazgos y guardar un commit en la rama nueva. No fusionar ni desplegar producción.
