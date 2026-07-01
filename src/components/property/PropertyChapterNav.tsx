"use client";

import { useEffect, useState } from "react";

export type Chapter = { id: string; label: string };

export function PropertyChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [chapters]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  };

  return (
    <nav aria-label="Índice de la propiedad" className="flex flex-col">
      <p className="mb-4 property-tag-type text-white/40">Índice</p>
      <ul className="flex flex-col">
        {chapters.map((chapter, i) => {
          const isActive = active === chapter.id;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                onClick={(e) => handleClick(e, chapter.id)}
                className={`flex items-baseline gap-3 border-l py-2.5 pl-4 transition-colors ${
                  isActive
                    ? "border-[var(--color-accent)]"
                    : "border-white/[0.1] hover:border-white/30"
                }`}
              >
                <span className="font-display text-[0.7rem] font-bold tabular-nums text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-body-sm font-semibold transition-colors ${
                    isActive ? "text-white" : "text-white/55"
                  }`}
                >
                  {chapter.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
