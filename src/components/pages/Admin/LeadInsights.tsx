import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/helpers/cn'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Lead } from '@/types'

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

interface Props {
  filteredLeads: Lead[]
  newLeads: number
  leadStatusCounts: Record<string, number>
}

export default function LeadInsights({ filteredLeads, newLeads, leadStatusCounts }: Props) {
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingLeadId(leadId)
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: newStatus })
    } catch (e) {
      console.error('Failed to update lead status', e)
    } finally {
      setUpdatingLeadId(null)
    }
  }

  const needsFollowUp = filteredLeads.filter(
    (l) =>
      l.status === 'new' ||
      (l.status === 'contacted' && Date.now() - l.updatedAt.getTime() > 172800000)
  ).length

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Lead Insights
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-muted-foreground">New:</span> {newLeads}
          </li>
          <li>
            <span className="text-muted-foreground">Contacted:</span>{' '}
            {leadStatusCounts['contacted'] || 0}
          </li>
          <li>
            <span className="text-muted-foreground">Closed:</span>{' '}
            {leadStatusCounts['converted'] || 0}
          </li>
          <li>
            <span className="text-muted-foreground">Needs Follow‑up:</span> {needsFollowUp}
          </li>
        </ul>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-serif text-lg font-semibold mb-4">Latest Leads</h3>
        <div className="space-y-2">
          {filteredLeads.slice(0, 5).map((l) => (
            <div
              key={l.leadId}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition"
            >
              <Link to={`/admin/leads/${l.leadId}`} className="truncate flex-1">
                {l.name}
              </Link>
              <select
                value={l.status}
                onChange={(e) => handleStatusChange(l.leadId, e.target.value)}
                disabled={updatingLeadId === l.leadId}
                className="text-xs border border-border rounded-md px-1 py-0.5 bg-transparent cursor-pointer"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
