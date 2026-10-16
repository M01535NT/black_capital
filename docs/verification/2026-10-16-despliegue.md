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

Pendiente de publicar el commit final validado con las escrituras bloqueadas o servicios aislados. No activar una vista previa operativa que herede credenciales de producción. Las URL y SHA se registrarán al recibir el resultado del despliegue, sin inventarlos.
