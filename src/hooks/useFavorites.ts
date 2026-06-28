import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/config/firebase'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook to fetch the current user's favorite property IDs.
 * Requires authentication; otherwise returns an empty array.
 */
export const useFavorites = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['favorites', user?.uid],
    queryFn: async () => {
      if (!user) return []
      const favRef = collection(db, `users/${user.uid}/favorites`)
      const snapshot = await getDocs(favRef)
      return snapshot.docs.map(
        (doc) =>
          ({ id: doc.id, ...doc.data() }) as {
            id: string
            propertyId: string
            propertyTitle: string
            addedAt: Timestamp
          }
      )
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes – reasonable balance for personal data
    placeholderData: (previousData) => previousData ?? [],
  })
}

/**
 * Mutation to toggle (add/remove) a property from favorites.
 * Returns the action performed and the property ID.
 * Requires the user to be logged in; shows a toast if not.
 */
export const useToggleFavorite = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      propertyId,
      propertyTitle,
    }: {
      propertyId: string
      propertyTitle: string
    }) => {
      if (!user) {
        throw new Error('You must be logged in to save properties.')
      }

      const favRef = collection(db, `users/${user.uid}/favorites`)
      const q = query(favRef, where('propertyId', '==', propertyId))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        // Remove from favorites
        const favDoc = snapshot.docs[0]! // guaranteed to exist because snapshot.empty is false
        await deleteDoc(doc(db, `users/${user.uid}/favorites`, favDoc.id))
        return { action: 'removed', propertyId }
      } else {
        // Add to favorites
        await addDoc(favRef, {
          propertyId,
          propertyTitle,
          addedAt: Timestamp.fromDate(new Date()),
        })
        return { action: 'added', propertyId }
      }
    },
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
    },
    onSuccess: (result) => {
      // Invalidate the favorites query to refetch the updated list
      void queryClient.invalidateQueries({ queryKey: ['favorites'] })
      // Also invalidate the property list so any favorite-related UI can update
      void queryClient.invalidateQueries({ queryKey: ['properties'] })

      if (result.action === 'added') {
        toast({ title: 'Saved to favorites', description: 'Property has been saved.' })
      } else {
        toast({ title: 'Removed from favorites', description: 'Property has been removed.' })
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not update favorites.',
        variant: 'destructive',
      })
    },
  })
}

// Optional: a simple hook to quickly check if a specific property is saved
export const useIsFavorite = (propertyId: string | undefined) => {
  const { data: favorites = [] } = useFavorites()
  if (!propertyId) return false
  return favorites.some((fav) => fav.propertyId === propertyId)
}

// Re-export for convenience
const hooks = { useFavorites, useToggleFavorite, useIsFavorite }
export default hooks
