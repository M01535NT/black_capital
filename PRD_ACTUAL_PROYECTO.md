# PRD Actual del Proyecto

**Proyecto:** Black Capital  
**Fecha de auditoria:** 10 de junio de 2026  
**Tipo de documento:** PRD del estado actual, basado en el repositorio existente  
**Alcance:** Auditoria de producto, arquitectura, UX/UI, contenido, SEO, integraciones, riesgos y oportunidades  

## Indice

1. Resumen ejecutivo
2. Alcance actual del sistema
3. Arquitectura general
4. Mapa de paginas y rutas
5. Inventario de componentes
6. Diseno visual actual
7. UX actual
8. Contenido actual
9. Funcionalidades actuales
10. Datos e integraciones
11. SEO y metadata
12. Responsividad
13. Accesibilidad
14. Performance
15. Estado tecnico del proyecto
16. Riesgos
17. Recomendaciones iniciales
18. Preguntas pendientes para el dueno del proyecto
19. Anexos tecnicos

## 1. Resumen ejecutivo

Black Capital es una plataforma inmobiliaria web para Tijuana y Baja California. Segun el codigo actual, el producto combina dos superficies principales:

- Un sitio publico orientado a captacion comercial: Home, inventario, paginas por linea de negocio, contacto, herramientas, nosotros y legales.
- Un panel privado de operacion: gestion de propiedades, leads, agentes, usuarios, cuenta y configuracion.

El sitio publico presenta a Black Capital como una inmobiliaria con tres lineas: Black Luxury, Black Business y Black Industrial. La propuesta visible gira alrededor de ordenar precio, zona, documentos, tipo de operacion y ruta de cierre antes de avanzar con una compra, venta, renta o valoracion.

El panel privado sugiere un sistema operativo real para administrar inventario inmobiliario, asignar agentes, revisar leads, dar seguimiento con tareas/actividades y controlar usuarios. La base de datos esperada es Supabase/PostgreSQL con politicas de seguridad, y el despliegue esta pensado para Vercel.

Estado general observado:

- El proyecto compila correctamente con `npm run build`.
- El linter pasa correctamente con `npm run lint`.
- Hay una arquitectura moderna y bastante completa.
- Hay funcionalidades terminadas y otras todavia aparentan estar en modo de demo, placeholder o preparacion.
- La validacion visual automatizada con Playwright no pudo completarse porque el navegador de Playwright no esta instalado en el entorno local y no se instalo nada por solicitud expresa.

## 2. Alcance actual del sistema

### Incluye actualmente

- Sitio publico corporativo.
- Home con hero, video, claims, lineas de negocio, testimonios, metodologia y CTAs.
- Tres landings de marca: Black Luxury, Black Business y Black Industrial.
- Inventario inmobiliario unificado conectado a Supabase, con respaldo de datos placeholder cuando no hay propiedades.
- Detalle publico de propiedad por `slug` o `id`.
- Pagina de contacto con formulario de captacion.
- Formularios de lead por contacto y por landings.
- Pagina de herramientas inmobiliarias con inventario visual de calculadoras.
- Paginas de Nosotros, Equipo, Historia y Valores.
- Paginas legales.
- Panel admin con dashboard, propiedades, leads, agentes, usuarios, cuenta y configuracion.
- Autenticacion por Supabase Auth para administradores/agentes.
- APIs para propiedades, leads, agentes, tareas, actividades, usuarios, subida de archivos, configuracion y acceso documental.
- SEO base, Open Graph, sitemap, robots, manifest PWA y service worker.
- Analitica con Vercel Analytics, Speed Insights y PostHog.
- Migraciones SQL de Supabase.
- Pruebas Playwright existentes.

### No se comprobo completamente

- No se comprobo visualmente en navegador por bloqueo de Playwright/Chrome en el entorno.
- No se verifico la base de datos remota ni la existencia real de registros en Supabase.
- No se abrio `.env.local` para evitar exponer secretos.
- No se verifico envio real de emails con Resend.
- No se verifico subida real de imagenes/documentos a Supabase Storage.
- No se verifico comportamiento en produccion.

## 3. Arquitectura general

### Framework y lenguaje

- Framework: Next.js 16 con App Router.
- Lenguaje principal: TypeScript.
- UI: React 19.
- Estilos: Tailwind CSS v4, shadcn/ui y CSS global propio.
- Base de datos e identidad: Supabase.
- Formularios: React Hook Form y Zod.
- Animaciones: Framer Motion y utilidades CSS.
- Iconos: lucide-react.
- Analitica: Vercel Analytics, Vercel Speed Insights y PostHog.
- PWA: `@ducanh2912/next-pwa`.

### Estructura de carpetas

El sistema esta organizado asi:

