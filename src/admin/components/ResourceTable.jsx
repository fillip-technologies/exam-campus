import { useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Check, Circle, ExternalLink, GripVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { iconFor } from '@/lib/icons'
import { useAuth } from '@/context/auth/useAuth'
import { hasRole } from '@/services/authService'
import { adminApi, useAdminList, useAdminMutation, useOptions } from '../api'
import { getResource } from '../resources'
import { Badge, Button, Empty, ErrorBox, formatDateTime, inputCls, Spinner, StatusBadge, useConfirm, useToast } from '../ui'

const get = (row, key) => key.split('.').reduce((o, k) => o?.[k], row)

function Cell({ col, row }) {
  if (col.render) return col.render(row)
  const v = get(row, col.key)
  switch (col.kind) {
    case 'bool':
      return v ? <Check className="size-4 text-emerald-600" aria-label="Yes" /> : <X className="size-4 text-slate-300" aria-label="No" />
    case 'status':
      return <StatusBadge status={v} />
    case 'date':
      return v ? String(v).slice(0, 10) : <span className="text-slate-400">TBA</span>
    case 'datetime':
      return v ? formatDateTime(v) : <span className="text-slate-400">—</span>
    case 'image':
      return v ? <img src={v} alt="" className="h-8 w-14 rounded border border-slate-200 bg-slate-50 object-contain" loading="lazy" /> : <span className="text-slate-300">—</span>
    case 'icon': {
      const I = iconFor(v, Circle)
      return <I className={`size-4 ${v ? 'text-primary-700' : 'text-slate-300'}`} aria-label={v ?? 'none'} />
    }
    default:
      return v === null || v === undefined || v === '' ? <span className="text-slate-300">—</span> : String(v)
  }
}

function FilterSelect({ filter, value, onChange }) {
  const { data = [] } = useOptions(filter.resource, Boolean(filter.resource))
  const options = filter.options ?? data.map((r) => ({ value: r.id, label: getResource(filter.resource)?.title?.(r) ?? r.id }))
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} w-auto min-w-36`} aria-label={filter.label}>
      <option value="">All {filter.label.toLowerCase()}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/**
 * Generic table for a resource: search, filters, pagination, drag-to-reorder (sortable resources),
 * row actions (edit, publish, delete). `fixed` = filters set by the parent (child lists on an edit page).
 */
export default function ResourceTable({ resourceKey, fixed = {}, preset = {}, compact = false, title }) {
  const r = getResource(resourceKey)
  const { user } = useAuth()
  const location = useLocation()
  const confirm = useConfirm()
  const toast = useToast()
  const canWrite = hasRole(user, r.writeRole ?? 'EDITOR')

  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [urlParams] = useSearchParams()
  // initial filters: ?status=PUBLISHED in the URL (dashboard links), else the filter's default
  const [filters, setFilters] = useState(() =>
    compact ? {} : Object.fromEntries((r.filters ?? []).map((f) => [f.key, urlParams.get(f.key) ?? f.default]).filter(([, v]) => v)),
  )
  // sortable lists load everything so drag-and-drop sees every row
  const pageSize = r.sortable ? 500 : 50
  const params = { ...filters, ...fixed, q: q.trim() || undefined, page, pageSize }
  const list = useAdminList(resourceKey, params, { placeholderData: (prev) => prev })
  const [order, setOrder] = useState(null)
  const [dragId, setDragId] = useState(null)
  // fresh data from the server replaces the optimistic drag order
  const [seenData, setSeenData] = useState(list.data)
  if (seenData !== list.data) {
    setSeenData(list.data)
    setOrder(null)
  }

  const rows = useMemo(() => {
    const items = list.data?.items ?? []
    if (!order) return items
    const byId = new Map(items.map((i) => [i.id, i]))
    return order.map((id) => byId.get(id)).filter(Boolean)
  }, [list.data, order])

  const reorder = useAdminMutation((ids) => adminApi.reorder(resourceKey, ids), { resource: resourceKey, onSuccess: () => toast('Order saved') })
  const remove = useAdminMutation((id) => adminApi.remove(resourceKey, id), { resource: resourceKey, onSuccess: () => toast('Deleted') })
  const action = useAdminMutation(({ id, act }) => adminApi.action(resourceKey, id, act), { resource: resourceKey, onSuccess: (_, v) => toast(v.act === 'publish' ? 'Published' : v.act === 'archive' ? 'Archived' : 'Moved to draft') })

  const canDrag = r.sortable && canWrite && !q.trim()
  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return
    const ids = rows.map((x) => x.id)
    const from = ids.indexOf(dragId)
    const to = ids.indexOf(targetId)
    ids.splice(to, 0, ids.splice(from, 1)[0])
    setOrder(ids)
    setDragId(null)
    reorder.mutate(ids)
  }
  const move = (id, d) => {
    const ids = rows.map((x) => x.id)
    const i = ids.indexOf(id)
    if (i + d < 0 || i + d >= ids.length) return
    ;[ids[i], ids[i + d]] = [ids[i + d], ids[i]]
    setOrder(ids)
    reorder.mutate(ids)
  }

  const onDelete = async (row) => {
    const ok = await confirm({
      title: `Delete ${r.singular.toLowerCase()}?`,
      message: `"${r.title(row)}" will be removed${r.children?.length ? ' together with everything inside it' : ''}. You can restore it later from its revision history (System → Audit log).`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (ok) remove.mutate(row.id)
  }

  const back = encodeURIComponent(location.pathname + location.search)
  const newParams = new URLSearchParams({ ...preset, ...fixed, back: location.pathname + location.search })
  const editHref = (row) => `/admin/r/${resourceKey}/${row.id}?back=${back}`
  const total = list.data?.total ?? 0
  const pages = Math.ceil(total / pageSize)

  return (
    <div className={compact ? '' : 'rounded-lg border border-slate-200 bg-white'}>
      <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mb-3' : 'border-b border-slate-100 p-3'}`}>
        {title && <h3 className="mr-auto text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h3>}
        {r.searchable && !compact && (
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" aria-hidden="true" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder={`Search ${r.label.toLowerCase()}`} className={`${inputCls} pl-9`} aria-label="Search" />
          </div>
        )}
        {!compact && (r.filters ?? []).map((f) => <FilterSelect key={f.key} filter={f} value={filters[f.key]} onChange={(v) => { setFilters((s) => ({ ...s, [f.key]: v || undefined })); setPage(1) }} />)}
        {!compact && <span className="flex-1" />}
        {canWrite && !r.noCreate && (
          <Link to={`/admin/r/${resourceKey}/new?${newParams}`} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary-600 px-3.5 text-sm font-semibold text-white hover:bg-primary-700">
            <Plus className="size-4" aria-hidden="true" /> Add {r.singular.toLowerCase()}
          </Link>
        )}
      </div>

      {(reorder.error || remove.error || action.error) && (
        <div className="p-3">
          <ErrorBox error={reorder.error || remove.error || action.error} />
        </div>
      )}

      {list.isPending ? (
        <Spinner />
      ) : list.isError ? (
        <div className="p-3">
          <ErrorBox error={list.error} onRetry={() => list.refetch()} />
        </div>
      ) : rows.length === 0 ? (
        <div className={compact ? '' : 'p-3'}>
          <Empty>{q ? 'Nothing matches your search.' : `No ${r.label.toLowerCase()} yet.`}</Empty>
        </div>
      ) : (
        <div className={`overflow-x-auto ${compact ? 'rounded-md border border-slate-200' : ''}`}>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {canDrag && <th className="w-16 px-2 py-2" aria-label="Order" />}
                {r.columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-3 py-2">
                    {c.label}
                  </th>
                ))}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  draggable={canDrag}
                  onDragStart={() => setDragId(row.id)}
                  onDragOver={(e) => canDrag && e.preventDefault()}
                  onDrop={() => onDrop(row.id)}
                  className={`${dragId === row.id ? 'opacity-40' : ''} hover:bg-primary-50/40`}
                >
                  {canDrag && (
                    <td className="px-1 py-1.5">
                      <div className="flex items-center text-slate-400">
                        <GripVertical className="size-4 cursor-grab" aria-hidden="true" />
                        <span className="flex flex-col">
                          <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(row.id, -1)} className="px-1 text-[0.6rem] leading-none hover:text-primary-700 disabled:opacity-30">
                            ▲
                          </button>
                          <button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(row.id, 1)} className="px-1 text-[0.6rem] leading-none hover:text-primary-700 disabled:opacity-30">
                            ▼
                          </button>
                        </span>
                      </div>
                    </td>
                  )}
                  {r.columns.map((c, ci) => (
                    <td key={c.key} className="max-w-xs truncate px-3 py-2">
                      {ci === 0 ? (
                        <Link to={editHref(row)} className="font-semibold text-ink hover:text-primary-700 hover:underline">
                          <Cell col={c} row={row} />
                        </Link>
                      ) : (
                        <Cell col={c} row={row} />
                      )}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-3 py-1.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      {r.publishable && canWrite && row.status !== 'PUBLISHED' && (
                        <Button size="sm" variant="ghost" onClick={() => action.mutate({ id: row.id, act: 'publish' })}>
                          Publish
                        </Button>
                      )}
                      {r.publicUrl && row.status === 'PUBLISHED' && (
                        <a href={r.publicUrl(row)} target="_blank" rel="noopener noreferrer" className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100" aria-label="View on site" title="View on site">
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                      <Link to={editHref(row)} className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary-700" aria-label={`Edit ${r.title(row)}`} title="Edit">
                        <Pencil className="size-4" />
                      </Link>
                      {canWrite && !r.noCreate && (
                        <Button variant="dangerGhost" size="icon" aria-label={`Delete ${r.title(row)}`} title="Delete" onClick={() => onDelete(row)}>
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!compact && pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-sm text-slate-500">
          <span>
            {total} {r.label.toLowerCase()} · page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
      {!compact && pages <= 1 && total > 0 && (
        <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
          {total} {total === 1 ? r.singular.toLowerCase() : r.label.toLowerCase()}
          {canDrag && total > 1 && ' · drag rows (or use the arrows) to change the order on the site'}
          {r.sortable && q.trim() && ' · clear the search to reorder'}
        </p>
      )}
      {compact && canDrag && rows.length > 1 && <p className="mt-2 text-xs text-slate-500">Drag rows (or use the arrows) to change the order.</p>}
      {reorder.isPending && <Badge tone="IN_PROGRESS">Saving order…</Badge>}
    </div>
  )
}
