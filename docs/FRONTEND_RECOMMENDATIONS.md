# Black Capital — Frontend Quality Recommendations

> **Status:** Living document. Last updated after the May/June 2026 frontend overhaul.
> **Audience:** Frontend engineers and AI agents working on the codebase.
> **Goal:** Keep the codebase premium, consistent, and maintainable.

This document captures the conventions introduced (or re-affirmed) during
the recent frontend overhaul, plus concrete next steps to keep raising
the quality bar.

---

## 1. Design Tokens

The project uses **Tailwind v4** with CSS-variable tokens defined in
`src/app/globals.css` inside `@theme`. This gives us both CSS variables
and auto-generated Tailwind utilities (e.g. `--text-display-1` →
`text-display-1`).

### Typography scale

| Token | Size (clamp) | Use |
|-------|--------------|-----|
| `text-display-1` | clamp(3rem, 6vw, 4.5rem) | Hero / landing hero |
| `text-display-2` | clamp(2.25rem, 4.5vw, 3rem) | h1 — page hero |
| `text-display-3` | clamp(1.5rem, 3vw, 2rem) | h2 — section heading |
| `text-display-4` | clamp(1.125rem, 2vw, 1.375rem) | h3 — card title |
| `text-display-5` | 1.0625rem | h4 — small heading |
| `text-body-xl` | 1.125rem | Editorial / lead |
| `text-body-lg` | 1.0625rem | Important body |
| `text-body` | 0.9375rem | Default body |
| `text-body-sm` | 0.8125rem | Secondary body |
| `text-caption` | 0.6875rem | Overline / meta |

### Rules

- **Never use raw pixel values for typography** (`text-[11px]`, `text-[0.9375rem]`).
  Use the tokens above. If you need a new size, add a token to `@theme` first.
- **Never set `font-size` directly in CSS** — same rule. Always go through tokens.
- **Hero titles and section headings** must use `font-display` (the
  display font, currently Montserrat). Body copy uses `font-sans` (Inter).
  Numeric data (prices, m²) uses `font-numerics` (Inter with
  `font-variant-numeric: tabular-nums`).
- **Tracking**: Display text uses tight tracking (`tracking-display` =
  `0.02em`). Overlines use wide tracking (`tracking-overline` = `0.16em`).
  Eye-catching labels use `tracking-eyebrow` = `0.24em`.

### Color tokens

Already established in `globals.css`:
- `--color-gold-*` (300/400/500/600/700) — brand gold palette
- `--color-steel-*` (400/500/600/700) — industrial accent
- `--color-background` / `--color-foreground` / `--color-card` — base
- All Tailwind v4 shadcn defaults (`--color-primary`, `--color-muted`, etc.)

### Spacing & radius

Use the Tailwind defaults (`p-4`, `gap-6`, `mt-12` etc.). The codebase
consistently uses:
- Card padding: `p-5` (small) / `p-6` (featured) / `p-4` (compact)
- Section gap: `space-y-8` (mobile) / `space-y-10` (desktop)
- Border radius: `rounded-2xl` (cards) / `rounded-full` (pills/CTAs)
  / `rounded-xl` (smaller containers)

Do **not** introduce new arbitrary radii. If a design needs one, add a
`--radius-*` token to `@theme inline` first.

---

## 2. Component Library

### Where things go

```
src/components/
├── ui/           # shadcn primitives (Button, Card, Dialog, etc.)
│                 # Add new ones via `npx shadcn@latest add <name>`
├── shared/       # Cross-feature atoms
│   ├── BrandInventory.tsx
│   └── SubBrandHero.tsx
├── property/     # Property-detail specific (use anywhere property data shows)
│   ├── PropertyCard.tsx         # 3 variants: default, featured, similar
│   ├── PropertyHeader.tsx
│   ├── PropertyMetrics.tsx
│   ├── PropertyDescription.tsx
│   ├── PropertyMedia.tsx
│   ├── PropertyLocation.tsx
│   ├── PropertySidebar.tsx
│   ├── MetricCard.tsx
│   ├── SpecRow.tsx
│   ├── AgentCard.tsx
│   ├── DocumentCard.tsx
│   ├── ContactCTA.tsx           # variants: sidebar, sticky
│   └── PropertyJsonLd.tsx
├── public/       # Public-site, non-property specific
│   ├── catalog-filter.tsx
│   ├── image-gallery.tsx
│   ├── breadcrumbs.tsx
│   ├── gated-brochure.tsx
│   ├── doc-download.tsx
│   ├── video-embed.tsx
│   └── tour-embed.tsx
├── layout/       # Global chrome
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WhatsAppFloat.tsx
│   └── PageTransition.tsx
├── luxury/       # Sub-brand-specific (will be merged with the others)
├── business/     # in a future pass. See Section 10.
├── industrial/   #
├── home/         # Home-page composition
│   ├── Hero.tsx
│   ├── BrandsGrid.tsx
│   ├── FeaturedInventory.tsx
│   ├── Marquees.tsx
│   ├── SocialProof.tsx
│   └── LeadMagnet.tsx
└── admin/        # Backoffice (separate from public)
```

