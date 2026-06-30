import { useAreas } from '@/hooks/useAreas'
import { DataTable } from '@/components/molecules/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { Pencil, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'

export const AreaList = () => {
  const { data: areas, isLoading } = useAreas()

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cell: (item: any) => <span className="font-medium text-foreground">{item.name}</span>,
    },
    { key: 'propertyCount', header: 'Properties', sortable: true },
    {
      key: 'isActive',
      header: 'Status',
      cell: (item: any) => (
        <Badge variant={item.isActive ? 'success' : 'secondary'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (item: any) => (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/admin/areas/${item.areaId}/edit`}>
            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <>
      <Seo title="Manage Areas" description="Admin area management" noindex nofollow />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Manage Areas</h1>
            <p className="text-muted-foreground mt-1">Create and edit property areas.</p>
          </div>
          <Link to="/admin/areas/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Area
            </Button>
          </Link>
        </motion.div>

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <DataTable
            data={areas || []}
            columns={columns}
            keyExtractor={(item) => item.areaId}
            isLoading={isLoading}
            emptyMessage="No areas found. Create your first area."
            striped
          />
        </div>
      </div>
    </>
  )
}

export default AreaList
