import { useQuery } from '@tanstack/react-query'
import { areaService } from '@/services/areaService'
import type { Area } from '@/types/area'

/**
 * Fetch all areas. Cached for 1 hour as area data is relatively static.
 */
export const useAreas = () => {
  return useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: areaService.getAll,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // keep previous while refetching
  })
}

/**
 * Fetch a single area by its Firestore document ID.
 */
export const useArea = (id: string | undefined) => {
  return useQuery<Area | null>({
    queryKey: ['area', id],
    queryFn: () => (id ? areaService.getById(id) : null),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  })
}

/**
 * Fetch a single area by its URL slug.
 */
export const useAreaBySlug = (slug: string | undefined) => {
  return useQuery<Area | null>({
    queryKey: ['area', 'slug', slug],
    queryFn: () => (slug ? areaService.getBySlug(slug) : null),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  })
}

// Re-export for convenience
const hooks = { useAreas, useArea, useAreaBySlug }
export default hooks
