import { MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/helpers/currency'
import type { Area } from '@/types'

interface Props {
  filteredAreas: Area[]
  areaWithMostProps: { name: string; count: number } | null
  areaWithHighestAvg: { name: string; avg: number } | null
}

export default function AreaInsights({
  filteredAreas,
  areaWithMostProps,
  areaWithHighestAvg,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Area Insights
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-muted-foreground">Most Properties:</span>{' '}
            {areaWithMostProps ? `${areaWithMostProps.name} (${areaWithMostProps.count})` : '—'}
          </li>
          <li>
            <span className="text-muted-foreground">Highest Avg Price:</span>{' '}
            {areaWithHighestAvg
              ? `${areaWithHighestAvg.name} – ${formatPrice(areaWithHighestAvg.avg)}`
              : '—'}
          </li>
          <li>
            <span className="text-muted-foreground">Recently Added:</span>{' '}
            {filteredAreas
              .slice(0, 3)
              .map((a) => a.name)
              .join(', ') || '—'}
          </li>
        </ul>
      </div>
    </div>
  )
}
