/**
 * Previous year paper helpers shared by the exam hub section and the full papers page.
 * Paper shape: { year, stage?, shift?, type?, heldOn?, questions?, marks?, durationMinutes?, languages?,
 *                viewUrl?, downloadUrl?, practiceUrl? }
 */

/** Prelims first, then Mains, then anything else (interview, descriptive...). */
export const stageRank = (stage = '') => {
  const s = stage.toLowerCase()
  if (s.includes('prelim')) return 0
  if (s.includes('main')) return 1
  return 2
}

const shiftNumber = (shift = '') => Number(String(shift).match(/\d+/)?.[0] ?? 0)

/** Newest year first; inside a year Prelims before Mains, then by shift. */
export const sortPapers = (papers = []) =>
  [...papers].sort(
    (a, b) => b.year - a.year || stageRank(a.stage) - stageRank(b.stage) || (a.stage ?? '').localeCompare(b.stage ?? '') || shiftNumber(a.shift) - shiftNumber(b.shift),
  )

/** Distinct stage names in display order. */
export const paperStages = (papers = []) => [...new Set(sortPapers(papers).map((p) => p.stage).filter(Boolean))].sort((a, b) => stageRank(a) - stageRank(b))

/** Distinct years, newest first. */
export const paperYears = (papers = []) => [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a)

/** [[year, papers[]], ...] newest year first (papers must already be sorted). */
export const groupByYear = (sorted) => {
  const map = new Map()
  for (const p of sorted) map.set(p.year, [...(map.get(p.year) ?? []), p])
  return [...map]
}

/** "SBI PO Prelims 2025" */
export const paperTitle = (examName, p) => [examName, p.stage, p.year].filter(Boolean).join(' ')

/** Stable key for lists. */
export const paperKey = (p) => [p.year, p.stage, p.shift, p.type].filter(Boolean).join('-')
