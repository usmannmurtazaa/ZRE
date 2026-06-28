// ─── Hooks barrel export ───────────────────────────────────────────
// Re‑export all public hooks so they can be imported from '@/hooks' directly.

export { useAuth } from './useAuth'
export {
  useProperties,
  useProperty,
  usePropertyBySlug,
  useFeaturedProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useIncrementPropertyViews,
} from './useProperties'
export {
  useLeadsByAgent,
  useLead,
  useCreateLead,
  useUpdateLeadStatus,
  useAddLeadNote,
  useAllLeads,
} from './useLeads'
export { useAreas, useArea, useAreaBySlug } from './useAreas'
export { useFavorites, useToggleFavorite, useIsFavorite } from './useFavorites'
export { useUsers, useUser, useUpdateUser, useUpdateUserRole } from './useUsers'
export { useSettings, useUpdateSettings } from './useSettings'
export { useMediaQuery } from './useMediaQuery'
export { useIntersectionObserver } from './useIntersectionObserver'
export { useToast, toast } from './use-toast'