| Carpeta | Funcion |
|---|---|
| `src/app` | Rutas, layouts, paginas, APIs, metadata, sitemap, robots y manifest |
| `src/app/(public)` | Sitio publico |
| `src/app/(admin)` | Panel privado protegido |
| `src/app/admin` | Login, setup y recuperacion de password |
| `src/app/api` | Endpoints para datos, autenticacion operativa y formularios |
| `src/components` | Componentes visuales y funcionales |
| `src/components/admin` | UI del panel privado |
| `src/components/public` | Catalogo, formularios publicos y media |
| `src/components/property` | Tarjeta y detalle de propiedad |
| `src/components/shared` | Bloques reutilizables de landings y secciones |
| `src/components/ui` | Componentes base tipo shadcn |
| `src/lib` | Datos, Supabase, auth, validaciones, helpers, configuraciones |
| `public` | Imagenes, video hero, iconos PWA, service worker |
| `supabase/migrations` | Migraciones SQL |
| `tests` | Pruebas Playwright |
| `docs` | Recomendaciones y planes previos |

### Partes criticas

- `src/lib/supabase/*`: conexion con Supabase.
- `src/lib/auth.ts`: control de sesion y roles.
- `src/proxy.ts`: excepciones publicas para admin/API.
- `src/app/api/public-leads/route.ts`: captacion publica de leads.
- `src/app/api/leads/route.ts`: gestion privada de leads.
- `src/app/api/properties/route.ts`: gestion de propiedades.
- `src/lib/sub-brand-config.tsx`: contenido y metadata de las tres lineas de negocio.
- `src/app/(public)/inventario/[slug]/page.tsx`: detalle publico de propiedad.
- `src/components/admin/property-form.tsx`: formulario principal de inventario.
- `src/app/layout.tsx`: metadata global, fuente, tema, PWA, analytics.

## 4. Mapa de paginas y rutas

| Ruta | Nombre de pagina | Proposito | Componentes principales | Estado aparente |
|---|---|---|---|---|
| `/` | Home | Presentar Black Capital, lineas de negocio y CTAs | `HomeHeroHeadline`, `HomeCounters`, `Testimonials`, `MethodologySection`, cards internas | Completa |
| `/inventario` | Inventario | Catalogo de propiedades con filtros | `CatalogFilter`, `PropertyCard` | Parcial/funcional; usa placeholders si no hay datos |
| `/inventario/[slug]` | Detalle de propiedad | Mostrar galeria, datos, agentes, documentos, contacto | `ImageGallery`, `PropertyHeader`, `PropertyMetrics`, `PropertySidebar`, `StickyContactBar`, `PropertyJsonLd` | Completa, dependiente de datos |
| `/black-luxury` | Landing residencial | Captar interesados en residencial | `SubBrandLanding`, config `luxury` | Completa |
| `/black-business` | Landing comercial | Captar interesados en comercial | `SubBrandLanding`, config `business` | Completa |
| `/black-industrial` | Landing industrial | Captar interesados en industrial | `SubBrandLanding`, config `industrial` | Completa |
| `/black-luxury/inventario` | Inventario residencial | Redireccion/entrada a inventario filtrado | Page wrapper del segmento | Parcial/dudosa por archivo minimo |
| `/black-business/inventario` | Inventario comercial | Redireccion/entrada a inventario filtrado | Page wrapper del segmento | Parcial/dudosa por archivo minimo |
| `/black-industrial/inventario` | Inventario industrial | Redireccion/entrada a inventario filtrado | Page wrapper del segmento | Parcial/dudosa por archivo minimo |
| `/black-luxury/contacto` | Contacto residencial | Entrada de contacto por marca | Page wrapper del segmento | Parcial/dudosa por archivo minimo |
| `/black-business/contacto` | Contacto comercial | Entrada de contacto por marca | Page wrapper del segmento | Parcial/dudosa por archivo minimo |
| `/black-industrial/contacto` | Contacto industrial | Entrada de contacto por marca | Page wrapper del segmento | Parcial/dudosa por archivo minimo |
| `/contacto` | Contacto | Captura de solicitud general | `ContactLeadForm`, cards de canales | Completa |
| `/herramientas` | Herramientas inmobiliarias | Mostrar calculadoras y recursos | Estructura propia de pagina | Parcial; se declara en desarrollo |
| `/nosotros` | Nosotros | Presentar empresa y enlaces internos | `Section`, `Eyebrow`, cards/pilares | Completa |
| `/nosotros/equipo` | Equipo | Presentar equipo | Pagina estatica | Parcial; no se verifico contenido completo |
| `/nosotros/historia` | Historia | Presentar historia | Pagina estatica | Parcial; no se verifico contenido completo |
| `/nosotros/valores` | Valores | Presentar valores | Pagina estatica | Parcial; no se verifico contenido completo |
| `/legal/aviso-privacidad` | Aviso de privacidad | Cumplimiento legal | Pagina estatica | Completa |
| `/legal/terminos-condiciones` | Terminos | Condiciones de uso | Pagina estatica | Completa |
| `/admin/login` | Login admin | Acceso privado | Supabase client, formulario login | Completa |
| `/admin/setup` | Setup inicial | Crear primer admin | API setup y token | Completa pero sensible |
| `/admin/reset-password` | Recuperacion | Solicitar reset | Supabase Auth | Completa |
| `/admin/update-password` | Actualizar password | Completar recuperacion | Supabase Auth | Completa |
| `/admin` | Dashboard | Resumen operativo | `AdminStatCard`, `AdminSectionCard` | Completa |
| `/admin/properties` | Admin inventario | Tabla de propiedades | `DataTable`, columns | Completa |
| `/admin/properties/new` | Nueva propiedad | Crear activo | `property-form` | Completa |
| `/admin/properties/[id]/edit` | Editar propiedad | Editar activo | `property-form` | Completa |
| `/admin/leads` | Leads | Gestion comercial | `LeadsPageClient` | Completa, cliente grande |
| `/admin/leads/[id]` | Detalle de lead | Seguimiento, tareas, actividades | `lead-actions`, `lead-tasks` | Completa |
| `/admin/agents` | Agentes | Gestion de asesores | `DataTable`, columns | Completa |
| `/admin/agents/new` | Nuevo agente | Crear asesor | `agent-form` | Completa |
| `/admin/agents/[id]` | Detalle de agente | Asignacion de propiedades | `assign-properties` | Completa |
| `/admin/agents/[id]/edit` | Editar agente | Editar asesor | `agent-form` | Completa |
| `/admin/users` | Usuarios | Gestion de usuarios admin | `users-client` | Parcial/funcional |
| `/admin/account` | Mi cuenta | Perfil, correo, password, preferencias | Forms de cuenta | Completa |
| `/admin/settings` | Configuracion | Ajustes del sistema | Pagina admin settings | Completa |
| `/api/*` | APIs | Datos y acciones del sistema | Route handlers | Funcional; dependiente de Supabase/env |

