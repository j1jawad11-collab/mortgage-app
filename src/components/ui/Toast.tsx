import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

const styles: Record<ToastType, { bg: string; icon: string }> = {
  success: {
    bg: 'bg-emerald-600',
    icon: '✓',
  },
  error: {
    bg: 'bg-red-500',
    icon: '✕',
  },
  info: {
    bg: 'bg-primary-600',
    icon: 'i',
  },
  warning: {
    bg: 'bg-amber-500',
    icon: '!',
  },
}

export function Toast({ message, type = 'success', duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [duration, onClose])

  const { bg, icon } = styles[type]

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 ${bg} text-white rounded-xl shadow-2xl min-w-[280px] max-w-sm transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
        {icon}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        aria-label="Dismiss notification"
        className="text-white/70 hover:text-white transition-colors ml-2"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ── useToast hook ─────────────────────────────────────────────────────────────
import { useCallback, useRef } from 'react'

interface ToastState {
  id: number
  message: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const counterRef = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counterRef.current
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, showToast, removeToast }
}
