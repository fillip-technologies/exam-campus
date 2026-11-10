import KeyFacts from '@/components/hub/KeyFacts'
import { CalendarDays } from 'lucide-react'
import { useState } from 'react'
import SectionShell from '@/components/hub/SectionShell'
import { TBA, formatDate } from '@/lib/format'

const statusStyle = {
  Completed: 'bg-slate-100 text-slate-600 ring-slate-200',
  Upcoming: 'bg-primary-50 text-primary-700 ring-primary-200',
  [TBA]: 'bg-accent-50 text-accent-700 ring-accent-100',
}

/** events: [{ event, date }]  `date` is an ISO date or null. Status is derived from the date. */
export default function ImportantDates({ examName, events }) {
  const [today] = useState(() => new Date().setHours(0, 0, 0, 0))

  const rows = events.map((e) => {
    const label = formatDate(e.date)
    const status = !label ? TBA : new Date(`${e.date}T00:00:00`).getTime() < today ? 'Completed' : 'Upcoming'
    return { ...e, label: label ?? TBA, status }
  })

  return (
    <SectionShell icon={CalendarDays} id="exam-dates" title={`${examName} Important Dates`}>
      <KeyFacts
        className="mb-6"
        facts={rows.filter((r) => r.highlight).map((r) => ({ label: r.event, value: r.label, tone: r.date ? "accent" : undefined }))}
      />
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[26rem] text-left text-sm sm:text-base">
          <caption className="sr-only">{examName} important dates</caption>
          <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Event</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.event}>
                <th scope="row" className="px-4 py-3.5 font-semibold text-ink">{r.event}</th>
                <td className={`px-4 py-3.5 ${r.date ? 'font-medium text-ink' : 'text-slate-400'}`}>{r.label}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-500">Dates are added here only after they are officially announced.</p>
    </SectionShell>
  )
}
