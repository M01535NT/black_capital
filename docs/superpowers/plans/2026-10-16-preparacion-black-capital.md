# Black Capital: preparación para cambios — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establecer una base reproducible y un entorno de validación aislado antes de conectar contenido administrable y continuar el desarrollo de Black Capital.

**Architecture:** Mantener Next.js, Supabase y Vercel. Descubrir producción y esquema mediante lecturas; separar configuración pública validada de accesos privilegiados; ejecutar operaciones de prueba exclusivamente contra infraestructura desechable. Entregar incrementos verificables sin refactorización general.

**Tech Stack:** Next.js 16.1.6, React 19.2.4, TypeScript, npm/package-lock.json, Supabase, Playwright y Vercel.

**Spec:** `docs/superpowers/specs/2026-10-16-preparacion-black-capital.md`.

## Global Constraints

- Esta entrega es planificación. Ninguna fase de implementación está iniciada.
- No escribir datos, alterar usuarios, ejecutar migraciones ni promover despliegues en producción como parte de las pruebas.
- No usar `/api/seed`, `tests/seed-db.ts` ni datos personales reales para preparar pruebas.
- No guardar secretos, cookies, enlaces firmados ni credenciales en Git, informes o artefactos compartidos.
- Conservar versiones del lockfile y diseño existente; no introducir un CMS completo ni una refactorización general.
- No tratar mocks, pruebas omitidas o informes antiguos como evidencia de integración real.
- Una vista previa solo puede habilitar operaciones si sus servicios apuntan a destinos de prueba comprobados.
- Resolver tareas con el mismo agente, secuencialmente; no se necesita delegación para ejecutar este plan.

## Review Focus

1. Una URL de preview puede apuntar a Supabase de producción: las escrituras de prueba deben rechazarse antes de abrir conexiones si el destino no está permitido (entregable 6).
2. Un agente puede intentar acceder directamente a recursos de otro agente, aunque la interfaz oculte enlaces: páginas y API deben denegarlo sin cambiar datos (entregable 4).
3. Una configuración parcial, inválida o no disponible debe conservar valores seguros y nunca publicar secretos (entregable 5).
4. La caducidad de una sesión o de un enlace documental debe impedir la operación; renovar sesión no debe elevar permisos (entregable 4).
5. Una limpieza interrumpida no debe borrar datos ajenos: solo se retiran identificadores y archivos creados por la ejecución de prueba (entregable 6).

## Responsabilidad, secuencia y control

- Responsable técnico propuesto: Codex, al recibir la instrucción de ejecutar.
- Responsable de decisiones de producto y aceptación: usuario.
- Enfoque: incremental, con descubrimiento inicial y decisiones de contenido antes del cambio público.
- Trabajo en curso: un entregable principal. Tras cada uno, registrar evidencia, limitaciones y siguiente acción.
- Ventanas: por hitos, sin comprometer fechas hasta comprobar accesos, destino de preview y disponibilidad de infraestructura de pruebas.
- Orden recomendado: **1 → 2 → 3 → 6 → 4 → 5**. El paso 6 habilita pruebas reales seguras para el 4 y el 5; se conserva la numeración del usuario.
- Si falta acceso a Vercel o a metadatos de Supabase, registrar el bloqueo exacto; no deducir resultados de constantes del código.

| Entregable | Dependencias | Evidencia para revisión |
|---|---|---|
| 1. Base técnica limpia | Checkout actual | Instalación, versiones, lint, tipos y build |
| 2. Producción y preview identificados | 1 para publicar preview | Proyecto, despliegue, rama, SHA y URLs comprobadas |
| 3. Esquema contrastado | Identidad de proyectos del 2 | Matriz de diferencias y tipos contrastados |
| 4. Permisos y operaciones validados | 3 y 6 | Matriz admin/agente/visitante y resultados sin omisiones críticas |
| 5. Ajustes conectados | 1, 3, 4 y 6; decisión de contenido | Matriz de campos, pruebas y evidencia de persistencia pública |
| 6. Datos y servicios aislados | 2 y 3 | Guardas de destino, fixtures y limpieza verificadas |

## Task 1: Sincronizar dependencias y limpiar la comprobación técnica

**Files:** `package.json`, `package-lock.json` (preservar), `tests/subbrand-value-hover.spec.ts`, `next.config.ts` (inspección), crear `docs/verification/2026-10-16-base-tecnica.md`.

