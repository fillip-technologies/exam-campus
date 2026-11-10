import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function ClassHero({ cls }) {
  const { name, grade, stage, category, description, boards } = cls

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: category, to: '/#test-series' },
    { label: name },
  ]

  return (
    <section id="overview" aria-labelledby="class-title" className="scroll-mt-56 md:scroll-mt-44 border-b border-slate-200 bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 text-slate-300" aria-hidden="true" />}
                {c.to ? (
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

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-md bg-primary-800 text-white sm:size-20">
            <span className="text-center leading-none">
              <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-primary-200">Class</span>
              <span className="mt-1 block text-3xl font-extrabold sm:text-4xl">{grade}</span>
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary-600">Academic · {stage}</p>
            <h1 id="class-title" className="mt-1 text-4xl font-semibold tracking-tight text-primary-900 sm:text-5xl">
              {name}
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{description}</p>

            {boards?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Boards covered">
                {boards.map((b) => (
                  <li key={b} className="rounded-sm bg-white px-2.5 py-1 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-200">
                    {b}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#test-series"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                View Test Series
              </a>
              <a
                href="#free-test"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-white hover:ring-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Take a Free Test
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
