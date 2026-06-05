import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * `mark` renders the compact header variant: a vertical gold bar
   * followed by "BLACK CAPITAL" wordmark in Space Grotesk.
   *
   * `full` renders the same wordmark at a larger size for the footer.
   * Same composition, no separate "BC" monogram.
   */
  variant?: "mark" | "full";
  /**
   * Visual height in pixels. Width follows the natural aspect of the
   * SVG content (the bar + the wordmark).
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color treatment. `gold` paints the accent bar in brand gold and the
   * wordmark in off-white. `mono` is single-color (current text color).
   * `light` paints the wordmark in white (for dark video overlays, etc).
   */
  tone?: "gold" | "mono" | "light";
  /** Optional href. If provided, wraps the logo in a Link. */
  href?: string;
  /** Additional classes for the outer wrapper. */
  className?: string;
  /** Accessible label override. Defaults to "Black Capital". */
  ariaLabel?: string;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, { mark: number; full: number }> = {
  sm: { mark: 22, full: 28 },
  md: { mark: 28, full: 36 },
  lg: { mark: 44, full: 56 },
};

/**
 * Black Capital wordmark logo.
 *
 * Composition:
 *   - A vertical gold bar (1:4 aspect, fills the cap height)
 *   - "BLACK" — uppercase, weight 700, tight tracking
 *   - "CAPITAL" — uppercase, weight 400, wide tracking, gold accent
 *
 * The 2-line stacked "BLACK / CAPITAL" treatment is the signature
 * of the brand. Inline SVG with `currentColor` so the `tone` prop
 * controls the paint at the call site, not at the file level.
 */
export function Logo({
  variant = "mark",
  size = "md",
  tone = "gold",
  href,
  className,
  ariaLabel = "Black Capital",
}: LogoProps) {
  const height = sizeMap[size][variant];

  // Color tokens per tone.
  const colors = (() => {
    switch (tone) {
      case "gold":
        return {
          bar: "#D4AF37",
          black: "#F5F5F5", // off-white for "BLACK" word
          capital: "#D4AF37", // gold for "CAPITAL" subhead
        };
      case "light":
        return {
          bar: "#D4AF37",
          black: "#FFFFFF",
          capital: "#D4AF37",
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

  // Aspect ratio: the wordmark is wider than tall. We pick widths
  // empirically for each size + variant to keep the cap-height
  // consistent with the rest of the nav.
  const widths: Record<NonNullable<LogoProps["size"]>, { mark: number; full: number }> = {
    sm: { mark: 110, full: 150 },
    md: { mark: 140, full: 190 },
    lg: { mark: 220, full: 300 },
  };
  const width = widths[size][variant];

  // Font size scaled to the cap-height of the chosen height.
  const fontSize = Math.round(height * 0.62);

  const content = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 100"
      role="img"
      aria-label={ariaLabel}
      height={height}
      width={(width / 100) * height}
      className={cn("flex-shrink-0", className)}
    >
      {/* Vertical accent bar — 1:4 aspect, fills the cap height. */}
      <rect
        x="6"
        y="6"
        width="6"
        height="88"
        rx="1"
        fill={colors.bar}
      />
      {/* "BLACK" — heavy, tight tracking, off-white. */}
      <text
        x="26"
        y="48"
        fontFamily="var(--font-display), 'Space Grotesk', 'Helvetica Neue', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="0.5"
        fill={colors.black}
      >
        BLACK
      </text>
      {/* "CAPITAL" — light, wide tracking, gold. */}
      <text
        x="26"
        y="84"
        fontFamily="var(--font-display), 'Space Grotesk', 'Helvetica Neue', sans-serif"
        fontSize={Math.round(fontSize * 0.62)}
        fontWeight="400"
        letterSpacing="3.5"
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
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-solid focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
      >
        {content}
      </Link>
    );
  }

  return content;
}
