import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { areaService } from '@/services/areaService'
import type { Area } from '@/types/area'

export const useAreas = () => {
  return useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: areaService.getAll,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}

export const useArea = (id: string | undefined) => {
  return useQuery<Area | null>({
    queryKey: ['area', id],
    queryFn: () => (id ? areaService.getById(id) : null),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  })
}

export const useAreaBySlug = (slug: string | undefined) => {
  return useQuery<Area | null>({
    queryKey: ['area', 'slug', slug],
    queryFn: () => (slug ? areaService.getBySlug(slug) : null),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  })
}

// ── Area Mutations ──────────────────────────────────────────────────

export const useCreateArea = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Area, 'areaId' | 'createdAt' | 'updatedAt'>) =>
      areaService.create({
        ...data,
        propertyCount: 0,
        popularity: 0,
      } as any),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['areas'] })
    },
  })
}

export const useUpdateArea = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Area> }) => areaService.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['areas'] })
      void queryClient.invalidateQueries({ queryKey: ['area', variables.id] })
    },
  })
}

const hooks = { useAreas, useArea, useAreaBySlug, useCreateArea, useUpdateArea }
export default hooks
