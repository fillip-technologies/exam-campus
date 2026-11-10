import { useEffect, useId, useRef, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { useAuth } from '@/context/auth/useAuth'
import { PASSWORD_MIN, isEmail, isMobile, requestOtp } from '@/services/authService'

const inputCls =
  'mt-1.5 h-12 w-full rounded-lg bg-white px-4 text-base text-ink ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

function LoginDialog() {
  const { modal, closeLogin, login, signup, loginWithOtp, resetPassword } = useAuth()
  const uid = useId()
  const dialogRef = useRef(null)
  const [tab, setTab] = useState(modal.tab)
  const [form, setForm] = useState({ name: '', identifier: '', password: '', code: '' })
  // login | otp (one-time code instead of a password) | reset (forgot password); `codeSent` = step 2 of otp/reset
  const [mode, setMode] = useState('login')
  const [codeSent, setCodeSent] = useState(false)
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const isSignup = tab === 'signup'
  const codeMode = !isSignup && mode !== 'login'

  // Focus the dialog, lock page scroll, and give focus back to the trigger on close.
  useEffect(() => {
    const previous = document.activeElement
    const scrollY = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('input')?.focus()
    return () => {
      document.body.style.overflow = scrollY
      previous?.focus?.()
    }
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLogin()
      return
    }
    if (e.key !== 'Tab') return
    const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const switchTab = (next) => {
    setTab(next)
    setMode('login')
    setCodeSent(false)
    setNotice('')
    setErrors({})
    setFormError('')
  }

  const switchMode = (next) => {
    setMode(next)
    setCodeSent(false)
    setNotice('')
    setErrors({})
    setFormError('')
  }

  const validate = () => {
    const next = {}
    if (isSignup && !form.name.trim()) next.name = 'Please enter your name.'
    if (!isEmail(form.identifier) && !isMobile(form.identifier)) next.identifier = 'Enter a valid email address or 10-digit mobile number.'
    if (codeMode && codeSent && !/^\d{4,8}$/.test(form.code.trim())) next.code = 'Enter the code we sent you.'
    const needsPassword = !codeMode || (mode === 'reset' && codeSent)
    if (needsPassword) {
      if (!form.password) next.password = mode === 'reset' ? 'Choose a new password.' : 'Please enter your password.'
      else if ((isSignup || mode === 'reset') && form.password.length < PASSWORD_MIN) next.password = `Use at least ${PASSWORD_MIN} characters.`
    }
    return next
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length) return
    setBusy(true)
    try {
      if (isSignup) await signup(form)
      else if (mode === 'login') await login(form)
      else if (!codeSent) {
        await requestOtp({ identifier: form.identifier, purpose: mode === 'reset' ? 'RESET_PASSWORD' : 'LOGIN' })
        setCodeSent(true)
        setNotice('If an account exists for this email or mobile number, we have sent it a code. It is valid for 10 minutes.')
        setBusy(false)
      } else if (mode === 'otp') await loginWithOtp({ identifier: form.identifier, code: form.code })
      else await resetPassword({ identifier: form.identifier, code: form.code, newPassword: form.password })
    } catch (err) {
      const fields = err.fieldErrors ?? {}
      if (fields.newPassword) fields.password = fields.newPassword
      setErrors(fields)
      setFormError(err.message || 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  const describe = (key) => (errors[key] ? `${uid}-${key}-error` : undefined)

  return (
    <div
      className="fixed inset-0 z-[80] grid animate-fade-in place-items-center overflow-y-auto bg-primary-900/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && closeLogin()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-md animate-pop rounded-xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={closeLogin}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary-600"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <h2 id={`${uid}-title`} className="pr-8 text-2xl font-semibold tracking-tight text-primary-900">
          {isSignup ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Login to continue'}
        </h2>
        <p className="mt-1.5 text-slate-600">
          {modal.reason ?? (isSignup ? 'Sign up to enroll in test series and track your progress.' : 'Welcome back to ExamCampus.')}
        </p>

        <div role="tablist" aria-label="Login or sign up" className="mt-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          {[
            ['login', 'Login'],
            ['signup', 'Sign up'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => switchTab(id)}
              className={`rounded-md py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary-600 ${
                tab === id ? 'bg-white text-primary-800 shadow-sm' : 'text-slate-600 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
          {isSignup && (
            <Field id={`${uid}-name`} label="Full name" error={errors.name}>
              <input
                id={`${uid}-name`}
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describe('name')}
                className={inputCls}
              />
            </Field>
          )}

          <Field id={`${uid}-identifier`} label="Email or mobile number" error={errors.identifier}>
            <input
              id={`${uid}-identifier`}
              type="text"
              inputMode="email"
              autoComplete="username"
              value={form.identifier}
              onChange={set('identifier')}
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={describe('identifier')}
              className={inputCls}
            />
          </Field>

          {codeMode && codeSent && (
            <Field id={`${uid}-code`} label="One-time code" error={errors.code}>
              <input
                id={`${uid}-code`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={form.code}
                onChange={set('code')}
                aria-invalid={Boolean(errors.code)}
                aria-describedby={describe('code')}
                className={inputCls}
              />
            </Field>
          )}

          {(!codeMode || (mode === 'reset' && codeSent)) && (
          <Field id={`${uid}-password`} label={mode === 'reset' ? 'New password' : 'Password'} error={errors.password}>
            <div className="relative">
              <input
                id={`${uid}-password`}
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignup || mode === 'reset' ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={set('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={describe('password')}
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-2.5 grid size-9 place-items-center rounded-md text-slate-500 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-600"
              >
                {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
              </button>
            </div>
          </Field>
          )}

          {notice && !formError && (
            <p role="status" className="rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-800">
              {notice}
            </p>
          )}

          {formError && (
            <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-lg bg-accent-500 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {busy
              ? 'Please wait…'
              : isSignup
                ? 'Create account'
                : mode === 'login'
                  ? 'Login'
                  : !codeSent
                    ? 'Send code'
                    : mode === 'reset'
                      ? 'Save password and login'
                      : 'Verify and login'}
          </button>
        </form>

        {!isSignup && (
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm">
            {mode === 'login' ? (
              <>
                <button type="button" onClick={() => switchMode('otp')} className="font-semibold text-primary-700 hover:underline">
                  Login with a one-time code
                </button>
                <button type="button" onClick={() => switchMode('reset')} className="font-semibold text-primary-700 hover:underline">
                  Forgot password?
                </button>
              </>
            ) : (
              <button type="button" onClick={() => switchMode('login')} className="font-semibold text-primary-700 hover:underline">
                Back to password login
              </button>
            )}
          </div>
        )}

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
          By continuing you agree to our{' '}
          <a href="/pages/terms-of-use" className="font-semibold text-primary-700 hover:underline">
            Terms of Use
          </a>{' '}
          and{' '}
          <a href="/pages/privacy-policy" className="font-semibold text-primary-700 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

/** Mounted once in the layout. The dialog remounts on every open, so its fields start fresh. */
export default function LoginModal() {
  const { modal } = useAuth()
  return modal.open ? <LoginDialog /> : null
}
