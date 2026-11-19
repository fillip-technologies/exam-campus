import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import JsonLd from './JsonLd'

/**
 * Top band of a listing page: breadcrumb (also published as BreadcrumbList JSON-LD), eyebrow, h1, intro and
 * optional extras (stats, buttons) as children. crumbs: [{ label, to? }], the last one is the current page.
 */
export default function PageHeader({ crumbs, eyebrow, title, intro, children }) {
  const origin = window.location.origin
  return (
    <section aria-labelledby="page-title" className="border-b border-slate-200 bg-surface">
      <JsonLd
        data={{
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            ...(c.to ? { item: `${origin}${c.to}` } : { item: window.location.href.split(/[?#]/)[0] }),
          })),
        }}
      />
      <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 text-slate-300" aria-hidden="true" />}
                {c.to && i < crumbs.length - 1 ? (
                  <Link to={c.to} className="hover:text-primary-700 hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-ink">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="mt-6 text-sm font-semibold text-primary-600">{eyebrow}</p>}
        <h1 id="page-title" className={`${eyebrow ? 'mt-1' : 'mt-6'} text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl`}>
          {title}
        </h1>
        {intro && <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{intro}</p>}
        {children}
      </div>
    </section>
  )
}
