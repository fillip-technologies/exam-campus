import { lazy, Suspense } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import ScrollManager from '@/components/common/ScrollManager'
import { PageLoader } from '@/components/common/LoadState'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import HomePage from '@/pages/Home/HomePage'
import ExamDetailsPage from '@/pages/ExamDetails/ExamDetailsPage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

// Home and the exam hubs (the main landing pages) ship in the main bundle; the rest load when first opened.
const ExamPapersPage = lazy(() => import('@/pages/ExamPapers/ExamPapersPage'))
const ExamDirectoryPage = lazy(() => import('@/pages/Listings/ExamDirectoryPage'))
const AllTestSeriesPage = lazy(() => import('@/pages/Listings/AllTestSeriesPage'))
const AllFreeTestsPage = lazy(() => import('@/pages/Listings/AllFreeTestsPage'))
const ClassDetailsPage = lazy(() => import('@/pages/ClassDetails/ClassDetailsPage'))
const EnrollPage = lazy(() => import('@/pages/Enroll/EnrollPage'))
const FreeTestPage = lazy(() => import('@/pages/FreeTest/FreeTestPage'))

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
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
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
        <Route path="/exams" element={<ExamDirectoryPage mode="exams" />} />
        <Route path="/previous-year-papers" element={<ExamDirectoryPage mode="papers" key="papers" />} />
        <Route path="/test-series" element={<AllTestSeriesPage />} />
        <Route path="/free-tests" element={<AllFreeTestsPage />} />
        <Route path="/exams/:slug" element={<ExamDetailsPage />} />
        <Route path="/exams/:slug/previous-year-papers" element={<ExamPapersPage />} />
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
