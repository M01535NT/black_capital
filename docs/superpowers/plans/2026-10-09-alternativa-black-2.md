# Implementación Alternativa Black 2

1. Añadir GSAP y crear CinematicImage como primitiva aislada para imágenes con parallax. Mantener fuentes y CSS globales.
2. Portada: hero con buscador desplegable, tres escenas de segmento, galería de propiedades, propietarios visual, método conciso y cierre fotográfico.
3. Trabajo independiente por archivos: segmentos/contacto/propietarios y tarjetas/catálogo. Contrato común de CinematicImage: src, alt, className, imageClassName, sizes, priority y children opcionales. No mutaciones de datos ni cambios en formularios/API.
4. Pruebas funcionales del buscador bajo demanda, navegación/guardados, movimiento real al scroll y alternativa reducida. Ajustar expectativas visuales anteriores al nuevo diseño; no debilitar controles funcionales.
5. Revisar capturas reales y arreglar problemas de composición. Validar lint, tipos, build y flujos afectados. Revisión independiente, commit y push de rama2; enlace de preview de Vercel.

## Verificación realizada

- ESLint completo y build de producción correctos; TypeScript validado por Next.
- Suite de 96 casos: 92 correctos en la ejecución completa; cuatro expectativas de textos anteriores se actualizaron al nuevo diseño y sus cuatro casos pasaron al repetirse. Se conservaron las comprobaciones de contexto y envío.
- Smoke contra el servidor del build de producción: 16/16 correctos.
- GSAP: scroll real, cambio de escena, limpieza al navegar, resize y preferencia de movimiento reducido comprobados. El selector de escena transfiere el foco a su enlace para continuar con teclado.
- Capturas revisadas a 320, 390 y 1440 px. Corregido recorte del titular a 320 px. Las familias tipográficas y los colores globales se conservaron.
- Revisión independiente sin hallazgos pendientes tras corregir el foco del selector.
- Formularios comprobados con respuestas interceptadas; sin modificar datos de Supabase.
