import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Circle, ImagePlus, Plus, Search, Trash2, X } from 'lucide-react'
import { iconFor, iconNames } from '@/lib/icons'
import { useOptions } from '../api'
import { getResource, HOME_CONFIG_FIELDS, LINK_TARGETS, LINK_TYPES, linkKeys } from '../resources'
import { slugify } from '../formValues'
import { Button, inputCls, Modal, Toggle, formatDateTime } from '../ui'
import MediaLibrary from './MediaLibrary'

/* Inputs for every field kind in resources.jsx. Each gets { field, value, onChange, values, setValues, error }. */

export function FieldShell({ field, error, children, id }) {
  return (
    <div className={field.half ? 'sm:col-span-1' : 'sm:col-span-2'}>
      {field.label && field.kind !== 'bool' && (
        <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">
          {field.label}
          {field.required && <span className="text-red-600"> *</span>}
        </label>
      )}
      {children}
      {field.help && !error && <p className="mt-1 text-xs text-slate-500">{field.help}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  )
}

const rowLabel = (resource, row) => {
  const r = getResource(resource)
  return r?.title ? r.title(row) : (row.name ?? row.title ?? row.label ?? row.id)
}

/** Select from another resource's rows (stores the id). */
export function RelationSelect({ resource, value, onChange, id, invalid, placeholder = '— None —', exclude }) {
  const { data = [], isPending } = useOptions(resource)
  const sorted = useMemo(() => data.filter((r) => r.id !== exclude).map((r) => ({ id: r.id, label: rowLabel(resource, r), status: r.status })), [data, resource, exclude])
  return (
    <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className={inputCls} disabled={isPending}>
      <option value="">{isPending ? 'Loading…' : placeholder}</option>
      {sorted.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
          {o.status && o.status !== 'PUBLISHED' ? ` (${o.status.toLowerCase().replace('_', ' ')})` : ''}
        </option>
      ))}
    </select>
  )
}

