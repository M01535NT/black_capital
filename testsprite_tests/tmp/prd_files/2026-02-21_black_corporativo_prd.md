# **Product Requirements Document (PRD): Black Corporativo (V2 Extendida)**

## **1\. Resumen Ejecutivo y Visión del Producto**

Black Corporativo es una plataforma digital inmobiliaria de alta gama estructurada como una Progressive Web App (PWA). Actúa como la empresa matriz de tres inmobiliarias gemelas o marcas hijas: **Black Luxury**, **Black Business** y **Black Industrial**.

Su propósito principal es la captación automatizada, calificación predictiva y gestión de leads B2B y B2C (High Net Worth Individuals \- HNWI). El inventario está unificado, pero segmentado estrictamente por su uso de suelo: **Residencial** (operado por Black Luxury), **Comercial** (operado por Black Business) e **Industrial** (operado por Black Industrial). Adicionalmente, cuenta con atributos transversales para oportunidades de **Cesiones** y **Proyectos**.

En un mercado inmobiliario saturado de plataformas genéricas con altas tasas de rebote, Black Corporativo se posiciona como una herramienta de *Inbound Marketing* de precisión. El sistema opera bajo un modelo de "Gated Content" (contenido bloqueado): intercambia el acceso a información financiera privilegiada (brochures interactivos, proyecciones de ROI, análisis de Cap Rate y due diligence preliminar) por datos de contacto verificados.

La arquitectura subyacente está diseñada para garantizar una latencia mínima (utilizando Next.js 16 y Tailwind v4 sobre una red Edge), disponibilidad sin conexión (Offline-First para inversores en movimiento), seguridad a nivel bancario (Supabase RLS) y un ciclo de vida de desarrollo impulsado y auditado por inteligencia artificial (Google Antigravity, TestSprite MCP), lo que asegura una escalabilidad operativa sin precedentes.

## **2\. Público Objetivo (Buyer Personas y Stakeholders)**

Para alinear las decisiones de diseño, copy y arquitectura, el producto se dirige a tres perfiles estrictos y un stakeholder interno:

1. **Inversor Institucional B2B (Family Offices, Fondos de Inversión, Fideicomisos):**  
   * **Comportamiento y Contexto:** Busca datos duros, escalabilidad de capital, TIR (Tasa Interna de Retorno), Cap Rate (Tasa de Capitalización) y análisis de absorción del mercado. Navega principalmente desde escritorio (monitores ultra-wide) o tablets de alta gama en entornos de oficina. Sus decisiones pasan por comités de inversión.  
   * **Punto de dolor:** Plataformas lentas con interfaces desordenadas, información financiera fragmentada, desactualizada o que requiere demasiadas llamadas telefónicas para obtener un *teaser* básico.  
   * **Motivador de Conversión:** Acceso inmediato a un "Data Room" simplificado o a un brochure con proyecciones financieras a 5-10 años.  
2. **Inversor Privado B2C (High Net Worth Individual \- HNWI):**  
   * **Comportamiento y Contexto:** Valora la exclusividad, el estatus, la diversificación de patrimonio y la estética visual impecable. Toma decisiones iniciales basadas en el impacto emocional, la arquitectura del activo y la fricción cero. Navega un 80% del tiempo desde dispositivos móviles de última generación (ej. iPhone Pro Max, Galaxy Z Fold).  
   * **Punto de dolor:** Formularios largos que exigen demasiados datos iniciales, interfaces genéricas que no transmiten confianza, falta de privacidad y exposición a spam comercial.  
   * **Motivador de Conversión:** Descubrir oportunidades "fuera del mercado" (Off-Market) y asegurar activos trofeo antes de que se hagan públicos.  
3. **Wealth Manager / Asesor Financiero Independiente (Intermediario):**  
   * **Comportamiento y Contexto:** Actúa en nombre de múltiples HNWIs. Necesita descargar información rápidamente para empaquetarla y enviarla a sus clientes. Valora los resúmenes ejecutivos y los PDFs marca blanca.  
   * **Punto de dolor:** Imposibilidad de compartir fichas técnicas limpias o tener que registrarse múltiples veces por cada cliente.

## **3\. Objetivos y Resultados Clave (OKRs)**

Para garantizar el éxito del producto, los objetivos se han cuantificado mediante métricas específicas (KRs) que serán monitoreadas semanalmente.

**Objetivo 1: Optimización del Embudo de Captación y Calidad del Lead**

