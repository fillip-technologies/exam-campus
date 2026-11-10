import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { ArrowRight, LayoutDashboard, Menu, Search, X } from 'lucide-react'
import AnnouncementBar from './AnnouncementBar'
import Logo from '@/components/common/Logo'
import NavItem from './NavItem'
import DropdownPanel from './DropdownPanel'
import { ColumnsMega } from './MegaPanels'
import CategoryMega from './CategoryMega'
import SmartLink from '@/components/common/SmartLink'
import { iconFor } from '@/lib/icons'
import SearchPanel from './SearchPanel'
import SearchCombobox from '@/components/common/SearchCombobox'
import MobileDrawer from './MobileDrawer'
import { useLayout } from '@/api/public'
import { isStaff } from '@/services/authService'

export default function Header() {
  const [openId, setOpenId] = useState(null)
  // The active nav item follows the current page: Academic hubs vs Exam hubs.
  const { pathname } = useLocation()
  const { user, isLoggedIn, logout, openLogin } = useAuth()
  const { data: layout } = useLayout()
  const navItems = (layout?.nav ?? []).map((n) => ({ ...n, icon: iconFor(n.icon) }))
  const header = layout?.site.header
  const activeId = navItems.find((n) => n.activePathPrefix && pathname.startsWith(n.activePathPrefix))?.id ?? null
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const closeTimer = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpenId(null)
      setSearchOpen(false)
      setDrawerOpen(false)
    }
    const onPointer = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenId(null)
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [])

  const cancelClose = () => clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenId(null), 140)
  }
  const onEnter = (id) => {
    cancelClose()
    setOpenId(id)
    setSearchOpen(false)
  }
  const onToggle = (id) => {
    setOpenId((c) => (c === id ? null : id))
    setSearchOpen(false)
  }
  // Clicking any link inside a panel marks that section as the active one
  const navigateFrom = () => () => {
    setOpenId(null)
  }

  const current = navItems.find((n) => n.id === openId)

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <AnnouncementBar announcement={layout?.announcement} />

      <div
        className={`border-b bg-white/95 backdrop-blur transition-shadow duration-200 ${
          scrolled || openId || searchOpen
            ? 'border-slate-200 shadow-md shadow-primary-900/5'
            : 'border-slate-200'
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between gap-4 md:h-[4.5rem] px-4 sm:px-6 lg:px-12">
          <Logo site={layout?.site} />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) =>
                item.type === 'link' ? (
                  <li key={item.id}>
                    <SmartLink
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-semibold 2xl:px-3 focus-visible:outline-2 focus-visible:outline-accent-600 ${
                        activeId === item.id ? 'text-primary-800' : 'text-slate-600 hover:text-primary-800'
                      }`}
                    >
                      {item.icon && <item.icon className="size-4 text-accent-700" aria-hidden="true" />}
                      {item.label}
                    </SmartLink>
                  </li>
                ) : (
                <NavItem
                  key={item.id}
                  item={item}
                  open={openId === item.id}
                  active={activeId === item.id}
                  onToggle={onToggle}
                  onEnter={onEnter}
                >
                  {openId === item.id && item.type === 'dropdown' && (
                    <DropdownPanel item={item} onNavigate={navigateFrom(item.id)} />
                  )}
                </NavItem>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              onClick={() => {
                setSearchOpen((o) => !o)
                setOpenId(null)
              }}
              className={`hidden size-10 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-accent-600 md:grid ${
                searchOpen ? 'bg-primary-800 text-white' : 'text-slate-600 hover:bg-primary-50 hover:text-primary-800'
              }`}
            >
              {searchOpen ? <X className="size-5" aria-hidden="true" /> : <Search className="size-5" aria-hidden="true" />}
            </button>
            {isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                {isStaff(user) && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-primary-800 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-accent-600"
                  >
                    <LayoutDashboard className="size-4" aria-hidden="true" />
                    Admin
                  </Link>
                )}
                <span className="hidden max-w-[8rem] truncate text-sm font-semibold text-primary-800 2xl:inline">Hi, {user.name.split(" ")[0]}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-accent-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => openLogin()} className="hidden whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold text-primary-800 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-primary-50 hover:ring-primary-200 focus-visible:outline-2 focus-visible:outline-accent-600 sm:inline-block">
                {header?.loginLabel ?? 'Login'}
              </button>
            )}
            <SmartLink
              href={header?.cta?.href ?? '#start'}
              className="group hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-primary-900 shadow-sm transition-all hover:-translate-y-px hover:bg-accent-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 sm:inline-flex"
            >
              {header?.cta?.label ?? 'Start Learning'}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </SmartLink>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={() => setDrawerOpen(true)}
              className="grid size-10 place-items-center rounded-md text-ink transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-accent-600 xl:hidden"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Phones: the search bar is always visible under the logo row (no search icon). */}
        <div className="px-4 pb-3 pt-1 md:hidden">
          <SearchCombobox size="sm" placeholder={layout?.site.searchPlaceholder} />
        </div>

        {current?.type === 'mega' && (
          <div className="hidden xl:block">
            {current.columns && <ColumnsMega id={`panel-${current.id}`} item={current} onNavigate={navigateFrom(current.id)} />}
            {current.categories?.length > 0 && <CategoryMega id={`panel-${current.id}`} item={current} onNavigate={navigateFrom(current.id)} />}
          </div>
        )}

        {searchOpen && <SearchPanel id="header-search" suggestions={layout?.search.suggestions ?? []} onClose={() => setSearchOpen(false)} />}
      </div>

      {drawerOpen && <MobileDrawer layout={layout} navItems={navItems} onClose={() => setDrawerOpen(false)} />}
    </header>
  )
}
