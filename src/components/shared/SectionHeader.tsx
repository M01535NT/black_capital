import { Eyebrow } from "@/components/shared/eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const TITLE_CLASS =
  "text-display-2 font-light text-white leading-display tracking-headline";
const DESC_CLASS =
  "text-body-fluid-sm text-white/65 leading-relaxed font-light max-w-xl";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-14 sm:mb-20",
        align === "center" ? "max-w-2xl mx-auto text-center" : "max-w-2xl",
        className,
      )}
    >
      <Eyebrow label={eyebrow} className="mb-4" />
      <h2 className={cn(TITLE_CLASS, "mb-5")}>{title}</h2>
      {description && <p className={DESC_CLASS}>{description}</p>}
    </div>
  );
}
