# Liberación de la portada — 16 de octubre de 2026

## Cambios

- Encabezado negro con marca centrada en escritorio, navegación por categoría y menú de cuadrícula.
- Menú y footer con tipografía condensada, acentos dorados y controles táctiles de al menos 44 px.
- Se conservan rutas, guardados, datos de contacto, enlaces legales y control de foco del menú.
- Incluye hero, marquee continuo, tarjetas de categorías, manifiesto y contadores, y revelado de tarjetas con scroll en celular desarrollados en la rama de preparación.

## Verificación

La revisión visual y de interacción del encabezado, menú y footer cubre 320, 390, 1024 y 1440 px, navegación por teclado, cierre con Escape, devolución de foco, guardados y ausencia de desbordamiento horizontal.

La regresión pública completa pasó 98 de 99 casos; el restante encontraba una copia transitoria del contenido durante el streaming. Se acotó el selector al contenido principal y los ocho casos de la suite de animación y touch pasaron al repetirlos. Las pruebas del manifiesto se actualizaron a los cuatro indicadores actuales y esperan el estado inicial de animación antes de medirlo.

Las 51 pruebas aisladas pasaron con PostgreSQL, Auth y Storage locales reales: formularios, operaciones administrativas, alcance de agentes, renovación de sesión, consentimiento, verificación documental, PDF firmado y caducidad. Los manifiestos de fixtures quedaron vacíos después de la limpieza. El build optimizado de producción completó correctamente.

## Servicios y datos

Se volvió a consultar exclusivamente metadata remota de Storage y migraciones. El bucket `secure-brochures` sigue siendo privado y conserva las dos políticas amplias de usuarios autenticados; `service_role` conserva BYPASSRLS. El historial remoto sigue conteniendo 11 migraciones. No se leyeron filas de negocio ni se modificó la base alojada.

La corrección `supabase/migrations/20261016205400_restrict_private_document_storage.sql` queda preparada como liberación separada de políticas, con evidencia local en `2026-10-16-permisos.md`. Deben verificarse consumidores externos que dependan del acceso directo antes de aplicarla. El snapshot de metadata queda en el directorio local ignorado; no contiene documentos ni secretos.

Los nombres y destinos de variables de Vercel se revisaron sin descifrar valores. No aparecen `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` ni `WHATSAPP_VERIFICATION_TEMPLATE_NAME`: en producción no se podrán enviar códigos documentales hasta configurarlos. La presencia de Resend no demuestra entregabilidad. Las pruebas usan transporte simulado en servidor y no enviaron mensajes reales.

## Despliegue

Producción se compiló con destino Production desde el SHA probado; no se promovió el build Preview, que tiene envíos y administración bloqueados por diseño.

| Campo | Valor verificado |
|---|---|
| URL pública | https://blackmx.vercel.app |
| Despliegue | `dpl_FLCRZcnE7dwJi7kPgze67p1AwEJn` |
| Estado / destino | READY / production |
| Rama / SHA | `main` / `6f668ae61a6b85d960dafe9190b60a9c0c09d209` |
| Preview inmutable del mismo código | https://blackcapital-nkedgy78v-tonala.vercel.app |
| Preview / estado | `dpl_EhP2DK38nJGQaa4Wute8VLc5bAnM` / READY |

El avance de `main` fue fast-forward y sin force. El push no generó un build productivo automático; se solicitó explícitamente a Vercel un build Production del SHA exacto mediante su conexión Git existente. El alias público se contrastó con el ID de ese despliegue.

El smoke público pasó en 1440 y 390 px: hero, menú, revelado, cuatro indicadores, ausencia de desbordamiento y ausencia del aviso Preview. Inventario, contacto y las tres categorías devolvieron 200. El formulario inválido devolvió 400 antes de insertar; la descarga sin sesión devolvió 403; la API administrativa sin sesión devolvió 401; `/admin` redirigió al login. No hubo errores JavaScript ni escrituras de negocio. Una lectura HTTPS con curl, sin desactivar la validación del certificado, devolvió 200; Chromium necesitó aceptar el certificado del proxy del workspace.

Muestra de carga, sin limitación de red y a través del proxy del entorno: DOMContentLoaded alrededor de 1,36 s en ambos anchos y transferencia observada de 755–873 KiB. Es una muestra técnica de esta sesión, no una medición de Core Web Vitals ni una garantía para redes móviles.

La comprobación de GitHub “Supabase Preview” falló por versiones de migraciones remotas ausentes del directorio local, coherente con la divergencia documentada. No se reparó el historial ni se ejecutaron migraciones para cambiar ese resultado. Tras publicar siguen existiendo 11 migraciones remotas y las dos políticas originales de Storage; la corrección de políticas continúa pendiente de aplicación separada.

Producción anterior para recuperación: `dpl_FhT63V8RJ7Z3Eur4W6wJdMVeeuUa`, SHA `836187c0fa30a77a55c5288c0393452ab926da6e`.
