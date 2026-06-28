import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import type { User, UserRole } from '@/types'

/**
 * Hook to fetch all users (admin only in service).
 * Cached for 5 minutes to balance freshness and performance.
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch a single user by UID.
 * Disabled if UID is not provided.
 */
export const useUser = (uid: string | undefined) => {
  return useQuery({
    queryKey: ['user', uid],
    queryFn: () => userService.getUser(uid!),
    enabled: !!uid,
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Mutation to update any user field (including role).
 * Invalidates affected queries on success.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: Partial<User> }) =>
      userService.updateUser(uid, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['user', variables.uid] })
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Convenience mutation to update only the user role.
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ uid, role }: { uid: string; role: UserRole }) =>
      userService.updateUser(uid, { role }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export default { useUsers, useUser, useUpdateUser, useUpdateUserRole }
