import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: string // e.g. "500+", "$200M+", "4.9★"
  className?: string
  duration?: number
}

// Extracts numeric values and preserves non-numeric prefixes/suffixes.
function parseCounterString(str: string) {
  const match = str.match(/^([^0-9.-]*)([0-9.,]+)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: str }
  
  const prefix = match[1]
  const numStr = match[2].replace(/,/g, '')
  const suffix = match[3]
  
  return { prefix, num: parseFloat(numStr), suffix }
}

export function AnimatedCounter({ value, className = '', duration = 1500 }: AnimatedCounterProps) {
  const { prefix, num, suffix } = parseCounterString(value)
  const isFloat = num % 1 !== 0
  
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function: easeOutExpo
      const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(num * easing)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    
    window.requestAnimationFrame(step)
  }, [isVisible, num, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{isFloat ? count.toFixed(1) : Math.floor(count)}{suffix}
    </span>
  )
}
