import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?: 'gray' | 'orange' | 'green' | 'blue' | 'red' | 'yellow' | 'purple'
  className?: string
}

const colorClasses = {
  gray: 'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
}

export function Badge({ children, color = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  )
}
