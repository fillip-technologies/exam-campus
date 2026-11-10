import { ArrowRight } from 'lucide-react'
import MenuLink from './MenuLink'
import SmartLink from '@/components/common/SmartLink'
import { iconFor } from '@/lib/icons'

/** Full-width shell shared by every mega-menu. footer: { text, cta, href } */
export function MegaShell({ id, footer, children, bare = false, onNavigate }) {
  return (
    <div id={id} className="absolute inset-x-0 top-full animate-pop border-y border-slate-200 bg-white shadow-xl shadow-primary-900/10">
      <div className={`mx-auto w-full px-12 ${bare ? 'py-0' : 'py-8'}`}>{children}</div>
      {footer && (
        <div className="border-t border-slate-100 bg-surface">
          <div className="mx-auto flex w-full items-center justify-between px-12 py-3 text-sm">
            <p className="text-slate-500">{footer.text}</p>
            {footer.cta && (
              <SmartLink href={footer.href ?? '#'} onClick={onNavigate} className="inline-flex items-center gap-1.5 font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-accent-600">
                {footer.cta} <ArrowRight className="size-4" aria-hidden="true" />
              </SmartLink>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const linkClass =
  'block rounded py-1 pl-2 text-sm text-slate-600 transition-colors hover:text-primary-700 hover:underline focus-visible:outline-2 focus-visible:outline-accent-600'

/** Mega menu built from admin-managed columns (Academic). Links without a published target show as plain text. */
export function ColumnsMega({ id, item, onNavigate }) {
  const count = Math.min(Math.max(item.columns.length, 1), 6)
  return (
    <MegaShell
      id={id}
      onNavigate={onNavigate}
      footer={{
        text: 'Not sure where to start? Take a free level check for your class.',
        cta: item.footer?.label ?? 'Browse all classes',
        href: item.footer?.href,
      }}
    >
      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {item.columns.map(({ title, icon, desc, links }) => (
          <section key={title} aria-label={title}>
            <MenuLink icon={iconFor(icon) ?? undefined} title={title} desc={desc} onClick={onNavigate} />
            <ul className="mt-2 space-y-0.5 border-l border-slate-200 pl-3 ml-[1.35rem]">
              {links.map((l) => (
                <li key={l.label}>
                  <SmartLink href={l.href} onClick={onNavigate} className={l.href ? linkClass : `${linkClass} cursor-default text-slate-400 hover:no-underline hover:text-slate-400`}>
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </MegaShell>
  )
}
