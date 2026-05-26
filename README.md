# Black Corporativo

Plataforma digital inmobiliaria de alta gama. Boutique matriz de tres marcas especializadas:

- **Black Luxury** — Residencias trofeo y super lujo
- **Black Business** — Activos corporativos clase A (oficinas, locales, plazas)
- **Black Industrial** — Naves logisticas, bodegas y parques industriales

Estructurada para inversores B2B y HNWI con interes en el mercado mexicano.

## Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Animaciones | Framer Motion |
| Formularios | React Hook Form + Zod |
| Emails | Resend API |
| Analytics | PostHog |
| Tests | Playwright + TestSprite |
| PWA | @ducanh2912/next-pwa |

## Estructura

```
src/
  app/
    (public)/           # Rutas publicas
      page.tsx          # Home
      black-luxury/     # Landing Luxury
      black-business/   # Landing Business
      black-industrial/ # Landing Industrial
      inventario/       # Catalogo unificado
      herramientas/     # Herramientas financieras
      nosotros/         # About
      contacto/         # Contacto
      legal/            # Aviso de privacidad
    (admin)/            # Backoffice (/admin)
    admin/login/        # Login admin
    api/                # API routes
  components/
    home/               # Componentes del Home
    luxury/             # Componentes Black Luxury
    business/           # Componentes Black Business
    industrial/         # Componentes Black Industrial
    layout/             # Header, Footer, WhatsAppFloat
    public/             # Componentes compartidos (catalogo, brochure)
    admin/              # Sidebar, DataTable, formularios
    ui/                 # shadcn/ui components
  lib/
    supabase/           # Clientes (client, server, admin)
    validations/        # Schemas Zod
supabase/
  migrations/           # Migraciones SQL
```

## Variables de Entorno

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripcion |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo server-side) |
| `ADMIN_PASSWORD` | Contrasena de acceso a /admin |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numero WhatsApp (sin +) |
| `RESEND_API_KEY` | API key de Resend para emails |
| `NEXT_PUBLIC_POSTHOG_KEY` | Key de PostHog (opcional) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host de PostHog (opcional) |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Build de produccion
npm run lint       # ESLint
```

## Deploy

El proyecto se despliega automaticamente en Vercel al hacer push a la rama master.

## Seguridad

- API de escritura usa `SUPABASE_SERVICE_ROLE_KEY` (nunca expuesto al cliente)
- Middleware protege rutas `/admin` con cookie de sesion
- Validacion Zod con bloqueo de disposable emails
- Row Level Security en Supabase

## Licencia

Privado. Todos los derechos reservados — Black Corporativo.
