// components/AlertBanner.tsx
import { Alert } from '@shared/types/alert'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type AlertBannerProps = {
  alert: Alert | null
  duration?: number // in ms
}

export default function AlertBanner({ alert, duration = 5000 }: AlertBannerProps) {
  const [visible, setVisible] = useState(!!alert)

  useEffect(() => {
    if (alert) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), duration)
      return () => clearTimeout(timer)
    }
  }, [alert, duration])

  return (
    <AnimatePresence>
      {visible && alert && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-xl shadow-lg"
        >
          {alert.title}
          {alert.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
