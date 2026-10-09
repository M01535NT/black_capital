'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { propertyContactHref } from '@/lib/property-contact'

interface StickyContactBarProps {
  propertyId: string
  propertyTitle: string
  brand?: string
  priceLabel?: string
  metaLabel?: string
}

/** Always-available mobile handoff, with room for the device safe area. */
export function StickyContactBar({ propertyId, propertyTitle, brand, priceLabel, metaLabel }: StickyContactBarProps) {
  const [footerVisible, setFooterVisible] = useState(false)
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting))
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  if (footerVisible) return null
  return (
    <section aria-label="Contacto de la propiedad" className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#0A0A0A]/95 shadow-2xl backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-2.5 sm:px-10 sm:py-3">
        <div className="min-w-0">
          {priceLabel && <p className="truncate font-display text-lg font-extrabold leading-tight tabular-nums gold-ink sm:text-xl">{priceLabel}</p>}
          <p className="hidden truncate text-[0.72rem] text-white/50 sm:block">{propertyTitle}{metaLabel ? ` · ${metaLabel}` : ''}</p>
        </div>
        <Link href={propertyContactHref({ propertyId, propertyTitle, brand })} aria-label="Consultar esta propiedad" className="gold-gradient inline-flex min-h-11 shrink-0 items-center gap-2 px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] text-black transition-[filter] hover:brightness-110 sm:px-5">
          <MessageCircle className="size-3.5" aria-hidden="true" />
          Consultar
        </Link>
      </div>
    </section>
  )
}
