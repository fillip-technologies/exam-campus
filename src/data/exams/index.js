import sbiPo from './sbiPo'

/**
 * Registry of exam hub pages. To launch a new exam page:
 *  1. Create `./<examName>.js` with the same shape as `sbiPo.js`.
 *  2. Import it here and add it to `exams`.
 * The route /exams/:slug then works automatically.
 */
const exams = [sbiPo]

const bySlug = new Map(exams.map((e) => [e.slug, e]))

export const getExamBySlug = (slug) => bySlug.get(slug) ?? null
export const hasExamPage = (slug) => bySlug.has(slug)
export const allExams = exams
