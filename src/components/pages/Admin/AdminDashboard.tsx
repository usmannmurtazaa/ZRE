import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProperties } from '@/hooks/useProperties'
import { useAllLeads } from '@/hooks/useLeads'
import { useUsers } from '@/hooks/useUsers'
import { KpiCard } from '@/components/organisms/KpiCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Seo } from '@/components/atoms/Seo'
import {
  Home,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
  Settings,
  Building2,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import { formatPrice } from '@/lib/helpers/currency'
import { formatDate } from '@/lib/helpers/date'
import type { Lead } from '@/types'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

const statusVariants: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  contacted:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  qualified:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  converted:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  lost: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

export const AdminDashboard = () => {
  const { data: propertiesData, isLoading: propsLoading } = useProperties({ limit: 5, page: 1 })
  const { data: leads, isLoading: leadsLoading } = useAllLeads()
  const { data: users, isLoading: usersLoading } = useUsers()

  const totalProperties = propertiesData?.total ?? 0
  const totalLeads = leads?.length ?? 0
  const totalUsers = users?.length ?? 0
  const newLeads = leads?.filter((l: Lead) => l.status === 'new').length ?? 0

  const isLoading = propsLoading || leadsLoading || usersLoading

  const kpiData = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: <Home className="h-6 w-6" />,
      description: 'Active & inactive',
      trend: undefined as { value: number; isPositive: boolean } | undefined,
      to: '/admin/properties',
    },
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <MessageSquare className="h-6 w-6" />,
      description: 'All inquiries',
      trend: undefined,
      to: '/admin/leads',
    },
    {
      title: 'New Leads',
      value: newLeads,
      icon: <Inbox className="h-6 w-6" />,
      description: 'Awaiting action',
      trend:
        totalLeads > 0
          ? { value: Math.round((newLeads / totalLeads) * 100), isPositive: true }
          : undefined,
      to: '/admin/leads?status=new',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <Users className="h-6 w-6" />,
      description: 'Registered accounts',
      trend: undefined,
      to: '/admin/users',
    },
  ]

  const recentProperties = propertiesData?.items?.slice(0, 5) || []
  const recentLeads = leads?.slice(0, 5) || []

  return (
    <>
      <Seo title="Admin Dashboard" description="Platform administration" noindex nofollow />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeInSection} className="mb-10">
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Overview of your entire platform &middot; Last updated just now
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/properties/new">
                <Button size="sm" className="gap-2 rounded-xl">
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

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
                    trend={kpi.trend}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInSection}>
            <motion.div
              variants={itemFadeUp}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-card-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Recent Properties
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Latest additions to your catalogue
                  </p>
                </div>
                <Link
                  to="/admin/properties"
                  className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-gold-400 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="px-2 py-2">
                {propsLoading ? (
                  <div className="space-y-3 p-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 rounded-xl" />
                    ))}
                  </div>
                ) : recentProperties.length > 0 ? (
                  recentProperties.map((property) => (
                    <Link
                      key={property.propertyId}
                      to={`/admin/properties/${property.propertyId}/edit`}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground truncate">
                          {property.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {property.area} &middot; {formatPrice(property.price)}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs ml-3">
                        {property.status?.replace('_', ' ')}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm">No properties yet</p>
                    <Link
                      to="/admin/properties/new"
                      className="text-primary text-xs font-medium hover:underline mt-1 inline-block"
                    >
                      Add your first property
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeInSection}>
            <motion.div
              variants={itemFadeUp}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-card-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Recent Leads
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Latest inquiries across all properties
                  </p>
                </div>
                <Link
                  to="/admin/leads"
                  className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-gold-400 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
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
                      to={`/admin/leads/${lead.leadId}`}
                      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lead.propertyTitle || 'General Inquiry'} &middot;{' '}
                          {formatDate(lead.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize text-xs ml-3',
                          statusVariants[lead.status] ||
                            'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        {lead.status}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm">No leads received yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link to="/admin/properties/new">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              New Property
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <Settings className="h-4 w-4" />
              Site Settings
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  )
}

export default AdminDashboard
