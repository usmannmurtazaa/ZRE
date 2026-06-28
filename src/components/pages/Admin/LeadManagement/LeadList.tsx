import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAllLeads } from '@/hooks/useLeads'
import { DataTable } from '@/components/molecules/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/helpers/date'
import { Seo } from '@/components/atoms/Seo'
import { Inbox, Eye } from 'lucide-react'
import type { Lead } from '@/types'

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

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export const LeadList = () => {
  const { data: leads, isLoading } = useAllLeads()

  const stats = useMemo(() => {
    if (!leads) return null
    const total = leads.length
    const newCount = leads.filter((l: Lead) => l.status === 'new').length
    const convertedCount = leads.filter((l: Lead) => l.status === 'converted').length
    return { total, newCount, convertedCount }
  }, [leads])

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: (item: any) => <span className="font-medium text-foreground">{item.name}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      cell: (item: any) => (
        <a
          href={`mailto:${item.email}`}
          className="text-primary hover:underline text-sm dark:text-gold-400"
        >
          {item.email}
        </a>
      ),
    },
    { key: 'phone', header: 'Phone' },
    {
      key: 'propertyTitle',
      header: 'Property',
      cell: (item: any) => (
        <span className="text-sm text-foreground">{item.propertyTitle || '—'}</span>
      ),
    },
    { key: 'agentName', header: 'Agent' },
    {
      key: 'status',
      header: 'Status',
      cell: (item: any) => (
        <Badge
          variant="outline"
          className={`capitalize text-xs font-medium ${statusVariants[item.status] || 'bg-muted text-muted-foreground border-border'}`}
        >
          {item.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (item: any) => (
        <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (item: any) => (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-1.5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/admin/leads/${item.leadId}`}>
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <>
      <Seo title="All Leads" description="Manage all incoming leads" noindex nofollow />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInSection}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <motion.div
          variants={itemFadeUp}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <Inbox className="h-8 w-8 text-primary" />
              All Leads
            </h1>
            <p className="mt-2 text-muted-foreground">
              View and manage every inquiry that comes through the platform.
            </p>
          </div>
          {!isLoading && stats && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">New</span>
                <span className="font-semibold text-foreground">{stats.newCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Converted</span>
                <span className="font-semibold text-foreground">{stats.convertedCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">{stats.total}</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemFadeUp}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <DataTable
            data={leads || []}
            columns={columns}
            keyExtractor={(item) => item.leadId}
            isLoading={isLoading}
            emptyMessage="No leads found"
            striped
            stickyHeader
          />
        </motion.div>
      </motion.div>
    </>
  )
}

export default LeadList
