import Logo from '@/components/common/Logo'
import SmartLink from '@/components/common/SmartLink'
import { useLayout } from '@/api/public'

const year = new Date().getFullYear()

const linkCls =
  'text-primary-200 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/** Footer: columns, legal links, social links and brand copy, all managed in the admin panel. */
export default function Footer() {
  const { data: layout } = useLayout()
  if (!layout) return <footer className="min-h-40 bg-primary-900" />
  const { site, footer } = layout
  const dev = site.footer.developer

  return (
    <footer className="bg-primary-900 text-primary-200">
      <div
        className="mx-auto grid w-full gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_repeat(var(--cols),1fr)] lg:gap-8 lg:px-12 lg:py-14"
        style={{ '--cols': Math.max(footer.columns.length, 1) }}
      >
          <div>
            <div className="inline-block rounded-md bg-white px-3 py-2">
              <Logo site={site} />
            </div>
            {site.footer.tagline && <p className="mt-3 max-w-xs leading-relaxed">{site.footer.tagline}</p>}
            {footer.social.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {footer.social.map((s) => (
                  <li key={s.platform}>
                    <SmartLink href={s.url} className={linkCls}>
                      {s.platform}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href} className={l.href ? linkCls : 'text-primary-300/70'}>
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full flex-col gap-3 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>
            &copy; {year} {site.footer.copyright ?? `${site.siteName}. All rights reserved.`}
          </p>
          {dev?.name && (
            <a
              href={dev.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Designed and developed by ${dev.name} (opens in a new tab)`}
              className="flex items-center gap-2.5 rounded-sm text-primary-200 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span>Designed &amp; Developed by</span>
              {dev.logoUrl ? <img src={dev.logoUrl} alt="" width="384" height="74" loading="lazy" className="h-6 w-auto" /> : <span className="font-semibold text-white">{dev.name}</span>}
            </a>
          )}
          {footer.legal.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <SmartLink href={l.href} className={linkCls}>
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
