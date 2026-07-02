'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface StickyContactBarProps {
  propertyId: string
  agentPhone?: string | null
  agentEmail?: string | null
  agentWhatsapp?: string | null
  propertyTitle: string
  priceLabel?: string
  metaLabel?: string
}

/**
 * Barra de acción fija inferior (plantilla "Propiedad Editorial Black"):
 * precio + contexto a la izquierda, Llamar + WhatsApp a la derecha.
 * Visible en todos los viewports al pasar el hero.
 */
export function StickyContactBar({
  agentPhone,
  agentWhatsapp,
  propertyTitle,
  priceLabel,
  metaLabel,
}: StickyContactBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sin canales de contacto no hay barra: evita renderizar una franja vacía.
  const hasChannels = Boolean(agentWhatsapp || agentPhone)
  if (!hasChannels) return null

  const buildWhatsappUrl = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const formatted = cleaned.length === 10 ? `52${cleaned}` : cleaned
    return `https://wa.me/${formatted}?text=Hola,%20me%20interesa%20esta%20propiedad:%20${encodeURIComponent(propertyTitle)}`
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="border-t border-white/[0.08] bg-[#0A0A0A]/95 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-2.5 sm:px-10 sm:py-3 lg:px-16">
              <div className="min-w-0">
                {priceLabel && (
                  <p className="truncate font-display text-lg font-extrabold leading-tight tabular-nums gold-ink sm:text-xl">
                    {priceLabel}
                  </p>
                )}
                <p className="hidden truncate text-[0.72rem] text-white/50 sm:block">
                  {propertyTitle}
                  {metaLabel ? ` · ${metaLabel}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                {agentPhone && (
                  <a
                    href={`tel:${agentPhone}`}
                    className="inline-flex min-h-11 items-center gap-2 border border-white/[0.14] px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-[var(--color-accent)]"
                  >
                    <Phone className="size-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Llamar</span>
                    <span className="sr-only sm:hidden">Llamar</span>
                  </a>
                )}
                {agentWhatsapp && (
                  <a
                    href={buildWhatsappUrl(agentWhatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-gradient inline-flex min-h-11 items-center gap-2 px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] text-black transition-[filter] hover:brightness-110 sm:px-5"
                  >
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                    Agendar visita
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