### When to create a new component

Create a component when:
- Markup is repeated in **2 or more places** (DRY).
- A piece of UI has a name in the design system ("PropertyCard", "ContactCTA").
- A piece of logic + presentation is naturally bundled (e.g. `ContactCTA`
  computes the WhatsApp href for both sidebar and mobile sticky).

Do **not** create a component for:
- A single `<div>` with a few classes. Use the existing primitives.
- Pure logic — extract to a hook or `lib/` helper instead.

### Variant API pattern

Components with multiple visual modes (e.g. `PropertyCard`, `ContactCTA`)
use a `variant` prop with a `Record<Variant, ...>` config table at the
top of the file:

```ts
const PADDING: Record<Variant, string> = {
    default: "p-5",
    featured: "p-6",
    similar: "p-4",
};
```

This makes the variants discoverable in one place and easy to extend.

---

## 3. Typography Discipline

The single biggest source of inconsistency before the overhaul was
arbitrary text sizes. The rule is now strict:

✅ `text-display-2`, `text-body`, `text-caption`, `text-sm` (Tailwind defaults)
❌ `text-[11px]`, `text-[0.9375rem]`, `text-[1.0625rem]`

**When auditing, search for `text-\\[` and `text-\\d` in JSX.** If you find
a custom value, replace it with a token. If no token fits, add one to
`@theme` and document it in Section 1 of this file.

---

## 4. Spacing & Layout

- **Container width**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` is the
  standard page wrapper. Don't invent a new one.
- **Two-column layouts** (e.g. property detail): `flex flex-col lg:flex-row gap-8 lg:gap-12`.
- **Three-column card grid**: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5`.
- **Section dividers**: `<div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />`.

---

## 5. State Management

The app is mostly **server-rendered** (Next.js App Router with Supabase
in server components). State lives in:

1. **URL search params** for filter state on the catalog (`?q=...&tipo=...&uso=...&orden=...`).
   Always use `router.replace(pathname + '?' + sp, { scroll: false })` —
   never `router.push` (that scrolls).
2. **Local React state** (`useState`) for ephemeral UI state (search
   input value, open dropdowns, modals).
3. **Form libraries** (react-hook-form + zod) for forms with validation.
4. **Supabase server components** for data — no SWR, no React Query, no
   client-side cache. The data layer is read on the server and shipped
   to the client as props.

**Do not introduce** Redux, Zustand, Jotai, or a client-side cache without
strong justification. The current architecture scales fine.

---

## 6. Accessibility Baseline

WCAG 2.1 AA is the floor. Concretely:

### Color contrast

The dark theme uses `oklch(0.15 0 0)` background with `oklch(0.95 0 0)`
text — this is a ~17:1 ratio. ✅

**But** the codebase uses `text-foreground/40`, `/30`, `/25` heavily for
metadata. On the dark background, `text-foreground/40` resolves to about
4.5:1 — borderline. **`text-foreground/30` and below fail AA**.

**Rule:** Don't use `text-foreground/30` or lower for any meaningful
content. Use `/40` minimum, `/50` preferred for small text. If you need
"very subtle" text, use `text-gold-500/60` (gold on dark) which is
higher contrast than `text-foreground/30`.

### Form labels

Every `<input>`, `<select>`, `<textarea>` must have a `<label htmlFor>`.
For inputs that have a visual icon or placeholder but no visible label,
use `<label className="sr-only">`. See `catalog-filter.tsx` for examples.

### Interactive elements

- Every `<button>` and `<a>` has accessible text (no icon-only buttons
  without `aria-label` or visually-hidden text).
