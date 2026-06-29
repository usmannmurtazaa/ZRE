import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLead, useUpdateLeadStatus, useAddLeadNote } from '@/hooks/useLeads'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { formatDate } from '@/lib/helpers/date'
import { Seo } from '@/components/atoms/Seo'
import {
  ArrowLeft,
  Phone,
  Mail,
  Home,
  User,
  Calendar,
  MessageSquare,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  contacted:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  qualified:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  converted:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  lost: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

export const LeadDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: lead, isLoading } = useLead(id)
  const updateStatus = useUpdateLeadStatus()
  const addNote = useAddLeadNote()
  const dispatch = useDispatch()
  const [newNote, setNewNote] = useState('')
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    if (!lead) return
    updateStatus.mutate(
      { id: lead.leadId, status: newStatus as any },
      {
        onSuccess: () => dispatch(showToast({ message: 'Status updated', type: 'success' })),
        onError: () => dispatch(showToast({ message: 'Failed to update status', type: 'error' })),
      }
    )
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !lead) return
    setIsSubmittingNote(true)
    addNote.mutate(
      {
        id: lead.leadId,
        note: { text: newNote.trim(), agentId: user?.uid || '', createdAt: new Date() },
      },
      {
        onSuccess: () => {
          setNewNote('')
          dispatch(showToast({ message: 'Note added', type: 'success' }))
        },
        onError: () => dispatch(showToast({ message: 'Failed to add note', type: 'error' })),
        onSettled: () => setIsSubmittingNote(false),
      }
    )
  }

  return (
    <>
      <Seo
        title={`Lead: ${lead?.name || 'Loading...'}`}
        description="Lead details"
        noindex
        nofollow
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Back button */}
        <Link
          to="/admin/leads"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        {/* Loading state */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        )}

        {/* Not found state */}
        {!isLoading && !lead && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <AlertCircle className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="font-serif text-xl font-semibold text-foreground">Lead not found</h2>
            <p className="text-muted-foreground mt-2">
              The lead you are looking for does not exist.
            </p>
          </motion.div>
        )}

        {/* Lead data */}
        {!isLoading && lead && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Left column: Lead Information */}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                    <User className="h-6 w-6 text-primary" />
                    Lead Details
                  </h1>
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize text-xs font-medium px-3 py-1',
                      statusColors[lead.status] || 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {lead.status}
                  </Badge>
                </div>

                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Name
                    </dt>
                    <dd className="text-base font-medium text-foreground">{lead.name}</dd>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Email
                      </dt>
                      <dd className="flex items-center gap-2 text-sm text-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-primary transition-colors"
                        >
                          {lead.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Phone
                      </dt>
                      <dd className="flex items-center gap-2 text-sm text-foreground">
                        <Phone className="h-4 w-4 text-primary" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-primary transition-colors"
                        >
                          {lead.phone}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Property
                    </dt>
                    <dd className="flex items-center gap-2 text-sm text-foreground">
                      <Home className="h-4 w-4 text-primary" />
                      {lead.propertyTitle || 'General Inquiry'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Agent
                    </dt>
                    <dd className="flex items-center gap-2 text-sm text-foreground">
                      <User className="h-4 w-4 text-primary" />
                      {lead.agentName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Date
                    </dt>
                    <dd className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(lead.createdAt)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Status
                    </dt>
                    <dd>
                      <Select value={lead.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full sm:w-[200px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </dd>
                  </div>
                </dl>

                {/* Message (if exists) */}
                {lead.message && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 bg-muted rounded-xl border border-border p-5"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message
                    </dt>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right column: Notes */}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 flex flex-col h-full">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Notes
                </h3>

                {/* Notes list */}
                <div className="flex-1 space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 mb-4">
                  {lead.notes && lead.notes.length > 0 ? (
                    lead.notes.map((note, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="bg-muted rounded-xl border border-border p-4"
                      >
                        <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.createdAt)}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {note.agentId ? `Agent ID: ${note.agentId.slice(0, 8)}...` : 'System'}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm text-muted-foreground">No notes added yet.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add internal notes to keep track of conversations.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Add note form */}
                <div className="pt-4 border-t border-border space-y-3">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a note..."
                    rows={3}
                    className="resize-none"
                    disabled={isSubmittingNote}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSubmittingNote}
                    className="w-full gap-2"
                  >
                    {isSubmittingNote ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Note
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default LeadDetail
