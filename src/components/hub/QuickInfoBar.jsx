import { TBA } from '@/lib/format'

/** items: [{ label, value }]  A missing value renders as "To Be Announced". */
export default function QuickInfoBar({ items }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 divide-slate-200 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {items.map((item) => (
            <div key={item.label} className="border-b border-slate-100 py-4 pr-3 sm:px-4 sm:nth-[3n+1]:pl-0 lg:border-b-0 lg:nth-[3n+1]:pl-4 lg:first:pl-0">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</dt>
              <dd className={`mt-1 text-sm font-semibold sm:text-base ${item.value ? 'text-ink' : 'text-slate-400'}`}>
                {item.value ?? TBA}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
