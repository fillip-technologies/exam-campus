import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import ScrollManager from '@/components/common/ScrollManager'
import HomePage from '@/pages/Home/HomePage'
import ExamDetailsPage from '@/pages/ExamDetails/ExamDetailsPage'
import ClassDetailsPage from '@/pages/ClassDetails/ClassDetailsPage'
import EnrollPage from '@/pages/Enroll/EnrollPage'
import FreeTestPage from '@/pages/FreeTest/FreeTestPage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

export default function App() {
  return (
    <MainLayout>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exams/:slug" element={<ExamDetailsPage />} />
        <Route path="/academic/:slug" element={<ClassDetailsPage />} />
        <Route path="/enroll/:slug" element={<EnrollPage />} />
        <Route path="/free-test/:slug" element={<FreeTestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  )
}
