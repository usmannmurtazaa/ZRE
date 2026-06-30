import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ErrorBoundary } from './components/atoms/ErrorBoundary'
import { AuthGuard } from './components/atoms/AuthGuard'
import { RoleGuard } from './components/atoms/RoleGuard'
import { Layout } from './components/templates/Layout'
import { PublicLayout } from './components/templates/PublicLayout'

// ---------- Public Pages ----------
const Home = lazy(() => import('./components/pages/Home/Home'))
const Properties = lazy(() => import('./components/pages/Properties/Properties'))
const PropertyDetail = lazy(() => import('./components/pages/PropertyDetail/PropertyDetail'))
const About = lazy(() => import('./components/pages/About/About'))
const Contact = lazy(() => import('./components/pages/Contact/Contact'))
const Areas = lazy(() => import('./components/pages/Areas/Areas'))
const AreaDetail = lazy(() => import('./components/pages/AreaDetail/AreaDetail'))
const Privacy = lazy(() => import('./components/pages/Privacy/Privacy'))
const Terms = lazy(() => import('./components/pages/Terms/Terms'))

// ---------- Auth Pages ----------
const Login = lazy(() => import('./components/pages/Auth/Login'))
const Register = lazy(() => import('./components/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('./components/pages/Auth/ForgotPassword'))

// ---------- User Dashboard ----------
const Dashboard = lazy(() => import('./components/pages/Dashboard/Dashboard'))
const Favorites = lazy(() => import('./components/pages/Dashboard/Favorites'))
const Inquiries = lazy(() => import('./components/pages/Dashboard/Inquiries'))
const Profile = lazy(() => import('./components/pages/Dashboard/Profile'))

// ---------- Agent Dashboard ----------
const AgentDashboard = lazy(() => import('./components/pages/AgentDashboard/AgentDashboard'))
const Leads = lazy(() => import('./components/pages/AgentDashboard/Leads'))
const MyProperties = lazy(() => import('./components/pages/AgentDashboard/MyProperties'))
const Analytics = lazy(() => import('./components/pages/AgentDashboard/Analytics'))

// ---------- Admin Pages ----------
const AdminDashboard = lazy(() => import('./components/pages/Admin/AdminDashboard'))
const PropertyList = lazy(() => import('./components/pages/Admin/PropertyManagement/PropertyList'))
const PropertyForm = lazy(() => import('./components/pages/Admin/PropertyManagement/PropertyForm'))
const LeadList = lazy(() => import('./components/pages/Admin/LeadManagement/LeadList'))
const LeadDetail = lazy(() => import('./components/pages/Admin/LeadManagement/LeadDetail'))
const UserList = lazy(() => import('./components/pages/Admin/UserManagement/UserList'))
const Settings = lazy(() => import('./components/pages/Admin/Settings/Settings'))

// ---------- Area Management (Admin) ----------
const AreaList = lazy(() => import('./components/pages/Admin/AreaManagement/AreaList'))
const AreaForm = lazy(() => import('./components/pages/Admin/AreaManagement/AreaForm'))

const NotFound = lazy(() => import('./components/pages/NotFound/NotFound'))

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <span className="sr-only">Loading page...</span>
      </div>
      <p className="mt-6 text-sm font-medium text-muted-foreground">Preparing your experience</p>
    </div>
  )
}

function PageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    try {
      const gtag = (window as any).gtag
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_title: document.title,
        })
      }
    } catch {
      // analytics not available
    }
  }, [location])
  return null
}

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <PageViewTracker />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/areas/:slug" element={<AreaDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes (authenticated) */}
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/favorites" element={<Favorites />} />
              <Route path="/dashboard/inquiries" element={<Inquiries />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Agent Routes */}
          <Route element={<AuthGuard />}>
            <Route element={<RoleGuard allowedRoles={['agent', 'admin']} />}>
              <Route element={<Layout />}>
                <Route path="/agent-dashboard" element={<AgentDashboard />} />
                <Route path="/agent-dashboard/leads" element={<Leads />} />
                <Route path="/agent-dashboard/properties" element={<MyProperties />} />
                <Route path="/agent-dashboard/analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes (includes Areas) */}
          <Route element={<AuthGuard />}>
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route element={<Layout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/properties" element={<PropertyList />} />
                <Route path="/admin/properties/new" element={<PropertyForm />} />
                <Route path="/admin/properties/:id/edit" element={<PropertyForm />} />
                <Route path="/admin/leads" element={<LeadList />} />
                <Route path="/admin/leads/:id" element={<LeadDetail />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/settings" element={<Settings />} />
                {/* Area Management */}
                <Route path="/admin/areas" element={<AreaList />} />
                <Route path="/admin/areas/new" element={<AreaForm />} />
                <Route path="/admin/areas/:id/edit" element={<AreaForm />} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default AppRoutes
