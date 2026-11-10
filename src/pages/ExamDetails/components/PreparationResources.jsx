import { ArrowRight, Library } from 'lucide-react'
import SectionShell from '@/components/hub/SectionShell'

/** resources: [{ type, title, description?, href? }]  Grouped by `type`; empty groups are never shown. */
export default function PreparationResources({ examName, resources = [] }) {
  if (!resources.length) return null

  const groups = resources.reduce((acc, r) => {
    ;(acc[r.type] ??= []).push(r)
    return acc
  }, {})

  return (
    <SectionShell icon={Library} id="resources" title={`Prepare Better for ${examName}`}>
      <div className="space-y-7">
        {Object.entries(groups).map(([type, items]) => (
          <div key={type}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{type}</h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => {
                const body = (
                  <>
                    <span className="block font-semibold text-ink group-hover:text-primary-700">{r.title}</span>
                    {r.description && <span className="mt-1 block text-sm leading-relaxed text-slate-500">{r.description}</span>}
                    {r.href && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
                        Open
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )
                const cls = 'group block h-full rounded-md border border-slate-200 bg-white p-4 transition-colors'
                return (
                  <li key={r.title}>
                    {r.href ? (
                      <a href={r.href} className={`${cls} hover:border-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