## 5. Inventario de componentes

| Componente/Grupo | Ubicacion | Funcion | Donde se usa | Observaciones |
|---|---|---|---|---|
| Header publico | `src/components/layout/header/*` | Navegacion desktop/mobile | Layout publico | Usa dropdowns para venta, renta y herramientas |
| Footer | `src/components/layout/Footer.tsx` | Footer corporativo, contacto y legales | Layout publico | Incluye link a Panel Admin |
| Logo | `src/components/layout/Logo.tsx` | Identidad visual | Header, footer, admin | Reutilizable |
| WhatsAppFloat | `src/components/layout/WhatsAppFloat.tsx` | CTA flotante | Layout publico | Posicion fixed con safe-area |
| HomeCounters | `src/components/home/HomeCounters.tsx` | Metric counters | Home | Animado |
| HomeHeroHeadline | `src/components/home/HomeHeroHeadline.tsx` | Titular principal | Home | Texto central del hero |
| MethodologySection | `src/components/home/MethodologySection.tsx` | Metodologia comercial | Home | Apoya propuesta de valor |
| Testimonials | `src/components/home/Testimonials.tsx` | Testimonios | Home | No se verifico fuente real |
| SubBrandHero | `src/components/shared/SubBrandHero.tsx` | Hero de landings | Black Luxury/Business/Industrial | Configurable |
| SubBrandValue | `src/components/shared/SubBrandValue.tsx` | Valor por marca | Landings | Reutilizable |
| SubBrandStats | `src/components/shared/SubBrandStats.tsx` | Stats por marca | Landings | Datos definidos en config |
| BrandInventory | `src/components/shared/BrandInventory.tsx` | Muestra inventario por linea | Landings | Por defecto usa placeholders si `useLiveData` no esta activo |
| SubBrandCTA | `src/components/shared/SubBrandCTA.tsx` | Formulario de lead por marca | Landings | Usa Zod, React Hook Form y PostHog |
| CatalogFilter | `src/components/public/catalog-filter.tsx` | Filtros y listado publico | Inventario | Componente grande e importante |
| ContactLeadForm | `src/components/public/contact-lead-form.tsx` | Formulario contacto | `/contacto` | Envia a `/api/public-leads` |
| ImageGallery | `src/components/public/image-gallery.tsx` | Galeria de propiedad | Detalle propiedad | Interaccion visual principal |
| TourEmbed / VideoEmbed | `src/components/public/*embed.tsx` | Medios externos | Detalle propiedad | Permite video/tour |
| PropertyCard | `src/components/property/PropertyCard.tsx` | Tarjeta de propiedad | Inventario y similares | Central para catalogo |
| PropertyHeader | `src/components/property/PropertyHeader.tsx` | Encabezado detalle | Detalle propiedad | Precio, tipo, ubicacion |
| PropertyMetrics | `src/components/property/PropertyMetrics.tsx` | Metricas inmueble | Detalle propiedad | M2 y atributos |
| PropertySidebar | `src/components/property/PropertySidebar.tsx` | Agentes, contacto, documentos | Detalle propiedad | Conecta documentos visibles |
| DocumentCard | `src/components/property/DocumentCard.tsx` | Acceso/documentos | Detalle propiedad | Funcionalidad sensible |
| StickyContactBar | `src/components/property/StickyContactBar.tsx` | CTA movil | Detalle propiedad | Mobile only |
| PropertyJsonLd | `src/components/property/PropertyJsonLd.tsx` | Datos estructurados | Detalle propiedad | SEO |
| FavoriteButton | `src/components/property/favorite-button.tsx` | Favoritos | Detalle propiedad | No se verifico persistencia |
| AdminSidebar | `src/components/admin/Sidebar.tsx` | Navegacion admin | Admin layout | Cambia segun rol |
| Admin UI | `src/components/admin/admin-ui.tsx` | Cards, headers, patrones visuales admin | Panel | Base visual del backoffice |
| DataTable | `src/components/admin/data-table.tsx` | Tabla con busqueda/filtros | Admin propiedades/agentes | Importante para operacion |
| property-form | `src/components/admin/property-form.tsx` | Crear/editar propiedades | Admin | Archivo grande y critico |
| agent-form | `src/components/admin/agent-form.tsx` | Crear/editar agentes | Admin | Critico |
| LeadsPageClient | `src/app/(admin)/admin/leads/leads-client.tsx` | Gestion avanzada de leads | Admin leads | Archivo muy grande; riesgo de mantenimiento |
| UI base | `src/components/ui/*` | Botones, inputs, dialog, drawer, tabla, select | Todo el sistema | Basado en shadcn/Radix |
| MortgageCalculator | `src/components/tools/mortgage-calculator.tsx` | Calculadora hipotecaria funcional | No se vio conectada a `/herramientas` | Parece componente no usado o pendiente |