**Interfaces:** Consume el checkout y el lockfile actuales. Produce instalación alineada, scripts `typecheck` y `check` y un informe de base técnica.

- [ ] Reconfirmar instrucciones, estado de Git, rama, SHA y procesos que usan `node_modules`; preservar cambios ajenos y no interrumpir servidores ajenos.
- [ ] Comprobar versión de Node/npm, campo `engines` si existe y scripts de instalación de dependencias antes de ejecutarlos. Leer la política de red del entorno si hay descargas.
- [ ] Registrar el resultado inicial de `npm ls gsap --depth=0` y `npx --no-install tsc --noEmit --incremental false` sin presentar errores como corregidos.
- [ ] Ejecutar `npm ci`; si falla por inconsistencia entre manifiesto y lockfile, diagnosticar y explicar el diff antes de actualizar versiones. Si necesita reconstruir dependencias en uso, hacerlo en un checkout aislado.
- [ ] Comprobar que GSAP coincide con la versión bloqueada. Repetir tipos para separar errores de instalación de errores del código.
- [ ] Cambiar el `test.use` incompatible a `contextOptions: { reducedMotion: "reduce" }`, conservando viewport y las aserciones existentes; confirmar contra los tipos de Playwright instalado.
- [ ] Añadir `typecheck: "tsc --noEmit --incremental false"` y `check: "npm run lint && npm run typecheck"` en `package.json`. No debilitar `strict`, excluir pruebas ni añadir supresiones para ocultar errores.
- [ ] Ejecutar `npm run check` y `npx --no-install playwright test tests/subbrand-value-hover.spec.ts --list`; resultado esperado: código 0 y pruebas descubiertas.
- [ ] Ejecutar `npm run build` con configuración apropiada y registrar los archivos generados por Next/PWA; restaurar únicamente los artefactos derivados de esta ejecución que no deban versionarse.
- [ ] Registrar comandos, versiones y salidas resumidas. Revisar el diff y preparar un commit limitado a este entregable, sin push a `main`.

**Aceptación:** instalación reproducible, lint/tipos/build correctos y prueba incompatible corregida sin reducir cobertura. Un fallo de red o configuración se registra como bloqueo, no como aprobación del build.

## Task 2: Identificar publicación y preparar vista previa

**Files:** inspeccionar `vercel.json`, `src/lib/site-url.ts`, metadatos y configuración remota; crear `docs/verification/2026-10-16-despliegue.md`. No cambiar canónicos ni redirecciones de negocio por usar preview.

**Interfaces:** Produce un registro `production` y `preview`, cada uno con `project_id`, `deployment_id`, `url`, `git_branch`, `git_sha`, `status`, `checked_at` y fuente de evidencia. Usar `null` y causa cuando el proveedor no exponga un campo; nunca inventarlo.

- [ ] Consultar Vercel en modo lectura; identificar cuenta/equipo, proyecto y repositorio conectado a `blackmx.vercel.app`.
- [ ] Resolver el alias de producción al despliegue efectivo y consultar su metadato Git; no confundir el último despliegue creado con el que sirve producción.
- [ ] Comparar su SHA/rama con el checkout y registrar la diferencia. Si el despliegue carece de procedencia Git, contrastar con su fuente y dejar explícita la limitación.
- [ ] Revisar nombres y separación de variables de Production/Preview sin exportar valores; comprobar qué proyecto Supabase y proveedores de mensajería usaría preview.
- [ ] Preparar una rama de trabajo propia sin alterar `main`; usar la convención del repositorio y registrar su nombre real. No asumir que `work` está conectado a un despliegue.
- [ ] Crear preview del SHA validado. Si aún no existe backend aislado, usar configuración de preview sin escrituras ni credenciales privilegiadas de producción y registrar las funciones no disponibles.
- [ ] Verificar que el despliegue terminó correctamente y que su SHA coincide con el commit previsto; comprobar portada, catálogo y redirección del admin sin enviar formularios.
- [ ] Documentar URL, acceso, destino de servicios, fallos y procedimiento para volver al último preview correcto. Revisar y preparar commit de documentación.

**Aceptación:** producción tiene procedencia identificada o una limitación demostrada; preview abre, corresponde al SHA registrado y no permite pruebas contra datos productivos. No promover a producción.

## Task 3: Contrastar esquema remoto, migraciones y tipos

