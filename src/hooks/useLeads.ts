import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadService } from '@/services/leadService'
import type { CreateLeadInput, LeadStatus } from '@/types'

/**
 * Hook to fetch leads assigned to a specific agent, optionally filtered by status.
 * Disabled when agentId is not provided to avoid unnecessary calls.
 */
export const useLeadsByAgent = (agentId: string, status?: LeadStatus) => {
  return useQuery({
    queryKey: ['leads', 'agent', agentId, status],
    queryFn: () => leadService.getByAgent(agentId, status),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: !!agentId,
  })
}

/**
 * Hook to fetch a single lead by its ID.
 */
export const useLead = (id: string | undefined) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => (id ? leadService.getById(id) : null),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  })
}

/**
 * Mutation to create a new lead.
 * Invalidates the leads list and the property's data to reflect the new inquiry count.
 */
export const useCreateLead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLeadInput) => leadService.create(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['leads'] })
      void queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] })
    },
  })
}

/**
 * Mutation to update the status of a lead.
 * Invalidates relevant lead queries to ensure UI is up‑to‑date.
 */
export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      leadService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['leads'] })
      void queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
    },
  })
}

/**
 * Mutation to add a note to a lead.
 * Invalidates the specific lead query so the note list is refreshed.
 */
export const useAddLeadNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      note,
    }: {
      id: string
      note: { text: string; agentId: string; createdAt?: Date }
    }) => leadService.addNote(id, note),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
    },
  })
}

/**
 * Hook to fetch all leads (admin use).
 * Cached for 1 minute to keep the admin panel responsive.
 */
export const useAllLeads = () => {
  return useQuery({
    queryKey: ['leads', 'all'],
    queryFn: () => leadService.getAll(),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Re‑export for convenience
const hooks = {
  useLeadsByAgent,
  useLead,
  useCreateLead,
  useUpdateLeadStatus,
  useAddLeadNote,
  useAllLeads,
}

export default hooks
