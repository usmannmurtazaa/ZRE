import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useLeadsByAgent } from '@/hooks/useLeads'
import { useProperties } from '@/hooks/useProperties'
import { KpiCard } from '@/components/organisms/KpiCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Seo } from '@/components/atoms/Seo'
import {
  Heart,
  Search,
  MessageSquare,
  Home,
  ArrowRight,
  Clock,
  Eye,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/helpers/cn'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

const leadStatusVariants: Record<string, { color: string; label: string }> = {
  new: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'New' },
  contacted: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Contacted',
  },
  qualified: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Qualified',
  },
  converted: {
    color: 'bg-brand-50 text-brand-700 border-brand-200',
    label: 'Converted',
  },
  lost: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Lost' },
}

export const Dashboard = () => {
  const { user } = useAuth()
  const { data: favorites } = useFavorites()
  const { data: inquiries, isLoading: inquiriesLoading } = useLeadsByAgent(
    user?.uid || '',
    undefined
  )
  const { data: properties } = useProperties({ agentId: user?.uid, limit: 5 })

  const recentInquiries = inquiries?.slice(0, 5) || []
  const userFirstName = user?.displayName?.split(' ')[0] || 'there'

  return (
    <>
      <Seo title="Dashboard" description="Your personal real estate dashboard" noindex nofollow />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={fadeInSection} className="mb-8">
          <motion.div variants={itemFadeUp} className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Welcome back, {userFirstName}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Here&apos;s your property activity at a glance
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInSection}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10"
        >
          <motion.div variants={itemFadeUp}>
            <KpiCard
              title="Saved Properties"
              value={favorites?.length || 0}
              icon={<Heart className="h-6 w-6" />}
              description="Properties you've saved"
              trend={{ value: 12, isPositive: true }}
            />
          </motion.div>
          <motion.div variants={itemFadeUp}>
            <KpiCard
              title="Active Inquiries"
              value={inquiries?.length || 0}
              icon={<MessageSquare className="h-6 w-6" />}
              description="Pending responses"
            />
          </motion.div>
          <motion.div variants={itemFadeUp}>
            <KpiCard
              title="Viewed Properties"
              value={properties?.items?.length || 0}
              icon={<Eye className="h-6 w-6" />}
              description="Recently browsed"
            />
          </motion.div>
          <motion.div variants={itemFadeUp}>
            <KpiCard
              title="Saved Searches"
              value={0}
              icon={<Search className="h-6 w-6" />}
              description="Coming soon"
            />
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInSection} className="mb-10">
          <motion.div variants={itemFadeUp}>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'Browse Properties',
                icon: <Home className="h-4 w-4" />,
                to: '/properties',
                variant: 'default' as const,
              },
              {
                label: 'View Favorites',
                icon: <Heart className="h-4 w-4" />,
                to: '/dashboard/favorites',
                variant: 'outline' as const,
              },
              {
                label: 'My Inquiries',
                icon: <MessageSquare className="h-4 w-4" />,
                to: '/dashboard/inquiries',
                variant: 'outline' as const,
              },
            ].map((action) => (
              <motion.div key={action.to} variants={itemFadeUp}>
                <Link to={action.to}>
                  <Button
                    variant={action.variant}
                    className="w-full gap-2 h-11 justify-start font-medium text-sm rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {action.icon}
                    {action.label}
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInSection}>
          <motion.div variants={itemFadeUp} className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground">Recent Inquiries</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track your latest property inquiries
              </p>
            </div>
            {recentInquiries.length > 0 && (
              <Link
                to="/dashboard/inquiries"
                className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-gold-400 flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </motion.div>

          {inquiriesLoading ? (
            <motion.div variants={itemFadeUp} className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <Skeleton className="h-5 w-2/3 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </motion.div>
          ) : recentInquiries.length > 0 ? (
            <motion.div variants={itemFadeUp}>
              <div className="space-y-3">
                {recentInquiries.map((lead, index) => {
                  const status = leadStatusVariants[lead.status] || {
                    color: 'bg-neutral-50 text-neutral-600 border-neutral-200',
                    label: lead.status,
                  }
                  return (
                    <motion.div
                      key={lead.leadId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-primary/20"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-1 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {lead.propertyTitle || 'General Inquiry'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {lead.name} &middot; {lead.email}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lead.createdAt
                                ? new Date(lead.createdAt).toLocaleDateString('en-PK', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'Recently'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <Badge
                          variant="outline"
                          className={cn('capitalize text-xs font-medium', status.color)}
                        >
                          {status.label}
                        </Badge>
                        <Link
                          to={`/agent-dashboard/leads/${lead.leadId}`}
                          className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemFadeUp}
              className="text-center py-16 rounded-2xl border border-dashed border-border bg-muted/30"
            >
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No inquiries yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                When you inquire about a property, it will appear here.
              </p>
              <Link to="/properties" className="mt-4 inline-block">
                <Button variant="outline" size="sm" className="rounded-full">
                  Browse Properties
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Dashboard
