/** Common wrapper for a hub section: a white panel with an icon, heading and optional intro. */
export default function SectionShell({ id, title, intro, icon: Icon, children, className = '' }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-56 md:scroll-mt-44 rounded-md border border-t-4 border-slate-200 border-t-primary-600 bg-white p-5 shadow-sm shadow-primary-900/5 sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-600 text-white sm:size-11">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
            {title}
          </h2>
          {intro && <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">{intro}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function EmptyState({ children }) {
  return (
    <p className="rounded-md border border-dashed border-slate-300 bg-surface px-5 py-6 text-slate-600">{children}</p>
  )
}

export function Disclaimer({ children }) {
  return (
    <p className="mt-5 rounded-md border-l-4 border-accent-500 bg-accent-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
      <strong className="font-semibold text-ink">Important: </strong>
      {children}
    </p>
  )
}
