import { Link } from 'react-router-dom'
import { Activity, Building2, MessageSquare, Users, MapPin, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/helpers/cn'
import { formatRelative } from '@/lib/helpers/date'

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

interface ActivityItem {
  id: string
  type: string
  action: string
  label: string
  timestamp: Date
  status?: string
  link?: string
}

interface Props {
  activityFeed: ActivityItem[]
}

export default function RecentActivity({ activityFeed }: Props) {
  if (activityFeed.length === 0)
    return <p className="text-muted-foreground text-sm">No recent activity.</p>

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activityFeed.map((item) => (
          <div key={item.id} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5">
              {item.type === 'property' && <Building2 className="h-4 w-4 text-blue-500" />}
              {item.type === 'lead' && <MessageSquare className="h-4 w-4 text-amber-500" />}
              {item.type === 'user' && <Users className="h-4 w-4 text-emerald-500" />}
              {item.type === 'area' && <MapPin className="h-4 w-4 text-purple-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground">
                <span className="font-medium">{item.action}</span> –{' '}
                {item.link ? (
                  <Link to={item.link} className="hover:underline text-primary">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" /> {formatRelative(item.timestamp)}
                {item.status && (
                  <Badge
                    variant="outline"
                    className={cn('capitalize text-xs', statusVariants[item.status])}
                  >
                    {item.status}
                  </Badge>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
