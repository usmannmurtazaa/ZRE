import { motion } from 'framer-motion'
import { useLeadsByAgent } from '@/hooks/useLeads'
import { useAuth } from '@/hooks/useAuth'
import { DataTable } from '@/components/molecules/DataTable'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/helpers/date'
import { MessageSquare, Inbox } from 'lucide-react'
import { Seo } from '@/components/atoms/Seo'

const statusVariants: Record<
  string,
  { variant: 'default' | 'secondary' | 'outline' | 'destructive'; className?: string }
> = {
  new: {
    variant: 'default',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  },
  contacted: {
    variant: 'secondary',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  },
  qualified: {
    variant: 'secondary',
    className:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  },
  converted: {
    variant: 'default',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  },
  lost: {
    variant: 'destructive',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  },
}

export const Inquiries = () => {
  const { user } = useAuth()
  const { data: inquiries, isLoading } = useLeadsByAgent(user?.uid || '', undefined)

  const columns = [
    {
      key: 'propertyTitle',
      header: 'Property',
      cell: (item: any) => (
        <span className="font-medium text-foreground">
          {item.propertyTitle || 'General Inquiry'}
        </span>
      ),
      sortable: true,
    },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      cell: (item: any) => {
        const config = statusVariants[item.status] || {
          variant: 'outline' as const,
          className: 'bg-muted text-muted-foreground border-border',
        }
        return (
          <Badge
            variant={config.variant}
            className={`capitalize text-xs font-medium ${config.className || ''}`}
          >
            {item.status}
          </Badge>
        )
      },
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Date',
      cell: (item: any) => (
        <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
      ),
      sortable: true,
    },
  ]

  return (
    <>
      <Seo title="My Inquiries" description="Track your property inquiries" noindex nofollow />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              My Inquiries
            </h1>
            <p className="mt-2 text-muted-foreground">
              Keep track of all your property inquiries in one place.
            </p>
          </div>
          {!isLoading && inquiries && inquiries.length > 0 && (
            <p className="text-sm text-muted-foreground font-medium">
              {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'} total
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <DataTable
              data={inquiries}
              columns={columns}
              keyExtractor={(item) => item.leadId}
              className="border-0"
              emptyMessage="No inquiries yet."
              striped
              stickyHeader
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border shadow-sm"
          >
            <div className="rounded-full bg-muted p-4 mb-6">
              <Inbox className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              No inquiries yet
            </h2>
            <p className="text-muted-foreground max-w-md">
              When potential buyers or tenants reach out about a property, their inquiries will
              appear here.
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default Inquiries
