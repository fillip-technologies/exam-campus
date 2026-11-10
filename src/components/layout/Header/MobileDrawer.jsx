import { Link } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, X } from 'lucide-react'
import Logo from '@/components/common/Logo'
import { academicColumns, navItems } from '@/data/nav'
import { competitiveMenu } from '@/data/competitiveMenu'
import { pyqMenu } from '@/data/pyqMenu'

function Accordion({ id, label, badge, icon: Icon, open, onToggle, children }) {
  return (
    <li className="border-b border-slate-100">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`m-${id}`}
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between gap-2 px-1 py-3.5 text-left text-base font-semibold text-ink focus-visible:outline-2 focus-visible:outline-accent-600"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-accent-700" aria-hidden="true" />}
          {label}
          {badge && (
            <span className="rounded bg-accent-100 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase leading-none text-accent-700">{badge}</span>
          )}
        </span>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div id={`m-${id}`} className="pb-3">{children}</div>}
    </li>
  )
}

const subLink = 'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-accent-600'

export default function MobileDrawer({ onClose }) {
  const { isLoggedIn, logout, openLogin } = useAuth()
  const [openId, setOpenId] = useState(null)
  const [openCat, setOpenCat] = useState(null)
  const toggle = (id) => setOpenId((c) => (c === id ? null : id))

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className="fixed inset-0 z-[70] xl:hidden">
      <div className="absolute inset-0 animate-fade-in bg-primary-900/50" onClick={onClose} aria-hidden="true" />
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute inset-y-0 right-0 flex w-[min(24rem,100%)] animate-slide-in flex-col bg-white shadow-2xl"
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <Logo />
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-10 place-items-center rounded-md text-ink hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-accent-600">
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4">
          <ul>
            {navItems.map((item) => (
              <Accordion key={item.id} id={item.id} label={item.label} badge={item.badge} icon={item.icon} open={openId === item.id} onToggle={toggle}>
                {item.id === 'academic' && (
                  <ul className="space-y-3 pl-1">
                    {academicColumns.map((c) => (
                      <li key={c.title}>
                        <a href="#" onClick={onClose} className={`${subLink} font-semibold text-ink`}>
                          <c.icon className="size-4 text-primary-600" aria-hidden="true" /> {c.title}
                        </a>
                        <ul className="ml-6 flex flex-wrap gap-x-1">
                          {c.links.map((l) => {
                            const label = typeof l === "string" ? l : l.label
                            const linkClass = "rounded px-2 py-1 text-xs text-slate-500 hover:text-primary-700"
                            return (
                              <li key={label}>
                                {typeof l === "string" ? (
                                  <a href="#" onClick={onClose} className={linkClass}>{label}</a>
                                ) : (
                                  <Link to={l.to} onClick={onClose} className={linkClass}>{label}</Link>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
                {(item.id === 'competitive' || item.id === 'pyq') && (
                  <ul>
                    {(item.id === "pyq" ? pyqMenu : competitiveMenu).map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          aria-expanded={openCat === c.id}
                          aria-controls={`m-cat-${c.id}`}
                          onClick={() => setOpenCat((o) => (o === c.id ? null : c.id))}
                          className={`${subLink} w-full justify-between text-left font-semibold text-ink`}
                        >
                          <span className="flex items-center gap-2.5">
                            <c.icon className="size-4 text-primary-600" aria-hidden="true" /> {c.label}
                          </span>
                          <ChevronDown
                            className={`size-4 text-slate-400 transition-transform ${openCat === c.id ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                        {openCat === c.id && (
                          <ul id={`m-cat-${c.id}`} className="mb-2 ml-3 grid grid-cols-2 gap-x-1 border-l-2 border-primary-100 pl-2">
                            {c.exams.map((e) => (
                              <li key={e.slug}>
                                <Link to={item.id === "pyq" ? `/exams/${e.slug}#previous-year-papers` : `/exams/${e.slug}`} onClick={onClose} className="block rounded px-2 py-1.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-800">
                                  {e.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                    <li>
                      <a href={item.id === "pyq" ? "#all-previous-papers" : "#all-exams"} onClick={onClose} className="mt-1 flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50">
                        {item.id === "pyq" ? "Explore All Previous Year Papers" : "Explore All Competitive Exams"} <ArrowRight className="size-4" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                )}
                {item.items && (
                  <ul>
                    {item.items.map((i) => (
                      <li key={i.title}>
                        <a href="#" onClick={onClose} className={subLink}>
                          <i.icon className="size-4 text-primary-600" aria-hidden="true" /> {i.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Accordion>
            ))}
          </ul>
        </nav>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 p-4">
          {isLoggedIn ? (
            <button type="button" onClick={() => { logout(); onClose() }} className="rounded-md px-4 py-3 text-center text-sm font-semibold text-primary-800 ring-1 ring-inset ring-slate-300 hover:bg-primary-50">Logout</button>
          ) : (
            <button type="button" onClick={() => { onClose(); openLogin() }} className="rounded-md px-4 py-3 text-center text-sm font-semibold text-primary-800 ring-1 ring-inset ring-slate-300 hover:bg-primary-50">Login</button>
          )}
          <a href="#start" onClick={onClose} className="rounded-md bg-accent-500 px-4 py-3 text-center text-sm font-bold text-primary-900 hover:bg-accent-400">Start Learning →</a>
        </div>
      </div>
    </div>
  )
}
