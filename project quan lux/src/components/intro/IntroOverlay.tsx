import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface IntroOverlayProps {
  onComplete: () => void
}

export const IntroOverlay = ({ onComplete }: IntroOverlayProps) => {
  const [logoSrc, setLogoSrc] = useState('./quanlux-logo.png')

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <motion.div
        className="relative flex h-[340px] w-[460px] flex-col items-center justify-center overflow-hidden rounded-[36px] border border-gold-400/40 bg-gradient-to-br from-black via-[#0f1118] to-black shadow-luxe"
        style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
        initial={{ opacity: 0, rotateX: 28, rotateY: -18, scale: 0.8 }}
        animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute inset-0 rounded-[36px] border border-gold-300/30"
          initial={{ opacity: 0, rotateZ: -10 }}
          animate={{ opacity: [0, 0.85, 0.2], rotateZ: [0, 10, -8] }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,176,38,0.18),rgba(0,0,0,0.6),rgba(0,0,0,0.95))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div
          className="relative flex h-48 w-48 items-center justify-center"
          initial={{ opacity: 0, scale: 0.8, rotateZ: -8 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ delay: 0.25, duration: 1.3, ease: 'easeOut' }}
        >
          <div className="absolute h-full w-full rounded-full border border-gold-300/70 shadow-[0_0_45px_rgba(253,176,38,0.35)]" />
          <div className="absolute h-[86%] w-[86%] rounded-full border border-gold-400/40" />
          <motion.div
            className="absolute h-[120%] w-[120%] rounded-full border border-gold-500/20"
            animate={{ rotateZ: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          <motion.img
            src={logoSrc}
            onError={() => setLogoSrc('./quanlux-logo.svg')}
            alt="Quan Lux"
            className="h-32 w-32 rounded-full border border-white/10 bg-black/60 object-contain"
            initial={{ scale: 0.85 }}
            animate={{ scale: [0.85, 1, 0.96, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.p
          className="text-xs uppercase tracking-[0.5em] text-gold-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Quan Lux Africa
        </motion.p>
        <motion.h1
          className="mt-4 text-center font-display text-3xl text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          Chauffeur Intelligence
        </motion.h1>
        <motion.p
          className="mt-3 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
        >
          Luxury mobility, orchestrated with precision.
        </motion.p>
        <motion.button
          onClick={onComplete}
          className="mt-6 rounded-full border border-gold-400/60 bg-gold-500/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-gold-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Enter
        </motion.button>
      </motion.div>
    </div>
  )
}
