import { searchableCourses } from '@/data/searchCatalog'
import { slugify } from '@/lib/slugify'

const norm = (s) => s.trim().toLowerCase()

/** The page a catalogue entry opens: a class hub, an exam hub, or the exam list on the homepage. */
export function pathForCatalogEntry(entry) {
  if (entry.category === 'Academic') return `/academic/${slugify(entry.name)}`
  if (/\(all exams\)$/i.test(entry.name)) return '/#exams'
  return `/exams/${slugify(entry.name)}`
}

/** Best catalogue match for typed text: exact name, then names starting with it, then names containing it. */
export function findCatalogMatch(query) {
  const q = norm(query)
  if (!q) return null
  return (
    searchableCourses.find((c) => norm(c.name) === q) ??
    searchableCourses.find((c) => norm(c.name).startsWith(q)) ??
    searchableCourses.find((c) => norm(`${c.name} ${c.category}`).includes(q)) ??
    null
  )
}

/** Path to open for a search term, or null when nothing matches. */
export function resolveSearchTarget(query) {
  const match = findCatalogMatch(query)
  return match ? pathForCatalogEntry(match) : null
}
