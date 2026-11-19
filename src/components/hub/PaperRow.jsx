import { ArrowRight, Award, CalendarDays, CircleHelp, Clock, Download, Eye, FileText, Languages } from 'lucide-react'
import { formatDate, formatMinutes } from '@/lib/format'
import { paperTitle, stageRank } from '@/lib/papers'

const outline =
  'inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

/**
 * One previous year paper as a list row: stage icon, title, counts, and the actions it has links for
 * (View PDF, Download PDF, Attempt Online). Render inside a <ul>.
 */
export default function PaperRow({ examName, paper: p }) {
  const prelims = stageRank(p.stage) === 0
  const heldOn = formatDate(p.heldOn ? String(p.heldOn).slice(0, 10) : null)
  const meta = [
    p.questions != null && { icon: CircleHelp, text: `${p.questions} Questions` },
    p.marks != null && { icon: Award, text: `${p.marks} Marks` },
    p.durationMinutes != null && { icon: Clock, text: formatMinutes(p.durationMinutes) },
    p.languages?.length > 0 && { icon: Languages, text: p.languages.join(', ') },
    heldOn && { icon: CalendarDays, text: `Held on ${heldOn}` },
  ].filter(Boolean)

  return (
    <li className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 gap-3.5">
        <span className={`grid size-11 shrink-0 place-items-center rounded-lg ${prelims ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'}`}>
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-bold text-ink">{paperTitle(examName, p)}</span>
            {p.shift && <span className="font-semibold text-slate-500">· {p.shift}</span>}
            {p.type && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-600">{p.type}</span>}
          </p>
          {meta.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              {meta.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5">
                  <Icon className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(p.viewUrl || p.downloadUrl || p.practiceUrl) && (
        <div className="flex flex-wrap items-center gap-2 pl-[3.625rem] lg:shrink-0 lg:pl-0">
          {p.viewUrl && (
            <a href={p.viewUrl} target="_blank" rel="noopener noreferrer" className={outline}>
              <Eye className="size-4" aria-hidden="true" />
              View
            </a>
          )}
          {p.downloadUrl && (
            <a href={p.downloadUrl} download className={outline}>
              <Download className="size-4" aria-hidden="true" />
              PDF
            </a>
          )}
          {p.practiceUrl && (
            <a
              href={p.practiceUrl}
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Attempt Online
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </li>
  )
}
