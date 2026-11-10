import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import AnnouncementBar from './AnnouncementBar'
import Logo from '@/components/common/Logo'
import NavItem from './NavItem'
import DropdownPanel from './DropdownPanel'
import { AcademicMega } from './MegaPanels'
import CompetitiveMega from './CompetitiveMega'
import PyqMega from './PyqMega'
import SearchPanel from './SearchPanel'
import SearchCombobox from '@/components/common/SearchCombobox'
import MobileDrawer from './MobileDrawer'
import { navItems } from '@/data/nav'

export default function Header() {
  const [openId, setOpenId] = useState(null)
  // The active nav item follows the current page: Academic hubs vs Exam hubs.
  const { pathname } = useLocation()
  const { user, isLoggedIn, logout, openLogin } = useAuth()
  const activeId = pathname.startsWith('/academic') ? 'academic' : pathname.startsWith('/exams') ? 'competitive' : null
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
      <AnnouncementBar />

      <div
        className={`border-b bg-white/95 backdrop-blur transition-shadow duration-200 ${
          scrolled || openId || searchOpen
            ? 'border-slate-200 shadow-md shadow-primary-900/5'
            : 'border-slate-200'
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between gap-4 md:h-[4.5rem] px-4 sm:px-6 lg:px-12">
          <Logo />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
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
              ))}
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
                Login
              </button>
            )}
            <a
              href="#start"
              className="group hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-primary-900 shadow-sm transition-all hover:-translate-y-px hover:bg-accent-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 sm:inline-flex"
            >
              Start Learning
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
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
          <SearchCombobox size="sm" />
        </div>

        {current?.type === 'mega' && (
          <div className="hidden xl:block">
            {current.id === "academic" && <AcademicMega id={`panel-${current.id}`} onNavigate={navigateFrom(current.id)} />}
            {current.id === "competitive" && <CompetitiveMega id={`panel-${current.id}`} onNavigate={navigateFrom(current.id)} />}
            {current.id === "pyq" && <PyqMega id={`panel-${current.id}`} onNavigate={navigateFrom(current.id)} />}
          </div>
        )}

        {searchOpen && <SearchPanel id="header-search" onClose={() => setSearchOpen(false)} />}
      </div>

      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
    </header>
  )
}
