import { ArrowRight, Download, Eye, History } from 'lucide-react'
import SectionShell, { EmptyState } from '@/components/hub/SectionShell'

/** papers: [{ year, stage, shift?, type?, viewUrl?, downloadUrl?, practiceUrl? }]  Actions render only when a URL exists. */
export default function PreviousYearPapers({ examName, papers = [] }) {
  const sorted = [...papers].sort((a, b) => b.year - a.year)

  return (
    <SectionShell icon={History} id="previous-year-papers" title={`${examName} Previous Year Question Papers`}>
      {sorted.length === 0 ? (
        <EmptyState>
          Previous year papers for {examName} will be added here soon. You can practise the exam pattern in the meantime with a free mock test.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {sorted.map((p) => (
            <li key={`${p.year}-${p.stage}-${p.shift ?? ''}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-lg font-semibold text-ink">
                  {examName} {p.year}
                </p>
                <p className="text-sm text-slate-500">
                  {[p.stage, p.shift, p.type].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {p.viewUrl && (
                  <a href={p.viewUrl} className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                    <Eye className="size-4" aria-hidden="true" />
                    View Paper
                  </a>
                )}
                {p.downloadUrl && (
                  <a href={p.downloadUrl} download className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                    <Download className="size-4" aria-hidden="true" />
                    Download PDF
                  </a>
                )}
                {p.practiceUrl && (
                  <a href={p.practiceUrl} className="group inline-flex items-center gap-1.5 rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-primary-900 transition-colors hover:bg-accent-400">
                    Practice Online
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  )
}
