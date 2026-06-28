import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md',
        outline:
          'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // ── Luxury Gold variant ──────────────────────────────
        gold: 'bg-gold-500 text-brand-900 shadow-sm hover:bg-gold-600 hover:shadow-md dark:text-brand-900 dark:hover:bg-gold-600',
        // ── Outline Gold variant ────────────────────────────
        'outline-gold':
          'border border-gold-500/40 bg-transparent text-gold-600 hover:bg-gold-50 hover:border-gold-500 hover:text-gold-700 dark:text-gold-400 dark:hover:bg-gold-950/30 dark:hover:text-gold-300 dark:hover:border-gold-500',
        // ── Success variant ──────────────────────────────────
        success: 'bg-green-500 text-white shadow-sm hover:bg-green-600 hover:shadow-md',
        // ── Outline Success variant ──────────────────────────
        'outline-success':
          'border border-green-500/40 bg-transparent text-green-600 hover:bg-green-50 hover:border-green-500 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-950/30 dark:hover:text-green-300 dark:hover:border-green-500',
        // ── Earth / Warm variant ─────────────────────────────
        earth: 'bg-earth-500 text-white shadow-sm hover:bg-earth-600 hover:shadow-md',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-lg',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        xl: 'h-12 rounded-xl px-10 text-base',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
