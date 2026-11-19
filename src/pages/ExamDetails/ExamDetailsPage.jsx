import { useParams } from 'react-router-dom'
import { useExam } from '@/api/public'
import { pageState } from '@/components/common/LoadState'
import ExamHero from './components/ExamHero'
import ExamSeo from './components/ExamSeo'
import QuickInfoBar from '@/components/hub/QuickInfoBar'
import StickySectionNav from '@/components/hub/StickySectionNav'
import TestSeriesSection from '@/components/hub/TestSeriesSection'
import CoursesSection from '@/components/hub/CoursesSection'
import FacultySection from '@/components/hub/FacultySection'
import MobileEnrollBar from '@/components/hub/MobileEnrollBar'
import { sampleCourses, sampleFaculty } from '@/data/sampleCourses'
import { samplePapers } from '@/data/samplePapers'
import LatestUpdates from './components/LatestUpdates'
import ImportantDates from './components/ImportantDates'
import EligibilitySection from './components/EligibilitySection'
import ExamPattern from './components/ExamPattern'
import SyllabusSection from './components/SyllabusSection'
import PreviousYearPapers from './components/PreviousYearPapers'
import FreeMockTest from '@/components/hub/FreeMockTest'
import PreparationResources from './components/PreparationResources'
import FaqSection from '@/components/hub/FaqSection'
import RelatedExams from './components/RelatedExams'
import HubFinalCta from '@/components/hub/HubFinalCta'
import InlineSeriesCta from '@/components/hub/InlineSeriesCta'

/** Builds the sticky navigation from the data, so it never links to a section that is not rendered. */
const buildNavItems = (exam, courses, faculty, papers) =>
  [
    { id: 'overview', label: 'Overview' },
    courses.length && { id: 'courses', label: 'Courses' },
    exam.testSeries?.length && { id: 'test-series', label: 'Test Series' },
    faculty.length && { id: 'faculty', label: 'Faculty' },
    exam.importantDates?.length && { id: 'exam-dates', label: 'Exam Dates' },
    exam.eligibility?.sections?.length && { id: 'eligibility', label: 'Eligibility' },
    exam.examPattern?.stages?.length && { id: 'exam-pattern', label: 'Exam Pattern' },
    exam.syllabus?.stages?.length && { id: 'syllabus', label: 'Syllabus' },
    papers.length && { id: 'previous-year-papers', label: 'Previous Year Papers' },
    exam.freeTests?.length && { id: 'free-test', label: 'Free Test' },
    exam.faqs?.length && { id: 'faqs', label: 'FAQs' },
  ].filter(Boolean)

/**
 * Master Exam Hub page. Everything on it comes from GET /public/exams/:slug, so a new exam page is
 * created (and published) in the admin panel.
 *
 * Order follows the big test-prep sites: who the page is for (hero + key facts) and the in-page tabs first,
 * then what to buy (courses, teachers, test series), then the exam information.
 */
export default function ExamDetailsPage() {
  const { slug } = useParams()
  const query = useExam(slug)
  const exam = query.data

  const state = pageState(query)
  if (state) return state

  const { name } = exam
  const primarySeries = exam.testSeries?.find((s) => s.isPrimary) ?? exam.testSeries?.[0]
  // Until the API sends `courses` / `faculty`, dev builds show sample data (src/data/sampleCourses.js); production shows none.
  const courses = exam.courses ?? (import.meta.env.DEV ? sampleCourses(name) : [])
  const faculty = exam.faculty ?? (import.meta.env.DEV ? sampleFaculty : [])
  const papers = exam.previousYearPapers?.length ? exam.previousYearPapers : import.meta.env.DEV ? samplePapers() : []
  const primaryCourse = courses.find((c) => c.isPrimary) ?? courses[0]
  const hasFreeTests = exam.freeTests?.length > 0

  return (
    <>
      <ExamSeo exam={exam} slug={slug} />
      <ExamHero exam={exam} hasCourses={courses.length > 0} hasSeries={exam.testSeries?.length > 0} hasFreeTests={hasFreeTests} />
      {exam.quickInfo?.length > 0 && <QuickInfoBar items={exam.quickInfo} wide />}
      <StickySectionNav items={buildNavItems(exam, courses, faculty, papers)} wide />

      <div className="w-full space-y-6 px-4 pb-10 pt-8 sm:px-6 lg:px-12">
        <CoursesSection examName={name} org={exam.org} courses={courses} demoVideoUrl={exam.demoVideoUrl} />
        <TestSeriesSection examName={name} org={exam.org} series={exam.testSeries} freeTestCount={exam.freeTests?.length ?? 0} />
        <FacultySection examName={name} faculty={faculty} />
        <LatestUpdates examName={name} updates={exam.latestUpdates} />
        <ImportantDates examName={name} events={exam.importantDates} />
        <EligibilitySection examName={name} eligibility={exam.eligibility} />
        <ExamPattern examName={name} pattern={exam.examPattern} />
        <InlineSeriesCta examName={name} series={primarySeries} text={`Practise this pattern with the ${name} Test Series.`} />
        <SyllabusSection examName={name} syllabus={exam.syllabus} />
        <PreviousYearPapers examName={name} slug={slug} papers={papers} />
        <FreeMockTest examName={name} tests={exam.freeTests} />
        <PreparationResources examName={name} resources={exam.resources} />
        <FaqSection examName={name} faqs={exam.faqs} />
        <RelatedExams exams={exam.relatedExams} />
      </div>

      <HubFinalCta
        examName={name}
        text={courses.length ? 'Pick a course or a test series, practise regularly and prepare with confidence.' : undefined}
        primaryLabel={courses.length ? `Explore ${name} Courses` : undefined}
        primaryHref={courses.length ? '#courses' : '#test-series'}
        wide
      />
      <MobileEnrollBar product={primaryCourse ?? primarySeries} />
    </>
  )
}