## 6. Diseno visual actual

### Tipografias

- Fuente principal: Manrope via `next/font/google`.
- Uso consistente de escala display, body, caption y property tags en `globals.css`.
- Hay texto uppercase para headers, labels y CTAs.

### Colores

- Base dominante: negro/profundo (`#050505`, variantes oscuras).
- Color de marca: dorado/champagne definido por tokens (`--color-accent`, `--gradient-gold`).
- Grises/blancos con opacidades para jerarquia secundaria.
- Industrial tiene menciones de `steel`, pero gran parte del sistema mantiene dorado como acento principal.

### Sistema visual

- Estilo oscuro, corporativo, inmobiliario y cinematico.
- Uso frecuente de bordes finos, divisores, fondos transparentes, overlays y gradientes.
- Cards con imagenes de activos/marcas.
- Hero con video `hero.webm` y poster.
- Animaciones de shimmer dorado, marquee, hover, scroll reveal y Framer Motion.

### Coherencia

El sistema visual publico es bastante coherente: negro + dorado + imagen inmobiliaria + tipografia fuerte. El admin comparte la identidad, pero con enfoque operativo.

Inconsistencias o puntos a revisar:

- `--radius` global es `1rem`, pero muchas piezas usan bordes cuadrados o circulares. Puede convivir, pero conviene formalizar reglas.
- Existen clases de letter spacing negativo y positivo amplio; podria afectar lectura en mobile.
- Hay comentarios y nombres heredados que mencionan enfoques anteriores.
- La pagina `/herramientas` usa un diseno tipo dashboard, pero todavia no conecta claramente calculadoras reales.
- Algunas paginas de submarca/contacto/inventario por marca son wrappers minimos; producto puede percibirlas como rutas redundantes si no aportan contenido propio.

## 7. UX actual

### Flujo publico

Un usuario puede:

1. Entrar por Home.
2. Elegir inventario, contacto o una linea de negocio.
3. Ver catalogo general o filtrado.
4. Abrir un detalle de propiedad.
5. Contactar por formulario, WhatsApp, telefono o correo.
6. Navegar a herramientas o nosotros.

### Puntos fuertes

- CTAs claros: Ver inventario, Hablar con asesor, Enviar solicitud.
- La Home ordena bien las tres lineas de negocio.
- Mobile esta considerado con rails horizontales, sticky contact bar y drawer.
- Formularios tienen estados de carga, error y exito.
- El detalle de propiedad contempla galeria, metricas, ubicacion, agentes, documentos y similares.

