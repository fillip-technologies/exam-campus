import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { api, qs } from '@/api/client'
import { useAuth } from '@/context/auth/useAuth'
import { hasRole, PASSWORD_MIN } from '@/services/authService'
import { useAdminMutation } from '../api'
import { Badge, Button, Card, Empty, ErrorBox, formatDateTime, inputCls, Modal, PageHeader, Spinner, Toggle, useConfirm, useToast } from '../ui'

const ROLES = ['STUDENT', 'SUPPORT', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']
const ROLE_HELP = {
  SUPPORT: 'Users, messages, waitlist; reads content',
  EDITOR: 'Edits all content',
  ADMIN: 'Content + settings, pass, students',
  SUPER_ADMIN: 'Everything, including staff accounts',
}

function NewStaffModal({ onClose }) {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', identifier: '', password: '', role: 'EDITOR' })
  const create = useAdminMutation((body) => api('/admin/users', { method: 'POST', body }), {
    resource: 'users',
    onSuccess: () => {
      toast('Staff account created')
      onClose()
    },
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <Modal
      title="New staff account"
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" busy={create.isPending} onClick={() => create.mutate(form)}>
            Create account
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {[
          ['name', 'Full name', 'text'],
          ['identifier', 'Email or mobile number', 'text'],
          ['password', `Password (at least ${PASSWORD_MIN} characters)`, 'password'],
        ].map(([k, label, type]) => (
          <label key={k} className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">{label}</span>
            <input type={type} value={form[k]} onChange={set(k)} className={inputCls} autoComplete={type === 'password' ? 'new-password' : 'off'} />
            {create.error?.fieldErrors?.[k] && <span className="mt-1 block text-xs font-semibold text-red-700">{create.error.fieldErrors[k]}</span>}
          </label>
        ))}
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-ink">Role</span>
          <select value={form.role} onChange={set('role')} className={inputCls}>
            {ROLES.filter((r) => r !== 'STUDENT').map((r) => (
              <option key={r} value={r}>
                {r} — {ROLE_HELP[r]}
              </option>
            ))}
          </select>
        </label>
        {create.error && !Object.keys(create.error.fieldErrors ?? {}).length && <ErrorBox error={create.error} />}
      </div>
    </Modal>
  )
}

export default function UsersPage() {
  const { user: me } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [staff, setStaff] = useState(false)
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const list = useQuery({
    queryKey: ['admin', 'users', q, role, staff, page],
    queryFn: () => api(`/admin/users${qs({ q: q.trim(), role, staff: staff || undefined, page, pageSize: 50 })}`),
    placeholderData: (p) => p,
  })
  const update = useAdminMutation(({ id, body }) => api(`/admin/users/${id}`, { method: 'PATCH', body }), { resource: 'users', onSuccess: () => toast('User updated') })

  const canEdit = (u) => (u.role === 'STUDENT' ? hasRole(me, 'ADMIN') : hasRole(me, 'SUPER_ADMIN'))

  const changeRole = async (u, next) => {
    if (next === u.role) return
    const ok = await confirm({ title: 'Change role?', message: `${u.name} becomes ${next}. They will be logged out on every device.`, confirmLabel: 'Change role' })
    if (ok) update.mutate({ id: u.id, body: { role: next } })
  }
  const toggleActive = async (u) => {
    if (u.isActive) {
      const ok = await confirm({ title: 'Disable this account?', message: `${u.name} will be logged out and cannot log in until enabled again.`, confirmLabel: 'Disable', danger: true })
      if (!ok) return
    }
    update.mutate({ id: u.id, body: { isActive: !u.isActive } })
  }

  const pages = Math.ceil((list.data?.total ?? 0) / 50)

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Students and staff share one login. Staff roles open the admin panel."
        actions={
          hasRole(me, 'SUPER_ADMIN') && (
            <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
              New staff account
            </Button>
          )
        }
      />
      <Card bodyClass="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" aria-hidden="true" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Search name, email or mobile" className={`${inputCls} pl-9`} aria-label="Search users" />
          </div>
          <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }} className={`${inputCls} w-auto`} aria-label="Role">
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <Toggle checked={staff} onChange={(v) => { setStaff(v); setPage(1) }} label="Staff only" /> Staff only
          </label>
        </div>
        {update.error && (
          <div className="p-3">
            <ErrorBox error={update.error} />
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
            <Empty>No users found.</Empty>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Login</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Joined</th>
                  <th className="px-3 py-2">Last login</th>
                  <th className="px-3 py-2">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data.items.map((u) => (
                  <tr key={u.id}>
                    <td className="px-3 py-2 font-semibold text-ink">
                      {u.name} {u.id === me.id && <Badge tone="IN_PROGRESS">You</Badge>}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{u.email ?? u.mobile}</td>
                    <td className="px-3 py-2">
                      {hasRole(me, 'SUPER_ADMIN') && u.id !== me.id ? (
                        <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} className={`${inputCls} w-auto py-1`} aria-label={`Role of ${u.name}`}>
                          {ROLES.map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge tone={u.role === 'STUDENT' ? 'off' : 'IN_PROGRESS'}>{u.role}</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(u.createdAt)}</td>
                    <td className="px-3 py-2 text-slate-500">{formatDateTime(u.lastLoginAt)}</td>
                    <td className="px-3 py-2">
                      <Toggle checked={u.isActive} onChange={() => toggleActive(u)} disabled={!canEdit(u) || u.id === me.id} label={`${u.name} active`} />
                    </td>
                  </tr>
                ))}
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
      {creating && <NewStaffModal onClose={() => setCreating(false)} />}
    </div>
  )
}
