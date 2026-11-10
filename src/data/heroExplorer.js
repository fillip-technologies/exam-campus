import { Atom, History, Library, ShieldCheck, BookOpen, ClipboardList, School, Clock, FileText, Flame, Gift, GraduationCap, Landmark, LayoutList, ListChecks, MapPinned, Scale, Shield, Sparkles, TrainFront } from 'lucide-react'
import { allTestSeries, testSeriesCategories } from './testSeries'
import { freeTests } from './freeTests'

/**
 * Exam categories shown beside the hero banner. `seriesIds` are ids from testSeriesCategories
 * that the category covers; an empty list means no test series are published yet.
 */
export const heroCategories = [
  { id: 'teaching', label: 'Teaching', icon: GraduationCap, seriesIds: ['teaching'] },
  { id: 'ssc', label: 'SSC', icon: FileText, seriesIds: ['ssc'] },
  { id: 'banking', label: 'Banking & Insurance', icon: Landmark, seriesIds: ['banking'] },
  { id: 'railway', label: 'Railway', icon: TrainFront, seriesIds: ['railway'] },
  { id: 'upsc-psc', label: 'UPSC & PSC', icon: Scale, seriesIds: ['upsc-psc'] },
  { id: 'defence', label: 'Defence', icon: Shield, seriesIds: ['defence'] },
  { id: 'state', label: 'State Government Exams', icon: MapPinned, seriesIds: [] },
  { id: 'jee-neet', label: 'JEE & NEET', icon: Atom, seriesIds: [] },
  { id: 'class-6-8', label: 'Class 6–8', icon: School, seriesIds: [] },
  { id: 'class-9-10', label: 'Class 9–10', icon: BookOpen, seriesIds: [] },
  { id: 'class-11-12', label: 'Class 11–12', icon: GraduationCap, seriesIds: [] },
  { id: 'board', label: 'Board Exams', icon: ClipboardList, seriesIds: [] },
  { id: 'police', label: 'Police Exams', icon: ShieldCheck, seriesIds: [] },
  { id: 'subject', label: 'Subject-wise Learning', icon: Library, seriesIds: [] },
]

// Curated slugs: edit these lists to promote the exams that are in season.
const popularSlugs = ['sbi-po', 'ssc-cgl', 'bpsc-tre', 'ctet', 'rrb-ntpc', 'upsc-cse-prelims', 'nda', 'ibps-po', 'ibps-clerk', 'sbi-clerk']
const latestSlugs = ['bpsc-tre', 'ctet', 'ssc-cgl', 'rrb-ntpc', 'sbi-po', 'nda']
const freeSlugs = new Set(freeTests.map((t) => t.slug))

// Curated slugs come first, in the given order; the remaining series follow so a category never looks empty.
const bySlugOrder = (slugs) => (items) => {
  const rank = (t) => {
    const i = slugs.indexOf(t.slug)
    return i === -1 ? slugs.length : i
  }
  return [...items].sort((a, b) => rank(a) - rank(b))
}

/** Tabs below the hero. `limit` (optional) caps how many cards show. `pick` receives the series of the selected category and returns what to show. */
export const seriesTabs = [
  { id: 'popular', label: 'Popular', icon: Flame, heading: 'Popular Test Series', limit: 12, pick: bySlugOrder(popularSlugs) },
  { id: 'latest', label: 'Latest', icon: Sparkles, heading: 'Latest Test Series', limit: 6, pick: bySlugOrder(latestSlugs) },
  { id: 'exam-wise', label: 'Exam-wise', icon: Clock, heading: 'Exam-wise Test Series', pick: (items) => items },
  {
    id: 'sectional',
    label: 'Sectional',
    icon: LayoutList,
    heading: 'Test Series with Sectional Tests',
    pick: (items) => items.filter((t) => t.features.some((f) => f.label === 'Sectional Tests')),
  },
  {
    id: 'topic-wise',
    label: 'Topic-wise',
    icon: ListChecks,
    heading: 'Test Series with Topic-wise Tests',
    pick: (items) => items.filter((t) => t.features.some((f) => f.label === 'Topic-wise Tests')),
  },
  {
    id: 'pyq',
    label: 'PYQs',
    icon: History,
    heading: 'Test Series with Previous Year Papers',
    pick: (items) => items.filter((t) => t.features.some((f) => f.label === 'Previous Year Papers')),
  },
  { id: 'free', label: 'Free Tests', icon: Gift, heading: 'Test Series with a Free Mock Test', pick: (items) => items.filter((t) => freeSlugs.has(t.slug)) },
]

/** Test series for a category, or every series when no category is selected. */
export function seriesForCategory(category) {
  if (!category) return allTestSeries
  return allTestSeries.filter((t) =>
    testSeriesCategories.some((c) => category.seriesIds.includes(c.id) && c.items.includes(t)),
  )
}