### Fricciones

- El usuario no tecnico podria no distinguir entre Black Capital y sus tres lineas si entra directo a una landing.
- Herramientas parece prometer calculadoras, pero la pagina actual muestra tarjetas informativas; riesgo de expectativa incumplida.
- El inventario puede mostrar placeholders cuando no hay datos reales; esto debe comunicarse con cuidado para no parecer inventario falso.
- Rutas como `/black-luxury/inventario` existen, pero si solo redirigen o contienen wrappers minimos, pueden generar duplicidad.
- El footer incluye `Panel Admin`; esto puede ser practico, pero en un sitio publico podria exponer demasiado la superficie privada.

## 8. Contenido actual

### Mensajes principales observados

- Compra, venta, renta y valor comercial de inmuebles.
- Enfoque en Tijuana y Baja California.
- Revision de precio, zona, documentos y ruta antes de avanzar.
- Tres lineas: residencial, comercial e industrial.

### CTAs actuales

- Ver inventario.
- Hablar con un asesor.
- Enviar solicitud.
- WhatsApp directo.
- Solicitar opciones residenciales/comerciales/industriales.
- Solicitar calculo.

### Secciones con texto fuerte

- Home hero.
- Manifiesto.
- Metodologia.
- Landings por marca.
- Contacto.

### Dudas de contenido

- No se verifico si testimonios son reales.
- No se verifico si claims de anos operando, zonas o experiencia tienen fuente documental.
- Algunas palabras comerciales como inversion, activos y portafolio aparecen en el codigo. Conviene decidir si ese lenguaje es correcto legal/comercialmente.
- La pagina herramientas necesita decidir si sera educativa, funcional o ambas.

## 9. Funcionalidades actuales

| Funcionalidad | Que hace | Donde esta | Estado | Riesgos/Dudas |
|---|---|---|---|---|
| Navegacion publica | Menu desktop/mobile, dropdowns | Header | Completa | Verificar visual mobile |
| Home comercial | Presenta propuesta y lineas | `/` | Completa | Testimonios/claims no verificados |
| Landings por marca | Segmentan residencial/comercial/industrial | `/black-*` | Completa | Inventario por marca parece placeholder si no se activa data live |
| Inventario publico | Lista propiedades desde Supabase | `/inventario` | Funcional | Usa placeholders si no hay data |
| Filtros de inventario | Filtra por uso/tipo/precio/etc. | `CatalogFilter` | Funcional segun codigo | No verificado en navegador |
| Detalle de propiedad | Galeria, datos, agentes, documentos, contacto | `/inventario/[slug]` | Completa | Depende de registros Supabase |
| Contacto publico | Captura lead general | `/contacto` | Completa | Depende de API/env |
| Captura publica de leads | Valida, limita intentos y guarda | `/api/public-leads` | Completa | No se probo envio real |
| Captura por landing | Form por marca con tracking | `SubBrandCTA` | Completa | Depende de PostHog/API |
| WhatsApp directo | Abre wa.me con mensaje | Layout/contacto/detalle | Completa | Depende de numero env/config |
| Herramientas | Muestra biblioteca de calculadoras | `/herramientas` | Parcial | No hay calculos conectados en la pagina |
| Calculadora hipotecaria | Calcula pago mensual | `mortgage-calculator.tsx` | Funcional como componente | No se vio integrada |
| Admin login | Acceso por Supabase Auth | `/admin/login` | Completa | Depende de Supabase |
| Setup inicial | Crear primer admin | `/admin/setup` | Completa | Debe protegerse con token |
| Dashboard admin | Muestra metricas, leads y propiedades recientes | `/admin` | Completa | Depende de data |
| Gestion de propiedades | CRUD de propiedades | `/admin/properties`, API | Completa | Formulario grande |
| Gestion de leads | Estados, asignaciones, tareas, actividades | `/admin/leads` | Completa | Cliente grande; riesgo de mantenimiento |
| Gestion de agentes | CRUD y asignaciones | `/admin/agents` | Completa | Depende de roles |
| Gestion de usuarios | Usuarios admin | `/admin/users` | Parcial/funcional | No se verifico flujo completo |
| Cuenta admin | Perfil, email, password, preferencias | `/admin/account` | Completa | Depende de Auth |
| Configuracion | Ajustes del sistema | `/admin/settings` | Completa | No se verifico persistencia |
| Documentos protegidos | Solicitud/verificacion/descarga | `/api/document-access/*` | Completa segun archivos | No se verifico flujo real |
| PWA | Manifest y service worker | `manifest.ts`, `sw.js`, next-pwa | Configurada | No se verifico install prompt |
| SEO dinamico | Sitemap y metadata | `sitemap.ts`, pages | Completa | Depende de Supabase para propiedades |