**Files:** `supabase/migrations/*.sql`, `supabase/SCHEMA_DRIFT.md`, `src/types/database.types.ts`, `src/lib/db-types.ts`, `src/lib/supabase/{admin,server,client}.ts`; crear `docs/verification/2026-10-16-esquema.md`.

**Interfaces:** Produce una matriz `objeto | código | migraciones | remoto | diferencia | impacto | acción`, incluyendo tablas, columnas, enums, FK, índices, RLS y buckets. Produce un snapshot estructural sin filas de negocio ni secretos, en ubicación ignorada de trabajo.

- [ ] Confirmar la identidad del proyecto remoto; usar solo consultas de catálogo/metadata o herramientas equivalentes de lectura. No descargar filas de clientes, usuarios ni documentos.
- [ ] Comparar las tablas operativas, `document_access_requests`, `properties.faqs`, `system_logs`, `admin_access_requests`, las políticas y los buckets con el código y los 18 archivos SQL.
- [ ] Consultar el historial de migraciones disponible y distinguir existencia de un objeto de aplicación comprobada de una migración.
- [ ] Generar tipos a un archivo temporal y compararlos con `database.types.ts`; no sobrescribir hasta revisar el diff. El nombre del archivo temporal no debe quedar incluido por el `tsconfig` del proyecto.
- [ ] Incorporar al archivo generado solo tipos que correspondan al esquema confirmado. Examinar si los clientes necesitan `Database` como genérico; separar cualquier cambio amplio de tipado del ajuste mínimo.
- [ ] Actualizar el documento de divergencias distinguiendo evidencia actual de su historial. No ejecutar automáticamente SQL para igualar una de las versiones.
- [ ] Clasificar cada diferencia: documentación, tipos, migración futura o decisión de modelo. Para migraciones futuras, describir precondiciones, compatibilidad y recuperación sin aplicarlas en producción.
- [ ] Ejecutar `npm run check` después de cambios de tipos y revisar el diff. Preparar commit de documentación/tipos sin datos.

**Aceptación:** cada diferencia relevante tiene evidencia y tratamiento. La fase puede concluir con divergencias pendientes documentadas; no implica autorización para corregir producción ni garantiza que la cadena SQL sea reproducible.

## Task 6: Preparar infraestructura y datos de prueba aislados

**Files:** crear `playwright.isolated.config.ts`, `tests/support/isolated-target.ts`, `tests/support/isolated-fixtures.ts`, `tests/support/isolated-providers.ts`, `tests/isolated/target-guard.spec.ts`, `tests/isolated/fixtures.spec.ts`, `src/lib/operational-transport.ts`, `docs/testing/entorno-aislado.md`; actualizar `.gitignore`, `package.json`, `src/lib/email.ts`, `src/lib/whatsapp.ts` y exclusiones de la configuración Playwright habitual para no ejecutar accidentalmente la suite aislada.

**Interfaces:** `assertIsolatedTarget(config): void` falla antes de conexiones si no hay modo de prueba, referencia exacta permitida y host permitido o si coincide con producción. `createTestFixtures(runId): Promise<TestFixtures>` y `cleanupTestFixtures(fixtures): Promise<void>` manejan solo IDs y rutas que devuelve esa ejecución. `TestFixtures` contiene IDs de dos agentes, admin, usuarios activos/inactivo, propiedades asignadas/no asignadas, leads y documentos; credenciales solo en memoria o secretos del entorno. `sendOperationalRequest(service: "resend" | "whatsapp", url: string, init: RequestInit): Promise<Response>` centraliza únicamente el transporte de los dos proveedores; el modo normal mantiene su comportamiento y destinos actuales.

