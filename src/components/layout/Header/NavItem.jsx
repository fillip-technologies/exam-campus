import { ChevronDown } from 'lucide-react'

/** Top-level nav trigger. Renders its dropdown panel (if any) as children. */
export default function NavItem({ item, open, active, onToggle, onEnter, children }) {
  const { id, label, badge, icon: Icon } = item
  return (
    <li className={item.type === 'dropdown' ? 'relative' : undefined} onMouseEnter={() => onEnter(id)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`panel-${id}`}
        aria-haspopup="true"
        aria-label={item.ariaLabel}
        onClick={() => onToggle(id)}
        className={`group relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-semibold 2xl:px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600 ${
          open || active ? 'text-primary-800' : 'text-slate-600 hover:text-primary-800'
        }`}
      >
        {Icon && <Icon className="size-4 text-accent-700" aria-hidden="true" />}
        {label}
        {badge && (
          <span className="rounded bg-accent-100 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase leading-none tracking-wide text-accent-700">
            {badge}
          </span>
        )}
        <ChevronDown
          className={`size-3.5 text-slate-400 transition-transform duration-200 group-hover:text-primary-700 ${
            open ? 'rotate-180 text-primary-700' : ''
          }`}
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          className={`absolute inset-x-3 -bottom-[1.1rem] h-0.5 origin-left rounded bg-accent-500 transition-transform duration-200 ${
            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
          }`}
        />
      </button>
      {children}
    </li>
  )
}
