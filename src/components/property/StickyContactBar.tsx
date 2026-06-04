'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StickyContactBarProps {
  propertyId: string
  agentPhone?: string | null
  agentEmail?: string | null
  agentWhatsapp?: string | null
  propertyTitle: string
}

export function StickyContactBar({
  propertyId,
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
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-pb"
        >
          <div className="bg-background-deep/95 backdrop-blur-xl border-t border-subtle shadow-2xl">
            <div className="flex items-center gap-2 p-3">
              {agentWhatsapp && (
                <a
                  href={buildWhatsappUrl(agentWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-md)] bg-gold text-dark font-semibold transition-colors hover:bg-gold/90"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {agentPhone && (
                <a
                  href={`tel:${agentPhone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-md)] bg-surface text-foreground font-semibold transition-colors hover:bg-surface-hover"
                >
                  <Phone className="w-5 h-5" />
                  <span>Llamar</span>
                </a>
              )}
              {agentEmail && (
                <a
                  href={`mailto:${agentEmail}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-md)] bg-surface text-foreground font-semibold transition-colors hover:bg-surface-hover"
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
