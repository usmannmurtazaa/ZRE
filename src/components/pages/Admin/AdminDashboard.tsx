import { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '@/hooks/useProperties'
import { useAllLeads } from '@/hooks/useLeads'
import { useUsers } from '@/hooks/useUsers'
import { useAreas } from '@/hooks/useAreas'
import { Skeleton } from '@/components/ui/skeleton'
import { Seo } from '@/components/atoms/Seo'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'
import { X, Search, Command, Menu } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import type { Lead } from '@/types'
import type { Property } from '@/types/property'

// Lazy-loaded content sections
const DashboardOverview = lazy(() => import('./DashboardOverview'))
const DashboardAnalytics = lazy(() => import('./DashboardAnalytics'))
const PropertyInsights = lazy(() => import('./PropertyInsights'))
const LeadInsights = lazy(() => import('./LeadInsights'))
const AreaInsights = lazy(() => import('./AreaInsights'))
const RecentActivity = lazy(() => import('./RecentActivity'))
const QuickActions = lazy(() => import('./QuickActions'))

type Section =
  | 'overview'
  | 'analytics'
  | 'property-insights'
  | 'lead-insights'
  | 'area-insights'
  | 'recent-activity'
  | 'quick-actions'

// ----------------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------------
function isWithinDays(date: Date, days: number): boolean {
  const now = new Date()
  const past = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days)
  return date >= past
}

function groupByMonth<T extends { createdAt: Date }>(
  items: T[]
): { month: string; count: number }[] {
  const map = new Map<string, number>()
  items.forEach((item) => {
    const d = item.createdAt
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) ?? 0) + 1)
  })
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))
    .slice(-12)
}