* **KR 1.1:** Generar un mínimo de 100 leads corporativos/HNWI calificados y verificados mensualmente durante el primer trimestre.  
* **KR 1.2:** Mantener una tasa de rebote en el formulario de captura (Drop-off rate, medido en PostHog/GA4 comparando el evento lead\_form\_opened vs lead\_form\_submitted) inferior al 35% durante la fase de lanzamiento inicial.  
* **KR 1.3:** Lograr una tasa de entrega de PDFs del 99%, implementando bloqueos estrictos contra dominios de correos temporales/desechables (disposable emails), asegurando que todos los registros (corporativos o freemails como Gmail/Outlook) sean de usuarios reales.

**Objetivo 2: Segmentación Predictiva y Aceleración Comercial**

* **KR 2.1:** Clasificar automáticamente el 100% de los leads en las 3 verticales y enviarlos al CRM o correo del agente correspondiente en menos de 2 minutos vía webhooks.  
* **KR 2.2:** Disminuir el tiempo promedio desde la primera visita hasta la cualificación comercial (Sales Qualified Lead \- SQL) en un 40%, basándose en la auto-educación del cliente mediante el material descargado.

**Objetivo 3: Rendimiento Extremo y Experiencia Premium (Web Vitals)**

* **KR 3.1:** Alcanzar un *Largest Contentful Paint* (LCP) global \< 1.5 segundos en redes 4G móviles.  
* **KR 3.2:** Mantener un *Cumulative Layout Shift* (CLS) estricto de 0.00 en todas las resoluciones, garantizando una lectura sin saltos de contenido.  
* **KR 3.3:** Lograr un 15% de adopción de PWA (usuarios recurrentes que instalan la aplicación en su *Homescreen* en los primeros 3 meses).

## **4\. Alcance del Proyecto (Scope Detallado)**

**Dentro del Alcance (V1 \- Lanzamiento Core):**

* **Frontend PWA (Arquitectura Modular):** Plataforma pública construida bajo el patrón de *Route Groups* de Next.js. Las páginas de las marcas hijas (`/black-luxury`, etc.) funcionarán como *landing pages* de marketing inyectadas dinámicamente con el inventario pre-filtrado correspondiente a su segmento de uso.  
* **Catálogo Dinámico Unificado:** La ruta central `/inventario` alojará el 100% de las propiedades. Integrará un motor de búsqueda y filtrado local segmentado por Uso (Residencial, Comercial, Industrial), Tipo (Terreno, Bodega, Casa, etc.) y atributos transversales (Cesiones, Proyectos).  
* **Lead Magnet (Gated Content):** Sistema robusto de bloqueo de PDF. Modal de formulario superpuesto en las tarjetas de detalle de propiedad, validación en tiempo real y generación de URLs firmadas temporales (entregadas vía email).  
* **Panel Administrativo (Backoffice):** Interfaz segura aislada (ruta `/admin`) protegida por Supabase Auth para operaciones CRUD sobre el inventario y visualización de leads.  
* **Infraestructura Offline-First:** Configuración avanzada de Service Workers para cachear activos estáticos y el JSON del catálogo. Soporte para 'Background Sync' en la captura de leads, incluyendo un componente visual (*toast*) que notifique al usuario cuando está operando sin conexión y que su solicitud se ha encolado.  
* **Testing Automatizado:** Suite completa de pruebas E2E ejecutada por TestSprite MCP.

**Fuera del Alcance (Exclusiones explícitas para V1, planificadas para V2/V3):**

* Pasarelas de pago, reserva de propiedades con tarjeta de crédito o transacciones blockchain.  
* Chatbots de atención al cliente en tiempo real.  
* Alojamiento de videos nativos o recorridos 360 en la base de datos (se utilizarán iframes y URLs externas).  
* Creación de cuentas o portales para el usuario/inversor.  
* Sincronización bidireccional compleja con Salesforce/Hubspot.

## **5\. Flujo de Usuario y Arquitectura de la Información**

**Estructura Visual de Inicio (Home Page \- `/`)** La página principal actúa como el embudo maestro, estructurada visualmente bajo reglas estrictas de contraste (fondo `oklch` oscuro, texto blanco hueso, acentos dorados moderados):

1. **Header Responsivo (Sticky):**  
   * *Desktop:* 3 columnas. Izquierda: Logo. Centro: Enlaces base (INICIO, INVENTARIO, NOSOTROS, HERRAMIENTAS). Derecha: Ícono hamburguesa (abre Drawer con verticales y atributos).  
   * *Móvil:* 2 columnas. La columna central desaparece y sus enlaces se fusionan en el menú Drawer de la derecha.  
