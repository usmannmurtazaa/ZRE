import { Link } from 'react-router-dom'
import { Building2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/helpers/currency'
import { formatDate } from '@/lib/helpers/date'
import type { Property } from '@/types/property'

interface Props {
  filteredProperties: Property[]
  highestPriceProp?: Property
  lowestPriceProp?: Property
  oldestUnsoldProp?: Property
}

export default function PropertyInsights({
  filteredProperties,
  highestPriceProp,
  lowestPriceProp,
  oldestUnsoldProp,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Property Insights
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-muted-foreground">Highest Price:</span>{' '}
            {highestPriceProp
              ? `${highestPriceProp.title} – ${formatPrice(highestPriceProp.price)}`
              : '—'}
          </li>
          <li>
            <span className="text-muted-foreground">Lowest Price:</span>{' '}
            {lowestPriceProp
              ? `${lowestPriceProp.title} – ${formatPrice(lowestPriceProp.price)}`
              : '—'}
          </li>
          <li>
            <span className="text-muted-foreground">Oldest Unsold:</span>{' '}
            {oldestUnsoldProp
              ? `${oldestUnsoldProp.title} (${formatDate(oldestUnsoldProp.createdAt)})`
              : '—'}
          </li>
          <li>
            <span className="text-muted-foreground">Without Images:</span>{' '}
            {filteredProperties.filter((p) => !p.images?.length).length}
          </li>
        </ul>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4">Recent Properties</h3>
        <div className="space-y-2">
          {filteredProperties.slice(0, 5).map((p) => (
            <Link
              key={p.propertyId}
              to={`/admin/properties/${p.propertyId}/edit`}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition"
            >
              <span className="truncate">{p.title}</span>
              <Badge variant="outline" className="text-xs">
                {p.status?.replace('_', ' ')}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
