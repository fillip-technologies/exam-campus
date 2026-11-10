import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Undo2 } from 'lucide-react'
import { api, qs } from '@/api/client'
import { useAdminMutation } from '../api'
import { Button, Card, Empty, ErrorBox, formatDateTime, inputCls, PageHeader, Spinner, useConfirm, useToast } from '../ui'
import { resourceOfEntity } from './ResourceEditPage'

/** Every admin write, newest first. Deleted rows can be brought back from their last revision. */
export default function AuditLogPage() {
  const toast = useToast()
  const confirm = useConfirm()
  const [entityType, setEntityType] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(null)
  const list = useQuery({
    queryKey: ['admin', 'audit', entityType, page],
    queryFn: () => api(`/admin/audit-logs${qs({ entityType: entityType.trim(), page, pageSize: 50 })}`),
    placeholderData: (p) => p,
  })
  const undelete = useAdminMutation(
    async ({ entityType: type, entityId }) => {
      const { items } = await api(`/admin/revisions${qs({ entityType: type, entityId, take: 1 })}`)
      if (!items.length) throw new Error('No saved version to restore')
      return api(`/admin/revisions/${items[0].id}/restore`, { method: 'POST' })
    },
    { onSuccess: () => toast('Restored') },
  )
  const pages = Math.ceil((list.data?.total ?? 0) / 50)

  return (
    <div>
      <PageHeader title="Audit log" subtitle="Who changed what, and when. Open a row to see the change." />
      <Card bodyClass="p-0">
        <div className="flex gap-2 border-b border-slate-100 p-3">
          <input value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1) }} placeholder="Filter by type (exam, banner, homeSection …)" className={`${inputCls} max-w-sm`} aria-label="Entity type" />
        </div>
        {undelete.error && (
          <div className="p-3">
            <ErrorBox error={undelete.error} />
          </div>
        )}
        {list.isPending ? (
          <Spinner />
        ) : list.isError ? (
          <div className="p-3">
            <ErrorBox error={list.error} onRetry={() => list.refetch()} />
          </div>
        ) : list.data.items.length === 0 ? (
          <div className="p-3">
            <Empty>No changes recorded yet.</Empty>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Who</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data.items.map((a) => {
                  const res = resourceOfEntity(a.entityType)
                  const deleted = a.action.endsWith('.delete')
                  return (
                    <Fragment key={a.id}>
                      <tr className="cursor-pointer hover:bg-primary-50/40" onClick={() => setOpen(open === a.id ? null : a.id)}>
                        <td className="whitespace-nowrap px-3 py-2 text-slate-500">{formatDateTime(a.createdAt)}</td>
                        <td className="px-3 py-2">{a.actorName ?? '—'}</td>
                        <td className="px-3 py-2 font-mono text-xs">{a.action}</td>
                        <td className="px-3 py-2">
                          {res && a.entityId && !deleted ? (
                            <Link to={`/admin/r/${res}/${a.entityId}`} onClick={(e) => e.stopPropagation()} className="font-mono text-xs text-primary-700 hover:underline">
                              {a.entityId}
                            </Link>
                          ) : (
                            <span className="font-mono text-xs text-slate-500">{a.entityId ?? '—'}</span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          {deleted && res && (
                            <Button
                              size="sm"
                              icon={Undo2}
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (await confirm({ title: 'Restore deleted item?', message: 'It is recreated from the version saved when it was deleted.', confirmLabel: 'Restore' }))
                                  undelete.mutate({ entityType: a.entityType, entityId: a.entityId })
                              }}
                            >
                              Restore
                            </Button>
                          )}
                        </td>
                      </tr>
                      {open === a.id && (
                        <tr>
                          <td colSpan={5} className="bg-slate-50 px-3 py-2">
                            <pre className="max-h-72 overflow-auto text-xs">{JSON.stringify(a.diff, null, 2)}</pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex justify-end gap-2 border-t border-slate-100 p-3">
            <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