2. **Hero Section (Atracción Dinámica):** Fondo oscurecido premium. Titular en blanco hueso: "Estructuramos portafolios inmobiliarios diseñados para tu **\[ Legado / Rentabilidad / Expansión \]**". La palabra final alterna automáticamente mediante animación *Vertical Slide*, manteniendo el color dorado (sin depender de interacción táctil). La animación debe pausarse si el usuario tiene activado `prefers-reduced-motion` para cumplir con estándares de accesibilidad.  
3. **Carrusel de Valores (Marquee Superior):** Banda de desplazamiento infinito horizontal (CSS puro) con los textos: Compromiso, Confianza, Respeto, Esfuerzo, Calidad.  
4. **Grid de Marcas Hijas:** Tres bloques para Black Luxury, Black Business y Black Industrial. Efecto de zoom (`scale-105`) al *hover* (solo en desktop) oscureciendo la tarjeta para revelar el botón dorado hacia la *landing page* pre-filtrada correspondiente.  
5. **Inventario Destacado (`is_featured`):** Tarjetas de propiedades consultadas dinámicamente. Mostrarán imagen, M2 de Terreno, M2 de Construcción y dos atributos dinámicos configurables. *Restricción:* No habrá botón de descarga en esta vista; el clic en la tarjeta forza la navegación al detalle completo.  
6. **Social Proof (Banda de Autoridad):** Tres contadores numéricos activados por scroll (*Intersection Observer*, duración máxima de 1.5 a 2 segundos).  
   * Número grande en dorado con signo `+` fijo (ej. 10+, 100+, 50+).  
   * Texto inferior en blanco hueso: "Años de Experiencia", "Negocios Cerrados", "Clientes Satisfechos".  
7. **Carrusel de Clientes (Marquee Inferior):** Banda infinita mostrando logotipos en formato SVG monocolor (blanco hueso/gris) de clientes institucionales (Bimbo, Coca Cola, Coppel, Tersa, Lala).  
8. **Lead Magnet Temprano:** Sección de contraste sutil (bordes dorados) con formulario integrado (Nombre, Email, Empresa, Teléfono, Checkbox de Privacidad) para captación sin necesidad de interactuar con el inventario.  
9. **Footer:** Logotipo, dirección corporativa, teléfono de contacto, hipervínculos de políticas legales, redes sociales y replicación de las verticales.

**Sitemap y Jerarquía de Rutas (Escalable):**

* **Rutas Estáticas / Marketing Corporativo:** `/`, `/nosotros`, `/herramientas`, `/legal/privacidad`.  
* **Rutas de Marcas Hijas (Landing \+ Inventario Pre-filtrado):** `/black-luxury`, `/black-business`, `/black-industrial`.  
* **Rutas Dinámicas / Catálogo Global:** `/inventario`, `/cesiones`, `/proyectos`, `/propiedad/[slug]`.  
* **Rutas Administrativas:** `/admin`, `/admin/dashboard`, `/admin/properties`, `/admin/leads`.

**Embudo de Conversión Profundo (User Journey Map):**

1. **Atracción:** El prospecto llega a la Home o a una landing page hija.  
2. **Exploración:** Interactúa con el catálogo utilizando filtros paramétricos instantáneos.  
3. **Punto de Interés:** Clic en una tarjeta de propiedad (fuerza la visita a la ficha técnica completa).  
4. **Acción (Gated Content):** El usuario hace clic en "Descargar Brochure Financiero (PDF)".  
5. **Captura:** Aparece modal UI con soporte para auto-completado. Validación obligatoria de checkbox de Privacidad.  
6. **Entrega (Validación B2B):** Datos guardados en Supabase. La URL firmada para descargar el PDF se envía directamente al correo electrónico ingresado, forzando la veracidad del dato aportado.  
7. **Nurturing:** Webhook de Supabase alerta vía Slack/Teams al equipo comercial.

## **6\. Historias de Usuario Detalladas y Criterios de Aceptación (CA)**

### **Épica 1: Exploración y Experiencia Premium (UI/UX)**

* **HU1.3 \- Estética de Alto Contraste y Lujo Visual:** Como prospecto de alto perfil, requiero una interfaz sofisticada que no fatigue mi vista.  
  * *CA:* Aplicación de tema oscuro nativo (`oklch`, fondo aprox. `#0A0A0A`). Texto principal en **blanco hueso**. El color **dorado** se aplicará sin abusar, estrictamente en CTAs, títulos, íconos, el botón flotante de WhatsApp y contornos/contrastes específicos. Tipografía: Lato (encabezados) y Montserrat (datos numéricos).

### **Épica 4: Backoffice y Panel de Control Administrativo**

