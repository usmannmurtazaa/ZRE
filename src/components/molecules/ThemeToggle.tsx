import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/helpers/cn'

export const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <motion.div
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="relative inline-flex"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          'relative h-10 w-10 rounded-xl transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.75 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-[1.25rem] w-[1.25rem]" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.75 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-[1.25rem] w-[1.25rem]" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

export default ThemeToggle
