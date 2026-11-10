import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ExternalLink, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/auth/useAuth'
import { hasRole } from '@/services/authService'
import { resources } from './resources'

/** Sidebar: resource groups from resources.jsx + the special pages, filtered by the user's role. */
const special = {
  Site: [{ to: '/admin/settings', label: 'Brand & settings' }],
  Content: [{ to: '/admin/media', label: 'Media library' }],
  Students: [
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/waitlist', label: 'App waitlist' },
  ],
  System: [{ to: '/admin/audit', label: 'Audit log', role: 'ADMIN' }],
}
const GROUPS = ['Site', 'Home page', 'Catalog', 'Content', 'Students', 'System']

function buildNav(user) {
  return GROUPS.map((g) => ({
    name: g,
    items: [
      ...Object.entries(resources)
        .filter(([, r]) => r.group === g && !r.parentOnly)
        .map(([key, r]) => ({ to: `/admin/r/${key}`, label: r.label })),
      ...(special[g] ?? []).filter((i) => !i.role || hasRole(user, i.role)),
    ],
  })).filter((g) => g.items.length)
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const nav = buildNav(user)
  const close = () => setOpen(false)
  useEffect(() => {
    document.title = 'Admin | ExamCampus'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <Link to="/admin" className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
        <img src="/images/brand/logo-mark.png" alt="" className="h-7 w-auto rounded bg-white p-0.5" />
        <span className="font-semibold text-white">ExamCampus admin</span>
      </Link>
      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <NavLink
          to="/admin"
          end
          onClick={close}
          className={({ isActive }) => `flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-semibold ${isActive ? 'bg-white/15 text-white' : 'text-primary-100 hover:bg-white/10'}`}
        >
          <LayoutDashboard className="size-4" aria-hidden="true" /> Dashboard
        </NavLink>
        {nav.map((g) => (
          <div key={g.name}>
            <p className="px-2.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary-300">{g.name}</p>
            <ul className="mt-1 space-y-0.5">
              {g.items.map((i) => (
                <li key={i.to}>
                  <NavLink
                    to={i.to}
                    onClick={close}
                    className={({ isActive }) => `block rounded-md px-2.5 py-1.5 text-sm ${isActive ? 'bg-white/15 font-semibold text-white' : 'text-primary-100 hover:bg-white/10 hover:text-white'}`}
                  >
                    {i.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-3 text-sm">
        <p className="truncate font-semibold text-white">{user.name}</p>
        <p className="text-xs text-primary-300">{user.role.replace('_', ' ')}</p>
        <div className="mt-2 flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-primary-100 ring-1 ring-inset ring-white/20 hover:bg-white/10">
            <ExternalLink className="size-3.5" aria-hidden="true" /> View site
          </a>
          <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-primary-100 ring-1 ring-inset ring-white/20 hover:bg-white/10">
            <LogOut className="size-3.5" aria-hidden="true" /> Log out
          </button>
        </div>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-primary-900 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary-900/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 animate-fade-in bg-primary-900">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(!open)} aria-label="Menu" className="grid size-9 place-items-center rounded-md hover:bg-slate-100">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="font-semibold text-primary-900">ExamCampus admin</span>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
