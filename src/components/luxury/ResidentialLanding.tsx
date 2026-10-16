import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { brandFont } from "@/lib/brand-font";
import { getSiteSettings } from "@/lib/site-settings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-schema";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import styles from "./ResidentialLanding.module.css";

const inventoryHref = "/inventario?uso=Residencial#catalogo";
const contactHref = "/contacto?brand=luxury&objetivo=buscar-propiedad";

const collections = [
  { title: "Cerca del mar", description: "Explora residencias en Rosarito", image: "/hero-luxury.webp", alt: "Arquitectura residencial junto al mar al atardecer", zone: "Rosarito" },
  { title: "Arquitectura contemporánea", description: "Explora residencias en Tijuana", image: "/categories-residencial.webp", alt: "Residencia contemporánea de líneas blancas e iluminación cálida", zone: "Tijuana" },
];

/** Residential editorial landing. Collection images illustrate searches, not listings. */
export async function ResidentialLanding() {
  const settings = await getSiteSettings();
  // The previous site stored the brand/category labels as its hero copy.
  // Keep those labels in the eyebrow and upgrade only these known defaults.
  const defaultTitle = [DEFAULT_SITE_SETTINGS.luxuryHeroTitle, "Black Luxury"].includes(settings.luxuryHeroTitle.trim());
  const subtitle = [DEFAULT_SITE_SETTINGS.luxuryHeroSubtitle, "Inmuebles Residenciales"].includes(settings.luxuryHeroSubtitle.trim())
    ? "Casas y residencias en Tijuana y Rosarito. Te ayudamos a comparar zona, precio y condiciones antes de visitar."
    : settings.luxuryHeroSubtitle;

  return (
    <div className={`${styles.page} ${brandFont.variable}`} data-residential-landing>
      <section className={styles.hero} aria-labelledby="residential-title" data-section="residential-hero">
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Black Luxury / Residencial</p>
            <h1 id="residential-title" className={styles.heroTitle}>
              {defaultTitle ? <>Vivir bien.<br />Elegir<br /><span>con criterio.</span></> : settings.luxuryHeroTitle}
            </h1>
            <p className={styles.heroDescription}>{subtitle}</p>
            <div className={styles.heroActions}>
              <Link href={inventoryHref} className={styles.primaryButton}>Explorar residencias</Link>
              <Link href="#luxury-cta" className={styles.advisorLink}>Hablar con un asesor <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className={styles.heroSignature} aria-label="Black Capital en Baja California">
            <span>Black Capital</span>
            <span>Tijuana · Rosarito<br />Baja California</span>
          </div>
        </div>
        <div className={styles.heroPhoto}>
          <CinematicImage src="/categories-residencial.webp" alt="Residencia contemporánea de ventanales amplios en un entorno rocoso al anochecer" priority sizes="(min-width: 1024px) 56vw, 100vw" className={styles.heroImage} />
          <p className={styles.photoCaption}>Diseño que se vive.</p>
        </div>
      </section>

      <section id="residencias" className={styles.discovery} aria-labelledby="residential-discovery-title">
        <div className={styles.container}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Encuentra tu espacio</p>
            <h2 id="residential-discovery-title" className={styles.sectionTitle}>Una casa para<br />tu forma de vivir.</h2>
            <p className={styles.discoveryDescription}>Explora residencias en Tijuana y Rosarito, desde casas frente al mar hasta proyectos de arquitectura contemporánea.</p>
          </ScrollReveal>

          <form action="/inventario#catalogo" method="get" aria-label="Buscar inmuebles residenciales" className={styles.search}>
            <input type="hidden" name="uso" value="Residencial" />
            <label className={styles.searchField}>
              <span>Tipo de propiedad</span>
              <select name="propiedad" defaultValue="" aria-label="Tipo de propiedad">
                <option value="">Casa o departamento</option>
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Preventa">Preventa</option>
                <option value="Terreno">Terreno</option>
              </select>
              <ChevronDown size={18} aria-hidden="true" />
            </label>
            <label className={styles.searchField}>
              <span>Zona</span>
              <select name="zona" defaultValue="" aria-label="Zona residencial">
                <option value="">Tijuana o Rosarito</option>
                <option value="Tijuana">Tijuana</option>
                <option value="Rosarito">Rosarito</option>
                <option value="Chapultepec">Chapultepec</option>
                <option value="Zona Río">Zona Río</option>
              </select>
              <ChevronDown size={18} aria-hidden="true" />
            </label>
            <button type="submit" className={styles.searchButton}>Buscar</button>
          </form>

          <div className={styles.collections} data-section="residential-collections">
            {collections.map((collection, index) => (
              <ScrollReveal key={collection.zone} delay={index * 0.08}>
                <Link href={`/inventario?uso=Residencial&zona=${collection.zone}#catalogo`} className={styles.collection}>
                  <div className={styles.collectionPhoto}>
                    <Image src={collection.image} alt={collection.alt} fill sizes="(min-width: 1440px) 644px, (min-width: 768px) 45vw, 100vw" className={styles.collectionImage} />
                  </div>
                  <h3>{collection.title}</h3>
                  <p>{collection.description}<ArrowRight size={18} aria-hidden="true" /></p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="luxury-cta" className={styles.contact} aria-labelledby="residential-contact-title">
        <Image src="/hero-luxury.webp" alt="" fill sizes="100vw" className={styles.contactImage} />
        <div className={styles.contactShade} aria-hidden="true" />
        <div className={`${styles.container} ${styles.contactContent}`}>
          <ScrollReveal><h2 id="residential-contact-title">Tu próxima casa empieza<br /><span>con una conversación.</span></h2></ScrollReveal>
          <Link href={contactHref} className={styles.contactButton}>Pedir opciones</Link>
        </div>
      </section>
    </div>
  );
}
