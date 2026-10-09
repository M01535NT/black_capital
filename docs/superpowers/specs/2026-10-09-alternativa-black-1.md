# Alternativa Black 1 — diseño aprobado

El usuario autorizó implementar la reorganización completa en una rama nueva. La rama es `Alternativa-Black-1`, porque Git no admite espacios. Se conservan negro y dorado, familias y estilos tipográficos y todas las propiedades de prueba. No se modifica información en Supabase ni se publica en producción.

## Arquitectura y recorridos

- Inicio: hero con el titular existente y buscador → propiedades destacadas → tres segmentos visibles → propietarios → proceso compacto → cifras y testimonios manuales → preguntas → contacto.
- Navegación: enlaces visibles a Propiedades, Para propietarios y Asesoría; conservar el menú de marca, mejorar teclado y foco. Pie compacto.
- Un catálogo `/inventario`: filtros rápidos de operación, uso, zona, precio y moneda; filtros avanzados y chips. No comparar precios entre monedas como si fueran equivalentes. Guardados sincronizados, persistentes y consultables en un panel.
- Fichas: galería y resumen con contacto inmediato, secciones ancladas, medios solo cuando existan, similares al final, contacto fijo móvil. Compartir siempre la propiedad correspondiente.
- Segmentos: hero/búsqueda → inventario → criterios → contacto contextual; conservar contenido propio de cada segmento.
- Nueva página `/propietarios`: venta/renta, servicios, proceso, información inicial y formulario breve.
- `/nosotros`: consolidar equipo, historia y valores; las rutas anteriores redirigen a sus secciones.
- `/herramientas`: selector de Hipoteca, Rendimiento de renta, Compra y remodelación e Impuestos, con enlaces directos y resultados claros.
- `/contacto`: canales y formulario juntos, conservar contexto de inmueble, servicio y segmento; errores sin perder entradas y confirmación clara.

## Criterios de aceptación

1. Colores y tipografía no cambian; no se edita `globals.css` ni la configuración de fuentes.
2. Búsquedas enlazan con filtros operativos y reflejan URL; zonas y monedas se respetan.
3. Guardar/quitar se sincroniza entre tarjetas y panel y persiste al recargar; compartir enlaza la ficha.
4. Navegación por teclado, Escape y devolución del foco funcionan en paneles.
5. Contacto y propietarios conservan objetivo/contexto y validan sin realizar envíos reales en pruebas.
6. Calculadoras tienen selección y enlaces directos; rutas antiguas de Nosotros siguen funcionando.
7. No hay desbordamiento horizontal ni colisiones con barra móvil en escritorio y móvil.
8. Verificar lint, tipos, compilación y pruebas de recorridos; revisar cambios antes de guardar la rama.
