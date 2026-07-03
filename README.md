# Black Capital

Página web inmobiliaria enfocada en el mercado de Tijuana, Baja California, estructurada para familias, empresarios e inversionistas. Se organiza en tres verticales:

- **Black Luxury** — Residencias en fraccionamientos privados
- **Black Business** — Activos que generan ingresos (oficinas, locales, plazas)
- **Black Industrial** — Naves logísticas, bodegas y parques industriales

Incluye catálogo público de propiedades, herramientas financieras, captación de leads (formularios + WhatsApp), descarga de documentos protegidos con verificación por WhatsApp, y un backoffice (`/admin`) con CRM de leads, gestión de inventario y equipo.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) · React 19 |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Autenticación | Supabase Auth (usuarios con roles) |
| Animaciones | Framer Motion |
| Formularios | React Hook Form + Zod |
| Emails | Resend API |
| Analytics | PostHog + Vercel Analytics + Speed Insights |
| Tests | Playwright |
| PWA | @ducanh2912/next-pwa |

## Requisitos

- Node.js 20+
- npm
- Un proyecto de Supabase (URL + keys)

## Estructura

```
src/
  app/
    (public)/                 # Rutas públicas
      page.tsx                # Home
      black-luxury/           # Landing Luxury (+ inventario, contacto)
      black-business/         # Landing Business (+ inventario, contacto)
      black-industrial/       # Landing Industrial (+ inventario, contacto)
      inventario/             # Catálogo unificado
        [slug]/               # Detalle de propiedad
      herramientas/           # Herramientas financieras
      nosotros/               # About (+ historia, equipo, valores)
      contacto/               # Contacto
      legal/                  # Aviso de privacidad + Términos y condiciones
    (admin)/                  # Backoffice (/admin), protegido server-side
      admin/
        properties/           # Inventario (+ new, [id]/edit)
        leads/                # CRM de leads (+ [id])
        agents/               # Equipo (+ new, [id], [id]/edit)
        users/                # Gestión de usuarios
        settings/             # Configuración del sitio
        account/              # Mi cuenta
    admin/
      login/                  # Login admin
      setup/                  # Alta del primer administrador
      reset-password/         # Recuperación de contraseña
      update-password/        # Cambio de contraseña
    api/                      # API routes (ver abajo)
  components/
    home/                     # Componentes del Home
    luxury/ business/ industrial/   # Componentes por vertical
    layout/                   # Header, Footer, WhatsAppFloat
    public/                   # Componentes compartidos (catálogo, brochure)
    admin/                    # Sidebar, DataTable, formularios
    ui/                       # shadcn/ui components
  lib/
    auth.ts                   # requireAdminSession y helpers de sesión
    supabase/                 # Clientes (client, server, admin)
    validations/              # Schemas Zod
supabase/
  migrations/                 # Migraciones SQL
tests/                        # Pruebas Playwright
```

### API routes

- `api/public-leads`, `api/leads`, `api/lead-tasks`, `api/lead-activities` — captación y CRM de leads
- `api/properties`, `api/faq-catalog` — inventario y FAQs
- `api/agents`, `api/property-agents` — equipo y asignación de agentes
- `api/document-access/{request,verify,download}` — descarga de documentos con verificación por WhatsApp
- `api/upload` — subida de imágenes
- `api/settings`, `api/admin/notifications` — configuración y notificaciones
- `api/admin/{login,logout,setup,setup-status}`, `api/admin/account/{email,profile}`, `api/admin/users` — auth y cuenta

## Variables de Entorno

Copiar `.env.example` a `.env.local` y completar los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (anon), segura para el cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo server-side, nunca en el bundle del cliente) |
| `ADMIN_SETUP_TOKEN` | Token temporal para crear el primer admin en `/admin/setup`. Rotar/eliminar después |
| `ADMIN_PASSWORD` | Fallback legacy para setup inicial. No usar como login final |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (enlaces de invitación y recuperación) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp del botón flotante, formato internacional sin `+` |
| `WHATSAPP_ACCESS_TOKEN` | **Requerido en prod.** Token de WhatsApp Cloud API (verificación de documentos) |
| `WHATSAPP_PHONE_NUMBER_ID` | **Requerido en prod.** Phone Number ID de WhatsApp Cloud API |
| `WHATSAPP_VERIFICATION_TEMPLATE_NAME` | **Requerido en prod.** Plantilla aprobada que envía el código |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Idioma de la plantilla (default `es_MX`) |
| `WHATSAPP_GRAPH_API_VERSION` | Versión de Graph API (default `v21.0`) |
| `DOCUMENT_ACCESS_SECRET` | Sal para hashear tokens de acceso a documentos (fallback: service role key) |
| `RESEND_API_KEY` | API key de Resend para emails transaccionales |
| `RESEND_FROM_EMAIL` | Remitente de los emails (ej. `Black Capital <notificaciones@...>`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | Key de PostHog (opcional) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host de PostHog (opcional) |

> Sin las variables `WHATSAPP_*` el flujo de descarga de documentos protegidos (`/api/document-access/*`) falla en producción con error 502.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Build de producción
npm run lint       # ESLint
npx playwright test  # Tests E2E (levanta el server automáticamente)
```

### Base de datos

Las migraciones viven en `supabase/migrations/` y se aplican sobre el proyecto de Supabase (vía Supabase CLI o el panel/SQL editor).

### Primer administrador

1. Definir `ADMIN_SETUP_TOKEN` en el entorno.
2. Ir a `/admin/setup` y crear la cuenta del primer admin usando ese token.
3. Rotar o eliminar `ADMIN_SETUP_TOKEN` después del alta inicial.

## Deploy

El proyecto se despliega automáticamente en Vercel al hacer push a la rama `main`.

## Seguridad

- La API de escritura usa `SUPABASE_SERVICE_ROLE_KEY` (nunca expuesto al cliente).
- Las rutas `/admin` se protegen server-side con `requireAdminSession()` en el layout del grupo `(admin)`, con control de acceso por rol (admin / agente).
- Autenticación de usuarios vía Supabase Auth (login, recuperación y cambio de contraseña).
- Validación con Zod, incluyendo bloqueo de emails desechables.
- Row Level Security en Supabase.
- Descarga de documentos protegidos con verificación de identidad por WhatsApp y tokens hasheados (`DOCUMENT_ACCESS_SECRET`).

## Licencia

Privado. Todos los derechos reservados — Black Capital.
