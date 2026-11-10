import { lazy, Suspense } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import ScrollManager from '@/components/common/ScrollManager'
import { PageLoader } from '@/components/common/LoadState'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import HomePage from '@/pages/Home/HomePage'
import ExamDetailsPage from '@/pages/ExamDetails/ExamDetailsPage'
import ClassDetailsPage from '@/pages/ClassDetails/ClassDetailsPage'
import EnrollPage from '@/pages/Enroll/EnrollPage'
import FreeTestPage from '@/pages/FreeTest/FreeTestPage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

// Admin panel: its own chunk, so visitors never download it.
const AdminApp = lazy(() => import('@/admin/AdminApp'))
// CMS pages pull in the markdown renderer: load it only when a /pages/* URL is opened.
const CmsPage = lazy(() => import('@/pages/Page/CmsPage'))

function SiteLayout() {
  const { pathname } = useLocation()
  return (
    <MainLayout>
      <ScrollManager />
      <ErrorBoundary resetKey={pathname}>
        <Outlet />
      </ErrorBoundary>
    </MainLayout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader label="Loading admin…" />}>
              <AdminApp />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/exams/:slug" element={<ExamDetailsPage />} />
        <Route path="/academic/:slug" element={<ClassDetailsPage />} />
        <Route path="/enroll/:slug" element={<EnrollPage />} />
        <Route path="/free-test/:slug" element={<FreeTestPage />} />
        <Route
          path="/pages/:slug"
          element={
            <Suspense fallback={<PageLoader />}>
              <CmsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