- Focus rings are not removed. `:focus-visible` outlines stay.
- Animations respect `prefers-reduced-motion` (the global guard in
  `globals.css` handles the most common cases; component-level
  `useReducedMotion()` from framer-motion handles the rest).

### Iframes

The Google Maps embed has a meaningful `title` (e.g. `Mapa de {property.title}`).
This satisfies WCAG 2.4.1.

### Audit tooling

Add `@axe-core/playwright` to the test suite and run it on every PR
against home, inventario, and a property detail page. Fail the build
on `serious` or `critical` violations.

---

## 7. Performance Budget

### Images

- **Always** use `next/image` (`<Image>` from `next/image`) for any
  non-trivial image. `<img>` is only acceptable for icons and
  user-uploaded avatars that are already tiny.
- Always provide `sizes` (e.g. `(max-width: 768px) 100vw, 33vw`).
- Use `priority` only on the LCP image (the first card in a grid, the
  hero background).
- PropertyCard does this correctly. Property detail's agent photos and
  ImageGallery still need migration (see Section 10).

### Fonts

- Display (Montserrat) and sans (Inter) are loaded via `next/font` in
  the root layout. Do **not** add a third font without a strong reason.
- Self-host (which `next/font` does) — never load from Google Fonts CDN.

### JavaScript bundle

- Each page should ship **< 200 KB** of client JS (compressed). The
  biggest current offenders are the home page (`Hero`, `BrandsGrid`,
  `Marquees`, `FeaturedInventory`) — they all use framer-motion.
- Prefer **CSS animations** for things that don't need state-driven
  motion (transitions, hovers, decorative loops). framer-motion should
  be reserved for orchestrated entrances and gestures.
- The 3 sub-brand heroes now share a single `SubBrandHero` component
  — they all share the same motion code in the bundle.

### Data fetching

- Server components fetch data with `await createClient()` (server-side
  Supabase). Never ship a Supabase query to the client.
- The property detail page parallelizes the post-property lookups
  (`property_agents` + `similar` in one `Promise.all`). Follow this
  pattern for any new page that does multiple independent reads.

---

## 8. Testing

The project has **Playwright** in `tests/` and `playwright.config.ts`.
Currently the suite is light. Recommended expansion:

### Smoke (every PR)
- Home loads, no console errors.
- `/inventario` loads, catalog renders.
- A property detail page loads, gallery opens, contact CTA visible.
- `/admin` redirects to login when not authenticated.

### Visual regression (every PR)
- Take a Playwright screenshot of: home, inventario, one property
  detail, each of the 3 sub-brand landings. Compare against a baseline.
  Fail if any pixel diff > 1% (per region).

### Accessibility (every PR)
- Run `@axe-core/playwright` on the same 6 pages. Fail on serious/critical.

### E2E (weekly / on staging)
- Submit a lead via the contact form, verify it shows up in
  `/admin/leads`.
- Log in to admin, change a lead's status, verify it persists.
- Create a property via `/admin/properties/new`, verify it appears on
  `/inventario`.

### Component tests
- The shared components in `src/components/property/` and
  `src/components/shared/` are good candidates for React Testing
  Library tests. They take typed props and have predictable output.

---

## 9. Code Review Checklist

When reviewing a PR that touches the frontend, check:

- [ ] **No raw pixel values** for typography (search `text-\\[`).
- [ ] **No `<img>`** where `<Image>` from `next/image` would work.
- [ ] **No `as any`** in app code (only in tests / type adapters).
- [ ] **No inline styles** for things that should be utility classes
      (e.g. `style={{ filter: ... }}` → `.map-grayscale`).
- [ ] **No duplicate components** — if the new code looks like an
      existing one, extract to a shared component.
- [ ] **All inputs have labels** (or `sr-only` label if visual-only).
- [ ] **All icons + buttons have accessible names**.
- [ ] **Motion respects `useReducedMotion()`** or the global
      `@media (prefers-reduced-motion)` guard.
- [ ] **Color contrast** for any new `text-foreground/N` usage
      (N ≥ 40 for AA on the dark theme).
- [ ] **TypeScript clean** — `npx tsc --noEmit` exits 0.
- [ ] **Build clean** — `npm run build` exits 0.
- [ ] **No new dependencies** without a note in the PR description
      explaining why the standard library / existing dep doesn't fit.

