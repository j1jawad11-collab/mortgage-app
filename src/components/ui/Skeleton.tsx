import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  delay?: number
}

export function Skeleton({ className = '', delay = 0 }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 0.7 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.8,
        ease: "easeInOut",
        delay
      }}
      className={`bg-white/5 rounded-xl ${className}`}
    />
  )
}
