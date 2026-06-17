# Graph Report - .  (2026-06-17)

## Corpus Check
- 317 files · ~135,071 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1099 nodes · 2088 edges · 130 communities (116 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 122|Community 122]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 112 edges
2. `createAdminClient()` - 91 edges
3. `Button()` - 46 edges
4. `requireApiProfile()` - 44 edges
5. `isAdmin()` - 30 edges
6. `logger` - 20 edges
7. `Input()` - 19 edges
8. `useReducedMotion()` - 18 edges
9. `createClient()` - 18 edges
10. `requireAdminSession()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `EditAgentPage()` --calls--> `createAdminClient()`  [INFERRED]
  src/app/(admin)/admin/agents/[id]/edit/page.tsx → src/lib/supabase/admin.ts
- `AgentDetailPage()` --calls--> `createAdminClient()`  [INFERRED]
  src/app/(admin)/admin/agents/[id]/page.tsx → src/lib/supabase/admin.ts
- `NewAgentPage()` --calls--> `requireAdminRole()`  [INFERRED]
  src/app/(admin)/admin/agents/new/page.tsx → src/lib/auth.ts
- `LeadDetailPage()` --calls--> `requireAdminSession()`  [INFERRED]
  src/app/(admin)/admin/leads/[id]/page.tsx → src/lib/auth.ts
- `LeadDetailPage()` --calls--> `createAdminClient()`  [INFERRED]
  src/app/(admin)/admin/leads/[id]/page.tsx → src/lib/supabase/admin.ts

## Import Cycles
- None detected.

## Communities (130 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (33): GET(), createSessionToken(), createVerificationCode(), hashSecret(), isoFromNow(), isValidWhatsappPhone(), JsonRecord, normalizeWhatsappPhone() (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (31): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (32): dependencies, browser-image-compression, class-variance-authority, clsx, @ducanh2912/next-pwa, embla-carousel-react, framer-motion, @hookform/resolvers (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (16): columns, columns, LeadRow, Badge(), badgeVariants, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (17): AgentOption, AgentSelect(), AgentSelectProps, PdfEntry, RestrictedDocument, UploadResult, Select(), SelectContent() (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (17): AdminPageHeader(), AgentForm(), PropertyForm(), AgentsPage(), EditAgentPage(), EditPropertyPage(), renderTeamInviteEmail(), sendTeamInviteEmail() (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (16): AdminBackButton(), AdminLogoutButton(), AdminPublicLinksMenu(), PUBLIC_SITE_ITEMS, AdminTooltip(), ADMIN_NAV_ITEMS, ADMIN_ONLY_ITEMS, AdminRole (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (15): AgentCard(), AgentInfo, DocumentCard(), DocumentCardProps, DocumentLink, Step, PropertySidebarProps, SpecRow() (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (17): AgentFormProps, Checkbox(), FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem() (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (3): AssignPropertiesButtonProps, Button(), buttonVariants

### Community 10 - "Community 10"
Cohesion: 0.23
Nodes (18): countAgentAssignments(), DELETE(), GET(), normalizeEmail(), parseUserByEmail(), PATCH(), POST(), PUT() (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (15): EASE, HomeHeroHeadline(), words, EASE, MethodologySection(), steps, defaultTestimonials, Testimonials() (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (15): getPropertyDocuments(), toVisibleDocuments(), PropertyDescription(), AgentInfo, PropertyJsonLd(), PropertyJsonLdProps, PropertyLocation(), StickyContactBar() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.26
Nodes (14): AdminSectionCard(), AdminStatCard(), AdminDashboard(), getAgentsCount(), getLeadsByStatus(), getLeadsCount(), getPropertiesCount(), getRecentLeads() (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (15): DataTableProps, FilterConfig, FilterDropdown(), cn(), ScrollArea(), ScrollBar(), Separator(), Table() (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (14): metadata, miembros, containerVariants(), Direction, directionMap, FadeInProps, ScaleOnHoverProps, StaggerChildren() (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (6): interestOptions, createClient(), createMockClient(), supabase, Input(), AdminUser

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (15): AccountPage(), DataTable(), AdminLayout(), AgentDetailPage(), LeadsPageClient(), LeadsPage(), getCurrentAdminProfile(), requireAdminSession() (+7 more)

### Community 20 - "Community 20"
Cohesion: 0.15
Nodes (7): manrope, metadata, ThemeGuard(), ThemeProvider(), PostHogProvider(), usePostHog(), Toaster()

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (12): baseLinks, corporativoLinks, DESKTOP_DROPDOWNS, DropdownDef, DropdownKey, herramientasDropdown, rentaDropdown, ventaDropdown (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (13): FeaturedInventoryResult, FeaturedProperty, getFeaturedProperties(), ASPECT, PropertyCardData, PropertyCardProps, SIZES, STATUS_LABELS (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (13): ATTRIBUTE_ICONS, BRAND_TO_USE, BUSINESS_TYPES, BusinessType, PropertyStatus, PropertyUse, STATUS_VARIANTS, StatusVariant (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.23
Nodes (10): sitemap(), normalizeEmail(), PATCH(), DELETE(), GET(), POST(), POST(), generateMetadata() (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (11): MobileDrawer(), MobileDrawerProps, useIsActive(), Drawer(), DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader() (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.16
Nodes (10): CONTAINER, Section, SectionProps, SPACING, metadata, pillars, subpaginas, Eyebrow() (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.14
Nodes (10): Agent, AgentCell(), AttentionSummary(), getLeadAttention(), Lead, LeadAttentionBadges(), LeadsPageClientProps, sourceLabels (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.19
Nodes (9): logger, cleanString(), PATCH(), POST(), PropertyRow, seedProperties, POST(), safeEqual() (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (14): baseJsonLd, BUSINESS_STATS, INDUSTRIAL_STATS, LUXURY_STATS, PropertyUse, SubBrandConfig, SubBrandHeroConfig, SubBrandInventoryConfig (+6 more)

### Community 30 - "Community 30"
Cohesion: 0.21
Nodes (8): AccountProfileForm(), AccountProfileFormProps, LeadActions(), LeadActionsProps, STATUS_OPTIONS, LeadTasks(), Task, Textarea()

### Community 31 - "Community 31"
Cohesion: 0.21
Nodes (11): compact, formatArea(), formatShortDate(), formatShortPrice(), fullEsMX, MetricCard(), MetricCardProps, PropertyCard() (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.18
Nodes (10): LuxuryManifesto(), EASE, fadeUp, imageMask, ScrollReveal(), BrandInventory(), BrandInventoryProps, BrandProperty (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 34 - "Community 34"
Cohesion: 0.21
Nodes (8): AppSettings, DEFAULTS, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 35 - "Community 35"
Cohesion: 0.15
Nodes (12): buildCommand, main, devCommand, framework, git, deploymentEnabled, github, autoJobCancelation (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, @playwright/test, shadcn, tailwindcss, @tailwindcss/postcss, tw-animate-css (+4 more)

### Community 37 - "Community 37"
Cohesion: 0.24
Nodes (6): metadata, CONTACT_CONFIG, ContactConfig, getSocialStats(), SocialStats, ZERO_STATS

### Community 38 - "Community 38"
Cohesion: 0.18
Nodes (5): hitos, metadata, PageHeroProps, metadata, FadeIn()

### Community 39 - "Community 39"
Cohesion: 0.27
Nodes (9): LeadDetailPage(), canAccessLead(), POST(), canAccessLead(), PATCH(), POST(), PUT(), canAccessAgentScopedResource() (+1 more)

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (4): AccountEmailForm(), AccountPreferencesForm(), DEFAULTS, Preferences

### Community 41 - "Community 41"
Cohesion: 0.31
Nodes (6): AdminEmptyState(), AgentDeleteButton(), AgentDeleteButtonProps, AgentStatusToggle(), AgentStatusToggleProps, AssignPropertiesButton()

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (9): ALLOWED_COLUMNS, DELETE(), filterPayload(), generateSlug(), GET(), POST(), PUT(), syncPropertyAgents() (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.24
Nodes (5): PropertyMedia(), TourEmbed(), TourEmbedProps, VideoEmbed(), VideoEmbedProps

### Community 44 - "Community 44"
Cohesion: 0.20
Nodes (9): Accent, EASE, heroChild, heroGroup, QUICK_SEARCH_CONFIG, QuickSearchConfig, QuickSearchOption, SubBrandHero() (+1 more)

### Community 45 - "Community 45"
Cohesion: 0.39
Nodes (4): IndustrialCTA(), IndustrialStats(), IndustrialValue(), SUB_BRAND_CONFIGS

### Community 46 - "Community 46"
Cohesion: 0.22
Nodes (3): ErrorBoundary, Props, State

### Community 47 - "Community 47"
Cohesion: 0.25
Nodes (7): brandLinks, corpLinks, Footer(), socialLinks, Logo(), LogoProps, sizeMap

### Community 48 - "Community 48"
Cohesion: 0.25
Nodes (6): AnimateIfAllowed(), AnimateIfAllowedProps, useReducedMotion(), Counter(), ScaleOnHover(), RevealText()

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (8): buildSchema(), CTAFormValues, EASE, revealItem, SECTION_SPACING, staggerGroup, SubBrand, SubBrandCTA()

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (6): BusinessStats(), Accent, SPACING, SubBrand, SubBrandStats(), SubBrandStatsProps

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (6): BusinessValue(), BRAND_HREF, BRAND_IMAGES, BrandCardImage, SubBrandValue(), SubBrandValueProps

### Community 53 - "Community 53"
Cohesion: 0.32
Nodes (7): formatPrice(), STATUS_CLASSES, STATUS_LABELS, currencyMXN, formatDisplayTitle(), PropertyHeader(), PropertyHeaderProps

### Community 54 - "Community 54"
Cohesion: 0.38
Nodes (3): BusinessCTA(), JsonLd(), JsonLdProps

### Community 55 - "Community 55"
Cohesion: 0.38
Nodes (4): useFavorites(), UseFavoritesReturn, FavoriteButton(), FavoriteButtonProps

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (3): metadata, PLACEHOLDER_PROPERTIES, CatalogFilter()

### Community 57 - "Community 57"
Cohesion: 0.38
Nodes (3): PageTransition(), ScrollProgress(), WhatsAppFloat()

### Community 58 - "Community 58"
Cohesion: 0.38
Nodes (6): ALLOWED_KEYS, AppSettings, DEFAULTS, GET(), POST(), readSettings()

### Community 60 - "Community 60"
Cohesion: 0.33
Nodes (4): metadata, metrics, primaryTools, secondaryTools

### Community 61 - "Community 61"
Cohesion: 0.47
Nodes (5): CounterItem(), counters, formatCount(), HomeCounters(), useCountUp()

### Community 62 - "Community 62"
Cohesion: 0.47
Nodes (4): getPropertyPlaceholderImage(), PROPERTY_PLACEHOLDER_IMAGES, ImageGallery(), ImageGalleryProps

### Community 63 - "Community 63"
Cohesion: 0.40
Nodes (4): criteria, EASE, LuxuryCriteria(), LuxuryStats()

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (3): contactCards, metadata, ContactLeadForm()

### Community 67 - "Community 67"
Cohesion: 0.40
Nodes (3): config, PUBLIC_ADMIN_PATHS, PUBLIC_API_PATHS

## Knowledge Gaps
- **355 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+350 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 16` to `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 12`, `Community 15`, `Community 18`, `Community 19`, `Community 21`, `Community 22`, `Community 25`, `Community 26`, `Community 27`, `Community 30`, `Community 31`, `Community 33`, `Community 34`, `Community 40`, `Community 41`, `Community 47`, `Community 55`, `Community 62`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `createAdminClient()` connect `Community 15` to `Community 0`, `Community 32`, `Community 5`, `Community 37`, `Community 39`, `Community 40`, `Community 41`, `Community 10`, `Community 42`, `Community 19`, `Community 22`, `Community 24`, `Community 58`, `Community 28`, `Community 30`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `useReducedMotion()` connect `Community 48` to `Community 64`, `Community 32`, `Community 38`, `Community 11`, `Community 44`, `Community 17`, `Community 50`, `Community 56`, `Community 57`, `Community 31`, `Community 61`, `Community 63`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `createAdminClient()` (e.g. with `AdminDashboard()` and `EditAgentPage()`) actually correct?**
  _`createAdminClient()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _355 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._