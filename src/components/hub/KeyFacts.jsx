/**
 * Highlighted "at a glance" tiles for the most important facts of a section.
 * facts: [{ label, value, tone?: 'accent' }]  Facts without a value are skipped.
 */
export default function KeyFacts({ facts = [], className = '' }) {
  const shown = facts.filter((f) => f.value != null && f.value !== '')
  if (!shown.length) return null

  return (
    <dl className={`grid gap-3 sm:grid-cols-2 ${shown.length >= 4 ? "lg:grid-cols-4" : shown.length === 3 ? "lg:grid-cols-3" : ""} ${className}`}>
      {shown.map((f) => {
        const accent = f.tone === 'accent'
        return (
          <div
            key={f.label}
            className={`rounded-md border-t-4 p-4 ${accent ? 'border-accent-500 bg-accent-50' : 'border-primary-600 bg-primary-50'}`}
          >
            <dt className={`text-xs font-bold uppercase tracking-wider ${accent ? 'text-accent-700' : 'text-primary-600'}`}>{f.label}</dt>
            <dd className="mt-1.5 text-lg font-bold leading-snug text-primary-900">{f.value}</dd>
          </div>
        )
      })}
    </dl>
  )
}