## 10. Datos e integraciones

### Datos locales/hardcodeados

- Configuracion de submarcas en `src/lib/sub-brand-config.tsx`.
- Textos de Home y paginas estaticas en componentes/paginas.
- Placeholders de inventario en `/inventario` y `BrandInventory`.
- Contacto en `src/lib/contact-config.ts`.
- Configuracion de sitio en `src/lib/site-url.ts`.
- Ajustes locales en `src/lib/settings.json`.

### Base de datos

El proyecto espera Supabase/PostgreSQL. Migraciones observadas:

- Propiedades.
- Agentes.
- Relacion propiedad-agente.
- Leads/document leads.
- Politicas RLS.
- Storage policies.
- Schema operativo admin.
- Acceso documental seguro.
- Triggers de `updated_at`.

### APIs principales

| API | Proposito |
|---|---|
| `/api/public-leads` | Lead publico con rate limit, honeypot y Zod |
| `/api/leads` | CRUD/gestion privada de leads |
| `/api/properties` | CRUD/gestion de propiedades |
| `/api/agents` | Gestion de agentes |
| `/api/property-agents` | Asignacion propiedad-agente |
| `/api/lead-activities` | Actividades de lead |
| `/api/lead-tasks` | Tareas de lead |
| `/api/upload` | Subida de archivos |
| `/api/settings` | Configuracion |
| `/api/document-access/*` | Solicitud, verificacion y descarga de documentos |
| `/api/admin/*` | Login, logout, setup, perfil, usuarios, notificaciones |

### Variables de entorno esperadas

Se verifico `.env.example`; no se abrio `.env.local`. Variables esperadas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SETUP_TOKEN`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

### Integraciones externas

- Supabase: auth, database, storage.
- Resend: emails transaccionales.
- PostHog: tracking de eventos.
- Vercel: analytics, speed insights y deploy.
- Google Maps: link de busqueda de direccion.
- WhatsApp: enlaces `wa.me`.
- YouTube/Google frames permitidos por CSP.
- Cloudinary/Supabase/Unsplash permitidos como imagenes remotas.

## 11. SEO y metadata

### Implementado

- Metadata global en `src/app/layout.tsx`.
- Metadata especifica para Home, Contacto, Inventario, Nosotros y landings.
- Open Graph global y por landings.
- Twitter card.
- JSON-LD de organizacion en Home.
- JSON-LD de propiedades en detalle.
- Sitemap dinamico con paginas estaticas y propiedades disponibles.
- Robots con bloqueo de `/admin` y `/api`.
- Canonicals usando `SITE_URL` o URLs fijas `blackmx.vercel.app`.
- Redirects legales y redirect de dominio antiguo `black-corporativo.com`.

### Problemas o riesgos

- `public/og-image.jpg` existe con tamano 0 bytes. Aunque hay `opengraph-image.tsx`, el archivo vacio puede ser riesgo si alguna metadata apunta a `/og-image.jpg`.
- Algunas URLs canonicas estan hardcodeadas a `https://blackmx.vercel.app`; conviene decidir dominio final.
- Sitemap incluye rutas por marca de inventario/contacto que podrian ser redundantes si no aportan contenido propio.
- Keywords incluyen terminos comerciales que deben validarse con estrategia y cumplimiento legal.
- No se verifico render final de Open Graph en produccion.

## 12. Responsividad

### Desktop

El codigo contempla layouts amplios con max-width de 90rem, grids de 12 columnas, cards y efectos hover.

### Tablet

Se usan breakpoints `sm`, `md`, `lg`, `xl`. Muchas secciones cambian de rail horizontal a grid.

### Mobile

El proyecto muestra intencion mobile-first:

- Header con drawer.
- Rails horizontales en Home, Nosotros, Herramientas e inventario de marcas.
- Sticky contact bar en detalle de propiedad.
- Safe-area para WhatsAppFloat.
- Uso de `svh` para altura estable.
- Pruebas mobile existentes: `mobile-public-audit.spec.ts`, `mobile-section-height-audit.spec.ts`, `mobile-home-layout.spec.ts`.

### No verificado

No se pudo validar en navegador por falta de navegador Playwright instalado y timeout del proyecto `chrome`. Por codigo, la responsividad esta considerada; por evidencia visual, queda pendiente.

## 13. Accesibilidad

### Fortalezas

- `lang="es-MX"`.
- Estados `focus-visible` globales.
- `prefers-reduced-motion` en CSS.
- Varios iconos con `aria-hidden`.
- Formularios con campos requeridos y validaciones.
- Checkbox de privacidad requerido.
- Drawer con texto `sr-only`.
- `role="status"` en mensajes de exito.
- `aria-label` en secciones y footer.
- Robots bloquea areas privadas.

