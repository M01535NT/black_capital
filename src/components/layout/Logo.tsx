import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * `mark` renders the monogram badge only (square with the BC monogram).
   * Use inside compact UI (header, button leading slot, etc).
   *
   * `full` renders the monogram + "BLACK CORPORATIVO" wordmark beside it.
   * Use in footer, auth pages, email signatures, and any layout that has
   * room for ~160px of width.
   */
  variant?: "mark" | "full";
  /**
   * Visual height in pixels. Width follows the viewBox aspect ratio.
   * `mark` is 1:1, `full` is 3.6:1. Defaults to a comfortable 36/44.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Color of the strokes/fills. `gold` paints the whole logo in brand
   * gold; `current` inherits the text color of the parent. Default `gold`
   * keeps the brand consistent even on dark or light surfaces.
   */
  tone?: "gold" | "current";
  /** Optional href. If provided, wraps the logo in a Link. */
  href?: string;
  /** Additional classes for the outer wrapper. */
  className?: string;
  /** Accessible label override. Defaults to "Black Corporativo". */
  ariaLabel?: string;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, { mark: number; full: number }> = {
  sm: { mark: 28, full: 33 },
  md: { mark: 36, full: 44 },
  lg: { mark: 56, full: 66 },
};

/**
 * Black Corporativo brand mark.
 *
 * Inlined SVG instead of next/image + /public/*.svg. Two reasons:
 *
 * 1. The original stroke + text colors are `currentColor`, which only
 *    works for SVGs that live in the DOM (not for `<img src>`). The
 *    `tone` prop toggles which class paints the SVG.
 * 2. Inline SVG ships zero extra HTTP requests and the browser can paint
 *    it on the very first frame — important for the LCP candidate in the
 *    sticky header.
 */
export function Logo({
  variant = "mark",
  size = "md",
  tone = "gold",
  href,
  className,
  ariaLabel = "Black Corporativo",
}: LogoProps) {
  const height = sizeMap[size][variant];
  const toneClass = tone === "gold" ? "text-gold-solid" : "text-current";

  const content =
    variant === "mark" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        role="img"
        aria-label={ariaLabel}
        height={height}
        width={height}
        className={cn("flex-shrink-0", toneClass, className)}
      >
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="50"
          y="72"
          fontFamily="Georgia, 'Times New Roman', 'Playfair Display', serif"
          fontSize="60"
          fontWeight="700"
          fontStyle="italic"
          textAnchor="middle"
          fill="currentColor"
          letterSpacing="-2"
        >
          BC
        </text>
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 360 100"
        role="img"
        aria-label={ariaLabel}
        height={height}
        width={height * 3.6}
        className={cn("flex-shrink-0", toneClass, className)}
      >
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="50"
          y="72"
          fontFamily="Georgia, 'Times New Roman', 'Playfair Display', serif"
          fontSize="60"
          fontWeight="700"
          fontStyle="italic"
          textAnchor="middle"
          fill="currentColor"
          letterSpacing="-2"
        >
          BC
        </text>
        <text
          x="116"
          y="52"
          fontFamily="Montserrat, 'Helvetica Neue', sans-serif"
          fontSize="22"
          fontWeight="800"
          letterSpacing="3"
          fill="currentColor"
        >
          BLACK
        </text>
        <line
          x1="116"
          y1="62"
          x2="200"
          y2="62"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <text
          x="116"
          y="78"
          fontFamily="Montserrat, 'Helvetica Neue', sans-serif"
          fontSize="22"
          fontWeight="500"
          letterSpacing="8"
          fill="currentColor"
          opacity="0.85"
        >
          CORPORATIVO
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
