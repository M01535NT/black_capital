import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionProps {
  id?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  spacing?: "default" | "tight" | "loose" | "none";
  containerWidth?: "default" | "wide";
}

const SPACING = {
  none: "",
  tight: "py-16 sm:py-20 lg:py-24",
  default: "py-24 sm:py-32 lg:py-32",
  loose: "py-32 sm:py-40 lg:py-56",
} as const;

const CONTAINER = {
  default: "max-w-[80rem] mx-auto px-6 sm:px-10 lg:px-16",
  wide: "max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16",
} as const;

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, label, children, className, contentClassName, spacing = "default", containerWidth = "default" },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={cn(
        "scroll-snap-section relative bg-background border-t border-white/[0.04]",
        SPACING[spacing],
        className,
      )}
    >
      <div
        className={cn(
          CONTAINER[containerWidth],
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
});
