import { linkKeys } from './resources'

/** API row <-> form values for a resource's fields. */

const pad = (n) => String(n).padStart(2, '0')

/** ISO -> "YYYY-MM-DDTHH:mm" in local time (datetime-local input). */
const toLocalInput = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Date-only columns come back as "2026-01-31T00:00:00.000Z". */
const toDateInput = (iso) => (iso ? String(iso).slice(0, 10) : '')

const emptyFor = (field) => {
  if (field.default !== undefined) return field.default
  switch (field.kind) {
    case 'bool':
      return false
    case 'relations':
    case 'stringList':
    case 'labelValue':
    case 'blocks':
      return []
    case 'homeConfig':
      return {}
    case 'json':
      return null
    default:
      return ''
  }
}

/** Form state for a row (or defaults + preset for a new one). */
export function toFormValues(fields, row, preset = {}) {
  const v = {}
  for (const f of fields) {
    if (f.kind === 'link') {
      const k = linkKeys(f.prefix)
      v[k.type] = row?.[k.type] ?? 'NONE'
      v[k.ref] = row?.[k.ref] ?? ''
      v[k.url] = row?.[k.url] ?? ''
      continue
    }
    const raw = row ? row[f.key] : undefined
    if (raw === undefined || raw === null) {
      v[f.key] = row ? (f.kind === 'bool' ? false : emptyFor({ ...f, default: undefined })) : emptyFor(f)
      continue
    }
    if (f.kind === 'datetime') v[f.key] = toLocalInput(raw)
    else if (f.kind === 'date') v[f.key] = toDateInput(raw)
    else if (f.kind === 'number') v[f.key] = String(raw)
    else v[f.key] = raw
  }
  for (const [k, val] of Object.entries(preset)) v[k] = val
  return v
}

/** Request body from form state. Only the configured, editable fields are sent. */
export function toPayload(fields, values) {
  const out = {}
  for (const f of fields) {
    if (f.kind === 'readonly' || f.readOnly) continue
    // a hidden picker list (e.g. curated series when the rule is not CURATED) keeps its saved value
    if (f.kind === 'relations' && f.showIf && !f.showIf(values)) continue
    if (f.kind === 'link') {
      const k = linkKeys(f.prefix)
      const type = values[k.type] || 'NONE'
      out[k.type] = type
      out[k.ref] = type !== 'NONE' && type !== 'URL' ? values[k.ref] || null : null
      out[k.url] = type === 'URL' ? values[k.url] || null : null
      continue
    }
    const val = values[f.key]
    switch (f.kind) {
      case 'number':
        out[f.key] = val === '' || val === null || val === undefined ? null : Number(val)
        break
      case 'datetime':
        out[f.key] = val ? new Date(val).toISOString() : null
        break
      case 'date':
        out[f.key] = val || null
        break
      case 'relation':
      case 'select':
        out[f.key] = val === '' ? null : val
        break
      case 'stringList':
        out[f.key] = (val ?? []).map((s) => s.trim()).filter(Boolean)
        break
      case 'labelValue':
        out[f.key] = (val ?? []).filter((r) => String(r.label ?? '').trim()).map((r) => ({ label: r.label.trim(), value: /^\d+$/.test(String(r.value).trim()) ? Number(r.value) : String(r.value ?? '').trim() }))
        break
      case 'markdown':
      case 'textarea':
      case 'text':
      case 'slug':
      case 'url':
      case 'image':
      case 'icon':
        out[f.key] = typeof val === 'string' ? val : (val ?? null)
        break
      default:
        out[f.key] = val
    }
  }
  // required numbers left empty: let the API answer "Required" instead of sending null to a non-null column
  for (const f of fields) if (f.kind === 'number' && f.required && out[f.key] === null) delete out[f.key]
  return out
}

/** Client-side checks before sending (the API validates everything again). */
export function validate(fields, values) {
  const errors = {}
  for (const f of fields) {
    if (f.showIf && !f.showIf(values)) continue
    if (!f.required || f.kind === 'readonly' || f.kind === 'bool') continue
    const v = values[f.key]
    if (v === '' || v === null || v === undefined || (Array.isArray(v) && !v.length && f.kind !== 'blocks')) errors[f.key] = 'Required'
  }
  return errors
}

export const slugify = (text) =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
