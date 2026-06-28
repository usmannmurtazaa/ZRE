import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '@/services/settingsService'
import type { Setting } from '@/types/settings'

/**
 * Hook to fetch all site settings.
 * Cached for 1 hour as settings rarely change.
 */
export const useSettings = () => {
  return useQuery<Setting[]>({
    queryKey: ['settings'],
    queryFn: settingsService.getAll,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Mutation to update multiple settings at once.
 * Invalidates the settings query after successful update.
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: Setting[]) => settingsService.updateMany(settings),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

// Re‑export for convenience
const hooks = { useSettings, useUpdateSettings }
export default hooks
