import { ReactNode } from 'react'
import { cn } from '@/lib/helpers/cn'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  className?: string
}

export const StatCard = ({ label, value, icon, className }: StatCardProps) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center rounded-2xl border border-white/20 dark:border-white/10',
        'bg-white/50 dark:bg-black/30 backdrop-blur-md p-6 shadow-lg',
        'transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
        className
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div className="font-serif text-4xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}

export default StatCard
