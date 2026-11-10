import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Archive, ExternalLink, History, Save, Send, Trash2, Undo2 } from 'lucide-react'
import { api, qs } from '@/api/client'
import { useAuth } from '@/context/auth/useAuth'
import { hasRole } from '@/services/authService'
import { adminApi, useAdminMutation, useAdminRow } from '../api'
import { FieldInput } from '../components/fields'
import ResourceTable from '../components/ResourceTable'
import { getResource } from '../resources'
import { slugify, toFormValues, toPayload, validate } from '../formValues'
import { Button, Card, ErrorBox, formatDateTime, Modal, PageHeader, Spinner, StatusBadge, useConfirm, useToast } from '../ui'
import NotFound from './NotFound'

/** Entity type used by AuditLog / ContentRevision for each resource (backend resources.ts `entityType`). */
const ENTITY_TYPES = {
  announcements: 'announcement', 'nav-items': 'navItem', 'nav-columns': 'navColumn', 'nav-links': 'navLink',
  'footer-columns': 'footerColumn', 'footer-links': 'footerLink', 'social-links': 'socialLink', 'search-suggestions': 'searchSuggestion',
  'home-sections': 'homeSection', 'section-items': 'sectionItem', banners: 'banner', 'hero-categories': 'heroCategory',
  'series-tabs': 'seriesTab', 'exam-categories': 'examCategory', organizations: 'examOrganization', 'class-groups': 'classGroup',
  exams: 'exam', 'quick-info': 'quickInfoItem', 'exam-dates': 'examDate', 'exam-updates': 'examUpdate',
  'eligibility-sections': 'examEligibilitySection', 'pattern-stages': 'examPatternStage', 'pattern-sections': 'examPatternSection',
  'syllabus-stages': 'examSyllabusStage', 'syllabus-subjects': 'examSyllabusSubject', papers: 'previousYearPaper',
  'exam-resources': 'examResource', faqs: 'faq', classes: 'class', 'class-subjects': 'classSubject', 'how-it-works': 'howItWorksStep',
  series: 'series', 'free-tests': 'freeTest', passes: 'pass', pages: 'page', 'contact-messages': 'contactMessage',
}
export const entityTypeOf = (resourceKey) => ENTITY_TYPES[resourceKey]
export const resourceOfEntity = (entityType) => Object.entries(ENTITY_TYPES).find(([, t]) => t === entityType)?.[0]

/** Revision history of one row: each save stored the row as it was before; restoring saves the current state first. */
function Revisions({ resourceKey, id, onClose, onRestored }) {
  const toast = useToast()
  const confirm = useConfirm()
  const list = useQuery({ queryKey: ['admin', resourceKey, 'revisions', id], queryFn: () => api(`/admin/revisions${qs({ entityType: entityTypeOf(resourceKey), entityId: id, take: 50 })}`) })
  const restore = useAdminMutation((revId) => api(`/admin/revisions/${revId}/restore`, { method: 'POST' }), {
    resource: resourceKey,
    onSuccess: () => {
      toast('Restored')
      onRestored()
    },
  })
  const [open, setOpen] = useState(null)
  return (
    <Modal title="Revision history" size="lg" onClose={onClose}>
      {list.isPending ? (
        <Spinner />
      ) : list.isError ? (
        <ErrorBox error={list.error} />
      ) : list.data.items.length === 0 ? (
        <p className="text-sm text-slate-500">No earlier versions yet. A version is saved every time this item changes.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
          {list.data.items.map((rev) => (
            <li key={rev.id} className="px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="flex-1 text-sm">
                  Version from before <strong>{formatDateTime(rev.createdAt)}</strong>
                </span>
                <Button size="sm" variant="ghost" onClick={() => setOpen(open === rev.id ? null : rev.id)}>
                  {open === rev.id ? 'Hide' : 'Show'}
                </Button>
                <Button
                  size="sm"
                  icon={Undo2}
                  busy={restore.isPending && restore.variables === rev.id}
                  onClick={async () => {
                    if (await confirm({ title: 'Restore this version?', message: 'The current version is saved first, so you can undo the restore.', confirmLabel: 'Restore' })) restore.mutate(rev.id)
                  }}
                >
                  Restore
                </Button>
              </div>
              {open === rev.id && <pre className="mt-2 max-h-64 overflow-auto rounded bg-slate-50 p-2 text-xs">{JSON.stringify(rev.snapshot, null, 2)}</pre>}
            </li>
          ))}
        </ul>
      )}
      {restore.error && <ErrorBox error={restore.error} />}
    </Modal>
  )
}

