import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Inbox, ShoppingCart, Smartphone, Users } from 'lucide-react'
import { useAuth } from '@/context/auth/useAuth'
import { useDashboard } from '../api'
import { Card, ErrorBox, formatDateTime, PageHeader, Spinner, StatusBadge } from '../ui'

function Stat({ icon: Icon, label, value, hint, to }) {
  const inner = (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-primary-200">
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums text-ink">{value}</p>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

const quickLinks = [
  ['Home sections', '/admin/r/home-sections'],
  ['Banners', '/admin/r/banners'],
  ['Exams', '/admin/r/exams'],
  ['Test series', '/admin/r/series'],
  ['Announcement bar', '/admin/r/announcements'],
  ['Navbar', '/admin/r/nav-items'],
]

export default function Dashboard() {
  const { user } = useAuth()
  const q = useDashboard()

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Everything on the website is managed from here." />
      {q.isPending ? (
        <Spinner />
      ) : q.isError ? (
        <ErrorBox error={q.error} onRetry={() => q.refetch()} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Stat icon={Users} label="Students" value={q.data.students} hint={`${q.data.newStudents7d} new this week`} to="/admin/users" />
            <Stat icon={Smartphone} label="App waitlist" value={q.data.waitlist} to="/admin/waitlist" />
            <Stat icon={Inbox} label="New messages" value={q.data.newMessages} to="/admin/r/contact-messages" />
            <Stat icon={ShoppingCart} label="Orders today" value={q.data.ordersToday} hint={`₹${(q.data.revenueTodayPaise / 100).toLocaleString('en-IN')} revenue`} />
            <Stat icon={BookOpen} label="Live exam pages" value={q.data.examsByStatus?.PUBLISHED ?? 0} hint={`${q.data.examsByStatus?.COMING_SOON ?? 0} coming soon`} to="/admin/r/exams" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Latest contact messages" actions={<Link to="/admin/r/contact-messages" className="text-sm font-semibold text-primary-700 hover:underline">All messages</Link>}>
              {q.data.latestMessages.length === 0 ? (
                <p className="text-sm text-slate-500">No messages yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {q.data.latestMessages.map((m) => (
                    <li key={m.id} className="flex items-center gap-3 py-2 text-sm">
                      <Link to={`/admin/r/contact-messages/${m.id}`} className="min-w-0 flex-1 truncate font-semibold text-ink hover:text-primary-700">
                        {m.subject || m.name}
                      </Link>
                      {m.status && <StatusBadge status={m.status} />}
                      <span className="shrink-0 text-xs text-slate-500">{formatDateTime(m.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card title="Exams by status">
              <ul className="space-y-2">
                {Object.entries(q.data.examsByStatus ?? {}).map(([status, n]) => (
                  <li key={status} className="flex items-center justify-between text-sm">
                    <StatusBadge status={status} />
                    <Link to={`/admin/r/exams?status=${status}`} className="font-semibold tabular-nums text-ink hover:text-primary-700">
                      {n}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card title="Quick edit">
            <ul className="grid gap-2 sm:grid-cols-3">
              {quickLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-primary-800 ring-1 ring-inset ring-slate-200 hover:bg-primary-50">
                    {label} <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
