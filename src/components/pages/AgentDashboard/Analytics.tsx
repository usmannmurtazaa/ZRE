import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLeadsByAgent } from '@/hooks/useLeads'
import { useProperties } from '@/hooks/useProperties'
import { useAuth } from '@/hooks/useAuth'
import { KpiCard } from '@/components/organisms/KpiCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Seo } from '@/components/atoms/Seo'
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Target,
  Home,
  Eye,
  MessageSquare,
  BarChart3,
} from 'lucide-react'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

// Custom progress bar component
function ProgressBar({
  value,
  max,
  color = 'bg-brand-500',
  label,
  showLabel = false,
  className,
}: {
  value: number
  max: number
  color?: string
  label?: string
  showLabel?: boolean
  className?: string
}) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span>{label}</span>
          <span className="font-medium">{value}</span>
        </div>
      )}
      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export const Analytics = () => {
  const { user } = useAuth()
  const { data: leads, isLoading: leadsLoading } = useLeadsByAgent(user?.uid || '', undefined)
  const { data: propertiesData, isLoading: propsLoading } = useProperties({
    agentId: user?.uid,
    limit: 50,
  })

  const totalLeads = leads?.length ?? 0
  const newLeads = leads?.filter((l) => l.status === 'new').length ?? 0
  const contactedLeads = leads?.filter((l) => l.status === 'contacted').length ?? 0
  const convertedLeads = leads?.filter((l) => l.status === 'converted').length ?? 0
  const lostLeads = leads?.filter((l) => l.status === 'lost').length ?? 0
  const qualifiedLeads = leads?.filter((l) => l.status === 'qualified').length ?? 0

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0'

  const properties = propertiesData?.items ?? []
  const totalProperties = properties.length
  const totalPropertyViews = properties.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalPropertyInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0)

  // Top performing property by views
  const topByViews = useMemo(() => {
    if (!properties.length) return null
    return [...properties].sort((a, b) => (b.views || 0) - (a.views || 0))[0] ?? null
  }, [properties])

  // Top performing property by inquiries
  const topByInquiries = useMemo(() => {
    if (!properties.length) return null
    return [...properties].sort((a, b) => (b.inquiries || 0) - (a.inquiries || 0))[0] ?? null
  }, [properties])

  const isLoading = leadsLoading || propsLoading

  return (
    <>
      <Seo title="Analytics" description="Performance metrics and insights" noindex nofollow />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInSection}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-brand-600" />
            Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Performance metrics for your listings and lead pipeline.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Lead KPIs */}
            <motion.div variants={itemFadeUp} className="mb-10">
              <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-5">
                Lead Pipeline
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <KpiCard
                  title="Total Leads"
                  value={totalLeads}
                  icon={<Users className="h-5 w-5" />}
                  description="All inquiries"
                />
                <KpiCard
                  title="New"
                  value={newLeads}
                  icon={<Clock className="h-5 w-5" />}
                  description="Awaiting action"
                />
                <KpiCard
                  title="Contacted"
                  value={contactedLeads}
                  icon={<Phone className="h-5 w-5" />}
                  description="In conversation"
                />
                <KpiCard
                  title="Converted"
                  value={convertedLeads}
                  icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
                  description="Successfully closed"
                />
                <KpiCard
                  title="Lost"
                  value={lostLeads}
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  description="Opportunities lost"
                />
              </div>
            </motion.div>

            {/* Conversion Rate */}
            <motion.div
              variants={itemFadeUp}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-brand-600" />
                  Conversion Rate
                </h3>
                <span className="text-3xl font-bold text-brand-600">{conversionRate}%</span>
              </div>
              <ProgressBar
                value={convertedLeads}
                max={totalLeads}
                color="bg-emerald-500"
                label="Converted Leads"
                showLabel
                className="mb-4"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Qualified</span>
                  <span className="font-medium">{qualifiedLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Contact Ratio</span>
                  <span className="font-medium">
                    {totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Lead Status Breakdown (bars) */}
            <motion.div
              variants={itemFadeUp}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 mb-8"
            >
              <h3 className="font-serif text-lg font-semibold text-neutral-900 mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-600" />
                Status Breakdown
              </h3>
              <div className="space-y-4">
                <ProgressBar
                  value={newLeads}
                  max={totalLeads}
                  color="bg-blue-500"
                  label="New"
                  showLabel
                />
                <ProgressBar
                  value={contactedLeads}
                  max={totalLeads}
                  color="bg-amber-500"
                  label="Contacted"
                  showLabel
                />
                <ProgressBar
                  value={qualifiedLeads}
                  max={totalLeads}
                  color="bg-purple-500"
                  label="Qualified"
                  showLabel
                />
                <ProgressBar
                  value={convertedLeads}
                  max={totalLeads}
                  color="bg-emerald-500"
                  label="Converted"
                  showLabel
                />
                <ProgressBar
                  value={lostLeads}
                  max={totalLeads}
                  color="bg-red-400"
                  label="Lost"
                  showLabel
                />
              </div>
            </motion.div>

            {/* Property Analytics */}
            <motion.div variants={itemFadeUp} className="mb-10">
              <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-5">
                Property Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard
                  title="Listings"
                  value={totalProperties}
                  icon={<Home className="h-5 w-5" />}
                  description="Total properties"
                />
                <KpiCard
                  title="Total Views"
                  value={totalPropertyViews}
                  icon={<Eye className="h-5 w-5" />}
                  description="Across all listings"
                />
                <KpiCard
                  title="Total Inquiries"
                  value={totalPropertyInquiries}
                  icon={<MessageSquare className="h-5 w-5" />}
                  description="Across all listings"
                />
                <KpiCard
                  title="Avg Views/Listing"
                  value={
                    totalProperties > 0
                      ? Math.round(totalPropertyViews / totalProperties).toLocaleString()
                      : '0'
                  }
                  icon={<BarChart3 className="h-5 w-5" />}
                  description="Per property"
                />
              </div>

              {/* Top performing listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topByViews && (
                  <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Most Viewed
                        </p>
                        <h4 className="font-semibold text-neutral-900 mt-1">{topByViews.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {topByViews.area} &middot; {topByViews.views ?? 0} views
                        </p>
                      </div>
                      <Eye className="h-6 w-6 text-brand-500/60" />
                    </div>
                  </div>
                )}
                {topByInquiries && (
                  <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Most Inquired
                        </p>
                        <h4 className="font-semibold text-neutral-900 mt-1">
                          {topByInquiries.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {topByInquiries.area} &middot; {topByInquiries.inquiries ?? 0} inquiries
                        </p>
                      </div>
                      <MessageSquare className="h-6 w-6 text-brand-500/60" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </>
  )
}

export default Analytics
