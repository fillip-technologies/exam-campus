import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | ExamCampus'
  }, [])

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wider text-primary-600">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">This page is not available yet.</h1>
      <p className="mt-4 text-lg text-slate-600">
        The page you are looking for is coming soon, or the link is incorrect. You can explore the pages that are available.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="/#exams"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-bold text-white hover:bg-primary-700"
        >
          Explore exams
        </a>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-bold text-primary-700 ring-1 ring-inset ring-primary-200 hover:bg-primary-50"
        >
          Go to Home
        </Link>
      </div>
    </section>
  )
}
