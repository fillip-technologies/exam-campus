export const TBA = 'To Be Announced'

/** "2026-01-31" -> "31 Jan 2026". Returns null for missing or invalid dates. */
export const formatDate = (iso) => {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatRupees = (n) => `₹${n.toLocaleString('en-IN')}`

export const formatMinutes = (m) => {
  if (m == null) return '—'
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h} hr ${r} min` : `${h} hr`
}
