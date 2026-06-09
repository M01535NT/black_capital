"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface WhyBlackCapitalItem {
  step: string;
  title: string;
  text: string;
  signal: string;
}

interface WhyBlackCapitalTimelineProps {
  items: WhyBlackCapitalItem[];
}

function TimelineCard({ item }: { item: WhyBlackCapitalItem }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 96%", "center 42%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [136, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.72, 1], [0.06, 0.82, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.article
      ref={ref}
      style={{ y, opacity, scale, filter }}
      className="group relative timeline-mobile-reveal flex min-h-[190px] flex-col border-t border-white/[0.08] pt-7 transition-colors duration-300 md:min-h-[280px] md:border-t-0 md:pt-12"
    >
      <span className="absolute -left-[2.35rem] top-0 h-3 w-3 rounded-full border border-[var(--color-accent)] bg-background shadow-[0_0_0_6px_rgba(0,0,0,0.25)] md:left-0 md:top-[0.8rem]" />
      <div className="mb-6 flex min-h-12 flex-col gap-3 border-b border-[var(--color-accent)]/25 pb-4 sm:flex-row sm:items-start sm:justify-between md:min-h-16">
        <p className="property-tag-type gold-ink">{item.step}</p>
        <span className="w-fit text-caption text-white/72 transition-colors duration-300 group-hover:text-white">
          {item.signal}
        </span>
      </div>
      <h3 className="text-display-4 text-white transition-colors duration-300 group-hover:text-[var(--color-accent)]">
        {item.title}
      </h3>
      <p className="mt-2 text-body text-white/70">{item.text}</p>
    </motion.article>
  );
}

export function WhyBlackCapitalTimeline({ items }: WhyBlackCapitalTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 82%", "end 54%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute bottom-4 left-1.5 top-2 w-px bg-white/[0.08] md:hidden" />
      <motion.div
        style={{ scaleY: lineScale }}
        className="absolute bottom-4 left-1.5 top-2 origin-top bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/55 to-transparent md:hidden"
      />
      <div className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent md:block" />
      <div className="grid gap-8 pl-8 md:grid-cols-4 md:gap-8 md:pl-0">
        {items.map((item) => (
          <TimelineCard key={item.step} item={item} />
        ))}
      </div>
    </div>
  );
}
