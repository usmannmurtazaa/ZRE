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
        'text-center p-6 rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {icon && (
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div className="text-3xl font-serif font-bold text-card-foreground">{value}</div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}

export default StatCard
