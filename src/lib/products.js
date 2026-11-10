import { allExams } from '@/data/exams'
import { allClasses } from '@/data/classes'
import { allTestSeries } from '@/data/testSeries'
import { freeTests } from '@/data/freeTests'

// PLACEHOLDER: replace with the real pass plan.
const pass = { title: 'ExamCampus Pass', validity: '12 Months', price: 1999, originalPrice: 5999 }

/**
 * Finds what a /enroll/:slug URL refers to: the pass, an exam hub's test series, a class hub's test
 * series, or a test series card from the homepage. Returns null for an unknown slug.
 */
export function getProductBySlug(slug) {
  if (slug === 'pass') return pass

  const packages = [...allExams, ...allClasses].flatMap((h) => h.testSeries ?? [])
  const pkg = packages.find((t) => t.enrollUrl === `/enroll/${slug}`)
  if (pkg) return pkg

  const exam = allExams.find((e) => e.slug === slug)
  if (exam?.testSeries?.[0]) return exam.testSeries[0]

  const cls = allClasses.find((c) => c.slug === slug)
  if (cls?.testSeries?.[0]) return cls.testSeries[0]

  const series = allTestSeries.find((t) => t.slug === slug)
  if (series) return { title: series.title, validity: series.validity, price: series.price, originalPrice: series.mrp }

  return null
}

/**
 * Finds the free test a /free-test/:slug URL refers to: an exam hub's free test, a class hub's free test,
 * or a free test card from the homepage. Returns null for an unknown slug.
 */
export function getFreeTestBySlug(slug) {
  const exam = allExams.find((e) => e.slug === slug)
  if (exam?.freeTests?.[0]) return exam.freeTests[0]

  const cls = allClasses.find((c) => c.slug === slug)
  if (cls?.freeTests?.[0]) return cls.freeTests[0]

  const test = freeTests.find((t) => t.slug === slug)
  if (test) {
    return { title: `${test.exam} Free Mock Test`, questions: test.questions, durationMinutes: test.minutes, type: 'Full-length mock test' }
  }

  return null
}
