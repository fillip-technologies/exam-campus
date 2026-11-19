/**
 * Single-choice filter chips with an "All" chip first. Scrolls sideways on small screens.
 * options: [{ id, label, count? }] · value: selected id or null (= All)
 */
export default function FilterChips({ label, options, value, onChange, allLabel = 'All', allCount }) {
  const chip = (active) =>
    `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
      active ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:ring-primary-600'
    }`
  const count = (n, active) => n != null && <span className={active ? 'text-primary-100' : 'text-slate-400'}>({n})</span>

  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 sm:mx-0 sm:flex-wrap sm:px-0">
      <button type="button" aria-pressed={value == null} onClick={() => onChange(null)} className={chip(value == null)}>
        {allLabel} {count(allCount, value == null)}
      </button>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)} className={chip(value === o.id)}>
          {o.label} {count(o.count, value === o.id)}
        </button>
      ))}
    </div>
  )
}