### Riesgos

- Algunos inputs usan placeholder como texto principal; conviene revisar labels accesibles.
- Algunas cards usan `tabIndex` para hover/focus; hay que verificar orden de teclado.
- Contraste dorado sobre negro parece alto, pero dorado con opacidad sobre fondos oscuros debe medirse.
- Marquee y animaciones deben revisarse en lectores/reduced motion.
- No se ejecuto auditoria visual/axe.

## 14. Performance

### Fortalezas

- Next.js App Router.
- `next/image` en imagenes principales.
- `next/font/google` con `display: swap`.
- Revalidate en inventario y detalle.
- Build optimizado exitoso.
- Video hero con `preload="metadata"` y poster.
- Service worker/PWA configurado.
- Sitemap dinamico con fallback si Supabase falla.

### Riesgos

- `hero.webm` pesa aproximadamente 2.4 MB.
- Muchas animaciones, overlays y gradients pueden afectar moviles de gama baja.
- Framer Motion y componentes client pueden aumentar JS en paginas publicas.
- `LeadsPageClient` y `property-form` son archivos grandes, potencialmente complejos de mantener.
- `public/og-image.jpg` esta vacio.
- No se midio Lighthouse ni Web Vitals reales.

## 15. Estado tecnico del proyecto

### Solido

- Stack moderno y coherente.
- Build y lint pasan.
- Separacion clara entre publico/admin/API/lib/components.
- Validaciones Zod.
- Rate limit en leads publicos.
- Auth y roles via Supabase.
- Migraciones SQL presentes.
- SEO tecnico implementado.
- Tests Playwright ya existen.
- Seguridad HTTP headers y CSP en `next.config.ts`.

### Fragil o incompleto

- Validacion visual automatizada bloqueada por navegadores faltantes.
- Herramientas inmobiliarias parece incompleta funcionalmente.
- Calculadora hipotecaria existe como componente, pero no se observo conectada.
- Inventario/landings usan placeholders en ciertos escenarios.
- Algunas rutas de marca por inventario/contacto parecen wrappers minimos.
- `og-image.jpg` vacio.
- Archivos cliente grandes pueden dificultar mantenimiento.
- No se verifico Supabase real.

### Puede mantenerse

- Next.js + Supabase + Tailwind.
- Config central de submarcas.
- Sistema visual negro/dorado.
- Panel admin y separacion por roles.
- Formularios con Zod.
- SEO dinamico y PWA.

## 16. Riesgos

| Tipo | Riesgo | Impacto |
|---|---|---|
| Producto | Herramientas prometen calculos que no estan funcionales en pagina | Confusion o perdida de confianza |
| Producto | Placeholders pueden parecer inventario real | Riesgo comercial/legal |
| UX | Muchas rutas y lineas pueden dispersar al usuario | Menor conversion |
| UX | Footer expone Panel Admin | Puede distraer o revelar superficie privada |
| SEO | `og-image.jpg` vacio | Previews sociales rotos si se usa |
| SEO | Dominio final no consolidado en todos los lugares | Canonicals inconsistentes |
| Accesibilidad | Labels/placeholders y motion no auditados visualmente | Barreras para usuarios |
| Performance | Video hero y animaciones | Carga/fluidez movil |
| Tecnico | Archivos cliente muy grandes | Mayor costo de cambios |
| Seguridad | Setup/admin dependen de configuracion correcta | Riesgo si tokens quedan activos |
| Operacion | No se verifico Supabase en vivo | Riesgo de fallos ocultos |

## 17. Recomendaciones iniciales

No se deben ejecutar cambios todavia. Recomendaciones para decidir en Fase 2:

1. Definir objetivo principal del sitio: captacion de leads, mostrar inventario, construir marca o apoyar operaciones.
2. Decidir si las tres lineas deben ser submarcas fuertes o solo categorias del inventario.
3. Decidir si los placeholders deben mostrarse publicamente o solo como fallback interno.
4. Convertir Herramientas en funcionalidad real o renombrarla como recursos/proximamente.
5. Consolidar dominio final y revisar canonicals/Open Graph.
6. Corregir o reemplazar `og-image.jpg` vacio.
7. Revisar si el link a Panel Admin debe estar visible en footer publico.
8. Medir mobile con Playwright/Lighthouse cuando se autorice instalar navegador o usar un navegador disponible.
9. Dividir componentes admin/client muy grandes cuando se haga refactor.
10. Validar claims comerciales y testimonios con evidencia real.
11. Definir reglas de contenido para no sobreprometer rendimiento, inversion o resultados.

## 18. Preguntas pendientes para el dueno del proyecto