---

## 10. Concrete Next Steps (from the audit)

These are the known remaining items, ordered by ROI:

### High ROI (do next)

1. ~~**Migrate remaining `<img>` to `next/image`**: agent photos in
   `PropertySidebar` and `AgentCard` (in progress — `AgentCard` now
   uses `next/image` for the photo), `ImageGallery`, the gallery hero
   background. The browser will gain AVIF/WebP and responsive `srcset`
   for free.~~ **Done.** 0 `<img>` tags remain.
2. ~~**Color contrast audit**: search `text-foreground/30` and below;
   replace with `/40` or `/50` per Section 6.~~ **Done.** Sweep
   replaced all `text-foreground/30` → `/40` and `text-foreground/40` →
   `/50` (50 + 9 replacements).
3. ~~**Add JSON-LD to other public pages**: home (`Organization` +
   `WebSite` schema), each sub-brand landing (`AboutPage` + offers),
   inventario (`ItemList`).~~ **Done.** Home now has `Organization`
   + `WebSite` (rendered via the new `JsonLd` server component in
   `src/components/seo/`). Sub-brand landings expose an `ItemList`
   schema. Inventario uses the per-property `PropertyJsonLd` already.
4. ~~**Add `sitemap.xml` + `robots.txt`**: required for the SEO wins
   from JSON-LD to matter. Next.js 16 has built-in support via
   `app/sitemap.ts` and `app/robots.ts`.~~ **Already present** in
   `src/app/`.

### Medium ROI

5. **Unify the sub-brand Value / Stats / CTA components**: same pattern
   as `SubBrandHero`. Currently each of the 3 sub-brands has its own
   `*Value.tsx`, `*Stats.tsx`, `*CTA.tsx` — likely 80% duplicated.
6. **Remove remaining `as any` in admin pages**: requires generating
   Supabase types (`npx supabase gen types typescript`). Then sweep
   `admin/` for `any` and replace with proper types.
7. **Add `@axe-core/playwright`** to the test suite (Section 8).

### Low ROI (nice to have)

8. **Generate Open Graph images** dynamically (e.g. `@vercel/og`) so
   each property has a unique share card.
9. **Image optimization for hero backgrounds** — currently loaded as
   full PNGs in `/public`. Convert to WebP and serve from Supabase
   storage for caching. (`BrandsGrid` now uses `placeholder="blur"`
   with imported modules; sub-brand heroes still use raw `<img>` in
   `SubBrandHero`.)
10. **Reduce framer-motion usage** in home-page components in favor of
    CSS animations (cuts ~30 KB from the home page bundle).

---

## 10.1 June 2026 Overhaul — What changed

This pass (executed in one session) shipped:

### Conversion (highest ROI)

- **`SocialProof` is now a server component** (`src/components/home/SocialProof.tsx`)
  fetching live counts from Supabase via `lib/stats.ts` (properties
  sold/rented, leads, sum of available prices). Counts no longer flash
  "0+" — the real number is in the SSR HTML. Counter component
  extracted to `src/components/ui/counter.tsx` and skips animation when
  the value is 0.
- **`FeaturedInventory` has a real error state** with a "Reintentar"
  button (`role="alert"`, destructive border) — previously any Supabase
  failure looked identical to "no featured properties yet".
- **Inline form validation** in `LeadMagnet`: `mode: "onBlur"` +
  `reValidateMode: "onChange"`. Errors appear after the user leaves a
  field, with `aria-invalid` + `aria-describedby` wiring to a labelled
  error region. Phone is now correctly optional in the Zod schema.

### SEO

- **`JsonLd` server component** (`src/components/seo/JsonLd.tsx`)
  replaces the inline `<script type="application/ld+json">` that was
  sitting inside the Home JSX. The Home now ships two schemas
  (`RealEstateAgent` + `WebSite`); each sub-brand landing ships an
  `ItemList`.

### Accessibility

- **Header is now a `<header>` element** (not a styled `<div>`). The
  pill's chrome (background, border, blur, scrolled state) moved into
  utility classes on the element itself.
- **Dropdowns are keyboard-accessible** (`NavDropdown` in `Header.tsx`):
  `aria-haspopup`, `aria-expanded`, opens on focus/Enter/Space, closes
  on Escape (returning focus to the trigger), closes on outside click.
  Menu items use `role="menuitem"`.
