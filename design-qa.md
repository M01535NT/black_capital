# Black Luxury — opción 2

## Fuente y evidencia

- Referencia seleccionada: `/workspace/generated_images/exec-bc82d80b-c861-4d6c-9bfc-c7e883bf72c1.png` (971 × 1619 px).
- Implementación: `/black-luxury`, Chromium del entorno, capturas `/tmp/black-luxury-{1440,1024,768,390,320}.png`.
- Comparación conjunta: `/tmp/black-luxury-comparison-final.png`. Fuente y captura se normalizaron a 720 px de ancho cada una, sin deformar proporciones; implementación recortada al final de la landing, antes del footer existente. La landing mide 1440 × 2412 CSS px, densidad 1; la referencia a ese ancho equivale aproximadamente a 1440 × 2401 px.
- Estado visual: movimiento reducido, página sin filtros elegidos. Se comprobaron también las animaciones activas y la interacción con búsqueda, colecciones y contacto en Playwright.
- Browser conectado: herramienta de control no expuesta en esta sesión, igual que en la exploración previa. Se utilizó Chromium/Playwright instalado en el workspace para la validación renderizada, sin acceder al navegador personal.

## Comparación y correcciones

1. [P1, corregido] El componente compartido de revelado cambiaba de tipo de nodo al hidratar con movimiento reducido. Dejaba estilos iniciales ocultos en textos e imágenes. Mantiene ahora el mismo nodo Motion y muestra el estado final con duración cero. La captura posterior contiene introducción, ambas colecciones y cierre de contacto.
2. [P2, corregido] La altura mínima de la fotografía imponía 384 px de ancho en pantallas de 320 px. Se retiró esa restricción; las cinco anchuras revisadas tienen cero desbordamiento horizontal.
3. [P2, corregido] El titular inicial era pequeño y demasiado bajo; al ampliarlo, el acento se partía en dos líneas. Se ajustaron posición, tamaño y escala del acento. La captura final conserva las tres líneas del boceto.
4. [P2, corregido] En la revisión adicional de 1024 px, la fila del hero podía crecer por encima de su altura fija y solapar la introducción. Se sustituyó la altura fija por una altura mínima fluida y se añadió una comprobación de geometría entre fotografía e introducción. La nueva captura de 1024 px muestra la firma sobre negro y la introducción completamente debajo de ambas columnas; se recapturaron además las otras cuatro anchuras.

## Superficies de fidelidad

- Tipografía: Oswald servido por `next/font` para titulares y controles; Public Sans existente para cuerpo. Familia renderizada comprobada en el navegador, titulares sin recorte. Ajuste óptico del acento dorado para conservar una sola línea en escritorio.
- Ritmo y composición: hero 44,5/55,5 %, introducción clara, buscador horizontal, dos imágenes y cierre negro. En celular se apilan contenido, imagen y controles; no se usa desplazamiento horizontal para esconder contenido.
- Color: negro, marfil `#f3efe6`, dorado `#d2a73c` y dorado claro `#e4c078`. Texto oscuro y controles nativos con esquema claro en el buscador.
- Fotografías: los mismos recursos arquitectónicos utilizados al generar el boceto. Son enlaces a búsquedas por ciudad, sin inventar inmuebles, precios o disponibilidad.
- Contenido: titular y subtítulo predeterminados adaptados al boceto. Los rótulos genéricos heredados «Black Luxury» e «Inmuebles Residenciales», confirmados mediante lectura remota limitada a esos dos campos públicos, pasan a la nueva composición sin modificar la base de datos. Otros valores personalizados desde administración se conservan y se renderizan como texto. CTA al catálogo residencial y contacto con `brand=luxury`.

La comparación conjunta permite leer los titulares, proporciones y composición. Los controles y cuerpo se revisaron además en las capturas originales de 1440 y 390 px, sin reducirlas a miniaturas.

## Diferencias intencionales y límites

- Se conservan encabezado y footer reales, incluidos navegación, guardados y datos de contacto. El boceto muestra solo el fragmento principal de la landing.
- Se usan tipografías web reales, iconos existentes y fotografías originales; el boceto generativo tiene pequeñas diferencias de glifos y encuadre (P3).
- La comprobación local de consola detectó errores de certificado del proxy al cargar `https://va.vercel-scripts.com`; se separan de errores JavaScript de la aplicación, que no aparecieron. No se desactivó la validación TLS para enviar eventos de analítica.
- No se publicaron cambios de base de datos ni se enviaron formularios a servicios reales. La vista previa Vercel conserva el bloqueo de envíos y administración.

final result: passed
