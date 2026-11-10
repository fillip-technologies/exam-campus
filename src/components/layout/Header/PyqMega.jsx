import ExamMegaMenu from './ExamMegaMenu'
import { pyqMenu } from '@/data/pyqMenu'

/** Previous Year Questions mega menu: each exam opens the Previous Year Papers section of its Exam Hub. */
export default function PyqMega({ id, onNavigate }) {
  return (
    <ExamMegaMenu
      id={id}
      idPrefix="pq"
      menu={pyqMenu}
      label="Previous year question categories"
      linkFor={(e) => `/exams/${e.slug}#previous-year-papers`}
      footer={{
        text: 'Solve past papers online and see the solutions and your analysis after every test.',
        cta: 'Explore All Previous Year Papers',
        href: '#all-previous-papers',
      }}
      onNavigate={onNavigate}
    />
  )
}
