# Base técnica — 16 de octubre de 2026

- Base de aplicación: `836187c0fa30a77a55c5288c0393452ab926da6e`.
- Rama de trabajo: `codex/preparacion-black-capital`.
- Node 24.19.0 / npm 11.9.0; Vercel configura Node 24.x.
- Inicialmente faltaba GSAP y fallaba `test.use({ reducedMotion })`.
- `npm ci --cache /workspace/.npm-cache --no-audit --no-fund`: 961 paquetes instalados; versiones del lockfile conservadas. GSAP 3.15.0 confirmado.
- Se corrigió la opción de Playwright usando `contextOptions.reducedMotion`, sin quitar aserciones.
- `npm run check`: lint y TypeScript aprobados.
- Descubrimiento Playwright del archivo corregido: 18 casos en los dos proyectos configurados. Esto confirma descubrimiento, no ejecución de navegador.
- Build de producción aprobado con las fuentes originales. El proxy TLS del entorno exige `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1`, `NODE_USE_ENV_PROXY=1` y `NODE_USE_SYSTEM_CA=1`; no se deshabilitó TLS ni se cambiaron las fuentes.
- La caché npm predeterminada fuera del workspace no era escribible. Se usó la caché ya existente en `/workspace/.npm-cache`.

Los comandos de build pueden consultar datos públicos; no ejecutaron escrituras, seeds ni migraciones.
