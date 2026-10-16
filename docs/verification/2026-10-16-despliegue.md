# Despliegue comprobado — 16 de octubre de 2026

## Producción

Fuente: consultas autenticadas de Vercel `get_alias`, `get_deployment` y `get_project`.

| Campo | Valor |
|---|---|
| URL | https://blackmx.vercel.app |
| Proyecto | `prj_QPdrTgEiXyKQQHAZuCs3RXBCGKz2` (`black_capital`) |
| Equipo | `team_jlilBsnf2SeH3eRCrKSz3PxX` |
| Despliegue efectivo | `dpl_FhT63V8RJ7Z3Eur4W6wJdMVeeuUa` |
| Estado / destino | READY / production |
| Rama | `main` |
| SHA | `836187c0fa30a77a55c5288c0393452ab926da6e` |
| Repositorio | `M01535NT/black_capital` |
| Node | 24.x |

La base inicial del checkout coincide exactamente con producción. Se creó la rama local `codex/preparacion-black-capital`; no se cambió `main`.

## Separación de servicios

Los metadatos de variables de Vercel muestran que las claves Supabase, su URL y Resend están asignadas a Production, Preview y Development. Sus valores no se descifraron ni se guardaron. Esto no demuestra separación por entorno; debe tratarse como posible acceso compartido hasta verificar lo contrario.

No aparecen variables de WhatsApp Cloud API entre las claves configuradas consultadas. No se hicieron envíos.

## Vista previa

Comprobada el 16 de octubre de 2026 a las 21:12 UTC mediante `get_deployment` y lecturas autenticadas de Vercel.

| Campo | Valor |
|---|---|
| URL inmutable verificada | https://blackcapital-ranpxi7jh-tonala.vercel.app |
| Alias de rama | https://blackcapital-git-codex-preparacion-black-capital-tonala.vercel.app |
| Proyecto | `prj_QPdrTgEiXyKQQHAZuCs3RXBCGKz2` |
| Despliegue | `dpl_F4YEG6LdatyciG6jonAKXkJaKBFd` |
| Estado / destino | READY / preview (`target: null`, sin promoción) |
| Rama | `codex/preparacion-black-capital` |
| SHA del código verificado | `2b068179265a504db364c8c2ac8e2afc29e343cc` |
| Fuente | GitHub conectado; push exclusivo de la rama de trabajo |

Portada e inventario devolvieron 200 y el aviso de revisión. `/api/leads` devolvió 503 con el mensaje de solo lectura. El fetch de `/admin` siguió su redirección y terminó en la portada con aviso, sin formulario de login; el contrato de redirección se comprueba además en la suite aislada. No se enviaron formularios ni credenciales al despliegue. La API completa, incluidos los GET documentales con efectos secundarios, y todas las rutas admin quedan bloqueadas por el proxy en Preview.

Vercel protege el acceso: una lectura sin autenticación recibió 302; las comprobaciones de contenido se hicieron con el acceso autenticado temporal de la herramienta, sin compartir enlaces de bypass. Al abrir la URL puede solicitar la sesión de Vercel.

Los servicios heredados siguen siendo potencialmente productivos; el preview solo permite lectura pública. La operación del panel se validó en el stack local aislado. El commit posterior que registra este informe solo cambia documentación; la URL inmutable anterior conserva el código probado aunque el alias de rama avance.

Recuperación: abrir esta URL inmutable o crear otro despliegue Preview del SHA registrado. No mover el alias productivo ni aplicar SQL como parte de esa recuperación. `main` remoto sigue en `836187c0fa30a77a55c5288c0393452ab926da6e`, comprobado después del push.
