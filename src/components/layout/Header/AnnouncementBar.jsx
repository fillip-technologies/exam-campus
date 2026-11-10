import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import SmartLink from '@/components/common/SmartLink'

const themes = {
  dark: { bar: 'bg-primary-900 text-primary-100', cta: 'text-accent-400 hover:text-white focus-visible:outline-accent-400' },
  accent: { bar: 'bg-accent-500 text-primary-900', cta: 'text-primary-900 hover:text-white focus-visible:outline-primary-900' },
  light: { bar: 'bg-primary-50 text-primary-900', cta: 'text-primary-700 hover:text-primary-900 focus-visible:outline-primary-600' },
}

/** Top strip from the admin's active announcement (none = no bar). */
export default function AnnouncementBar({ announcement }) {
  const [dismissed, setDismissed] = useState(false)
  if (!announcement || dismissed) return null
  const { text, mobileText, cta, theme, dismissible } = announcement
  const t = themes[theme] ?? themes.dark

  return (
    <div className={t.bar}>
      <div className="mx-auto flex w-full h-9 items-center justify-center gap-4 px-4 text-xs sm:justify-between sm:px-6 lg:px-12">
        <p className="truncate">
          <span className={mobileText ? 'hidden sm:inline' : undefined}>{text}</span>
          {mobileText && <span className="sm:hidden">{mobileText}</span>}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {cta?.href && (
            <SmartLink
              href={cta.href}
              className={`group hidden shrink-0 items-center gap-1 font-semibold transition-colors focus-visible:outline-2 sm:inline-flex ${t.cta}`}
            >
              {cta.label}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </SmartLink>
          )}
          {dismissible && (
            <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss announcement" className="grid size-6 place-items-center rounded opacity-80 hover:opacity-100">
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
