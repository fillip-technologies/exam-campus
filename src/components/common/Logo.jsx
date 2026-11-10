import { Link } from 'react-router-dom'

/** Brand mark + wordmark + tagline. `site` comes from GET /public/layout; the bundled images are the fallback. */
export default function Logo({ site }) {
  const name = site?.siteName ?? 'ExamCampus'
  const tagline = site === undefined ? 'One Campus All Exam' : site?.tagline
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
      aria-label={`${name} home`}
    >
      <img src={site?.logoMarkUrl ?? '/images/brand/logo-mark.png'} alt="" width="260" height="172" className="h-8 w-auto sm:h-10 xl:h-9 2xl:h-10" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        {site?.logoWordmarkUrl === null ? (
          <span className="text-lg font-extrabold tracking-tight text-primary-900">{name}</span>
        ) : (
          <img src={site?.logoWordmarkUrl ?? '/images/brand/logo-wordmark.png'} alt="" width="560" height="95" className="h-5 w-auto sm:h-6 xl:h-5 2xl:h-6" />
        )}
        {tagline && (
          <span className="mt-1.5 xl:hidden 2xl:block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[0.65rem]">
            {tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
