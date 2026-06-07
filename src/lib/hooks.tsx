import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/**
 * Hook to detect user's reduced motion preference
 * Use this to conditionally disable animations for accessibility
 */
export function useReducedMotion(): boolean {
  const prefersReduced = useFramerReducedMotion()
  return prefersReduced ?? false
}

interface AnimateIfAllowedProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wrapper that only animates if user hasn't requested reduced motion
 * Use this instead of motion.div to respect accessibility preferences
 */
export function AnimateIfAllowed({ children, className }: AnimateIfAllowedProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
