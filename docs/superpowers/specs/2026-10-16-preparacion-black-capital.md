# Preparación de Black Capital para cambios verificables

Fecha: 16 de octubre de 2026. Estado: implementación autorizada por la instrucción del usuario «Ejecuta el plan».

## Resultado esperado

Disponer de una base reproducible, una identificación comprobada del sitio publicado, un mapa actualizado de datos y permisos y un circuito de pruebas aislado. Conectar después los ajustes administrables a la web pública sin perder el diseño ni los flujos existentes.

## Requisitos del usuario

1. Sincronizar las dependencias con el lockfile y establecer una comprobación de tipos limpia.
2. Identificar la rama y el commit que realmente están publicados; utilizar una vista previa para los cambios.
3. Contrastar el esquema remoto con migraciones y tipos antes de tocar datos.
4. Validar acceso y operaciones con perfiles de administrador y agente.
5. Definir qué contenido debe administrarse desde el panel y conectar los ajustes correspondientes.
6. Preparar datos de prueba aislados para formularios, documentos y operaciones administrativas.

## Base comprobada en la revisión anterior

- Checkout en `/workspace/black_capital`, rama `work`, commit `836187c` al revisar. Reconfirmar al ejecutar.
- Next.js 16.1.6, React 19.2.4, TypeScript, Supabase y Playwright.
- ESLint pasó; TypeScript falló por GSAP ausente en la instalación y por `reducedMotion` en `tests/subbrand-value-hover.spec.ts`.
- GSAP 3.15.0 está registrado en el lockfile. No hay motivo comprobado para actualizar versiones.
- El repositorio documenta divergencia del esquema; los tipos generados omiten tablas operativas y contienen una tabla cuya eliminación figura en las migraciones.
- La configuración general se persiste en `app_settings`, pero diversas superficies públicas usan constantes.
- No se verificó el commit servido por Vercel, el esquema remoto ni las operaciones autenticadas.

## Restricciones

- El usuario autorizó ejecutar las seis fases. Se conserva la exclusión de escrituras y promoción de producción; la restricción inicial de solo planificación queda sustituida por esa instrucción.
- Durante la ejecución, descubrir primero los destinos remotos. No equiparar la rama local con producción ni una URL de vista previa con datos aislados.
- No escribir datos, alterar usuarios, ejecutar migraciones ni promover despliegues en producción como parte de las pruebas.
- No usar `/api/seed`, `tests/seed-db.ts` ni datos personales reales para preparar pruebas.
- No guardar secretos, cookies, enlaces firmados ni credenciales en Git, informes o artefactos compartidos.
- Conservar versiones del lockfile y diseño existente; no introducir un CMS completo ni una refactorización general.
- No tratar mocks, pruebas omitidas o informes antiguos como evidencia de integración real.

## Propuesta de contenido para el primer incremento

Conectar los campos ya ofrecidos por el panel: teléfono, correo, dirección, mensaje inicial de WhatsApp, títulos/subtítulos de los tres segmentos y medios de portada. Conservar las claves existentes para evitar una migración innecesaria.

Separar de este incremento testimonios, trayectoria, estadísticas, contenido legal, redes/horarios, sincronización del equipo público y preferencias de cuenta. Su alcance se decidirá con una matriz de contenido, sin dar por aprobados datos empresariales ni textos legales. Inventario, agentes y FAQ conservan sus módulos actuales.

En la portada, proponer prioridad video válido → imagen configurada → imagen actual; con movimiento reducido, imagen configurada → imagen actual. Dado que el panel muestra actualmente una URL de YouTube, comprobar el contrato real y proponer soporte de URL de video de archivo, sin convertir enlaces de YouTube en archivos ni añadir proveedores silenciosamente.

## Aceptación global

- Instalación reproducible, lint y tipos correctos; build verificado al habilitar su ejecución.
- Producción identificada mediante datos de Vercel y vista previa vinculada al commit de trabajo.
- Diferencias de esquema clasificadas y cambios de datos separados de la inspección.
- Pruebas de permisos de admin/agente y documentos ejecutadas con infraestructura aislada.
- Cambios de contenido guardados y visibles fuera de la sesión del editor.
- Resultados reproducibles y limitaciones expresas; publicación de producción fuera de este plan.
