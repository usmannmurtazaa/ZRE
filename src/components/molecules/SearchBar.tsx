import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  /** Debounce delay in ms (0 = no debounce, triggers onSubmit only). Default 0. */
  debounceDelay?: number
}

export const SearchBar = ({
  onSearch,
  placeholder = 'Search properties, areas...',
  value,
  onChange,
  className,
  debounceDelay = 0,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>()

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value)
    }
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    inputRef.current?.focus()
    onSearch('')
    onChange?.({
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    onSearch(localValue.trim())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange?.(e)

    if (debounceDelay > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        onSearch(newValue.trim())
      }, debounceDelay)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        'flex w-full max-w-3xl items-center gap-0 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-md p-1.5 shadow-sm transition-all duration-300 focus-within:shadow-card focus-within:border-brand-300/70',
        className
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/70 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 h-11 pl-11 pr-10 border-0 bg-transparent text-base text-neutral-800 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Search"
        />
        <AnimatePresence>
          {localValue.length > 0 && (
            <motion.button
              type="button"
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Button
        type="submit"
        size="default"
        className="h-11 px-5 rounded-xl shadow-sm hover:shadow-md font-semibold tracking-tight transition-all duration-200 bg-brand-500 hover:bg-brand-600 text-white"
      >
        <Search className="w-4 h-4 mr-2 hidden sm:inline" />
        Search
      </Button>
    </motion.form>
  )
}

export default SearchBar
