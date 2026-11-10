import { Atom } from 'lucide-react'
import { competitiveMenu } from './competitiveMenu'
import { slugify } from '@/lib/slugify'

// JEE and NEET are academic entrance exams, so they are not in the Competitive Exams menu.
const entrance = {
  id: 'jee-neet',
  label: 'JEE & NEET',
  icon: Atom,
  exams: [
    ['JEE Main', 'nta'],
    ['JEE Advanced', 'iit'],
    ['NEET UG', 'nta'],
  ].map(([name, org]) => ({ name, org, slug: slugify(name) })),
}

/** Data for the Previous Year Questions mega menu: every competitive exam category plus JEE & NEET. */
export const pyqMenu = [...competitiveMenu, entrance]
