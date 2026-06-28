import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLeadsByAgent } from '@/hooks/useLeads'
import { useProperties } from '@/hooks/useProperties'
import { KpiCard } from '@/components/organisms/KpiCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Seo } from '@/components/atoms/Seo'
import {
  Users,
  Home,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Building2,
  Plus,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import { formatDate } from '@/lib/helpers/date'

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-red-50 text-red-700 border-red-200',
}

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export const AgentDashboard = () => {
  const { user } = useAuth()
  const { data: leads, isLoading: leadsLoading } = useLeadsByAgent(user?.uid || '', undefined)
  const { data: propertiesData, isLoading: propsLoading } = useProperties({
    agentId: user?.uid,
    limit: 100,
  })

  const totalLeads = leads?.length || 0
  const newLeads = leads?.filter((l) => l.status === 'new').length || 0
  const convertedLeads = leads?.filter((l) => l.status === 'converted').length || 0
  const totalProperties = propertiesData?.items?.length || 0

  const recentLeads = leads?.slice(0, 5) || []

  const kpiData = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Users className="h-6 w-6" />,
      description: 'All inquiries assigned',
      to: '/agent-dashboard/leads',
    },
    {
      title: 'New Leads',
      value: newLeads,
      icon: <Clock className="h-6 w-6" />,
      description: 'Awaiting action',
      to: '/agent-dashboard/leads?status=new',
    },
    {
      title: 'Converted',
      value: convertedLeads,
      icon: <CheckCircle className="h-6 w-6" />,
      description: 'Successfully closed',
      to: '/agent-dashboard/leads?status=converted',
    },
    {
      title: 'My Properties',
      value: totalProperties,
      icon: <Home className="h-6 w-6" />,
      description: 'Listings managed',
      to: '/agent-dashboard/properties',
    },
  ]

  const isLoading = leadsLoading || propsLoading

  return (
    <>
      <Seo
        title="Agent Dashboard"
        description="Manage your leads and properties"
        noindex
        nofollow
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeInSection} className="mb-10">
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
                <Building2 className="h-8 w-8 text-brand-600" />
                Agent Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back, {user?.displayName || 'Agent'}. Here&apos;s your performance at a
                glance.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/properties/new">
                <Button
                  size="sm"
                  className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              </Link>
              <Link to="/agent-dashboard/leads">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <MessageSquare className="h-4 w-4" />
                  All Leads
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInSection}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10"
          >
            {kpiData.map((kpi) => (
              <motion.div key={kpi.title} variants={itemFadeUp}>
                <Link to={kpi.to}>
                  <KpiCard
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon}
                    description={kpi.description}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Recent Leads */}
        <motion.div initial="hidden" animate="visible" variants={fadeInSection}>
          <motion.div
            variants={itemFadeUp}
            className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div>
                <h2 className="font-serif text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-brand-600" />
                  Recent Leads
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest inquiries for your properties
                </p>
              </div>
              {recentLeads.length > 0 && (
                <Link
                  to="/agent-dashboard/leads"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            <div className="px-2 py-2">
              {leadsLoading ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-xl" />
                  ))}
                </div>
              ) : recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <Link
                    key={lead.leadId}
                    to={`/agent-dashboard/leads/${lead.leadId}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900 truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lead.propertyTitle || 'General Inquiry'} &middot; {lead.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize text-xs font-medium',
                          statusColors[lead.status] ||
                            'bg-neutral-50 text-neutral-600 border-neutral-200'
                        )}
                      >
                        {lead.status}
                      </Badge>
                      <Eye className="h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm">No leads yet</p>
                  <p className="text-xs mt-1">
                    Leads will appear here once someone inquires about your properties.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default AgentDashboard