* **HU4.1 \- Interfaz y Estados de UI del Panel:** Como administrador, quiero una interfaz clara y funcional que me indique cuándo el sistema está procesando información.  
  * *CA:* El panel utilizará un **tema claro** por defecto, con un toggle para cambiar a modo oscuro, construido sobre componentes de `shadcn/ui`. Debe implementar *Skeletons* de carga en la transición de rutas, reemplazar botones de guardado con *Spinners* durante las transacciones y usar `Sonner` para notificaciones tipo toast (éxito/error).  
* **HU4.2 \- Data Tables Avanzadas:** Como analista, necesito tabular, filtrar y exportar miles de leads e inventario sin que el navegador colapse.  
  * *CA:* Implementación estricta de **TanStack Table v8**. Paginación del lado del servidor (server-side pagination). Funcionalidad de filtrado multifila (ej. "Uso: Comercial" \+ "Tipo: Bodega"), ordenamiento por columnas y botón de exportación CSV.  
* **HU4.3 \- Formulario de Inventario (CRUD):** Como gestor de activos, necesito un formulario unificado para registrar las propiedades con sus respectivos usos y tipos de forma estructurada.  
  * *CA:* Formulario de subida con validación estricta vía Zod.  
    * *Campos:* Título, Uso (Select: Residencial, Comercial, Industrial), Tipo (Select dinámico: Terreno, Casa, Departamento, Oficina, Bodega, Local, Plaza, Nave, Parque), Tipo de Negocio (Select: Venta, Renta, Aportación, Cesión), Atributos transversales (Es Proyecto, Es Cesión, Destacado en Inicio), M2 Terreno, M2 Construcción, 2 Atributos personalizados extra, Precio, Moneda, Descripción, Dirección.  
    * *Media:* Subida auto-comprimida a WebP para imágenes. Inputs para URLs de video y embeds 360\.  
    * *Documentos (PDF):* Restricción forzada de 15MB. Destino: bucket privado `secure-brochures`.

## **7\. Arquitectura Técnica y Requisitos No Funcionales**

### **7.1. Frontend y Estrategia de Entrega (Next.js 16 & Tailwind v4)**

* **Estrategia de Renderizado Híbrido:**  
  * **Rutas de Catálogo Dinámico y Landing Pages de Marcas:** Implementación de *Incremental Static Regeneration (ISR)* con revalidación bajo demanda impulsada por webhooks desde Supabase. Integración de generación dinámica de imágenes Open Graph (`next/og`).  
  * **Rutas de Marketing:** Generación Estática (SSG) pura.  
  * **Páginas Administrativas:** *Client-Side Rendering (CSR)* apoyado en **TanStack Table v8** y **React Hook Form** junto con **Zustand** para la gestión fluida de estado en el cliente.

### **7.2. Infraestructura Backend y Bases de Datos (Supabase / PostgreSQL)**

* Implementación estricta de **Row Level Security (RLS)** para la tabla de inventario (pública para lectura) y la tabla de leads (inserción anónima, lectura restringida a administradores).  
* **Almacenamiento (Storage):** Bucket público para imágenes WebP y bucket privado seguro limitado a archivos MIME `application/pdf` de máximo 15MB.

### **7.3. Esquema de Base de Datos Profundo (Entity-Relationship Diagram)**

* **Tabla `properties` (Catálogo de Activos)**  
  * `id` (UUID, Primary Key)  
  * `title` (VARCHAR), `slug` (VARCHAR, Unique)  
  * `property_use` (ENUM) \- \[Residencial, Comercial, Industrial\]  
  * `property_type` (VARCHAR) \- \[Terreno, Casa, Departamento, Oficina, Bodega, Local, Plaza, Nave, Parque\]  
  * `business_type` (ENUM) \- \[Venta, Renta, Aportación, Cesión\]  
  * `is_project` (BOOLEAN, Default FALSE)  
  * `is_assignment` (BOOLEAN, Default FALSE)  
  * `is_featured` (BOOLEAN, Default FALSE)  
  * `m2_terrain` (NUMERIC)  
  * `m2_construction` (NUMERIC)  
  * `custom_attributes` (JSONB)  
  * `price` (NUMERIC)  
  * `currency` (ENUM) \- \[MXN, USD\]  
  * `address` (JSONB)  
  * `description` (TEXT)  
  * `status` (ENUM) \- \['Available', 'Under\_Offer', 'Sold', 'Rented'\]  
  * `images` (ARRAY of TEXT)  
  * `video_urls` (ARRAY of TEXT)  
  * `tour_embeds` (ARRAY of TEXT)  
  * `brochure_path` (VARCHAR)  
