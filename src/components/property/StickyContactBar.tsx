'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface StickyContactBarProps {
  propertyId: string
  agentPhone?: string | null
  agentEmail?: string | null
  agentWhatsapp?: string | null
  propertyTitle: string
}

export function StickyContactBar({
  agentPhone,
  agentEmail,
  agentWhatsapp,
  propertyTitle,
}: StickyContactBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sin canales de contacto no hay barra: evita renderizar una franja vacía.
  const hasChannels = Boolean(agentWhatsapp || agentPhone || agentEmail)
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/[0.06] shadow-2xl">
            <div className="flex items-center gap-2 p-3">
              {agentWhatsapp && (
                <a
                  href={buildWhatsappUrl(agentWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brushed-gold flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 premium-cta transition-all duration-300 hover:brightness-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {agentPhone && (
                <a
                  href={`tel:${agentPhone}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-body-sm text-white transition-all duration-300 hover:bg-white/[0.08]"
                >
                  <Phone className="w-5 h-5" />
                  <span>Llamar</span>
                </a>
              )}
              {agentEmail && (
                <a
                  href={`mailto:${agentEmail}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-body-sm text-white transition-all duration-300 hover:bg-white/[0.08]"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
