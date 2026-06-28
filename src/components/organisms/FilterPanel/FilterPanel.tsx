import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { PROPERTY_TYPES, AREAS, FEATURES } from '@/lib/constants'
import { cn } from '@/lib/helpers/cn'
import { Filter, RotateCcw, ChevronDown, X } from 'lucide-react'

interface FilterPanelProps {
  filters: {
    type: string[]
    area: string[]
    minPrice: number
    maxPrice: number
    sortBy: string
  }
  onApply: (filters: any) => void
  onClear?: () => void
  className?: string
}

export const FilterPanel = ({ filters, onApply, onClear, className }: FilterPanelProps) => {
  const [type, setType] = useState<string[]>(filters.type || [])
  const [area, setArea] = useState<string[]>(filters.area || [])
  const [minPrice, setMinPrice] = useState<number>(filters.minPrice || 0)
  const [maxPrice, setMaxPrice] = useState<number>(filters.maxPrice || 1_000_000_000)
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || 'newest')
  const [features, setFeatures] = useState<string[]>([])

  // Collapsible section state
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Format PKR for display
  const formatPrice = (value: number) => {
    if (value >= 10_000_000) return `PKR ${(value / 10_000_000).toFixed(1)}Cr`
    if (value >= 100_000) return `PKR ${(value / 100_000).toFixed(1)}Lac`
    return `PKR ${value.toLocaleString()}`
  }

  // Active filter count
  const activeFilterCount = useMemo(
    () =>
      type.length +
      area.length +
      features.length +
      (minPrice > 0 || maxPrice < 1_000_000_000 ? 1 : 0),
    [type, area, features, minPrice, maxPrice]
  )

  const toggleCollapse = useCallback((section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }, [])

  const isCollapsed = (section: string) => collapsedSections.has(section)

  const handleTypeToggle = (value: string) => {
    setType((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]))
  }

  const handleAreaToggle = (value: string) => {
    setArea((prev) => (prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]))
  }

  const handleFeatureToggle = (value: string) => {
    setFeatures((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    )
  }

  const handleApply = () => {
    onApply({
      type,
      area,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 1_000_000_000 ? maxPrice : undefined,
      sortBy,
      features,
    })
  }

  const handleClear = () => {
    setType([])
    setArea([])
    setMinPrice(0)
    setMaxPrice(1_000_000_000)
    setSortBy('newest')
    setFeatures([])
    onClear?.()
  }

  // Section wrapper component for consistent collapsing
  const CollapsibleSection = ({
    id,
    title,
    activeCount,
    children,
  }: {
    id: string
    title: string
    activeCount?: number
    children: React.ReactNode
  }) => {
    const collapsed = isCollapsed(id)
    return (
      <div className="border-b border-border last:border-b-0 pb-4">
        <button
          type="button"
          onClick={() => toggleCollapse(id)}
          className="flex w-full items-center justify-between py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg px-1 -mx-1"
          aria-expanded={!collapsed}
          aria-controls={`section-${id}`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">{title}</span>
            {activeCount !== undefined && activeCount > 0 && (
              <Badge variant="subtle" className="h-5 px-1.5 text-xs">
                {activeCount}
              </Badge>
            )}
          </div>
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              id={`section-${id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-1 pb-2">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-sm',
        className
      )}
      aria-label="Property filters"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gold-500" />
          <h2 className="font-serif text-lg font-semibold text-card-foreground">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="subtle" className="text-xs font-medium">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Filter sections */}
      <div className="px-5">
        {/* Property Type */}
        <CollapsibleSection id="type" title="Property Type" activeCount={type.length}>
          <div className="space-y-1.5">
            {PROPERTY_TYPES.map((t) => (
              <label
                key={t.value}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150',
                  'hover:bg-primary/5 dark:hover:bg-primary/10',
                  type.includes(t.value) && 'bg-primary/10 dark:bg-primary/15'
                )}
              >
                <Checkbox
                  checked={type.includes(t.value)}
                  onCheckedChange={() => handleTypeToggle(t.value)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                />
                <span className="text-sm font-medium text-foreground">{t.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Area */}
        <CollapsibleSection id="area" title="Location" activeCount={area.length}>
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30 pr-1">
            {AREAS.map((a) => (
              <label
                key={a}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150',
                  'hover:bg-primary/5 dark:hover:bg-primary/10',
                  area.includes(a) && 'bg-primary/10 dark:bg-primary/15'
                )}
              >
                <Checkbox
                  checked={area.includes(a)}
                  onCheckedChange={() => handleAreaToggle(a)}
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                />
                <span className="text-sm font-medium text-foreground">{a}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection
          id="price"
          title="Price Range"
          activeCount={minPrice > 0 || maxPrice < 1_000_000_000 ? 1 : 0}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">Min</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">Max</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={maxPrice === 1_000_000_000 ? '' : maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || 1_000_000_000)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <Slider
              min={0}
              max={1_000_000_000}
              step={500_000}
              value={[minPrice, maxPrice]}
              onValueChange={([min, max]) => {
                setMinPrice(min ?? 0)
                setMaxPrice(max ?? 1_000_000_000)
              }}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground text-center">
              {formatPrice(minPrice)} – {maxPrice >= 1_000_000_000 ? 'Any' : formatPrice(maxPrice)}
            </p>
          </div>
        </CollapsibleSection>

        {/* Sort By */}
        <CollapsibleSection id="sort" title="Sort By">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
              <SelectItem value="size-asc">Size: Small → Large</SelectItem>
              <SelectItem value="size-desc">Size: Large → Small</SelectItem>
            </SelectContent>
          </Select>
        </CollapsibleSection>

        {/* Features */}
        <CollapsibleSection id="features" title="Features" activeCount={features.length}>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFeatureToggle(f)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  features.includes(f)
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30'
                    : 'bg-muted text-muted-foreground border border-border hover:border-muted-foreground/30 hover:bg-muted/80'
                )}
              >
                {features.includes(f) && <X className="h-3 w-3" />}
                {f}
              </button>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-5 py-5 pt-3">
        <Button
          onClick={handleApply}
          className="flex-1 h-11 font-semibold text-sm shadow-sm hover:shadow-md transition-shadow"
        >
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClear} className="h-11 font-medium text-sm">
          Clear All
        </Button>
      </div>
    </motion.aside>
  )
}

export default FilterPanel