- [ ] Elegir Supabase local o proyecto desechable según capacidades comprobadas. Si el esquema no puede reconstruirse con las migraciones actuales, preparar una base estructural compatible en el destino aislado, registrar su procedencia y verificar RLS; no usar una copia de filas productivas.
- [ ] Crear la configuración Playwright separada con salida de artefactos ignorada y secretos externos al repositorio. `test:isolated` ejecutará `playwright test --config=playwright.isolated.config.ts`.
- [ ] Escribir y ejecutar pruebas de la guarda: destino productivo, host ajeno, modo ausente o referencia vacía deben fallar antes de cualquier solicitud; destino aislado explícito debe aceptarse.
- [ ] Implementar la guarda e invocarla antes de configurar clientes, crear usuarios, iniciar el servidor de prueba, realizar operaciones y limpiar datos.
- [ ] Crear fixtures sintéticos identificados por `runId`; relaciones entre dos agentes para comprobar acceso cruzado, un usuario inactivo, documentos privados y leads por estado. No incluir correos/teléfonos reales.
- [ ] Encauzar las llamadas existentes de Resend y WhatsApp por `sendOperationalRequest`; activar respuestas simuladas solo con modo aislado explícito y `assertIsolatedTarget` aprobado. Interceptar únicamente solicitudes del navegador no basta para impedir envíos del servidor. Sin modo aislado, mantener el transporte real y sus controles actuales; con modo aislado mal configurado, fallar cerrado sin enviar. Probar ambos modos y comprobar cero envíos reales durante la suite.
- [ ] Probar limpieza tras éxito y fallo: eliminar por los IDs/rutas de la ejecución y comprobar que sobrevive un registro centinela ajeno. No borrar tablas completas ni invocar seeds existentes.
- [ ] Verificar acceso real a Auth/DB/Storage en el entorno aislado, separándolo de pruebas que simulan proveedores. Registrar bootstrap, repetición y recuperación de limpieza interrumpida.
- [ ] Revisar artefactos para excluir cookies, contraseñas, enlaces firmados y datos sensibles; preparar commit del soporte reproducible.

**Aceptación:** suite repetible con datos propios, servicios externos simulados en el servidor y limpieza acotada. Sin infraestructura aislada, las pruebas UI con mocks pueden avanzar, pero permisos/RLS/integración quedan pendientes explícitos.

## Task 4: Validar permisos y operaciones de administrador y agente

**Files:** crear `tests/isolated/auth-roles.spec.ts`, `tests/isolated/admin-operations.spec.ts`, `tests/isolated/document-access.spec.ts`, `docs/verification/2026-10-16-permisos.md`. Revisar `src/lib/auth.ts`, `src/proxy.ts`, páginas admin y controladores API implicados; corregir únicamente defectos reproducidos por pruebas.

**Interfaces:** Consume `TestFixtures` y la configuración aislada. Produce matriz `actor | recurso propio/ajeno | operación | resultado esperado | resultado observado | evidencia`.

- [ ] Definir matriz para visitante, admin, agente A, agente B y perfil inactivo. Admin gestiona inventario/equipo/configuración; agentes consultan propiedades asignadas y gestionan sus leads/tareas; visitante accede solo a flujos públicos.
- [ ] Escribir pruebas de páginas y API directas para sesión ausente, perfil inactivo, cierre de sesión, expiración y renovación. Un fallo debe denegar la operación y no modificar filas.
- [ ] Escribir pruebas de lectura y modificación de lead/tarea propia frente a ajena, asignación reservada a admin y ausencia de elevación de rol mediante payloads.
- [ ] Comprobar alcance de contadores y notificaciones: el contador `/api/leads` de un agente debe corresponder a sus leads, no al total global. Si negocio necesita indicadores globales, documentar esa decisión antes de cambiar el contrato.
- [ ] Probar CRUD administrativo, asignación de agentes, archivos permitidos y rechazos por rol; para operaciones sensibles conservar la confirmación de contraseña existente.
- [ ] Probar documentos: privacidad/NDA, código incorrecto/vencido, verificación válida, sesión documental vencida, cookie ajena y descarga desde bucket privado. Comprobar contenido/permiso del archivo, no solo una redirección.
- [ ] Intentar lecturas/escrituras directas con claves públicas y sesiones de prueba según las políticas esperadas; diferenciar protección API de protección RLS/Storage.
- [ ] Ejecutar las tres suites aisladas, corregir defectos comprobados con ciclo fallo → cambio mínimo → aprobación y repetir `npm run check`. No aceptar omisiones en casos críticos de autorización.
- [ ] Registrar resultados y residuos de datos; verificar limpieza y preparar commits por defecto o conjunto coherente de pruebas.

**Aceptación:** operaciones permitidas funcionan, las prohibidas no exponen ni cambian datos y los casos críticos pasan en infraestructura real aislada. Pruebas con mocks no acreditan este entregable.

## Task 5: Definir y conectar contenido administrable

**Files:** crear `src/lib/site-settings-schema.ts`, `src/lib/site-settings.ts`, `tests/isolated/site-settings.spec.ts`, `docs/content/matriz-contenido.md`; modificar `src/app/api/settings/route.ts`, `src/app/(admin)/admin/settings/settings-form.tsx`, las páginas públicas y componentes consumidores identificados. Mantener `src/lib/contact-config.ts` y `src/lib/sub-brand-config.tsx` como valores predeterminados donde corresponda.

