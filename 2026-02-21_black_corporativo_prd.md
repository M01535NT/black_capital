# **PRD: Black Corporativo (V3 Ultra-Condensada)**

## **1. Visión y Arquitectura**
PWA inmobiliaria matriz de **Black Luxury, Black Business y Black Industrial**. Captura leads B2B/HNWI ofreciendo "Gated Content" (brochures financieros) a cambio de correos verificados. Stack: **Next.js 16, Tailwind v4, Supabase (RLS)**.

## **2. OKRs y Público**
* **Público:** Institucional B2B (datos duros), Privados HNWI (exclusividad) y Wealth Managers.
* **Métricas:** 100 leads/mes, rebote <35%, entrega de PDF 99% (bloqueo estricto de correos temporales). Clasificación en <2 min.
* **Rendimiento:** LCP <1.5s, CLS 0.00, 15% adopción PWA.

## **3. UI, Diseño y Embudo**
* **Frontend (Premium Dark):** Fondo oscuro (`#0A0A0A`), textos off-white (`#FAFAFA`). **Oro gradiente** exclusivo para elementos de área amplia (CTAs, contadores). Fuentes: *Inter* y *News Cycle*.
* **Home:** Hero dinámico (*Staggered Letter Reveal*), Marquees flotantes minimalistas, Grid de marcas/inventario y Contadores de autoridad (<2s).
* **Embudo:** Visita > Catálogo > Ficha Propiedad > Modal (Checkbox Privacidad) > Validación anti-spam > PDF enviado por email.
* **Alcance V1:** Catálogo unificado, landings por marca, Offline-First.

## **4. Backoffice y Base de Datos**
* **Panel (`/admin`):** Tema claro, *shadcn/ui*, TanStack Table v8 y validación Zod (PDFs máx. 15MB a bucket privado).
* **Esquema (Supabase):** Tablas `properties` (segmentado por uso/tipo, m2 y atributos personalizados), `leads` y `system_logs`. Renderizado híbrido (ISR/SSG/CSR).

## **5. Directrices IA (Desarrollo en 8 Días)**
1. **Emails:** Envío transaccional vía **Resend API**.
2. **Data Fetching:** Lecturas con RSC + `@supabase/ssr`. Escrituras con Next.js **Server Actions**.
3. **Validación Zod:** Uso de `.refine()` para bloquear *disposable emails* (permitiendo Gmail/Outlook).
4. **Componentes:** Solo `shadcn/ui` preaprobados. Estructura en directorio `src/`.