# Black Business — boceto 1

## Referencia y evidencia

- Selección explícita: opción 1, hero fotográfico y página negra.
- Fuente: `/workspace/generated_images/exec-e6535442-6680-4e88-8792-c17c07e55560.png`, 924 × 1703 px.
- Implementación: `/black-business`; capturas `/tmp/black-business-{1440,1024,768,390,320}.png`, densidad 1.
- Comparación conjunta: `/tmp/black-business-comparison-final.png`. Referencia e implementación normalizadas a 720 px de ancho cada una; recorte de implementación hasta el final de la landing, excluyendo el footer corporativo.
- Navegador: Chromium/Playwright instalado en el workspace. La herramienta de control del plugin Browser no está expuesta en esta sesión. No se accedió al navegador personal.

## Fidelidad y correcciones

1. [P2, corregido] Titulares y etiquetas demasiado pequeños frente al boceto. Se amplió la escala de escritorio, preservando el salto de tres líneas del hero y la adaptación móvil.
2. [P2, corregido] El recurso panorámico anterior perdía nitidez en hero y recortes verticales. Se generó una fotografía arquitectónica independiente a partir del boceto y se codificó en WebP (`public/business-retail-plaza.webp`, unos 455 KiB). Se usa en el hero y en dos recortes de categorías; oficinas conserva el recurso del proyecto.
3. Se revisaron las capturas posteriores en cinco anchuras: cero desbordamiento horizontal, sin errores JavaScript, texto e imágenes visibles con movimiento reducido.
4. [P1, corregido] Una captura posterior mostró revelados ocultos durante hidratación con movimiento reducido. Se añadió un marcador semántico al componente y una regla CSS de accesibilidad que hace visible todo el contenido incluso antes de hidratar. Las pruebas verifican ahora las cinco zonas de revelado, incluidas las que están fuera de pantalla. La recaptura y comparación conjunta posteriores muestran introducción, tres categorías y cierre visibles, tanto en escritorio como en celular.

## Superficies revisadas

- Tipografía: Oswald del proyecto en titulares, navegación y acciones; Georgia en el cuerpo editorial, siguiendo la referencia serif. Sin texto rasterizado dentro de la interfaz.
- Composición: encabezado existente, hero a sangre con sombreado para contraste, mensaje en tres líneas, CTA principal y enlace al cierre; después tres columnas de categorías y contacto con regla dorada. En celular las categorías se apilan completamente.
- Color: negro, marfil y dorado claro `#e4c078`; contraste suficiente sobre la fotografía mediante una capa oscura de lectura.
- Imágenes: fotografía comercial ilustrativa en hero/locales/plazas y arquitectura de oficinas del proyecto. No se muestran inventarios, precios o disponibilidad ficticios. Los pequeños cambios de encuadre respecto al mock generativo son P3.
- Contenido: se reconocen únicamente los rótulos genéricos heredados y los valores predeterminados para mostrar el nuevo titular. Otros títulos/subtítulos del panel siguen siendo texto configurable, sin interpretar HTML.
- Interacción: CTA al catálogo con `uso=Comercial`; categorías con `propiedad=Local`, `Oficina` y `Plaza`; enlace de asesor al ancla de contacto; cierre a `/contacto?brand=business&objetivo=buscar-propiedad`.

La comparación conjunta revisa jerarquía, ritmo y proporciones; las capturas originales de escritorio y móvil permiten revisar texto, botones y controles a escala real.

## Verificación

- Regresión pública inicial: 107 casos aprobados. Después de la regla CSS de accesibilidad, 106 de 107 pasaron; el caso restante encontraba una copia temporal de streaming fuera del contenido principal. Se acotó el selector a `#main-content` y las 18 pruebas de landings residencial/comercial pasaron al repetirlas.
- Ajustes del panel: 6 casos aislados aprobados, incluidos rótulos genéricos de ambas marcas, títulos personalizados como texto y recuperación ante fallos.
- Build optimizado, ESLint y TypeScript aprobados. Manifiestos de fixtures vacíos al terminar.
- Los nuevos casos cubren 1440/1024 px, contexto táctil 390/320 px, navegación por teclado, filtros reales del catálogo, contacto y movimiento activo/reducido.
- No se cambiaron dependencias, API, esquema ni datos alojados. Los envíos de prueba se limitaron al stack aislado.
- Se conservan el encabezado y footer corporativos. La landing residencial de la rama sigue disponible; su revisión anterior se conserva en [Black Luxury](./docs/verification/black-luxury-design-qa.md).

## Vista previa verificada

- URL: https://blackcapital-fidbdyt0o-tonala.vercel.app/black-business
- Despliegue: `dpl_vDArsQV2YS1BuxPrvT33pL8P7rY1`, READY / Preview.
- Rama: `codex/black-business-opcion-1`; SHA de código: `be81833aa838659ad54e6fdde870b3a789d9fcf8`.
- Landing 200 con titular, secciones y nueva fotografía; catálogo filtrado por Comercial/Oficina 200; API de envíos 503 por bloqueo intencional de Preview. No se enviaron formularios reales.
- Una compilación anterior de Vercel falló al resolver Oswald en Turbopack; la siguiente compilación del mismo código de aplicación terminó correctamente, sin cambiar fuentes ni configuración del proyecto.
- Las comprobaciones de contenido del despliegue usaron la lectura autenticada de Vercel; puede solicitar inicio de sesión al abrirlo. La revisión visual y de interacciones se hizo en Chromium local sobre el mismo código. No se movió el dominio de producción.

final result: passed
