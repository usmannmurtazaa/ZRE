import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search, Plus, MapPin, Command, Calendar, Clock, Activity } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

interface Props {
  onSearchOpen: () => void
  period: '7d' | '30d' | '90d' | 'all'
  setPeriod: (p: '7d' | '30d' | '90d' | 'all') => void
}

export default function DashboardHeader({ onSearchOpen, period, setPeriod }: Props) {
  const welcomeMsg = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  })()

  const currentDate = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const currentTime = new Date().toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold">{welcomeMsg}, Team</h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {currentDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentTime}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Last sync just now
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-muted rounded-lg hover:bg-muted/80 transition"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="ml-2 hidden sm:inline-flex items-center rounded border border-border px-1.5 text-xs text-muted-foreground">
              <Command className="h-3 w-3 mr-0.5" />K
            </kbd>
          </button>
          <Link to="/admin/properties/new">
            <Button size="sm" className="gap-2 rounded-xl shadow-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">+ Property</span>
            </Button>
          </Link>
          <Link to="/admin/areas">
            <Button size="sm" variant="outline" className="gap-2 rounded-xl shadow-sm">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Add Area</span>
              <span className="sm:hidden">+ Area</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Date period filter – scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['7d', '30d', '90d', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg border transition whitespace-nowrap',
              period === p
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:bg-muted'
            )}
          >
            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
          </button>
        ))}
      </div>
    </div>
  )
}