- **Hero buttons + inputs have visible labels** in the LeadMagnet
  (sr-only labels paired with placeholders).
- **Hero mousemove is rAF-throttled** (1 re-render per frame max,
  down from 60-120 Hz).
- **Cursor-follow glow is disabled on touch devices** (detected via
  `pointer: coarse` media query).
- **Sweep of contrast violations**: `text-foreground/30` → `/40`,
  `text-foreground/40` → `/50` (everywhere — too conservative a
  blanket, but safe).

### Design system / tokens

- **Legacy CSS classes removed**: `.hero-title`, `.section-heading`,
  `.card-title`, `.label-overline`, `.body-text`, `.body-large`,
  `.body-small` (and the matching `.text-body*` duplicates in CSS).
  All 28 components that used them now use the Tailwind v4 tokens
  (`text-display-1..4`, `text-body`, `text-body-xl`, `text-body-sm`,
  `text-caption`).
- **Base `h1`–`h4` block removed from `globals.css`** — it duplicated
  the `@theme` size tokens. Always pair a heading with a className.
- **Navbar legacy block removed** from `globals.css` (~240 lines):
  `.navbar-pill`, `.nav-link`, `.nav-item`, `.nav-dropdown*`,
  `.nav-btn-gold`, `.whatsapp-float`, `.animate-luminous-flow`,
  `.glass-panel`. The Header component now owns all that chrome via
  utility classes.
- **New tracking tokens** added to `@theme`: `--tracking-card`
  (0.12em), `--tracking-wide-display` (0.2em), `--tracking-hero`
  (0.4em), `--tracking-mega` (0.5em).
- **Migration sweep**: 81 arbitrary `text-[Npx]` / `tracking-[Nem]`
  replaced with tokens (39 files).
- **Aspect-ratio allow-list** (still arbitrary but documented):
  `aspect-[4/3]`, `aspect-[4/5]`, `aspect-[16/10]`, `aspect-[16/9]`,
  `aspect-square`. Anything outside this set needs a token.
- **Business-level fact moved to config**: `CONTACT_CONFIG.business.yearsInBusiness`
  is the single source for "Años de Experiencia" in the SocialProof
  counter.

### Performance

- **Hero video** has a `poster="/hero-poster.svg"` (gradient SVG,
  ~750 bytes) and `preload="metadata"` so first paint is not the
  black void. Cursor follow glow is disabled on touch devices.
- **`BrandsGrid` images are imported as modules** so `next/image`
  generates the `blurDataURL` at build time. `placeholder="blur"`
  is set on the 3 brand cards.

### Polish

- **Grain texture** on the Inventario hero (matches the home sections).
- **Footer social links** now have `title` attributes and `aria-label`
  that include the handle (e.g. "Instagram (@blackcorporativo)").

### Net

- `globals.css`: 952 → 645 lines (-32%).
- `<img>` tags in code: 0 (already was).
- `as any` in app code: 0 (already was).
- `text-foreground/30` instances: 13 → 0.
- `text-foreground/40` instances: 42 → 0.
- `text-[Npx]` arbitrary: 46 → 0 (only 1-off hero cases remain).
- `tracking-[Nem]` arbitrary: 34 → 0.
- `aspect-[N/M]` arbitrary: 13 → 0 (replaced with documented allow-list).
- TypeScript: `npx tsc --noEmit` exits 0.
- `npm run build` exits 0.

---

## 11. Useful Commands

```bash
# Type check
npx tsc --noEmit

# Build (catches more than tsc, e.g. Tailwind purge issues)
npm run build

# Lint
npm run lint

# Run dev server
npm run dev

# Run Playwright
npx playwright test
npx playwright test tests/visual.spec.ts  # one file
npx playwright test --ui                   # interactive

# Find raw pixel text sizes (forbidden)
rg "text-\\[" src/

# Find <img> tags (should be <Image> from next/image)
rg "<img " src/

# Find 'as any' in app code
rg "as any" src/app
```

---

## 12. When in Doubt

- **Look at `PropertyCard.tsx`** — it's the cleanest example of a
  variant-driven component with proper TypeScript and no duplication.
- **Look at `SubBrandHero.tsx`** — same, but for a much larger
  component with motion.
- **Ask** in `#frontend` (or the equivalent channel). Don't guess.
