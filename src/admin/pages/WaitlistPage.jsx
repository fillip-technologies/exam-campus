import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Trash2 } from 'lucide-react'
import { api, download, qs } from '@/api/client'
import { useAuth } from '@/context/auth/useAuth'
import { hasRole } from '@/services/authService'
import { useAdminMutation } from '../api'
import { Button, Card, Empty, ErrorBox, formatDateTime, PageHeader, Spinner, useConfirm, useToast } from '../ui'

export default function WaitlistPage() {
  const { user } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const list = useQuery({ queryKey: ['admin', 'waitlist', page], queryFn: () => api(`/admin/waitlist${qs({ page, pageSize: 100 })}`), placeholderData: (p) => p })
  const remove = useAdminMutation((id) => api(`/admin/waitlist/${id}`, { method: 'DELETE' }), { resource: 'waitlist', onSuccess: () => toast('Removed') })
  const pages = Math.ceil((list.data?.total ?? 0) / 100)

  const exportCsv = async () => {
    setExporting(true)
    try {
      await download('/admin/waitlist?format=csv', 'waitlist.csv')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="App waitlist"
        subtitle={list.data ? `${list.data.total} people asked to be notified when the app launches.` : null}
        actions={
          <Button icon={Download} busy={exporting} onClick={exportCsv}>
            Export CSV
          </Button>
        }
      />
      <Card bodyClass="p-0">
        {list.isPending ? (
          <Spinner />
        ) : list.isError ? (
          <div className="p-3">
            <ErrorBox error={list.error} onRetry={() => list.refetch()} />
          </div>
        ) : list.data.items.length === 0 ? (
          <div className="p-3">
            <Empty>Nobody on the waitlist yet.</Empty>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Joined</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.data.items.map((w) => (
                <tr key={w.id}>
                  <td className="px-3 py-2 font-semibold text-ink">{w.email}</td>
                  <td className="px-3 py-2 text-slate-500">{w.source}</td>
                  <td className="px-3 py-2 text-slate-500">{formatDateTime(w.createdAt)}</td>
                  <td className="px-3 py-1.5 text-right">
                    {hasRole(user, 'ADMIN') && (
                      <Button
                        variant="dangerGhost"
                        size="icon"
                        aria-label={`Remove ${w.email}`}
                        onClick={async () => (await confirm({ title: 'Remove from waitlist?', message: w.email, confirmLabel: 'Remove', danger: true })) && remove.mutate(w.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
