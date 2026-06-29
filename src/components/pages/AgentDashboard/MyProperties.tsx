import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProperties } from '@/hooks/useProperties'
import { useAuth } from '@/hooks/useAuth'
import { DataTable } from '@/components/molecules/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/helpers/currency'
import { formatDate } from '@/lib/helpers/date'
import { useDeleteProperty } from '@/hooks/useProperties'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { Seo } from '@/components/atoms/Seo'
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

const statusColors: Record<string, string> = {
  for_sale:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  for_rent:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  sold: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  rented:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
}

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export const MyProperties = () => {
  const { user } = useAuth()
  const { data, isLoading, refetch } = useProperties({ agentId: user?.uid, limit: 100 })
  const deleteProperty = useDeleteProperty()
  const dispatch = useDispatch()

  const items = data?.items || []

  const stats = useMemo(() => {
    if (!items.length) return null
    const total = items.length
    const forSale = items.filter((p) => p.status === 'for_sale').length
    const forRent = items.filter((p) => p.status === 'for_rent').length
    const sold = items.filter((p) => p.status === 'sold').length
    return { total, forSale, forRent, sold }
  }, [items])

  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)
    ) {
      deleteProperty.mutate(id, {
        onSuccess: () => {
          refetch()
          dispatch(showToast({ message: 'Property deleted', type: 'success' }))
        },
        onError: () => {
          dispatch(showToast({ message: 'Failed to delete property', type: 'error' }))
        },
      })
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Property',
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.area}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      cell: (item: any) => (
        <span className="font-medium text-foreground text-sm">{formatPrice(item.price)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (item: any) => (
        <Badge
          variant="outline"
          className={cn(
            'capitalize text-xs font-medium',
            statusColors[item.status] || 'bg-muted text-muted-foreground border-border'
          )}
        >
          {item.status?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      className: 'hidden md:table-cell',
      cell: (item: any) => <span className="text-xs text-muted-foreground">{item.views || 0}</span>,
    },
    {
      key: 'inquiries',
      header: 'Inquiries',
      className: 'hidden md:table-cell',
      cell: (item: any) => (
        <span className="text-xs text-muted-foreground">{item.inquiries || 0}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      cell: (item: any) => (
        <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
      ),
      className: 'hidden lg:table-cell',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Link to={`/admin/properties/${item.propertyId}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition-colors gap-1.5"
            onClick={() => handleDelete(item.propertyId, item.title)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Seo title="My Properties" description="Manage your property listings" noindex nofollow />

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
              <Building2 className="h-8 w-8 text-primary" />
              My Properties
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage the property listings assigned to you.
            </p>
          </div>
          <Link to="/admin/properties/new">
            <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </motion.div>

        {!isLoading && stats && (
          <motion.div variants={itemFadeUp} className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm">
              <span className="text-blue-500">For Sale</span>
              <span className="font-bold text-foreground">{stats.forSale}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm">
              <span className="text-amber-500">For Rent</span>
              <span className="font-bold text-foreground">{stats.forRent}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm">
              <span className="text-red-500">Sold</span>
              <span className="font-bold text-foreground">{stats.sold}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={itemFadeUp}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <DataTable
            data={items}
            columns={columns}
            keyExtractor={(item) => item.propertyId}
            isLoading={isLoading}
            emptyMessage="You haven't added any properties yet. Click the button above to create your first listing."
            striped
            stickyHeader
          />
        </motion.div>
      </motion.div>
    </>
  )
}

export default MyProperties
