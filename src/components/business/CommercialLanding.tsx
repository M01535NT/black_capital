import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { brandFont } from "@/lib/brand-font";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-schema";
import { getSiteSettings } from "@/lib/site-settings";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import styles from "./CommercialLanding.module.css";

const categories = [
  { title: "Locales", type: "Local", image: "/business-retail-plaza.webp", alt: "Fachadas de locales comerciales en una plaza al atardecer", description: "Encuentra el punto ideal para tu marca en zonas con alto flujo.", position: "18% center" },
  { title: "Oficinas", type: "Oficina", image: "/categories-comercial.webp", alt: "Edificio de oficinas con fachada de vidrio e iluminación cálida", description: "Espacios corporativos en ubicaciones estratégicas para tu equipo.", position: "center" },
  { title: "Plazas", type: "Plaza", image: "/business-retail-plaza.webp", alt: "Plaza comercial con accesos peatonales y locales iluminados", description: "Explora plazas comerciales con visibilidad y entorno consolidado.", position: "65% center" },
];

export async function CommercialLanding() {
  const settings = await getSiteSettings();
  const defaultTitle = [DEFAULT_SITE_SETTINGS.businessHeroTitle, "Black Business"].includes(settings.businessHeroTitle.trim());
  const subtitle = [DEFAULT_SITE_SETTINGS.businessHeroSubtitle, "Espacios Comerciales"].includes(settings.businessHeroSubtitle.trim())
    ? "Locales, oficinas y plazas en Tijuana. Compara zona, visibilidad y condiciones antes de decidir."
    : settings.businessHeroSubtitle;

  return (
    <div className={`${styles.page} ${brandFont.className}`} data-commercial-landing>
      <section className={styles.hero} aria-labelledby="commercial-title" data-section="commercial-hero">
        <CinematicImage src="/business-retail-plaza.webp" alt="Plaza comercial al atardecer, con locales y accesos peatonales" priority sizes="100vw" className={styles.heroPhoto} imageClassName={styles.heroImage} />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={`${styles.container} ${styles.heroContent}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Black Business / Comercial</p>
            <h1 id="commercial-title" className={styles.heroTitle}>{defaultTitle ? <>La ubicación<br />también es<br /><span>estrategia.</span></> : settings.businessHeroTitle}</h1>
            <p className={styles.description}>{subtitle}</p>
            <Link href="/inventario?uso=Comercial#catalogo" className={styles.primaryButton}>Ver espacios comerciales<ArrowRight size={20} aria-hidden="true" /></Link>
            <Link href="#business-cta" className={styles.advisorLink}>Hablar con un asesor<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <p className={styles.criteria}>Zona · Giro · Accesos · Condiciones</p>
        </div>
      </section>

      <section id="espacios-comerciales" className={styles.discovery} aria-labelledby="commercial-discovery-title">
        <div className={styles.container}>
          <ScrollReveal>
            <h2 id="commercial-discovery-title" className={styles.sectionTitle}>Un espacio a la altura<br />de <span>tu operación.</span></h2>
            <p className={styles.sectionDescription}>Explora por tipo de inmueble.</p>
          </ScrollReveal>
          <div className={styles.categories} data-section="commercial-categories">
            {categories.map((category, index) => (
              <ScrollReveal key={category.type} delay={index * 0.08}>
                <Link href={`/inventario?uso=Comercial&propiedad=${category.type}#catalogo`} className={styles.category} aria-label={`Explorar ${category.title.toLowerCase()}`}>
                  <div className={styles.categoryPhoto}><Image src={category.image} alt={category.alt} fill sizes="(min-width: 1440px) 416px, (min-width: 768px) 30vw, 100vw" style={{ objectPosition: category.position }} className={styles.categoryImage} /></div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className={styles.categoryAction}>Explorar<ArrowUpRight size={20} aria-hidden="true" /></span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="business-cta" className={styles.contact} aria-labelledby="commercial-contact-title">
        <div className={`${styles.container} ${styles.contactContent}`}>
          <ScrollReveal><h2 id="commercial-contact-title">Hablemos de tu<br />próxima <span>ubicación.</span></h2></ScrollReveal>
          <Link href="/contacto?brand=business&objetivo=buscar-propiedad" className={styles.contactButton}>Pedir opciones<ArrowRight size={20} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