/** Several related rows; `ordered` lets the admin sort them (curated tabs, related exams). */
function RelationsField({ field, value = [], onChange, rowId }) {
  const { data = [] } = useOptions(field.resource)
  const [adding, setAdding] = useState('')
  const byId = new Map(data.map((r) => [r.id, r]))
  const move = (i, d) => {
    const next = [...value]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  return (
    <div className="rounded-md ring-1 ring-inset ring-slate-200">
      {value.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {value.map((id, i) => (
            <li key={id} className="flex items-center gap-2 px-3 py-1.5 text-sm">
              <span className="min-w-0 flex-1 truncate">{byId.has(id) ? rowLabel(field.resource, byId.get(id)) : <span className="text-slate-400">{id}</span>}</span>
              {field.ordered && (
                <>
                  <Button variant="ghost" size="icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown className="size-3.5" />
                  </Button>
                </>
              )}
              <Button variant="dangerGhost" size="icon" aria-label="Remove" onClick={() => onChange(value.filter((x) => x !== id))}>
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-3 py-2 text-sm text-slate-400">None selected.</p>
      )}
      <div className="flex gap-2 border-t border-slate-100 p-2">
        <select value={adding} onChange={(e) => setAdding(e.target.value)} className={inputCls} aria-label={`Add to ${field.label}`}>
          <option value="">Add…</option>
          {data
            .filter((r) => !value.includes(r.id) && r.id !== rowId)
            .map((r) => (
              <option key={r.id} value={r.id}>
                {rowLabel(field.resource, r)}
              </option>
            ))}
        </select>
        <Button
          icon={Plus}
          disabled={!adding}
          onClick={() => {
            onChange([...value, adding])
            setAdding('')
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

/** Link triple: type + target (picked by id) / anchor / URL. */
function LinkField({ field, values, setValues, errors }) {
  const k = linkKeys(field.prefix)
  const type = values[k.type] || 'NONE'
  const set = (patch) => setValues((v) => ({ ...v, ...patch }))
  const target = LINK_TARGETS[type]
  return (
    <div className="sm:col-span-2">
      <span className="mb-1 block text-sm font-semibold text-ink">{field.label ?? 'Links to'}</span>
      <div className="grid gap-2 sm:grid-cols-[12rem_1fr]">
        <select value={type} onChange={(e) => set({ [k.type]: e.target.value, [k.ref]: '', [k.url]: '' })} className={inputCls} aria-label="Link type">
          {LINK_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value === 'NONE' ? 'No link' : o.value === 'ANCHOR' ? 'Section on the page (#anchor)' : o.value === 'URL' ? 'URL / site path' : o.label}
            </option>
          ))}
        </select>
        {target && <RelationSelect resource={target} value={values[k.ref]} onChange={(val) => set({ [k.ref]: val })} invalid={Boolean(errors[k.ref])} placeholder="Pick…" />}
        {type === 'ANCHOR' && (
          <input value={values[k.ref] ?? ''} onChange={(e) => set({ [k.ref]: e.target.value.replace(/^#/, '') })} placeholder="free-tests" className={inputCls} aria-label="Anchor id" aria-invalid={Boolean(errors[k.ref])} />
        )}
        {type === 'URL' && (
          <input value={values[k.url] ?? ''} onChange={(e) => set({ [k.url]: e.target.value })} placeholder="https://… or /pages/about" className={inputCls} aria-label="URL" aria-invalid={Boolean(errors[k.url])} />
        )}
      </div>
      {target && <p className="mt-1 text-xs text-slate-500">Stored by id: renaming the target's slug never breaks this link. Unpublished targets are hidden on the site.</p>}
      {(errors[k.type] || errors[k.ref] || errors[k.url]) && <p className="mt-1 text-xs font-semibold text-red-700">{errors[k.type] || errors[k.ref] || errors[k.url]}</p>}
    </div>
  )
}

/** Image / file URL with a media library picker and preview. */
function MediaField({ field, value, onChange, id, invalid }) {
  const [open, setOpen] = useState(false)
  const isPdf = field.accept === 'pdf'
  return (
    <div className="flex items-start gap-3">
      {value && !isPdf && <img src={value} alt="" className="h-14 w-20 shrink-0 rounded border border-slate-200 bg-slate-50 object-contain" />}
      <div className="flex min-w-0 flex-1 gap-2">
        <input id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/images/… or https://…" className={inputCls} aria-invalid={invalid} />
        <Button icon={ImagePlus} onClick={() => setOpen(true)}>
          Choose
        </Button>
      </div>
      {open && (
        <Modal title="Media library" size="lg" onClose={() => setOpen(false)}>
          <MediaLibrary
            onPick={(asset) => {
              onChange(asset.url)
              setOpen(false)
            }}
          />
        </Modal>
      )}
    </div>
  )
}

/** Icon from the site's registry (lib/icons.js). */
function IconField({ value, onChange, id }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const Icon = iconFor(value, Circle)
  const list = iconNames.filter((n) => n.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="flex gap-2">
      <button id={id} type="button" onClick={() => setOpen(true)} className={`${inputCls} flex items-center gap-2 text-left`}>
        <Icon className={`size-4 ${value ? 'text-primary-700' : 'text-slate-300'}`} aria-hidden="true" />
        <span className={value ? '' : 'text-slate-400'}>{value || 'No icon'}</span>
      </button>
      {value && (
        <Button variant="ghost" size="icon" aria-label="Clear icon" onClick={() => onChange('')}>
          <X className="size-4" />
        </Button>
      )}
      {open && (
        <Modal title="Choose an icon" onClose={() => setOpen(false)}>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" aria-hidden="true" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icons" className={`${inputCls} pl-9`} />
          </div>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {list.map((name) => {
              const I = iconFor(name)
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(name)
                      setOpen(false)
                    }}
                    className={`flex w-full flex-col items-center gap-1 rounded-md p-2 text-[0.65rem] text-slate-600 ring-1 ring-inset hover:bg-primary-50 ${value === name ? 'ring-primary-600' : 'ring-slate-200'}`}
                  >
                    <I className="size-5 text-primary-700" aria-hidden="true" />
                    <span className="w-full truncate text-center">{name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Modal>
      )}
    </div>
  )
}

/** One item per line. Keeps the raw text while typing so blank lines don't vanish under the cursor. */
const tidy = (text) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

function StringListField({ value = [], onChange, id, rows = 4 }) {
  const [text, setText] = useState(() => (value ?? []).join('\n'))
  // a new value from outside (form reset, revision restore) replaces the text; our own edits keep it as typed.
  // Compared as text, not by array identity (callers may pass a fresh [] each render).
  const joined = (value ?? []).join('\n')
  const [seen, setSeen] = useState(joined)
  if (seen !== joined) {
    setSeen(joined)
    if (joined !== tidy(text).join('\n')) setText(joined)
  }
  return (
    <textarea
      id={id}
      rows={Math.max(rows, Math.min((value?.length ?? 0) + 1, 12))}
      value={text}
      onChange={(e) => {
        setText(e.target.value)
        onChange(tidy(e.target.value))
      }}
      placeholder="One per line"
      className={`${inputCls} font-mono text-[0.8rem]`}
    />
  )
}

function LabelValueField({ value = [], onChange }) {
  const rows = value ?? []
  const set = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input value={r.label ?? ''} onChange={(e) => set(i, { label: e.target.value })} placeholder="Label" className={inputCls} aria-label={`Row ${i + 1} label`} />
          <input value={r.value ?? ''} onChange={(e) => set(i, { value: e.target.value })} placeholder="Value" className={inputCls} aria-label={`Row ${i + 1} value`} />
          <Button variant="dangerGhost" size="icon" aria-label="Remove row" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button size="sm" icon={Plus} onClick={() => onChange([...rows, { label: '', value: '' }])}>
        Add row
      </Button>
    </div>
  )
}

/** Eligibility content: paragraph / note / list blocks. */
function BlocksField({ value = [], onChange }) {
  const blocks = value ?? []
  const set = (i, b) => onChange(blocks.map((x, j) => (j === i ? b : x)))
  const move = (i, d) => {
    const next = [...blocks]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <div key={i} className="rounded-md border border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-2">
            <select
              value={b.type}
              onChange={(e) => set(i, e.target.value === 'list' ? { type: 'list', items: b.text ? [b.text] : (b.items ?? []) } : { type: e.target.value, text: b.text ?? (b.items ?? []).join(' ') })}
              className={`${inputCls} w-40`}
              aria-label="Block type"
            >
              <option value="paragraph">Paragraph</option>
              <option value="note">Note</option>
              <option value="list">Bullet list</option>
            </select>
            <span className="flex-1" />
            <Button variant="ghost" size="icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
              <ArrowUp className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Move down" disabled={i === blocks.length - 1} onClick={() => move(i, 1)}>
              <ArrowDown className="size-3.5" />
            </Button>
            <Button variant="dangerGhost" size="icon" aria-label="Remove block" onClick={() => onChange(blocks.filter((_, j) => j !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          {b.type === 'list' ? (
            <StringListField value={b.items} onChange={(items) => set(i, { type: 'list', items })} />
          ) : (
            <textarea rows={3} value={b.text ?? ''} onChange={(e) => set(i, { type: b.type, text: e.target.value })} className={inputCls} aria-label="Text" />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <Button size="sm" icon={Plus} onClick={() => onChange([...blocks, { type: 'paragraph', text: '' }])}>
          Paragraph
        </Button>
        <Button size="sm" icon={Plus} onClick={() => onChange([...blocks, { type: 'list', items: [] }])}>
          List
        </Button>
        <Button size="sm" icon={Plus} onClick={() => onChange([...blocks, { type: 'note', text: '' }])}>
          Note
        </Button>
      </div>
    </div>
  )
}

/** JSON value edited as text; only valid JSON is passed up. */
function JsonField({ value, onChange, id, rows = 10 }) {
  const [text, setText] = useState(() => (value == null ? '' : JSON.stringify(value, null, 2)))
  const [bad, setBad] = useState(false)
  return (
    <>
      <textarea
        id={id}
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          if (!e.target.value.trim()) {
            setBad(false)
            onChange(null)
            return
          }
          try {
            onChange(JSON.parse(e.target.value))
            setBad(false)
          } catch {
            setBad(true)
          }
        }}
        aria-invalid={bad}
        spellCheck={false}
        className={`${inputCls} font-mono text-xs`}
      />
      {bad && <p className="mt-1 text-xs font-semibold text-red-700">Not valid JSON yet; the last valid value is kept.</p>}
    </>
  )
}

/** HomeSection.config: typed inputs for the known keys of the section type; unknown keys are kept. */
function HomeConfigField({ values, value, onChange, errors }) {
  const defs = HOME_CONFIG_FIELDS[values.type] ?? []
  const config = value ?? {}
  if (!defs.length) return <p className="text-sm text-slate-500 sm:col-span-2">This section type has no extra settings.</p>
  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      {defs.map((d) => {
        const v = config[d.key]
        const set = (next) => {
          const c = { ...config }
          if (next === '' || next === null || next === undefined || (Array.isArray(next) && !next.length)) delete c[d.key]
          else c[d.key] = d.kind === 'number' ? Number(next) : next
          onChange(c)
        }
        const field = { ...d, half: d.kind !== 'stringList' && d.kind !== 'json' }
        const id = `config-${d.key}`
        return (
          <FieldShell key={`${values.type}-${d.key}`} field={field} id={id} error={errors[`config.${d.key}`]}>
            {d.kind === 'stringList' ? (
              <StringListField id={id} value={v ?? []} onChange={set} />
            ) : d.kind === 'json' ? (
              <JsonField id={id} value={v} onChange={set} rows={14} />
            ) : d.kind === 'select' ? (
              <select id={id} value={v ?? ''} onChange={(e) => set(e.target.value)} className={inputCls}>
                <option value="">Default</option>
                {d.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input id={id} type={d.kind === 'number' ? 'number' : 'text'} value={v ?? ''} onChange={(e) => set(e.target.value)} className={inputCls} />
            )}
          </FieldShell>
        )
      })}
    </div>
  )
}

/** Renders one field of a resource form. */
export function FieldInput({ field, values, setValues, errors, rowId }) {
  const id = `f-${field.prefix ?? ''}${field.key}`
  const value = values[field.key]
  const error = errors[field.key]
  const onChange = (v) => setValues((s) => ({ ...s, [field.key]: v }))

  if (field.kind === 'link') return <LinkField field={field} values={values} setValues={setValues} errors={errors} />
  if (field.kind === 'homeConfig') return <HomeConfigField values={values} value={value} onChange={onChange} errors={errors} />

  if (field.kind === 'bool') {
    return (
      <div className={`${field.half ? 'sm:col-span-1' : 'sm:col-span-2'} flex items-start gap-3 pt-1`}>
        <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />
        <div>
          <span className="text-sm font-medium text-ink">{field.label}</span>
          {field.help && <p className="text-xs text-slate-500">{field.help}</p>}
          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
        </div>
      </div>
    )
  }

  let input
  switch (field.kind) {
    case 'readonly': {
      const raw = value
      const shown = field.format === 'datetime' ? formatDateTime(raw) : raw || '—'
      input = <p className="whitespace-pre-wrap rounded-md bg-slate-50 px-3 py-2 text-sm text-ink">{shown}</p>
      break
    }
    case 'textarea':
      input = <textarea id={id} rows={field.rows ?? 3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} aria-invalid={Boolean(error)} />
      break
    case 'markdown':
      input = (
        <textarea id={id} rows={field.rows ?? 8} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} font-mono text-[0.8rem] leading-relaxed`} aria-invalid={Boolean(error)} />
      )
      break
    case 'number':
      input = <input id={id} type="number" inputMode="numeric" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} aria-invalid={Boolean(error)} />
      break
    case 'date':
      input = <input id={id} type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} aria-invalid={Boolean(error)} />
      break
    case 'datetime':
      input = <input id={id} type="datetime-local" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} aria-invalid={Boolean(error)} />
      break
    case 'select':
      input = (
        <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} aria-invalid={Boolean(error)}>
          {!field.required && <option value="">—</option>}
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'slug':
      input = (
        <div className="flex gap-2">
          <input id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} font-mono text-[0.8rem]`} aria-invalid={Boolean(error)} />
          {field.from && (
            <Button size="sm" variant="ghost" className="h-9" onClick={() => onChange(slugify(values[field.from]))} title={`Make from ${field.from}`}>
              Generate
            </Button>
          )}
        </div>
      )
      break
    case 'relation':
      input = <RelationSelect id={id} resource={field.resource} value={value} onChange={onChange} invalid={Boolean(error)} exclude={rowId} />
      break
    case 'relations':
      input = <RelationsField field={field} value={value} onChange={onChange} rowId={rowId} />
      break
    case 'icon':
      input = <IconField id={id} value={value} onChange={onChange} />
      break
    case 'image':
      input = <MediaField id={id} field={field} value={value} onChange={onChange} invalid={Boolean(error)} />
      break
    case 'stringList':
      input = <StringListField id={id} value={value} onChange={onChange} />
      break
    case 'labelValue':
      input = <LabelValueField value={value} onChange={onChange} />
      break
    case 'blocks':
      input = <BlocksField value={value} onChange={onChange} />
      break
    case 'json':
      input = <JsonField id={id} value={value} onChange={onChange} />
      break
    default:
      input = <input id={id} type="text" inputMode={field.kind === 'url' ? 'url' : undefined} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} aria-invalid={Boolean(error)} />
  }

  return (
    <FieldShell field={field} error={error} id={id}>
      {input}
    </FieldShell>
  )
}
