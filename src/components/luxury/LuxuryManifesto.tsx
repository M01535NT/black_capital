import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function LuxuryManifesto() {
  return (
    <section
      aria-label="Manifiesto residencial Black Luxury"
      className="relative overflow-hidden border-y border-white/[0.06]"
    >
      <div className="relative min-h-[72svh]">
        <Image
          src="/brand-luxury.webp"
          alt="Residencia privada con luz cálida y arquitectura residencial en Tijuana"
          fill
          sizes="100vw"
          className="object-cover object-[54%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/62 to-background/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/28" />
        <div className="grain-overlay" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-[90rem] items-end px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="max-w-5xl">
            <ScrollReveal>
              <p className="mb-5 property-tag-type gold-ink">Manifiesto residencial</p>
              <span
                aria-hidden="true"
                className="mb-8 block h-px w-44 origin-left bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-gold-light)] to-transparent"
              />
              <blockquote className="text-display-2 leading-display tracking-headline text-white/92">
                La residencia correcta no se mide primero.{" "}
                <span className="gold-ink">Se reconoce</span> por la calma que
                permite imaginar.
              </blockquote>
              <p className="mt-7 max-w-xl text-body text-white/62">
                Black Luxury debe sentirse como entrar a una habitación oscura
                donde la luz revela solo lo necesario: privacidad, proporción y
                una vida posible.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
