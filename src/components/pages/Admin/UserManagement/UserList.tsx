import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUsers, useUpdateUserRole } from '@/hooks/useUsers'
import { DataTable } from '@/components/molecules/DataTable'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { showToast } from '@/store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { formatDate } from '@/lib/helpers/date'
import { Seo } from '@/components/atoms/Seo'
import { Users, UserCheck, UserX, Shield, UserCog, Mail, Loader2 } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import type { UserRole } from '@/types/auth'

const roleConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin: {
    label: 'Admin',
    color:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    icon: <Shield className="h-3.5 w-3.5" />,
  },
  agent: {
    label: 'Agent',
    color:
      'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800',
    icon: <UserCog className="h-3.5 w-3.5" />,
  },
  buyer: {
    label: 'Buyer',
    color:
      'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
    icon: <Users className="h-3.5 w-3.5" />,
  },
}

export const UserList = () => {
  const { data: users, isLoading, refetch } = useUsers()
  const updateRole = useUpdateUserRole()
  const dispatch = useDispatch()
  const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null)

  const handleRoleChange = (uid: string, newRole: string) => {
    const user = users?.find((u) => u.uid === uid)
    if (!user || user.role === newRole) return

    setChangingRoleFor(uid)
    updateRole.mutate(
      { uid, role: newRole as UserRole },
      {
        onSuccess: () => {
          refetch()
          dispatch(showToast({ message: `Role updated to ${newRole}`, type: 'success' }))
        },
        onError: () => {
          dispatch(
            showToast({ message: 'Failed to update role. Please try again.', type: 'error' })
          )
        },
        onSettled: () => {
          setChangingRoleFor(null)
        },
      }
    )
  }

  const columns = [
    {
      key: 'displayName',
      header: 'Name',
      sortable: true,
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 font-medium text-sm">
            {item.displayName
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              {item.displayName || 'Unnamed User'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {item.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      cell: (item: any) => {
        const config = roleConfig[item.role] ?? roleConfig.buyer
        return (
          <div className="flex items-center gap-2">
            <Select
              value={item.role}
              onValueChange={(val) => handleRoleChange(item.uid, val)}
              disabled={changingRoleFor === item.uid}
            >
              <SelectTrigger
                className={cn(
                  'h-8 w-[120px] border-0 bg-transparent px-2 text-xs font-medium capitalize hover:bg-muted transition-colors',
                  changingRoleFor === item.uid && 'opacity-50 cursor-not-allowed'
                )}
              >
                {changingRoleFor === item.uid ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <SelectValue />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className={cn('text-xs font-medium capitalize gap-1', config?.color)}
            >
              {config?.icon}
              {config?.label}
            </Badge>
          </div>
        )
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (item: any) =>
        item.isActive ? (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 text-xs gap-1"
          >
            <UserCheck className="h-3 w-3" />
            Active
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 text-xs gap-1"
          >
            <UserX className="h-3 w-3" />
            Inactive
          </Badge>
        ),
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      cell: (item: any) => (
        <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
      ),
    },
  ]

  return (
    <>
      <Seo title="User Management" description="Manage platform users" noindex nofollow />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Users
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage all registered users and their roles.
            </p>
          </div>
          {!isLoading && users && (
            <p className="text-sm text-muted-foreground font-medium">
              {users.length} {users.length === 1 ? 'user' : 'users'} total
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <DataTable
            data={users || []}
            columns={columns}
            keyExtractor={(item) => item.uid}
            isLoading={isLoading}
            emptyMessage="No users found"
            striped
            stickyHeader
          />
        </motion.div>

        {!isLoading && users && users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            {Object.entries(roleConfig).map(([role, config]) => {
              const count = users.filter((u) => u.role === role).length
              return (
                <div
                  key={role}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2.5 border text-sm',
                    config.color
                  )}
                >
                  {config.icon}
                  <span className="font-medium capitalize">{config.label}s</span>
                  <span className="font-bold">{count}</span>
                </div>
              )
            })}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default UserList
