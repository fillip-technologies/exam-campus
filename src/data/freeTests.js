import { slugify } from '@/lib/slugify'

// PLACEHOLDER data: set real question counts and durations for each free mock.
// `org` is the logo key (see /public/exam-logos).
const test = (exam, org, category, questions, minutes) => ({
  exam,
  org,
  category,
  questions,
  minutes,
  slug: slugify(exam),
})

export const freeTestFilters = ['All', 'Teaching', 'SSC', 'Banking', 'Railway', 'UPSC']

export const freeTests = [
  test('BPSC TRE', 'bpsc', 'Teaching', 100, 120),
  test('SSC CGL', 'ssc', 'SSC', 100, 60),
  test('SBI PO', 'sbi', 'Banking', 100, 60),
  test('CTET', 'cbse', 'Teaching', 150, 150),
  test('IBPS Clerk', 'ibps', 'Banking', 100, 60),
  test('RRB NTPC', 'rrb', 'Railway', 100, 90),
  test('SSC CHSL', 'ssc', 'SSC', 100, 60),
  test('UPSC CSE Prelims', 'upsc', 'UPSC', 100, 120),
]
