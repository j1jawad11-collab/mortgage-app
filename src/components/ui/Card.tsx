import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'article' | 'section' | 'li'
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className = '', hover = false, padding = 'md', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={`card ${paddings[padding]} ${hover ? 'hover-lift cursor-pointer' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
