import Hero from './sections/Hero/Hero'
import WhyExamCampus from './sections/WhyExamCampus/WhyExamCampus'
import ExamCategories from './sections/ExamCategories/ExamCategories'
import TestPass from './sections/TestPass/TestPass'
import FreeTests from './sections/FreeTests/FreeTests'
import ExamExperience from './sections/ExamExperience/ExamExperience'
import MobileApp from './sections/MobileApp/MobileApp'
import Faq from './sections/Faq/Faq'
import FinalCta from './sections/FinalCta/FinalCta'

/** Homepage: sections are rendered top to bottom in this order. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyExamCampus />
      <ExamCategories />
      <TestPass />
      <FreeTests />
      <ExamExperience />
      <MobileApp />
      <Faq />
      <FinalCta />
    </>
  )
}
