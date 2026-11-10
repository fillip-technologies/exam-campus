import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { useFreeTest } from '@/api/public'
import { pageState } from '@/components/common/LoadState'
import { formatMinutes } from '@/lib/format'

/**
 * Free test start page (/free-test/:slug). Only usable when logged in: logged-out visitors are asked to log in.
 * The online test platform is not connected yet, so the start button is a placeholder.
 */
export default function FreeTestPage() {
  const { slug } = useParams()
  const { user, isLoggedIn, ready, openLogin } = useAuth()
  // GET /public/free-tests/:slug resolves free test slug -> exam slug -> class slug
  const query = useFreeTest(slug)
  const test = query.data

  useEffect(() => {
    document.title = 'Free Test | ExamCampus'
  }, [])

  // Direct visits while logged out get the login popup straight away.
  useEffect(() => {
    if (test && ready && !isLoggedIn) openLogin({ reason: `Please log in to start ${test.title}.` })
  }, [test, ready, isLoggedIn, openLogin])

  const state = pageState(query)
  if (state) return state

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">Start your free test</h1>

      {isLoggedIn ? (
        <>
          <p className="mt-3 text-lg text-slate-600">
            Logged in as <strong className="font-semibold text-ink">{user.name}</strong>
          </p>

          <div className="mt-8 rounded-md border border-primary-200 bg-primary-50 p-6">
            <span className="rounded-sm bg-accent-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">Free</span>
            <h2 className="mt-3 text-xl font-semibold text-ink">{test.title}</h2>
            <p className="mt-1.5 text-slate-600">
              {test.questions} Questions <span aria-hidden="true">·</span> {formatMinutes(test.durationMinutes)}
              {test.type && (
                <>
                  {' '}
                  <span aria-hidden="true">·</span> {test.type}
                </>
              )}
            </p>
            <button
              type="button"
              disabled
              className="mt-6 h-12 w-full cursor-not-allowed rounded-lg bg-slate-200 px-6 text-base font-bold text-slate-500 sm:w-auto"
            >
              Start test
            </button>
            <p className="mt-3 text-sm text-slate-500">The online test platform is not connected yet.</p>
          </div>
        </>
      ) : (
        <p className="mt-3 text-lg text-slate-600">
          Please log in to continue.{' '}
          <button type="button" onClick={() => openLogin()} className="font-semibold text-primary-700 underline underline-offset-4">
            Login
          </button>
        </p>
      )}

      <Link to="/" className="mt-8 inline-block text-sm font-semibold text-primary-700 hover:underline">
        Back to home
      </Link>
    </section>
  )
}