* **Tabla `leads` (Captura y Calificación)**  
  * `id` (UUID, Primary Key)  
  * `property_id` (UUID, FK \-\> `properties.id`)  
  * `full_name` (VARCHAR)  
  * `email` (VARCHAR, Validado, bloquea dominios temporales)  
  * `company` (VARCHAR)  
  * `phone` (VARCHAR, Nullable)  
  * `privacy_accepted` (BOOLEAN, Not Null)  
  * `downloaded_at` (TIMESTAMP WITH TIME ZONE)  
* **Tabla `system_logs` (Auditoría Administrativa)**  
  * `id` (UUID, Primary Key), `admin_uuid` (UUID), `action_type` (VARCHAR), `target_table` (VARCHAR), `timestamp` (TIMESTAMP WITH TIME ZONE)

## **8\. Orquestación con IA, Desarrollo Asistido y QA Autónomo**

* Orquestación en **Google Antigravity** con Gemini 3.1 Pro. Configuración de `.agent/rules/` forzando *App Router* y metodologías Next.js 16\.  
* **Supabase MCP** para gestión de migraciones y TypeScript gen.  
* **TestSprite MCP** para QA Visual, pruebas E2E y Red Teaming automatizado.

## **9\. Analítica de Producto y Métricas de Éxito (Business Intelligence)**

* Observabilidad técnica (Vercel Analytics & Speed Insights).  
* Mapeo de eventos (GA4/PostHog): `view_item`, `lead_form_opened`, `lead_form_submitted` (enviando `property_use`, `property_type` y `is_project` como metadatos para segmentación precisa del ROI).

## **10\. Cronograma y Fases de Desarrollo (Milestones \- 8 Días)**

* **Días 1-2 (Arquitectura):** Next 16 \+ Tailwind 4 (Route Groups). Supabase (Tablas RLS, Storage limits).  
* **Días 3-4 (UI Estática):** Layouts, Home Page (Marquees, Contadores IO), tema oscuro/dorado.  
* **Días 5-6 (Motor Dinámico y Backoffice):** Panel `/admin` (TanStack Tables). Formulario de subida optimizado. Modal de captura con validación Zod y URL vía correo.  
* **Día 7 (QA Autónomo y PWA):** Configuración Service Workers. Ejecución de TestSprite MCP.  
* **Día 8 (Soft Launch):** Periodo de validación final (UAT) por parte de stakeholders seguido por el despliegue en producción.

## **11\. Directrices de Implementación para IA (Implementation Details)**

Para evitar alucinaciones durante la generación de código mediante agentes autónomos, se establecen las siguientes directrices técnicas estrictas:

1. **Proveedor de Envío de Correos (Emailing):** \* Se utilizará **Resend API** para el envío transaccional de los URLs firmados de los PDFs. No se intentará configurar un servidor SMTP genérico. El trigger de envío se ejecutará de forma segura del lado del servidor.  
2. **Patrón de Mutación y Obtención de Datos (Data Fetching):**  
   * **Lecturas (Catálogo):** Uso exclusivo de *React Server Components (RSC)* combinados con el SDK de `@supabase/ssr` para inyectar datos pre-renderizados al cliente.  
   * **Escrituras (Formularios/Leads):** Uso de *Next.js Server Actions* (`"use server"`). Queda estrictamente prohibido usar API Routes tradicionales (`/api/...`) o llamadas a Supabase de mutación directamente desde componentes cliente (`"use client"`).  
3. **Lógica de Validación de Correos:**  
   * El esquema Zod del formulario debe implementar una regla de refinamiento (`.refine()`) que compare el dominio ingresado contra una lista de bloqueo (blocklist) de correos desechables conocidos (ej. `mailinator.com`, `temp-mail.org`). Los correos de proveedores gratuitos (Gmail, Outlook, Yahoo) **sí están permitidos**.  
4. **Inventario de Componentes UI Base:**  
   * La interfaz se construirá utilizando estrictamente el CLI de `shadcn/ui`. Los componentes autorizados para instalación son: `button`, `input`, `select`, `dialog` (para el lead magnet), `drawer` (para el menú móvil), `carousel` (para Marquees), `sonner` (para notificaciones toast), `table` (TanStack Table), y `form` (para integración con React Hook Form \+ Zod).  
5. **Estructura de Directorios (Folder Structure):**  
   * Toda la lógica de la aplicación debe residir en el directorio `src/`.  
   * `src/app`: Grupos de rutas y páginas.  
   * `src/components`: Componentes aislados (separando `/ui` para shadcn y `/blocks` para secciones complejas).  
   * `src/lib`: Utilidades, configuración de clientes (Supabase SSR) y esquemas Zod.  
   * `src/actions`: Funciones aisladas de Server Actions.

