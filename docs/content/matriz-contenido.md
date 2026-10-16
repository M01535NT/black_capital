# Contenido administrable — primer incremento

El usuario autorizó ejecutar el plan, incluido su primer incremento propuesto. Se conectan los campos ya ofrecidos por el panel; no se incorpora un CMS general ni se modifica contenido empresarial no confirmado.

| Campo / claves | Editor y fuente | Consumidores | Validación y respaldo |
|---|---|---|---|
| Teléfono `contactPhone` | Admin; `app_settings.site` | Contacto, footer, menú, CTA y teléfono alternativo de ficha | 10–15 dígitos; formato visible conservado y enlace normalizado. Default central si falta/es inválido |
| Correo `contactEmail` | Admin; misma fila | Contacto, footer, referencias de contacto legales y datos estructurados | Email válido, máximo 254 caracteres; default central |
| Dirección `contactAddress` | Admin; misma fila | Contacto, footer, enlace de mapa y datos estructurados | Texto de 1–500 caracteres; default central |
| Mensaje `whatsAppTemplate` | Admin; misma fila | Menú, footer, CTA generales y de segmentos | Texto de 1–1000 caracteres, codificado para URL; conserva contexto del segmento |
| Título/subtítulo de Luxury, Business e Industrial | Admin; claves existentes `*HeroTitle` / `*HeroSubtitle` | Encabezados de las tres landings | Texto, nunca HTML; límites 180/600; valores originales del código como respaldo |
| `heroImageUrl` | Admin; misma fila | Portada y respaldo del video | Archivo local o HTTPS de proveedores permitidos, sin credenciales ni esquema inseguro; portada original si falta |
| `heroVideoUrl` | Admin; misma fila | Portada | Archivo MP4/WebM local o HTTPS de Supabase/Cloudinary. YouTube no se trata como archivo; placeholder del panel actualizado. Imagen ante error o movimiento reducido |

## Contrato de persistencia

El esquema compartido valida el POST en el servidor y descarta claves ajenas al leer datos persistidos. Una actualización inválida no cambia la fila. La lectura solo expone la proyección pública permitida; el acceso privilegiado permanece en un módulo `server-only`.

La caché React es únicamente por render para deduplicar lecturas. Tras guardar se invalidan las rutas del layout; un visitante nuevo observa los ajustes sin depender del almacenamiento local del editor. Un fallo remoto se anuncia como error y conserva el formulario; no muestra guardado exitoso.

## Contenido que conserva su módulo o requiere otra decisión

- Propiedades, agentes asociados a fichas y FAQ mantienen sus módulos actuales.
- Redes, horarios, estadísticas, testimonios, historia y presentación del equipo siguen en código.
- Los textos legales no se reescriben; sus datos de contacto se mantienen coherentes con el teléfono/correo configurado.
- Preferencias de cuenta, sincronización de equipo público, nuevos proveedores multimedia y edición de textos legales quedan fuera de este incremento.

La vista previa de Vercel es de solo lectura: no permite guardar ni usar administración porque el proyecto hereda variables de servicios que podrían ser productivos. Los cambios se probaron contra el stack local aislado.