/** Fields grouped under their `group` heading, in config order. */
function groupFields(fields) {
  const groups = []
  for (const f of fields) {
    const name = f.group ?? ''
    let g = groups.find((x) => x.name === name)
    if (!g) groups.push((g = { name, fields: [] }))
    g.fields.push(f)
  }
  return groups
}

const parsePreset = (fields, params) => {
  const preset = {}
  for (const [k, v] of params.entries()) {
    if (k === 'back' || k === 'tab') continue
    const f = fields.find((x) => x.key === k)
    if (!f) continue
    preset[k] = f.kind === 'bool' ? v === 'true' : v
  }
  return preset
}

export default function ResourceEditPage() {
  const { resource: resourceKey, id } = useParams()
  const isNew = id === 'new'
  const r = getResource(resourceKey)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()
  const row = useAdminRow(resourceKey, isNew ? null : id)
  const [values, setValues] = useState(null)
  const [errors, setErrors] = useState({})
  const slugTouched = useRef(false)
  const valuesRef = useRef(null)
  valuesRef.current = values
  const [showRevisions, setShowRevisions] = useState(false)
  const back = params.get('back')
  const tab = params.get('tab') ?? 'details'

  const fields = useMemo(() => r?.fields ?? [], [r])
  const preset = useMemo(() => parsePreset(fields, params), [fields, params])
  const canWrite = hasRole(user, r?.writeRole ?? 'EDITOR')

  useEffect(() => {
    if (isNew) setValues(toFormValues(fields, null, preset))
    else if (row.data) setValues(toFormValues(fields, row.data))
    setErrors({})
    // preset only matters when the page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, row.data, fields])

  const goBack = () => navigate(back ?? `/admin/r/${resourceKey}`)

  const save = useAdminMutation((body) => (isNew ? adminApi.create(resourceKey, body) : adminApi.update(resourceKey, id, body)), {
    resource: resourceKey,
    onSuccess: (saved) => {
      toast(isNew ? `${r.singular} created` : 'Saved')
      setErrors({})
      if (isNew) {
        // parents open on their edit page so children can be added; leaf rows go back to the list
        if (r.children?.length) navigate(`/admin/r/${resourceKey}/${saved.id}${back ? `?back=${encodeURIComponent(back)}` : ''}`, { replace: true })
        else goBack()
      }
    },
  })
  const act = useAdminMutation((a) => adminApi.action(resourceKey, id, a), {
    resource: resourceKey,
    onSuccess: (_, a) => toast(a === 'publish' ? 'Published' : a === 'archive' ? 'Archived' : 'Moved to draft'),
  })
  const remove = useAdminMutation(() => adminApi.remove(resourceKey, id), {
    resource: resourceKey,
    onSuccess: () => {
      toast('Deleted')
      goBack()
    },
  })

  useEffect(() => {
    if (save.error) setErrors(save.error.fieldErrors ?? {})
  }, [save.error])

  if (!r) return <NotFound />
  if (!isNew && row.isPending) return <Spinner />
  if (!isNew && row.isError) return <ErrorBox error={row.error} onRetry={() => row.refetch()} />
  if (!values) return <Spinner />

  // new rows: the slug follows its source field until the admin edits the slug itself
  const setFormValues = (updater) => {
    const prev = valuesRef.current
    const next = { ...(typeof updater === 'function' ? updater(prev) : updater) }
    for (const f of fields) {
      if (f.kind !== 'slug') continue
      if (next[f.key] !== prev[f.key] && next[f.from] === prev[f.from]) slugTouched.current = true
      else if (isNew && !slugTouched.current && f.from && next[f.from] !== prev[f.from]) next[f.key] = slugify(next[f.from])
    }
    valuesRef.current = next
    setValues(next)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(fields, values)
    setErrors(found)
    if (Object.keys(found).length) {
      toast('Please fix the highlighted fields', 'error')
      return
    }
    save.mutate(toPayload(fields, values))
  }

  const onDelete = async () => {
    const ok = await confirm({
      title: `Delete ${r.singular.toLowerCase()}?`,
      message: `This removes it${r.children?.length ? ' and everything inside it' : ''}. Sold products cannot be deleted: archive them instead.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (ok) remove.mutate()
  }

  const current = row.data
  const children = isNew ? [] : (r.children ?? []).filter((c) => !c.showIf || c.showIf(current))
  const activeChild = children.find((c) => c.resource + c.fk === tab)
  const status = current?.status
  const title = isNew ? `New ${r.singular.toLowerCase()}` : r.title(current)
  const visibleFields = fields.filter((f) => !f.showIf || f.showIf(values))

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={isNew ? null : r.label}
        actions={
          !isNew && (
            <>
              {status && <StatusBadge status={status} />}
              {r.publicUrl && status !== undefined && status === 'PUBLISHED' && (
                <a href={r.publicUrl(current)} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  <ExternalLink className="size-4" aria-hidden="true" /> View on site
                </a>
              )}
              {r.publicUrl && !r.publishable && (
                <a href={r.publicUrl(current)} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  <ExternalLink className="size-4" aria-hidden="true" /> View on site
                </a>
              )}
              {hasRole(user, 'EDITOR') && (
                <Button icon={History} onClick={() => setShowRevisions(true)}>
                  History
                </Button>
              )}
              {r.publishable && canWrite && status !== 'PUBLISHED' && (
                <Button variant="accent" icon={Send} busy={act.isPending && act.variables === 'publish'} onClick={() => act.mutate('publish')}>
                  Publish
                </Button>
              )}
              {r.publishable && canWrite && status === 'PUBLISHED' && (
                <Button busy={act.isPending && act.variables === 'unpublish'} onClick={() => act.mutate('unpublish')}>
                  Unpublish
                </Button>
              )}
              {r.publishable && canWrite && status !== 'ARCHIVED' && (
                <Button icon={Archive} busy={act.isPending && act.variables === 'archive'} onClick={() => act.mutate('archive')}>
                  Archive
                </Button>
              )}
              {canWrite && !r.noCreate && (
                <Button variant="dangerGhost" icon={Trash2} busy={remove.isPending} onClick={onDelete}>
                  Delete
                </Button>
              )}
            </>
          )
        }
      >
        <Link to={back ?? `/admin/r/${resourceKey}`} className="mb-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back
        </Link>
      </PageHeader>

      {(act.error || remove.error) && (
        <div className="mb-4">
          <ErrorBox error={act.error || remove.error} />
        </div>
      )}

      {children.length > 0 && (
        <div role="tablist" aria-label="Sections" className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200">
          {[{ key: 'details', label: 'Details' }, ...children.map((c) => ({ key: c.resource + c.fk, label: c.label }))].map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key || (t.key === 'details' && !activeChild)}
              onClick={() => setParams((p) => {
                const n = new URLSearchParams(p)
                if (t.key === 'details') n.delete('tab')
                else n.set('tab', t.key)
                return n
              }, { replace: true })}
              className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold ${
                tab === t.key || (t.key === 'details' && !activeChild) ? 'border-primary-600 text-primary-800' : 'border-transparent text-slate-500 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {activeChild ? (
        <Card bodyClass="p-4">
          <ResourceTable key={activeChild.resource + activeChild.fk} resourceKey={activeChild.resource} fixed={{ [activeChild.fk]: id }} preset={activeChild.preset} compact />
        </Card>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {groupFields(visibleFields).map((g) => (
            <Card key={g.name || 'main'} title={g.name || null}>
              <div className="grid gap-4 sm:grid-cols-2">
                {g.fields.map((f) => (
                  <FieldInput key={f.kind === 'link' ? `link-${f.prefix ?? ''}` : f.key} field={f} values={values} setValues={setFormValues} errors={errors} rowId={isNew ? null : id} />
                ))}
              </div>
            </Card>
          ))}

          {save.error && <ErrorBox error={save.error} />}

          {canWrite && (
            <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
              <Button type="submit" variant="primary" icon={Save} busy={save.isPending}>
                {isNew ? `Create ${r.singular.toLowerCase()}` : 'Save changes'}
              </Button>
              <Button onClick={goBack}>Cancel</Button>
              {!isNew && current?.updatedAt && <span className="ml-auto hidden text-xs text-slate-500 sm:inline">Last saved {formatDateTime(current.updatedAt)}</span>}
            </div>
          )}
        </form>
      )}

      {showRevisions && <Revisions resourceKey={resourceKey} id={id} onClose={() => setShowRevisions(false)} onRestored={() => setShowRevisions(false)} />}
    </div>
  )
}
