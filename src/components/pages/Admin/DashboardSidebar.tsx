import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/helpers/cn'
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  MessageSquare,
  MapPin,
  Activity,
  Zap,
  Settings,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'property-insights', label: 'Property Insights', icon: Building2 },
  { id: 'lead-insights', label: 'Lead Insights', icon: MessageSquare },
  { id: 'area-insights', label: 'Area Insights', icon: MapPin },
  { id: 'recent-activity', label: 'Recent Activity', icon: Activity },
  { id: 'quick-actions', label: 'Quick Actions', icon: Zap },
] as const

interface Props {
  activeSection: string
  onSectionChange: (section: any) => void
  className?: string
}

export default function DashboardSidebar({ activeSection, onSectionChange, className }: Props) {
  const location = useLocation()

  return (
    <aside className={cn('w-64 flex-col py-6 px-4 bg-card border-r border-border', className)}>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
              activeSection === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="pt-4 mt-4 border-t border-border">
        <Link
          to="/admin/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
            location.pathname === '/admin/settings'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          Site Settings
        </Link>
      </div>
    </aside>
  )
}