function formatMonthKey(key: string): string {
  const [y, m] = key.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleDateString('en-PK', { month: 'short', year: '2-digit' })
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
export default function AdminDashboard() {
  const navigate = useNavigate()

  // ----- Firestore data hooks -----
  const { data: propertiesData, isLoading: propsLoading } = useProperties({ limit: 200, page: 1 })
  const { data: leads, isLoading: leadsLoading } = useAllLeads()
  const { data: users, isLoading: usersLoading } = useUsers()
  const { data: areas, isLoading: areasLoading } = useAreas()

  const properties = propertiesData?.items ?? []
  const allLeads = leads ?? []
  const allUsers = users ?? []
  const allAreas = areas ?? []

  // ----- UI State -----
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ----- Date filtering -----
  const filterByPeriod = useCallback(
    <T extends { createdAt: Date }>(items: T[]): T[] => {
      if (period === 'all') return items
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      return items.filter((item) => isWithinDays(item.createdAt, days))
    },
    [period]
  )

  const filteredProperties = useMemo(() => filterByPeriod(properties), [properties, filterByPeriod])
  const filteredLeads = useMemo(() => filterByPeriod(allLeads), [allLeads, filterByPeriod])
  const filteredUsers = useMemo(() => filterByPeriod(allUsers), [allUsers, filterByPeriod])
  const filteredAreas = useMemo(() => filterByPeriod(allAreas), [allAreas, filterByPeriod])

  // ----- Derived metrics -----
  const activeProperties = useMemo(
    () => filteredProperties.filter((p) => p.status !== 'sold' && p.status !== 'rented').length,
    [filteredProperties]
  )
  const soldProperties = useMemo(
    () => filteredProperties.filter((p) => p.status === 'sold').length,
    [filteredProperties]
  )
  const featuredProperties = useMemo(
    () => filteredProperties.filter((p) => p.isFeatured).length,
    [filteredProperties]
  )
  const newLeads = useMemo(
    () => filteredLeads.filter((l) => l.status === 'new').length,
    [filteredLeads]
  )
  const leadsToday = useMemo(
    () => filteredLeads.filter((l) => isWithinDays(l.createdAt, 1)).length,
    [filteredLeads]
  )
  const thisMonthLeads = useMemo(() => {
    const now = new Date()
    return filteredLeads.filter(
      (l) =>
        l.createdAt.getMonth() === now.getMonth() && l.createdAt.getFullYear() === now.getFullYear()
    ).length
  }, [filteredLeads])

  const portfolioValue = useMemo(
    () => filteredProperties.reduce((sum, p) => sum + (p.price || 0), 0),
    [filteredProperties]
  )
  const avgPrice = useMemo(() => {
    const active = filteredProperties.filter((p) => p.status !== 'sold')
    return active.length
      ? Math.round(active.reduce((sum, p) => sum + (p.price || 0), 0) / active.length)
      : 0
  }, [filteredProperties])

  // Property insights
  const highestPriceProp = useMemo(
    () =>
      filteredProperties.reduce(
        (max, p) => (p.price > (max?.price || 0) ? p : max),
        undefined as Property | undefined
      ),
    [filteredProperties]
  )
  const lowestPriceProp = useMemo(
    () =>
      filteredProperties.reduce(
        (min, p) => (p.price < (min?.price || Infinity) ? p : min),
        undefined as Property | undefined
      ),
    [filteredProperties]
  )
  const oldestUnsoldProp = useMemo(() => {
    const unsold = filteredProperties.filter((p) => p.status !== 'sold' && p.status !== 'rented')
    return unsold.length
      ? unsold.reduce((old, p) => (p.createdAt < old.createdAt ? p : old))
      : undefined
  }, [filteredProperties])

  // Area insights
  const areaWithMostProps = useMemo(() => {
    const map = new Map<string, number>()
    filteredProperties.forEach((p) => map.set(p.area, (map.get(p.area) || 0) + 1))
    if (map.size === 0) return null
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
    const first = sorted[0]
    if (!first) return null
    return { name: first[0], count: first[1] }
  }, [filteredProperties])

  const areaWithHighestAvg = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>()
    filteredProperties.forEach((p) => {
      if (!p.area) return
      const cur = map.get(p.area) || { total: 0, count: 0 }
      cur.total += p.price || 0
      cur.count += 1
      map.set(p.area, cur)
    })
    if (map.size === 0) return null
    let bestArea = ''
    let bestAvg = 0
    map.forEach((v, k) => {
      const avg = v.total / v.count
      if (avg > bestAvg) {
        bestAvg = avg
        bestArea = k
      }
    })
    return { name: bestArea, avg: Math.round(bestAvg) }
  }, [filteredProperties])

  // Lead status distribution
  const leadStatusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    filteredLeads.forEach((l) => (map[l.status] = (map[l.status] ?? 0) + 1))
    return map
  }, [filteredLeads])

  // Monthly charts
  const monthlyLeads = useMemo(() => groupByMonth(filteredLeads), [filteredLeads])
  const monthlyProperties = useMemo(() => groupByMonth(filteredProperties), [filteredProperties])

  // Property status distribution
  const propertyStatusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    filteredProperties.forEach((p) => (map[p.status] = (map[p.status] ?? 0) + 1))
    return map
  }, [filteredProperties])

  // Properties by area
  const propertyByArea = useMemo(() => {
    const map: Record<string, number> = {}
    filteredProperties.forEach((p) => {
      const a = p.area || 'Unknown'
      map[a] = (map[a] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filteredProperties])

  // Property type distribution
  const residentialCount = useMemo(
    () => filteredProperties.filter((p) => p.type === 'residential').length,
    [filteredProperties]
  )
  const commercialCount = useMemo(
    () => filteredProperties.filter((p) => p.type === 'commercial').length,
    [filteredProperties]
  )
  const industrialCount = useMemo(
    () => filteredProperties.filter((p) => p.type === 'industrial').length,
    [filteredProperties]
  )

  // Activity feed
  const activityFeed = useMemo(() => {
    const feed: {
      id: string
      type: string
      action: string
      label: string
      timestamp: Date
      status?: string
      link?: string
    }[] = []

    filteredProperties.forEach((p) => {
      feed.push({
        id: `prop-${p.propertyId}`,
        type: 'property',
        action: 'Property Added',
        label: p.title,
        timestamp: p.createdAt,
        link: `/admin/properties/${p.propertyId}/edit`,
      })
      if (p.updatedAt > p.createdAt) {
        feed.push({
          id: `prop-upd-${p.propertyId}`,
          type: 'property',
          action: 'Property Updated',
          label: p.title,
          timestamp: p.updatedAt,
          status: p.status,
          link: `/admin/properties/${p.propertyId}/edit`,
        })
      }
    })

    filteredLeads.forEach((l) => {
      feed.push({
        id: `lead-${l.leadId}`,
        type: 'lead',
        action: 'New Lead',
        label: l.name,
        timestamp: l.createdAt,
        status: l.status,
        link: `/admin/leads/${l.leadId}`,
      })
    })

    filteredUsers.forEach((u) => {
      feed.push({
        id: `user-${u.uid}`,
        type: 'user',
        action: 'User Registered',
        label: u.displayName || u.email || 'Unknown User',
        timestamp: u.createdAt,
        link: `/admin/users`,
      })
    })

    // Areas: use areaId, name, or fallback to index
    filteredAreas.forEach((a, index) => {
      const areaId = (a as any).areaId || a.name || `area-fallback-${index}`
      feed.push({
        id: `area-${areaId}`,
        type: 'area',
        action: 'Area Added',
        label: a.name || 'Unnamed Area',
        timestamp: (a as any).createdAt || new Date(),
        link: `/admin/areas`,
      })
    })

    feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    return feed.slice(0, 15)
  }, [filteredProperties, filteredLeads, filteredUsers, filteredAreas])

  // Global search
  const searchData = useMemo(() => {
    const items: { label: string; link: string; type: string }[] = []
    properties.forEach((p) =>
      items.push({
        label: p.title,
        link: `/admin/properties/${p.propertyId}/edit`,
        type: 'Property',
      })
    )
    allLeads.forEach((l) =>
      items.push({ label: l.name, link: `/admin/leads/${l.leadId}`, type: 'Lead' })
    )
    allUsers.forEach((u) =>
      items.push({
        label: u.displayName || u.email || 'Unknown User',
        link: `/admin/users`,
        type: 'User',
      })
    )
    allAreas.forEach((a) => items.push({ label: a.name, link: `/admin/areas`, type: 'Area' }))
    return items
  }, [properties, allLeads, allUsers, allAreas])

  const filteredSearch = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return searchData.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8)
  }, [searchData, searchQuery])

  // ⌘K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const isLoading = propsLoading || leadsLoading || usersLoading || areasLoading

  // Props for each section
  const sectionProps = {
    period,
    setPeriod,
    isLoading,
    filteredProperties,
    filteredLeads,
    filteredUsers,
    filteredAreas,
    activeProperties,
    soldProperties,
    featuredProperties,
    newLeads,
    leadsToday,
    thisMonthLeads,
    portfolioValue,
    avgPrice,
    highestPriceProp,
    lowestPriceProp,
    oldestUnsoldProp,
    areaWithMostProps,
    areaWithHighestAvg,
    leadStatusCounts,
    monthlyLeads,
    monthlyProperties,
    propertyStatusCounts,
    propertyByArea,
    residentialCount,
    commercialCount,
    industrialCount,
    activityFeed,
    allProperties: properties,
    allLeads,
    allUsers,
    allAreas,
  }

  return (
    <>
      <Seo title="Admin Dashboard" description="Platform administration" noindex nofollow />

      <div className="flex h-full min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          className="hidden lg:flex"
        />

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border lg:hidden"
              >
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <DashboardSidebar
                  activeSection={activeSection}
                  onSectionChange={(section) => {
                    setActiveSection(section)
                    setMobileSidebarOpen(false)
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with mobile hamburger */}
          <header className="border-b border-border bg-card px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Dashboard
              </h1>
            </div>
            <DashboardHeader
              onSearchOpen={() => setSearchOpen(true)}
              period={period}
              setPeriod={setPeriod}
            />
          </header>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
                  {activeSection === 'overview' && <DashboardOverview {...sectionProps} />}
                  {activeSection === 'analytics' && <DashboardAnalytics {...sectionProps} />}
                  {activeSection === 'property-insights' && <PropertyInsights {...sectionProps} />}
                  {activeSection === 'lead-insights' && <LeadInsights {...sectionProps} />}
                  {activeSection === 'area-insights' && <AreaInsights {...sectionProps} />}
                  {activeSection === 'recent-activity' && <RecentActivity {...sectionProps} />}
                  {activeSection === 'quick-actions' && <QuickActions />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-md mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-border px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <input
                  ref={searchInputRef}
                  autoFocus
                  type="text"
                  placeholder="Search properties, leads, areas..."
                  className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {filteredSearch.length === 0 && searchQuery ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">No results found.</p>
                ) : (
                  filteredSearch.map((item) => (
                    <button
                      key={item.link + item.label}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-2 transition"
                      onClick={() => {
                        navigate(item.link)
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                    >
                      <span className="text-xs text-muted-foreground uppercase w-16">
                        {item.type}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
