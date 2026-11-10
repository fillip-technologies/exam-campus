import { Route, Routes } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { isStaff } from '@/services/authService'
import { PageLoader } from '@/components/common/LoadState'
import AdminLayout from './AdminLayout'
import { AdminUiProvider } from './ui'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import ResourceListPage from './pages/ResourceListPage'
import ResourceEditPage from './pages/ResourceEditPage'
import SiteSettingsPage from './pages/SiteSettingsPage'
import MediaPage from './pages/MediaPage'
import UsersPage from './pages/UsersPage'
import WaitlistPage from './pages/WaitlistPage'
import AuditLogPage from './pages/AuditLogPage'
import NotFound from './pages/NotFound'

/**
 * Admin panel (/admin/*), loaded as its own chunk. Staff (SUPPORT and above) only; the API checks every
 * request again, so hiding a screen here is convenience, not security.
 */
export default function AdminApp() {
  const { user, ready } = useAuth()
  if (!ready) return <PageLoader label="Checking your session…" />
  if (!isStaff(user)) return <LoginPage />

  return (
    <AdminUiProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="r/:resource" element={<ResourceListPage />} />
          <Route path="r/:resource/:id" element={<ResourceEditPage />} />
          <Route path="settings" element={<SiteSettingsPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="waitlist" element={<WaitlistPage />} />
          <Route path="audit" element={<AuditLogPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AdminUiProvider>
  )
}
