import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useClass } from '@/api/public'
import { pageState } from '@/components/common/LoadState'
import QuickInfoBar from '@/components/hub/QuickInfoBar'
import StickySectionNav from '@/components/hub/StickySectionNav'
import TestSeriesSection from '@/components/hub/TestSeriesSection'
import InlineSeriesCta from '@/components/hub/InlineSeriesCta'
import FreeMockTest from '@/components/hub/FreeMockTest'
import FaqSection from '@/components/hub/FaqSection'
import HubFinalCta from '@/components/hub/HubFinalCta'
import ClassHero from './components/ClassHero'
import SubjectsGrid from './components/SubjectsGrid'
import HowItWorks from './components/HowItWorks'
import ClassSyllabus from './components/ClassSyllabus'
import OtherClasses from './components/OtherClasses'

/** Sticky navigation is built from the data, so it never links to a section that is not rendered. */
const buildNavItems = (cls) =>
  [
    { id: 'overview', label: 'Overview' },
    cls.testSeries?.length && { id: 'test-series', label: 'Test Series' },
    cls.subjects?.length && { id: 'subjects', label: 'Subjects' },
    cls.howItWorks?.length && { id: 'how-it-works', label: 'How It Works' },
    cls.subjects?.length && { id: 'syllabus', label: 'Syllabus' },
    cls.freeTests?.length && { id: 'free-test', label: 'Free Test' },
    cls.faqs?.length && { id: 'faqs', label: 'FAQs' },
  ].filter(Boolean)

/**
 * Master Academic Class Hub page. Everything on it comes from GET /public/classes/:slug, so a new class
 * page is created (and published) in the admin panel.
 */
export default function ClassDetailsPage() {
  const { slug } = useParams()
  const query = useClass(slug)
  const cls = query.data

  useEffect(() => {
    if (cls) document.title = `${cls.name} Test Series: Chapter-wise, Unit & Full Syllabus Tests | ExamCampus`
  }, [cls])

  const state = pageState(query)
  if (state) return state

  const { name } = cls
  const primarySeries = cls.testSeries?.find((s) => s.isPrimary) ?? cls.testSeries?.[0]

  return (
    <>
      <ClassHero cls={cls} />
      <QuickInfoBar items={cls.quickInfo} />
      <StickySectionNav items={buildNavItems(cls)} />

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <TestSeriesSection
          examName={name}
          series={cls.testSeries}
          freeTestCount={cls.freeTests?.length ?? 0}
          intro={`Practise every ${name} chapter with timed online tests, detailed solutions and chapter-wise analysis.`}
        />
        <SubjectsGrid className={name} subjects={cls.subjects} />
        <HowItWorks steps={cls.howItWorks} />
        <InlineSeriesCta examName={name} series={primarySeries} text={`Practise every ${name} chapter with timed online tests.`} />
        <ClassSyllabus className={name} subjects={cls.subjects} />
        <FreeMockTest examName={name} tests={cls.freeTests} />
        <FaqSection examName={name} faqs={cls.faqs} />
        <OtherClasses classes={cls.relatedClasses} />
      </div>

      <HubFinalCta
        examName={name}
        title={`Ready to Start Practising for ${name}?`}
        text="Choose the Test Series, practise chapter by chapter and see your child improve."
        primaryLabel={`Explore ${name} Test Series`}
      />
    </>
  )
}
