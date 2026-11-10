import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/context/auth/useAuth'
import { getProductBySlug } from '@/lib/products'
import { formatRupees } from '@/lib/format'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

/**
 * Enrollment page (/enroll/:slug). It is only usable when logged in: logged-out visitors are asked to log in.
 * Payment is not connected yet, so the final step is a placeholder.
 */
export default function EnrollPage() {
  const { slug } = useParams()
  const { user, isLoggedIn, openLogin } = useAuth()
  // memoised: the lookup can build a new object, which would re-trigger the effect below on every render
  const product = useMemo(() => getProductBySlug(slug), [slug])

  useEffect(() => {
    document.title = 'Enroll | ExamCampus'
  }, [])

  // Direct visits while logged out get the login popup straight away.
  useEffect(() => {
    if (product && !isLoggedIn) openLogin({ reason: `Please log in to enroll in ${product.title}.` })
  }, [product, isLoggedIn, openLogin])

  if (!product) return <NotFoundPage />

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">Complete your enrollment</h1>

      {isLoggedIn ? (
        <>
          <p className="mt-3 text-lg text-slate-600">
            Logged in as <strong className="font-semibold text-ink">{user.name}</strong>
          </p>

          <div className="mt-8 rounded-md border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">{product.title}</h2>
            {product.validity && <p className="mt-1 text-slate-500">Valid for {product.validity}</p>}
            <div className="mt-4 flex flex-wrap items-baseline gap-x-2 border-t border-slate-100 pt-4">
              <span className="text-3xl font-bold text-ink">{formatRupees(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-slate-400 line-through">{formatRupees(product.originalPrice)}</span>
              )}
            </div>
            <button
              type="button"
              disabled
              className="mt-6 h-12 w-full cursor-not-allowed rounded-lg bg-slate-200 px-6 text-base font-bold text-slate-500 sm:w-auto"
            >
              Proceed to payment
            </button>
            <p className="mt-3 text-sm text-slate-500">Online payment is not connected yet.</p>
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
