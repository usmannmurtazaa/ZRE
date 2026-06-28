import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import type { ReactNode } from 'react'

interface KpiCardProps {
  title: string
  value: number | string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  /** Optional description below the value */
  description?: string
  /** Click handler to make the card interactive */
  onClick?: () => void
}

/**
 * KpiCard – premium key performance indicator card with
 * subtle entrance animation, trend indicator, and hover elevation.
 *
 * Fully theme‑aware – works flawlessly in light & dark modes.
 */
export const KpiCard = ({
  title,
  value,
  icon,
  trend,
  className,
  description,
  onClick,
}: KpiCardProps) => {
  // Format numeric values with locale string
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-PK') : value

  const isInteractive = typeof onClick === 'function'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={isInteractive ? { y: -2 } : undefined}
      onClick={onClick}
      role={isInteractive ? 'button' : 'status'}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      aria-label={`${title}: ${formattedValue}${trend ? `, ${trend.isPositive ? 'up' : 'down'} ${Math.abs(trend.value)}%` : ''}`}
      className={cn(
        'group relative flex items-start justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300',
        'hover:shadow-card hover:border-gold-500/40',
        isInteractive && 'cursor-pointer',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {title}
        </p>

        {/* Value */}
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-card-foreground">
          {formattedValue}
        </p>

        {/* Optional description */}
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}

        {/* Trend indicator */}
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>

      {/* Icon */}
      {icon && (
        <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          {icon}
        </div>
      )}
    </motion.div>
  )
}

export default KpiCard
