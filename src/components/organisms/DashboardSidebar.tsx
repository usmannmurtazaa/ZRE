import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/helpers/cn'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  LayoutDashboard,
  Heart,
  Search,
  MessageSquare,
  User,
  Home,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: ('buyer' | 'agent' | 'admin')[]
}

export const DashboardSidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const [collapsed, setCollapsed] = useState(isMobile)

  useMemo(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  const userInitials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2) || 'U'

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['buyer', 'agent', 'admin'],
    },
    {
      label: 'Favorites',
      href: '/dashboard/favorites',
      icon: <Heart className="w-5 h-5" />,
      roles: ['buyer'],
    },
    {
      label: 'Saved Searches',
      href: '/dashboard/saved-searches',
      icon: <Search className="w-5 h-5" />,
      roles: ['buyer'],
    },
    {
      label: 'Inquiries',
      href: '/dashboard/inquiries',
      icon: <MessageSquare className="w-5 h-5" />,
      roles: ['buyer'],
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: <User className="w-5 h-5" />,
      roles: ['buyer', 'agent', 'admin'],
    },
    // Agent
    {
      label: 'Agent Dashboard',
      href: '/agent-dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['agent', 'admin'],
    },
    {
      label: 'My Leads',
      href: '/agent-dashboard/leads',
      icon: <Users className="w-5 h-5" />,
      roles: ['agent', 'admin'],
    },
    {
      label: 'My Properties',
      href: '/agent-dashboard/properties',
      icon: <Home className="w-5 h-5" />,
      roles: ['agent', 'admin'],
    },
    {
      label: 'Analytics',
      href: '/agent-dashboard/analytics',
      icon: <Search className="w-5 h-5" />,
      roles: ['agent', 'admin'],
    },
    // Admin
    {
      label: 'Admin Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      label: 'All Properties',
      href: '/admin/properties',
      icon: <Home className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      label: 'All Leads',
      href: '/admin/leads',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      label: 'Areas',
      href: '/admin/areas',
      icon: <MapPin className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin'],
    },
  ]

  const filteredItems = useMemo(
    () => navItems.filter((item) => !item.roles || item.roles.includes((user as any)?.role)),
    [navItems, user]
  )

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setCollapsed(true)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? (isMobile ? 0 : 72) : 280,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }}
        className={cn(
          'sticky top-16 h-[calc(100vh-4rem)] z-50 flex flex-col border-r border-border bg-card/90 backdrop-blur-xl transition-colors',
          collapsed && !isMobile && 'items-center',
          isMobile && collapsed && 'w-0 border-none',
          isMobile && !collapsed && 'fixed left-0 top-16 w-[280px] z-50 shadow-2xl'
        )}
      >
        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className={cn(
              'absolute -right-3.5 top-20 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              collapsed && '-right-3.5'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && !collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="absolute top-3 right-3 p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Profile section (only when expanded) */}
        <AnimatePresence mode="sync">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 py-6 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-border">
                  {user?.photoURL ? (
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName ?? ''} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground text-sm">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="truncate text-xs text-muted-foreground capitalize">
                    {(user as any)?.role || 'buyer'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200">
          {filteredItems.map((item) => {
            const isActive =
              location.pathname === item.href || location.pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && !isMobile && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
                <span
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {item.icon}
                </span>
                {(isMobile || !collapsed) && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all',
              collapsed && !isMobile && 'justify-center px-2'
            )}
            onClick={logout}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(isMobile || !collapsed) && <span>Logout</span>}
          </Button>
        </div>
      </motion.aside>
    </>
  )
}

export default DashboardSidebar
