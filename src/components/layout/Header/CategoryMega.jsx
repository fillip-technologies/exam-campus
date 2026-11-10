import ExamMegaMenu from './ExamMegaMenu'

const copy = {
  PYQ: {
    label: 'Previous year question categories',
    text: 'Solve past papers online and see the solutions and your analysis after every test.',
    cta: 'Explore All Previous Year Papers',
    href: '#all-previous-papers',
  },
  COMPETITIVE: {
    label: 'Exam categories',
    text: 'Every exam page has courses, test series, free mock tests and study resources.',
    cta: 'Explore All Competitive Exams',
    href: '#all-exams',
  },
}

/** Where an exam in a category menu goes: its hub, or the hub's papers section for the PYQ menu. */
export const examHref = (exam, menu) => (exam.href ? (menu === 'PYQ' ? `${exam.href}#previous-year-papers` : exam.href) : null)

/** Exam-category mega menus (Competitive Exams, PYQs): filled from the exam catalogue by the API. */
export default function CategoryMega({ id, item, onNavigate }) {
  const c = copy[item.menu] ?? copy.COMPETITIVE
  return (
    <ExamMegaMenu
      id={id}
      idPrefix={item.id}
      menu={item.categories}
      label={c.label}
      linkFor={(e) => examHref(e, item.menu)}
      footer={{ text: c.text, cta: item.footer?.label ?? c.cta, href: item.footer?.href ?? c.href }}
      onNavigate={onNavigate}
    />
  )
}
