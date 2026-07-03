"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Maximize2, MapPin } from "lucide-react";
import { formatShortPrice, formatArea } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getPropertyPlaceholderImage } from "@/lib/property-placeholder-image";
import type { PropertyCardData } from "@/components/property/PropertyCard";
import { STATUS_OPTIONS } from "./constants";

export function PropertyRow({ property }: { property: PropertyCardData }) {
  const href = property.isPlaceholder
    ? `/contacto?interes=${encodeURIComponent(property.property_use.toLowerCase())}`
    : `/inventario/${property.slug || property.id}`;

  const isAvailable = (property.status || "Available") === "Available";
  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === property.status)?.label || "Disponible";
  const typeUse = property.property_type
    ? `${property.property_type} · ${property.property_use}`
    : property.property_use;

  const hasCover = Boolean(property.cover_image);
  const fallback = getPropertyPlaceholderImage(property.property_use);
  const imageSrc = property.cover_image || fallback.src;
  const imageAlt = hasCover ? `Fotografía de ${property.title}` : fallback.alt;

  return (
    <article className="group flex flex-col border border-white/[0.09] bg-white/[0.02] transition-[border-color] duration-200 ease-out hover:border-[var(--color-accent)]/45 sm:flex-row">
      <Link
        href={href}
        aria-label={`Ver detalles de ${property.title}`}
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-56 lg:w-72"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 18rem"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent" />
        <span className="absolute left-3 top-3 border border-[var(--color-accent)]/25 bg-black/45 px-2.5 py-1 property-tag-type gold-ink backdrop-blur-md">
          {property.business_type}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="property-metadata-type text-white/45">{typeUse}</span>
            <span className={cn("property-tag-type", isAvailable ? "gold-ink" : "text-white/45")}>
              {statusLabel}
            </span>
          </div>
          <Link href={href} className="mt-1.5 block">
            <h3 className="line-clamp-1 font-display text-display-3 font-semibold leading-tight text-white transition-colors duration-200 ease-out group-hover:text-[var(--color-accent)]">
              {property.title}
            </h3>
          </Link>
          {property.address && (
            <p className="mt-2 inline-flex items-center gap-1.5 property-metadata-type text-white/45">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
              <span className="truncate">{property.address}</span>
            </p>
          )}
          {(property.m2_terrain || property.m2_construction) && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 property-metadata-type text-white/60">
              {property.m2_terrain ? (
                <span className="inline-flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                  {formatArea(property.m2_terrain, "T")}
                </span>
              ) : null}
              {property.m2_construction ? (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                  {formatArea(property.m2_construction, "C")}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <Link
          href={href}
          className="flex shrink-0 items-end justify-between gap-4 border-t border-white/[0.07] pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right"
        >
          <p className="property-price-type gold-ink">
            {property.isPlaceholder
              ? "Precio bajo consulta"
              : formatShortPrice(property.price, property.currency, property.business_type)}
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 property-tag-type text-white/65 transition-colors duration-200 ease-out group-hover:text-[var(--color-accent)]">
            {property.isPlaceholder ? "Solicitar" : "Ver ficha"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </article>
  );
}
