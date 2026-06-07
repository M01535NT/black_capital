'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
  description?: string
  variant?: 'icon' | 'pill'
  className?: string
}

export function ShareButton({
  title,
  description,
  variant = 'icon',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    // Try Web Share API first (mobile native share sheet)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
        return
      } catch (err) {
        // User cancelled or error, fall through to clipboard
        if ((err as Error).name === 'AbortError') return
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Enlace copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'
  
  if (variant === 'pill') {
    return (
      <button
        onClick={handleShare}
        className={`${baseClasses} px-4 py-2 rounded-full bg-surface hover:bg-surface-hover text-sm text-foreground border border-subtle ${className}`}
        aria-label="Compartir propiedad"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copiado
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Compartir
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleShare}
      className={`${baseClasses} w-10 h-10 rounded-lg bg-surface hover:bg-surface-hover text-foreground border border-subtle ${className}`}
      aria-label="Compartir propiedad"
      title="Compartir"
    >
      {copied ? (
        <Check className="w-5 h-5 text-gold" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  )
}
