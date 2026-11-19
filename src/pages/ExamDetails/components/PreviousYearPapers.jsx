import { Link } from 'react-router-dom'
import { ArrowRight, History } from 'lucide-react'
import SectionShell from '@/components/hub/SectionShell'
import PaperRow from '@/components/hub/PaperRow'
import { paperKey, paperStages, paperYears, sortPapers } from '@/lib/papers'

const PREVIEW = 5

/** Hub section: the latest few papers and a link to the full papers page. Hidden when there are no papers. */
export default function PreviousYearPapers({ examName, slug, papers = [] }) {
  if (!papers.length) return null
  const sorted = sortPapers(papers)
  const years = paperYears(papers)
  const range = years.length > 1 ? `${years.at(-1)}–${years[0]}` : String(years[0])

  return (
    <SectionShell
      icon={History}
      id="previous-year-papers"
      title={`${examName} Previous Year Question Papers`}
      intro={`${papers.length} ${paperStages(papers).join(' and ')} papers from ${range}. View, download or attempt them online.`.replace('  ', ' ')}
    >
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {sorted.slice(0, PREVIEW).map((p) => (
          <PaperRow key={paperKey(p)} examName={examName} paper={p} />
        ))}
      </ul>
      <div className="mt-5 flex justify-center">
        <Link
          to={`/exams/${slug}/previous-year-papers`}
          className="group inline-flex items-center gap-2 rounded-lg bg-primary-50 px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          View all {papers.length} {examName} papers
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </SectionShell>
  )
}
