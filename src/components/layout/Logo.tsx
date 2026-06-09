import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * `mark` renders the compact header variant: a vertical gold bar
   * followed by "BLACK CAPITAL" wordmark.
   *
   * `full` renders the same composition at a larger size for the footer.
   */
  variant?: "mark" | "full";
  /**
   * Visual height in pixels. The SVG `viewBox` is fixed (220x72), so the
   * `font-size`, the bar height, and the tracking all scale linearly
   * with this value. Sizing rules:
   *
   *   sm (28px) → BLACK ≈ 17px, CAPITAL ≈ 10px
   *   md (44px) → BLACK ≈ 28px, CAPITAL ≈ 16px
   *   lg (64px) → BLACK ≈ 40px, CAPITAL ≈ 23px
   *
   * Anything below 26px becomes hard to read because the "CAPITAL"
   * subhead drops below 9px in raster.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color treatment.
   *  - `gold` (default) — gold accent bar + off-white "BLACK" + gold "CAPITAL"
   *  - `light`           — gold bar + pure-white "BLACK" + gold "CAPITAL"
   *  - `mono`            — single-color (inherits `currentColor`); used on
   *                        light backgrounds or print stylesheets
   */
  tone?: "gold" | "light" | "mono";
  /** Optional href. If provided, wraps the logo in a Link. */
  href?: string;
  /** Additional classes for the outer wrapper. */
  className?: string;
  /** Accessible label override. Defaults to "Black Capital". */
  ariaLabel?: string;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 28,
  md: 44,
  lg: 64,
};

/**
 * Black Capital wordmark logo.
 *
 * Composition (viewBox 220x72, units in CSS px when SVG height = 72):
 *   x=0..6     → vertical gold accent bar (1:12 aspect)
 *   x=14..200  → two-line stacked wordmark
 *   line 1     → "BLACK"   uppercase, weight 700, tight tracking
 *   line 2     → "CAPITAL" uppercase, weight 400, wide tracking, gold
 *
 * The previous version had a viewBox of 240x100 with text positioned
 * at y=48/y=84 of a 100-unit-tall box. When rendered at height=22, that
 * gave a real font-size of ~3px — invisible. This version uses a tight
 * viewBox where every unit maps to meaningful pixels.
 */
export function Logo({
  variant = "mark",
  size = "md",
  tone = "gold",
  href,
  className,
  ariaLabel = "Black Capital",
}: LogoProps) {
  const height = sizeMap[size];

  // Color tokens per tone.
  const colors = (() => {
    switch (tone) {
      case "gold":
        return {
          bar: "#CFB155",
          black: "#F5F5F5",
          capital: "#CFB155",
        };
      case "light":
        return {
          bar: "#CFB155",
          black: "#FFFFFF",
          capital: "#CFB155",
        };
      case "mono":
      default:
        return {
          bar: "currentColor",
          black: "currentColor",
          capital: "currentColor",
        };
    }
  })();

  // Width follows the 220:72 aspect → width = height * (220 / 72).
  const width = height * ((variant === "full" ? 236 : 220) / 72);

  // viewBox is 220x72. font-size is in viewBox units. At height=72 the
  // text renders at these exact pixel sizes. At other heights it scales.
  const blackSize = 40;
  const capitalSize = 24;

  const content = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 72"
      role="img"
      aria-label={ariaLabel}
      height={height}
      width={width}
      className={cn("flex-shrink-0", className)}
    >
      {/* Vertical accent bar — 1:12 aspect, vertically centered. */}
      <rect
        x="2"
        y="4"
        width="4"
        height="64"
        rx="0.5"
        fill={colors.bar}
      />
      {/* "BLACK" — heavy, tight tracking, off-white. */}
      <text
        x="14"
        y="38"
        fontFamily="var(--font-display)"
        fontSize={blackSize}
        fontWeight="700"
        letterSpacing="0.5"
        fill={colors.black}
      >
        BLACK
      </text>
      {/* "CAPITAL" — light, wide tracking, gold. */}
      <text
        x="14"
        y="62"
        fontFamily="var(--font-display)"
        fontSize={capitalSize}
        fontWeight="400"
        letterSpacing="3"
        fill={colors.capital}
      >
        CAPITAL
      </text>
    </svg>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${ariaLabel} — Inicio`}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
      >
        {content}
      </Link>
    );
  }

  return content;
}
