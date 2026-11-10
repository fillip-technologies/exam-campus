import { lazy, Suspense, useEffect } from 'react'
import { useHome } from '@/api/public'
import { LoadError, PageLoader } from '@/components/common/LoadState'
import Hero from './sections/Hero/Hero'
import WhyExamCampus from './sections/WhyExamCampus/WhyExamCampus'
import ExamCategories from './sections/ExamCategories/ExamCategories'
import TestPass from './sections/TestPass/TestPass'
import FreeTests from './sections/FreeTests/FreeTests'
import ExamExperience from './sections/ExamExperience/ExamExperience'
import MobileApp from './sections/MobileApp/MobileApp'
import Faq from './sections/Faq/Faq'
import FinalCta from './sections/FinalCta/FinalCta'

// markdown renderer only loads when the admin adds a rich text section
const RichText = lazy(() => import('./sections/RichText/RichText'))

/** Section `type` (HomeSection.type in the API) -> component. Unknown types are skipped, so the API can add one first. */
const registry = {
  HERO: Hero,
  WHY_POINTS: WhyExamCampus,
  EXAM_CATEGORIES: ExamCategories,
  PASS: TestPass,
  FREE_TESTS: FreeTests,
  EXAM_EXPERIENCE: ExamExperience,
  MOBILE_APP: MobileApp,
  FAQ: Faq,
  FINAL_CTA: FinalCta,
  RICH_TEXT: RichText,
}

/** Homepage: the visible sections from GET /public/home, in the order the admin set. */
export default function HomePage() {
  const query = useHome()

  useEffect(() => {
    document.title = 'ExamCampus: Online Test Series for Competitive and School Exams'
  }, [])

  if (query.isPending) return <PageLoader />
  if (query.isError) return <LoadError error={query.error} onRetry={() => query.refetch()} className="my-16" />

  return (
    <>
      {query.data.sections.map((section) => {
        const Section = registry[section.type]
        if (!Section) return null
        return (
          <Suspense key={section.key} fallback={null}>
            <Section section={section} />
          </Suspense>
        )
      })}
    </>
  )
}
