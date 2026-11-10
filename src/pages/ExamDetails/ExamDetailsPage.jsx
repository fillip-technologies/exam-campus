import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useExam } from '@/api/public'
import { pageState } from '@/components/common/LoadState'
import ExamHero from './components/ExamHero'
import QuickInfoBar from '@/components/hub/QuickInfoBar'
import StickySectionNav from '@/components/hub/StickySectionNav'
import TestSeriesSection from '@/components/hub/TestSeriesSection'
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
import CourseSidebar from '@/components/hub/CourseSidebar'
import InlineSeriesCta from '@/components/hub/InlineSeriesCta'

/** Builds the sticky navigation from the data, so it never links to a section that is not rendered. */
const buildNavItems = (exam) =>
  [
    { id: 'overview', label: 'Overview' },
    exam.testSeries?.length && { id: 'test-series', label: 'Test Series' },
    exam.importantDates?.length && { id: 'exam-dates', label: 'Exam Dates' },
    exam.eligibility?.sections?.length && { id: 'eligibility', label: 'Eligibility' },
    exam.examPattern?.stages?.length && { id: 'exam-pattern', label: 'Exam Pattern' },
    exam.syllabus?.stages?.length && { id: 'syllabus', label: 'Syllabus' },
    { id: 'previous-year-papers', label: 'Previous Year Papers' },
    exam.freeTests?.length && { id: 'free-test', label: 'Free Test' },
    exam.faqs?.length && { id: 'faqs', label: 'FAQs' },
  ].filter(Boolean)

/**
 * Master Exam Hub page. Everything on it comes from GET /public/exams/:slug, so a new exam page is
 * created (and published) in the admin panel.
 */
export default function ExamDetailsPage() {
  const { slug } = useParams()
  const query = useExam(slug)
  const exam = query.data

  useEffect(() => {
    if (exam) document.title = exam.seo?.title && exam.seo.title !== exam.name ? exam.seo.title : `${exam.name} Exam Hub: Test Series, Syllabus, Pattern | ExamCampus`
  }, [exam])

  const state = pageState(query)
  if (state) return state

  const { name } = exam
  const primarySeries = exam.testSeries?.find((s) => s.isPrimary) ?? exam.testSeries?.[0]

  return (
    <>
      <div className="mx-auto grid w-full gap-6 px-4 pb-10 pt-8 sm:px-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:px-12">
        <div className="min-w-0 space-y-6">
          <TestSeriesSection examName={name} org={exam.org} series={exam.testSeries} freeTestCount={exam.freeTests?.length ?? 0} />
          <div>
            <ExamHero exam={exam} />
            <QuickInfoBar items={exam.quickInfo} />
          </div>
          <StickySectionNav items={buildNavItems(exam)} />
        <LatestUpdates examName={name} updates={exam.latestUpdates} />
        <ImportantDates examName={name} events={exam.importantDates} />
        <EligibilitySection examName={name} eligibility={exam.eligibility} />
        <ExamPattern examName={name} pattern={exam.examPattern} />
        <InlineSeriesCta examName={name} series={primarySeries} text={`Practise this pattern with the ${name} Test Series.`} />
        <SyllabusSection examName={name} syllabus={exam.syllabus} />
        <PreviousYearPapers examName={name} papers={exam.previousYearPapers} />
        <FreeMockTest examName={name} tests={exam.freeTests} />
        <PreparationResources examName={name} resources={exam.resources} />
        <FaqSection examName={name} faqs={exam.faqs} />
        <RelatedExams exams={exam.relatedExams} />
        </div>
        <CourseSidebar series={primarySeries} freeTestCount={exam.freeTests?.length ?? 0} />
      </div>

      <HubFinalCta examName={name} />
    </>
  )
}
