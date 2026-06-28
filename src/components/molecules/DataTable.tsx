import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Database } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import { Skeleton } from '@/components/ui/skeleton'
import type { ReactNode } from 'react'

export interface Column<T> {
  key: keyof T | string
  header: string
  cell?: (item: T) => ReactNode
  className?: string
  sortable?: boolean
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  loadingRows?: number
  onRowClick?: (item: T) => void
  striped?: boolean
  stickyHeader?: boolean
}

type SortDirection = 'asc' | 'desc' | null

interface SortState {
  key: string | null
  direction: SortDirection
}

export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  className,
  emptyMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  onRowClick,
  striped = false,
  stickyHeader = false,
}: DataTableProps<T>) => {
  const [sort, setSort] = useState<SortState>({ key: null, direction: null })

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: null, direction: null }
        return { key, direction: 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return data
    return [...data].sort((a, b) => {
      const valA = a[sort.key!]
      const valB = b[sort.key!]
      if (valA == null || valB == null) return 0
      if (valA < valB) return sort.direction === 'asc' ? -1 : 1
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sort])

  const skeletonRows = Array.from({ length: loadingRows }, (_, i) => i)

  if (!isLoading && sortedData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="rounded-full bg-muted p-4 mb-4">
          <Database className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        className
      )}
    >
      <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full min-w-[600px] caption-bottom text-sm" role="table">
          <caption className="sr-only">Data table with {columns.length} columns</caption>
          <thead
            className={cn(
              'bg-muted/40 border-b border-border',
              stickyHeader && 'sticky top-0 z-10 backdrop-blur-md bg-card/80'
            )}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={cn(
                    'h-12 px-5 text-left align-middle font-semibold text-muted-foreground text-xs tracking-wide uppercase',
                    col.sortable &&
                      'cursor-pointer select-none hover:text-foreground transition-colors',
                    col.headerClassName
                  )}
                  onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                  aria-sort={
                    sort.key === String(col.key)
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : sort.direction === 'desc'
                          ? 'descending'
                          : 'none'
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col leading-none text-muted-foreground/70">
                        {sort.key === String(col.key) && sort.direction === 'asc' ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : sort.key === String(col.key) && sort.direction === 'desc' ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <span className="flex flex-col opacity-30">
                            <ChevronUp className="h-3 w-3 -mb-1" />
                            <ChevronDown className="h-3 w-3" />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {isLoading
                ? skeletonRows.map((rowIndex) => (
                    <motion.tr
                      key={`skeleton-${rowIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-border last:border-0"
                    >
                      {columns.map((col) => (
                        <td key={String(col.key)} className="px-5 py-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                : sortedData.map((item, index) => (
                    <motion.tr
                      key={keyExtractor(item)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.02, ease: 'easeOut' }}
                      className={cn(
                        'border-b border-border last:border-0 transition-colors',
                        striped && index % 2 === 0 && 'bg-muted/20',
                        onRowClick && 'cursor-pointer hover:bg-primary/5',
                        !onRowClick && 'hover:bg-muted/50'
                      )}
                      onClick={onRowClick ? () => onRowClick(item) : undefined}
                      tabIndex={onRowClick ? 0 : undefined}
                      onKeyDown={
                        onRowClick
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') onRowClick(item)
                            }
                          : undefined
                      }
                    >
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={cn('px-5 py-4 align-middle text-foreground', col.className)}
                        >
                          {col.cell ? col.cell(item) : (item[col.key] as ReactNode)}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