**Interfaces:** `SiteSettings` valida solo las claves públicas existentes. `getSiteSettings(): Promise<SiteSettings>` vive en un módulo `server-only`, lee `app_settings['site']` y completa valores predeterminados. Los componentes cliente reciben props serializables, nunca el cliente privilegiado. `normalizeSiteSettings(value: unknown): SiteSettings` valida valores persistidos y conserva defaults seguros.

- [ ] Completar y presentar la matriz `campo | editor | fuente | consumidores | validación | visibilidad | política de respaldo`. Confirmar el primer incremento propuesto en la especificación antes de implementarlo; la definición de contenido forma parte de esta fase.
- [ ] Fijar consumidores: contacto en Header/Footer/CTA/fichas y contacto; títulos/subtítulos en las tres páginas de segmento; imagen/video en HomeHero. Inspeccionar todos los usos de `CONTACT_CONFIG` para evitar inconsistencias y conservar datos estructurados coherentes.
- [ ] Definir el contrato de `heroVideoUrl`: propuesta de URL de archivo HTTPS de host permitido y portada alternativa, con reproducción silenciosa y sin movimiento cuando el usuario lo reduzca. Si se conserva YouTube, especificar por separado su embed y privacidad antes de implementar; no aceptar ambos contratos implícitamente.
- [ ] Escribir pruebas que fallen: admin guarda y visitante nuevo observa el cambio tras recargar; agente no puede guardar; texto se representa como texto; URL/esquema/host no permitido se rechaza; configuración vacía/parcial o lectura fallida usa defaults sin filtrar datos internos.
- [ ] Extraer esquema y defaults compartidos, validar el POST de ajustes del lado servidor y persistir únicamente claves permitidas. Un error remoto al guardar debe mostrarse como error; el respaldo local no debe anunciar una publicación exitosa.
- [ ] Leer ajustes en componentes servidor y pasarlos por props; no convertir la API privilegiada en un endpoint público general ni consultar secretos desde el navegador.
- [ ] Invalidar contenido después de una escritura exitosa. Si se usa caché, definir una única etiqueta `site-settings` y probar que una sesión pública nueva ve el cambio tras la siguiente navegación completa.
- [ ] Conectar consumidores y conservar el layout, búsquedas y valores predeterminados. No agregar a esta fase equipo, testimonios, textos legales ni preferencias de cuenta sin una decisión registrada.
- [ ] Ejecutar `npm run check`, build, suite aislada de ajustes y regresiones públicas de contacto, segmentos y portada. Comparar 390 y 1440 px y movimiento reducido; evitar envíos reales.
- [ ] Publicar únicamente preview del commit probado, verificar SHA y registrar capturas/resultados sin secretos. Preparar commit y ficha de cambios para revisión de producto.

**Aceptación:** un ajuste válido persiste y aparece al visitante sin depender de localStorage; errores, permisos y respaldo están probados. La matriz deja explícitos los campos aún gestionados por código.

## Cierre y evidencia

- [ ] Comprobar cobertura de los seis requisitos y actualizar `estado-proyecto.json` con evidencia real; no marcar aceptado un entregable solo porque existe código.
- [ ] Entregar URLs de producción y preview, SHA correspondiente, resultados de checks y suites, mapa de diferencias de datos y matriz de contenido/permisos.
- [ ] Registrar pendientes, limitaciones y recuperación: último commit/preview correcto, limpieza por runId y política ante cambio de esquema. Cualquier futura migración de producción tendrá su propio respaldo, ensayo y recuperación comprobados.
- [ ] Dejar la promoción de producción como operación separada y revisable. Este plan termina con una vista previa validada.

## Comprobación del propio plan

- Los requisitos 1–6 están cubiertos por tareas homónimas; el orden cambia solo por la dependencia de aislamiento.
- No hay secretos ni identificadores remotos inventados; la primera acción es técnica y comprobable.
- Las fechas de ejecución dependen de accesos aún no evaluados. No hay compromiso de calendario externo.
- Los recursos auxiliares `estado-proyecto.schema.json`, `seleccion-enfoque.md` y `validar_proyecto.py` de la skill de gestión no pudieron recuperarse mediante skills ni localizarse en las rutas disponibles. El registro adjunto usa un formato operativo local; su sintaxis/coherencia se valida localmente, sin afirmar conformidad con ese esquema no disponible.
