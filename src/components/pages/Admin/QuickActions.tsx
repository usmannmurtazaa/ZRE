import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, MessageSquare, Building2, Settings } from 'lucide-react'

export default function QuickActions() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link to="/admin/properties/new">
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          </Link>
          <Link to="/admin/areas">
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              <MapPin className="h-4 w-4" /> Add Area
            </Button>
          </Link>
          <Link to="/admin/leads">
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              <MessageSquare className="h-4 w-4" /> View Leads
            </Button>
          </Link>
          <Link to="/admin/properties">
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              <Building2 className="h-4 w-4" /> View Properties
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              <Settings className="h-4 w-4" /> Site Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
