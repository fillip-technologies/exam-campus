import ExamMegaMenu from './ExamMegaMenu'
import { competitiveMenu } from '@/data/competitiveMenu'

/** Competitive Exams mega menu: each exam opens its Exam Hub page. */
export default function CompetitiveMega({ id, onNavigate }) {
  return (
    <ExamMegaMenu
      id={id}
      idPrefix="cm"
      menu={competitiveMenu}
      label="Exam categories"
      linkFor={(e) => `/exams/${e.slug}`}
      footer={{
        text: 'Every exam page has courses, test series, free mock tests and study resources.',
        cta: 'Explore All Competitive Exams',
        href: '#all-exams',
      }}
      onNavigate={onNavigate}
    />
  )
}