1. Cual es el objetivo numero uno del sitio: recibir leads, mostrar inventario, posicionar marca o cerrar citas?
2. Black Luxury, Black Business y Black Industrial deben sentirse como marcas separadas o como categorias dentro de Black Capital?
3. El inventario actual debe mostrar placeholders cuando no hay propiedades reales?
4. Las herramientas deben ser calculadoras funcionales desde esta fase?
5. El publico principal son compradores, propietarios, inversionistas, empresas o todos?
6. El lenguaje de inversion debe mantenerse, reducirse o limitarse por cumplimiento?
7. El Panel Admin debe aparecer en el footer publico?
8. Cual es el dominio final definitivo?
9. Que canales de contacto son prioritarios: formulario, WhatsApp, telefono, correo?
10. Que secciones de la Home son obligatorias y cuales pueden compactarse?
11. Que funcionalidades del admin se usaran realmente en operacion diaria?
12. Se requiere multiagente real o solo administrador central?
13. Los documentos de propiedad deben estar protegidos por lead/verificacion?
14. Cuales claims comerciales se pueden respaldar con evidencia?
15. Que debe considerarse “terminado” para lanzar?

## 19. Anexos tecnicos

### Arbol resumido

```text
black_capital/
  docs/
  public/
    brand-business.webp
    brand-industrial.webp
    brand-luxury.webp
    hero.webm
    hero-poster.webp
    icon-192x192.webp
    icon-512x512.webp
    sw.js
    og-image.jpg
  src/
    app/
      (public)/
      (admin)/
      admin/
      api/
      globals.css
      layout.tsx
      manifest.ts
      robots.ts
      sitemap.ts
    components/
      admin/
      home/
      layout/
      property/
      public/
      shared/
      tools/
      ui/
    lib/
      supabase/
      validations/
      auth.ts
      data.ts
      sub-brand-config.tsx
      site-url.ts
    providers/
    types/
    proxy.ts
  supabase/
    migrations/
  tests/
```

### Dependencias relevantes

| Dependencia | Uso |
|---|---|
| `next` | Framework principal |
| `react`, `react-dom` | UI |
| `@supabase/supabase-js`, `@supabase/ssr` | Base de datos/auth |
| `zod` | Validaciones |
| `react-hook-form` | Formularios |
| `@hookform/resolvers` | Integracion Zod/form |
| `framer-motion` | Animaciones |
| `lucide-react` | Iconos |
| `@radix-ui/*` | Componentes accesibles base |
| `@tanstack/react-table` | Tablas admin |
| `@vercel/analytics`, `@vercel/speed-insights` | Analitica/performance |
| `posthog-js` | Product analytics |
| `@ducanh2912/next-pwa` | PWA |
| `browser-image-compression` | Compresion de imagenes |
| `sonner` | Toasts |
| `vaul` | Drawer |
| `@playwright/test` | Pruebas end-to-end |

### Validaciones realizadas

| Validacion | Resultado |
|---|---|
| `npm run lint` | Paso correctamente |
| `npm run build` | Paso correctamente |
| Build route map | Confirmo 54 rutas/paginas generadas |
| Playwright Chromium | No paso: navegador Playwright no instalado |
| Playwright Chrome | No se completo: timeout |
| Revision `.env.local` | No se abrio para no exponer secretos |
| Estado git tras auditoria | Limpio despues de restaurar artefactos generados |

### Clasificacion solicitada

#### Lo que ya existe

- Sitio publico completo con Home, landings, inventario, contacto, nosotros, herramientas y legales.
- Panel admin con gestion de inventario, leads, agentes, usuarios, cuenta y configuracion.
- APIs protegidas y publicas.
- Supabase como backend previsto.
- SEO/PWA/analytics.
- Validaciones y seguridad basica.

#### Lo que parece incompleto

- Herramientas como calculadoras funcionales.
- Integracion visible de `MortgageCalculator`.
- Verificacion visual automatizada.
- Consolidacion de dominio/OG.
- Rutas por marca de contacto/inventario si solo duplican flujo.

#### Lo que esta planeado o insinuado por el codigo

- Biblioteca completa de calculadoras: hipoteca, ISAI/ISR, ROI, cap rate, gastos de cierre, capacidad de compra, comprar vs rentar, checklist documental y comparador.
- Acceso documental protegido ligado a leads.
- Operacion multiagente.
- Analitica de eventos de conversion.
- PWA instalable.

#### Lo que recomiendo cambiar

- Definir foco del producto antes de implementar.
- Priorizar claridad de conversion y confianza sobre mas secciones.
- Convertir placeholders en estados transparentes.
- Corregir SEO/OG y dominio.
- Decidir el rol real de herramientas.
- Revisar footer/admin y mensajes sensibles.
- Auditar mobile visualmente cuando el entorno permita navegador.
