import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '@/services/propertyService'
import type { PropertyFilters, CreatePropertyInput, UpdatePropertyInput } from '@/types'

// ----------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------

/**
 * Fetch a paginated / filtered list of properties.
 * `filters` object is used as a query key dependency.
 */
export const useProperties = (filters: PropertyFilters) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // keep previous while fetching new page
  })
}

/**
 * Fetch a single property by its Firestore document ID.
 */
export const useProperty = (id: string | undefined) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => (id ? propertyService.getById(id) : null),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch a single property by its URL slug.
 */
export const usePropertyBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['property', 'slug', slug],
    queryFn: () => (slug ? propertyService.getBySlug(slug) : null),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch featured properties with a configurable limit (default 6).
 */
export const useFeaturedProperties = (limit = 6) => {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: () => propertyService.getFeatured(limit),
    staleTime: 60 * 60 * 1000, // 1 hour – featured list changes rarely
  })
}

// ----------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------

/**
 * Create a new property.
 * Invalidates the main property list on success.
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePropertyInput) => propertyService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

/**
 * Update an existing property by ID.
 * Invalidates both the list and the individual property cache.
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyInput }) =>
      propertyService.update(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
      void queryClient.invalidateQueries({ queryKey: ['property', variables.id] })
    },
  })
}

/**
 * Delete a property by ID.
 * Invalidates the property list cache on success.
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => propertyService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

/**
 * Increment the view counter for a property.
 * Invalidates the individual property cache so the UI reflects the change.
 */
export const useIncrementPropertyViews = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => propertyService.incrementViews(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['property', id] })
    },
  })
}

// Re-export for convenience
export const hooks = {
  useProperties,
  useProperty,
  usePropertyBySlug,
  useFeaturedProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useIncrementPropertyViews,
}

export default hooks
