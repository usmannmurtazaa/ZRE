import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLeadsByAgent, useUpdateLeadStatus } from '@/hooks/useLeads'
import { useAuth } from '@/hooks/useAuth'
import { DataTable } from '@/components/molecules/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/helpers/date'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { Seo } from '@/components/atoms/Seo'
import { Phone, Eye, RefreshCcw, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

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

export const Leads = () => {
  const { user } = useAuth()
  const { data: leads, isLoading, refetch } = useLeadsByAgent(user?.uid || '', undefined)
  const updateStatus = useUpdateLeadStatus()
  const dispatch = useDispatch()
  const [changingStatusFor, setChangingStatusFor] = useState<string | null>(null)

  const handleStatusChange = (leadId: string, newStatus: string) => {
    const lead = leads?.find((l) => l.leadId === leadId)
    if (!lead || lead.status === newStatus) return

    setChangingStatusFor(leadId)
    updateStatus.mutate(
      { id: leadId, status: newStatus as any },
      {
        onSuccess: () => {
          refetch()
          dispatch(showToast({ message: 'Status updated', type: 'success' }))
        },
        onError: () => {
          dispatch(showToast({ message: 'Failed to update status', type: 'error' }))
        },
        onSettled: () => setChangingStatusFor(null),
      }
    )
  }

  // Summary statistics
  const stats = useMemo(() => {
    if (!leads) return null
    const total = leads.length
    const newCount = leads.filter((l) => l.status === 'new').length
    const contactedCount = leads.filter((l) => l.status === 'contacted').length
    const convertedCount = leads.filter((l) => l.status === 'converted').length
    return { total, newCount, contactedCount, convertedCount }
  }, [leads])

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-50 text-brand-600 font-medium text-sm flex items-center justify-center shrink-0">
            {item.name
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-neutral-900 text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (item: any) => (
        <a
          href={`tel:${item.phone}`}
          className="text-sm text-brand-600 hover:underline flex items-center gap-1"
        >
          <Phone className="h-3.5 w-3.5" />
          {item.phone}
        </a>
      ),
    },
    {
      key: 'propertyTitle',
      header: 'Property',
      cell: (item: any) => (
        <span className="text-sm">{item.propertyTitle || 'General Inquiry'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Select
            value={item.status}
            onValueChange={(val) => handleStatusChange(item.leadId, val)}
            disabled={changingStatusFor === item.leadId}
          >
            <SelectTrigger
              className={cn(
                'h-8 w-[130px] border-0 bg-transparent px-2 text-xs font-medium capitalize hover:bg-neutral-100 transition-colors',
                changingStatusFor === item.leadId && 'opacity-50 cursor-not-allowed'
              )}
            >
              {changingStatusFor === item.leadId ? (
                <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            variant="outline"
            className={cn(
              'capitalize text-xs font-medium',
              statusColors[item.status] || 'bg-neutral-50 text-neutral-600 border-neutral-200'
            )}
          >
            {item.status}
          </Badge>
        </div>
      ),
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
          <Link to={`/agent-dashboard/leads/${item.leadId}`}>
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <>
      <Seo title="My Leads" description="Manage your assigned leads" noindex nofollow />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInSection}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div
          variants={itemFadeUp}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-brand-600" />
              My Leads
            </h1>
            <p className="mt-2 text-muted-foreground">View and manage leads assigned to you.</p>
          </div>
          {!isLoading && stats && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-neutral-900">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">New</span>
                <span className="font-semibold text-neutral-900">{stats.newCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Converted</span>
                <span className="font-semibold text-neutral-900">{stats.convertedCount}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick stats pills */}
        {!isLoading && stats && (
          <motion.div variants={itemFadeUp} className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-neutral-600">New</span>
              <span className="font-bold">{stats.newCount}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-sm">
              <Phone className="h-4 w-4 text-amber-500" />
              <span className="text-neutral-600">Contacted</span>
              <span className="font-bold">{stats.contactedCount}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-neutral-600">Converted</span>
              <span className="font-bold">{stats.convertedCount}</span>
            </div>
          </motion.div>
        )}

        {/* Data table */}
        <motion.div
          variants={itemFadeUp}
          className="rounded-2xl border border-neutral-200/80 bg-white shadow-sm overflow-hidden"
        >
          <DataTable
            data={leads || []}
            columns={columns}
            keyExtractor={(item) => item.leadId}
            isLoading={isLoading}
            emptyMessage="No leads assigned yet. Leads will appear here once someone inquires about your properties."
            striped
            stickyHeader
          />
        </motion.div>
      </motion.div>
    </>
  )
}

export default Leads
