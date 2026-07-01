import { HorizontalBarChart, VerticalBarChart } from './Charts'
import { TrendingUp, Building2, Layers, MapPin } from 'lucide-react'

interface Props {
  monthlyLeads: { month: string; count: number }[]
  monthlyProperties: { month: string; count: number }[]
  propertyStatusCounts: Record<string, number>
  propertyByArea: [string, number][]
  residentialCount: number
  commercialCount: number
  industrialCount: number
}

function formatMonthKey(key: string): string {
  const [y, m] = key.split('-')
  const date = new Date(Number(y), Number(m) - 1, 1)
  return date.toLocaleDateString('en-PK', { month: 'short', year: '2-digit' })
}

export default function DashboardAnalytics({
  monthlyLeads,
  monthlyProperties,
  propertyStatusCounts,
  propertyByArea,
  residentialCount,
  commercialCount,
  industrialCount,
}: Props) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Monthly Leads
          </h3>
          <VerticalBarChart
            data={monthlyLeads.map((e) => ({ label: formatMonthKey(e.month), value: e.count }))}
          />
        </div>
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Monthly Properties Added
          </h3>
          <VerticalBarChart
            data={monthlyProperties.map((e) => ({
              label: formatMonthKey(e.month),
              value: e.count,
            }))}
            color="var(--emerald-500, #10B981)"
          />
        </div>
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Property Status Distribution
          </h3>
          <HorizontalBarChart
            data={Object.entries(propertyStatusCounts).map(([status, count]) => ({
              name: status.replace('_', ' '),
              value: count,
            }))}
          />
        </div>
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Properties by Area
          </h3>
          <HorizontalBarChart
            data={propertyByArea.slice(0, 6).map(([name, count]) => ({ name, value: count }))}
            color="var(--amber-500, #F59E0B)"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4">Property Type Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-2xl font-bold">{residentialCount}</p>
            <p className="text-xs text-muted-foreground">Residential</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-2xl font-bold">{commercialCount}</p>
            <p className="text-xs text-muted-foreground">Commercial</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-2xl font-bold">{industrialCount}</p>
            <p className="text-xs text-muted-foreground">Industrial</p>
          </div>
        </div>
      </div>
    </div>
  )
}
