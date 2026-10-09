"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "./_motion";

const LINES = [
  { category: "Residencial", title: "Black Luxury", href: "/black-luxury", image: "/line-residencial.webp", copy: "Un lugar para vivir." },
  { category: "Comercial", title: "Black Business", href: "/black-business", image: "/line-comercial.webp", copy: "Espacio para crecer." },
  { category: "Industrial", title: "Black Industrial", href: "/black-industrial", image: "/line-industrial.webp", copy: "Escala para tu operación." },
];

export function BusinessLines() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const focusScene = useRef<number | null>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const node = stage.current!;
      const slides = gsap.utils.toArray<HTMLElement>("[data-scene]", node);
      const dots = gsap.utils.toArray<HTMLButtonElement>("[data-scene-control]", root.current!);
      node.dataset.pinned = "true";
      gsap.set(node, { height: "calc(100svh - 6rem)" });
      gsap.set(slides, { position: "absolute", inset: 0, height: "100%", minHeight: 0 });
      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 0 });
      let previous = -1;
      const activate = (index: number) => {
        if (index === previous) return;
        previous = index;
        node.dataset.activeScene = String(index);
        slides.forEach((slide, i) => { slide.inert = i !== index; slide.setAttribute("aria-hidden", String(i !== index)); });
        dots.forEach((dot, i) => dot.setAttribute("aria-pressed", String(i === index)));
        if (focusScene.current === index) {
          slides[index].querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
          focusScene.current = null;
        }
      };
      activate(0);
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: node, start: "top 80px", end: () => `+=${window.innerHeight * 2.2}`, pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => activate(self.progress < 0.26 ? 0 : self.progress < 0.73 ? 1 : 2),
      } });
      trigger.current = timeline.scrollTrigger!;
      slides.slice(1).forEach((slide, i) => {
        timeline.set(slide, { autoAlpha: 1 }, i * 1.3 + 0.3)
          .to(slide, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, i * 1.3 + 0.3)
          .fromTo(slide.querySelector("[data-scene-image]"), { scale: 1.12 }, { scale: 1, duration: 1.3, ease: "none" }, i * 1.3 + 0.3);
      });
      return () => {
        trigger.current = null;
        focusScene.current = null;
        delete node.dataset.pinned;
        delete node.dataset.activeScene;
        slides.forEach(slide => { slide.inert = false; slide.removeAttribute("aria-hidden"); });
        dots.forEach(dot => dot.removeAttribute("aria-pressed"));
      };
    }, root);
    return () => media.revert();
  }, []);

  function jump(index: number) {
    const active = trigger.current;
    const scene = stage.current?.querySelectorAll<HTMLElement>("[data-scene]")[index];
    if (active) {
      if (stage.current?.dataset.activeScene === String(index)) scene?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
      else focusScene.current = index;
      window.scrollTo({ top: active.start + (active.end - active.start) * [0, 0.5, 1][index], behavior: "smooth" });
    } else {
      scene?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
      scene?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    }
  }

  return <section ref={root} data-section="home-segments" className="relative py-16 lg:py-24">
    <div className="mx-auto mb-10 flex max-w-[100rem] flex-col justify-between gap-6 px-6 sm:px-10 lg:flex-row lg:items-end lg:px-16">
      <Reveal><p className="mb-4 property-tag-type gold-ink">Tres maneras de avanzar</p><h2 className="max-w-2xl text-display-2 leading-display tracking-headline text-white">Encuentra tu lugar.</h2></Reveal>
      <nav aria-label="Líneas de negocio" className="flex flex-wrap gap-5">
        {LINES.map((line, i) => <button key={line.category} data-scene-control type="button" onClick={() => jump(i)} className="min-h-11 border-b border-white/20 property-tag-type text-white/55 transition-colors hover:text-[var(--color-accent)] aria-pressed:border-[var(--color-accent)] aria-pressed:text-[var(--color-accent)]">0{i + 1} · {line.category}</button>)}
      </nav>
    </div>
    <div className="mx-auto max-w-[100rem] px-3 sm:px-6 lg:px-10">
      <div ref={stage} data-segment-stage className="relative grid gap-6">
        {LINES.map((line, i) => <article key={line.category} data-scene className="relative isolate flex min-h-[32rem] scroll-mt-24 flex-col justify-end overflow-hidden rounded-[1.25rem] p-6 sm:min-h-[42rem] sm:p-10 lg:p-16">
          <div data-scene-image className="absolute inset-0 -z-20"><Image src={line.image} alt={`${line.category} en Tijuana`} fill sizes="100vw" className="object-cover" /></div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
          <span className="absolute left-6 top-6 property-tag-type text-white/90 sm:left-10 sm:top-10 lg:left-16 lg:top-12">0{i + 1} / 03 · {line.category}</span>
          <div className="flex items-end justify-between gap-6">
            <div><p className="mb-4 text-body-lg text-white/75">{line.copy}</p><h3 className="max-w-xl font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-tight text-white">{line.title}</h3></div>
            <Link href={line.href} aria-label={`Explorar ${line.category}`} className="group flex size-14 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-colors duration-500 hover:bg-white hover:text-black sm:size-20"><ArrowUpRight className="size-6 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" /></Link>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
