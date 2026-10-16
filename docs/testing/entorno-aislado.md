# Pruebas aisladas de Black Capital

El entorno utiliza PostgreSQL 17, Supabase Auth, PostgREST, Storage y Kong reales en contenedores Docker locales. No emplea filas, usuarios ni documentos productivos. El stack completo de Supabase CLI se descartó porque la extracción de su imagen PostgreSQL agotaba el espacio con el driver vfs del entorno; no se cambió el driver ni se reinició el daemon.

## Arranque reproducible

1. Ejecutar `node scripts/prepare-isolated-environment.mjs`. Genera únicamente claves locales y un archivo de estado en `.superpowers/sdd/2026-10-16-preparacion-black-capital/`, con permisos 0600. Si ya existen, los conserva.
2. Dar permiso de lectura a los archivos montados: `chmod 644 tests/fixtures/local-stack/init-db.sh tests/fixtures/local-stack/gateway.yml`.
3. Ejecutar `docker compose --env-file .superpowers/sdd/2026-10-16-preparacion-black-capital/local-stack.env -f tests/fixtures/local-stack/compose.yml up -d`.
4. Esperar estado saludable de PostgreSQL y HTTP 200 en `http://127.0.0.1:54321/auth/v1/health`; confirmar que existen `auth.users` y `storage.objects` mediante catálogo SQL en el contenedor `black-capital-isolated-db`.
5. En un stack virgen aplicar `docker exec -i black-capital-isolated-db psql -U postgres -v ON_ERROR_STOP=1 < tests/fixtures/schema-baseline.sql`. Contiene exclusivamente estructura confirmada del remoto, con PK/UNIQUE antes de FK. La transacción revierte completa si falla. No es una migración para producción.
6. Aplicar **solo en local** `supabase/migrations/20261016205400_restrict_private_document_storage.sql` con el mismo comando de psql; el baseline conserva las políticas anteriores para reproducir el acceso directo indebido antes de corregirlo.
7. Ejecutar en el contenedor `NOTIFY pgrst, 'reload schema';` y después `npm run test:isolated`.

No repetir el baseline sobre una base ya creada. Si el arranque inicial se interrumpe, comprobar el estado de los catálogos y recuperar únicamente este stack. Ningún comando de este procedimiento debe apuntar a un host remoto.

## Guardas y servicios

El lanzador comprueba `API_URL` antes de crear clientes o iniciar Next: solo admite `http://127.0.0.1:54321` y la identidad de prueba explícita. Sustituye las variables Supabase del proceso por las locales, vacía credenciales de WhatsApp/Resend y no cambia las variables del entorno anfitrión. Los proveedores de mensajería solo pueden simularse con destino local verificado; Vercel Production prohíbe ese modo.

`npm run test:isolated:unit` ejecuta guardas y transporte sin base ni navegador. Las integraciones requieren infraestructura y fallan si falta; no se omiten para aparentar aprobación. El navegador puede configurarse con `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

## Fixtures, limpieza y evidencia

`createTestFixtures(runId)` crea un admin, dos agentes, un perfil inactivo, propiedades, leads y PDF sintéticos. Las credenciales de usuario se mantienen en memoria. La limpieza usa solo IDs/rutas creados por la ejecución y es repetible; un registro centinela comprueba que no borra datos ajenos. No usar `/api/seed` ni `tests/seed-db.ts`.

Cada recurso se registra en un manifiesto local ignorado `fixtures/<runId>.json`, sin credenciales. `cleanupFixtureManifest(runId)` permite retomar una limpieza interrumpida usando únicamente esos IDs; se valida el destino local y el formato de identificadores/rutas antes de borrar. La prueba elimina primero una propiedad y luego recupera desde el manifiesto, preservando un centinela. Los números de pruebas documentales se reservan en un lead propio antes de llamar al formulario; una coincidencia con un número preexistente obliga a elegir otro.

Las sesiones de prueba utilizan cookies SSR reales de Supabase, conservadas en memoria. Las grabaciones, screenshots y traces administrativos están desactivados. No compartir el archivo local de estado, cookies, contraseñas o enlaces firmados. Los informes publicados contienen resultados y metadata estructural, no valores sensibles.

El entorno local reproduce las interfaces usadas por la aplicación; no reproduce extensiones administradas ni todos los componentes internos del servicio alojado. PostgreSQL local 17.11 y remoto 17.6 comparten versión mayor; la validación específica del servicio alojado sigue siendo una comprobación de despliegue separada.

Para detenerlo sin borrar datos: el mismo comando Compose seguido de `stop`. Para una reconstrucción intencional, comprobar primero el nombre `black-capital-isolated`; eliminar únicamente sus contenedores/volúmenes, nunca recursos ajenos. La migración de Storage no se ha aplicado a producción.
