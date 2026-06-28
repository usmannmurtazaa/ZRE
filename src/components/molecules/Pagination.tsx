import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  maxVisiblePages?: number
  showFirstLast?: boolean
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 7,
  showFirstLast = false,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const generatePages = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
    const half = Math.floor(maxVisiblePages / 2)

    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, currentPage + half)

    if (currentPage - half <= 1) {
      end = Math.min(totalPages, maxVisiblePages)
    }
    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('ellipsis-start')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('ellipsis-end')
      pages.push(totalPages)
    }

    return pages
  }

  const pages = generatePages()

  const baseButtonStyles =
    'h-9 w-9 sm:h-10 sm:w-10 p-0 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40'

  const arrowButtonStyles = cn(
    baseButtonStyles,
    'text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/70'
  )

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1 sm:gap-2', className)}
    >
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={arrowButtonStyles}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={arrowButtonStyles}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center text-sm text-muted-foreground select-none"
                aria-hidden="true"
              >
                &hellip;
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                baseButtonStyles,
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 active:bg-primary/80'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/70'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={arrowButtonStyles}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={arrowButtonStyles}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  )
}

export default Pagination
