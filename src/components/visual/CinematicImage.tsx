"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
}

/** Local scroll context: native scrolling, no animation when reduced motion is requested. */
export function CinematicImage({ src, alt, className = "", imageClassName = "", sizes = "100vw", priority = false, children }: CinematicImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(plane.current, { yPercent: -5 }, {
        yPercent: 5, ease: "none",
        scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: 1.2, invalidateOnRefresh: true },
      });
    }, frame);
    return () => media.revert();
  }, []);
  return <div ref={frame} className={cn("relative isolate overflow-hidden", className)} data-cinematic-image>
    <div ref={plane} className="absolute inset-x-0 -inset-y-[8%]" data-image-plane>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imageClassName}`} />
    </div>
    {children}
  </div>;
}
