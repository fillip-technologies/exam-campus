import class6 from './class6'

/**
 * Registry of Academic Class Hub pages. To launch a new class page:
 *  1. Create `./<className>.js` with the same shape as `class6.js`.
 *  2. Import it here and add it to `classes`.
 * The route /academic/:slug then works automatically.
 */
const classes = [class6]

const bySlug = new Map(classes.map((c) => [c.slug, c]))

export const getClassBySlug = (slug) => bySlug.get(slug) ?? null
export const hasClassPage = (slug) => bySlug.has(slug)
export const allClasses = classes
