import { PLAY_STORE_URL } from '@/lib/app'

/** Google Play's four-colour play mark (inline, so it needs no external image). */
function PlayMark({ className }) {
  return (
    <svg viewBox="0 0 24 26" className={className} aria-hidden="true">
      <path fill="#00D7FE" d="M.6.5C.2.9 0 1.5 0 2.3v21.4c0 .8.2 1.4.6 1.8l.1.1L13 13.3v-.3L.7.4z" />
      <path fill="#FFCE00" d="m17.1 17.5-4.1-4.2v-.3l4.1-4.2.1.1 4.9 2.8c1.4.8 1.4 2.1 0 2.9l-4.9 2.8z" />
      <path fill="#FF3A44" d="M17.2 17.4 13 13.2.6 25.6c.5.5 1.2.5 2.1.1l14.5-8.3" />
      <path fill="#00F076" d="M17.2 9 2.7.7C1.8.2 1.1.3.6.8L13 13.2z" />
    </svg>
  )
}

/**
 * "GET IT ON Google Play" store button that opens the ExamCampus app listing in a new tab.
 * tone: 'dark' (black, for light backgrounds) or 'light' (white, for dark backgrounds).
 */
export default function GooglePlayButton({ href = PLAY_STORE_URL, tone = 'dark', className = '' }) {
  const colors = tone === 'light' ? 'bg-white text-ink hover:bg-primary-50 ring-white/20' : 'bg-black text-white hover:bg-slate-800 ring-white/15'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get the ExamCampus app on Google Play (opens in a new tab)"
      className={`inline-flex items-center gap-3 rounded-xl px-4 py-2.5 ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-400 ${colors} ${className}`}
    >
      <PlayMark className="h-7 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[0.6rem] font-semibold uppercase tracking-wider opacity-80">Get it on</span>
        <span className="mt-0.5 text-lg font-semibold tracking-tight">Google Play</span>
      </span>
    </a>
  )
}
