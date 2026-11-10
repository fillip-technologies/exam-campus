import { ExternalLink, Bell } from 'lucide-react'
import SectionShell, { EmptyState } from '@/components/hub/SectionShell'
import { formatDate } from '@/lib/format'

/** updates: [{ date, title, description?, sourceUrl?, sourceLabel? }]  Rendered newest first. */
export default function LatestUpdates({ examName, updates = [] }) {
  const sorted = [...updates].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  return (
    <SectionShell icon={Bell} id="latest-updates" title={`${examName} Latest Updates`}>
      {sorted.length === 0 ? (
        <EmptyState>
          No updates have been published yet. Check the official {examName} notification for the latest information. We add important updates here as soon as they are announced.
        </EmptyState>
      ) : (
        <ol className="relative space-y-6 border-l-2 border-slate-200 pl-6">
          {sorted.map((u) => (
            <li key={`${u.date}-${u.title}`} className="relative">
              <span aria-hidden="true" className="absolute -left-[1.95rem] top-1.5 size-3 rounded-full border-2 border-white bg-primary-600 ring-2 ring-primary-200" />
              {formatDate(u.date) && (
                <time dateTime={u.date} className="text-sm font-semibold text-primary-600">
                  {formatDate(u.date)}
                </time>
              )}
              <h3 className="mt-0.5 text-lg font-semibold text-ink">{u.title}</h3>
              {u.description && <p className="mt-1 leading-relaxed text-slate-600">{u.description}</p>}
              {u.sourceUrl && (
                <a
                  href={u.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:underline"
                >
                  {u.sourceLabel ?? 'Official notification'}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ol>
      )}
    </SectionShell>
  )
}
