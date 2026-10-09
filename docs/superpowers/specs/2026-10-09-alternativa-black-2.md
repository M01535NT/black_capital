# Alternativa Black 2 — dirección visual

El usuario rechazó la dirección anterior: demasiado texto, imágenes compactas, poca sofisticación y apariencia brutalista. Solicita otro intento con fotografía protagonista, GSAP y Motion, transiciones fluidas ligadas al scroll y una experiencia inspirada en sitios editoriales de Awwwards. Autoriza implementarlo. Conservamos identidad negra/dorada, familias tipográficas y datos de prueba. Rama separada para comparación: Alternativa-Black-2.

## Diseño

- Hero fotográfico a pantalla completa: imagen legible, degradado localizado, titular original sobre la fotografía y dos acciones discretas. Buscador accesible bajo demanda, sin formulario abierto que compita con la imagen.
- Secuencia residencial/comercial/industrial con imágenes amplias, encuadres asimétricos, rótulos breves y transición de planos al desplazarse. GSAP ScrollTrigger en escritorio; lectura natural y parallax suave en móvil.
- Propiedades como galería editorial, fotografía dominante y solo precio, título y atributos esenciales. Se mantienen guardados, compartir y acceso a ficha.
- Propietarios como composición fotográfica; método en una escena visual con cuatro pasos breves, sin cuatro bloques pesados de texto.
- Reducir exposición de información secundaria mediante controles existentes, acordeones y enlaces a las páginas interiores. Evitar repetir argumentos en cada sección.
- Trasladar lenguaje de imagen, espacio y curvas sutiles a segmentos, contacto, propietarios y catálogo. Mantener navegación y formularios funcionales.

## Movimiento y verificación

GSAP controla parallax y secuencias de scroll con contexto local y limpieza en desmontaje. Motion controla entradas, gestos y paneles. No secuestrar el scroll. Sin scroll infinito ni cursores que sustituyan el cursor normal. `prefers-reduced-motion` conserva todo el contenido y elimina secuencias fijadas. Verificar teclado, móviles320/390, escritorio1440, ausencia de recortes, limpieza al navegar, errores de consola, compilación, tipos y lint. Formularios interceptados; ninguna escritura a datos reales.
