import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/auth/useAuth'
import { inputCls, Button, ErrorBox } from '../ui'

/** Staff log in with the same account system as students; the role decides access. */
export default function LoginPage() {
  const { login, user, logout } = useAuth()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(form)
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-surface p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-primary-900/5">
        <img src="/images/brand/logo-mark.png" alt="" className="h-10 w-auto" />
        <h1 className="mt-4 text-xl font-semibold text-primary-900">ExamCampus admin</h1>
        {user ? (
          <>
            <p className="mt-2 text-sm text-slate-600">
              You are logged in as <strong>{user.name}</strong>, which is a student account. Ask a super admin for staff access.
            </p>
            <div className="mt-5 flex gap-2">
              <Button onClick={logout}>Log out</Button>
              <Link to="/" className="inline-flex h-9 items-center rounded-md px-3.5 text-sm font-semibold text-primary-700 hover:underline">
                Go to the website
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-ink">Email or mobile number</span>
              <input autoFocus autoComplete="username" value={form.identifier} onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))} className={inputCls} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-ink">Password</span>
              <span className="relative block">
                <input type={show ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className={`${inputCls} pr-10`} required />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-1 top-1 grid size-7 place-items-center text-slate-500">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>
            {error && <ErrorBox error={error} />}
            <Button type="submit" variant="primary" busy={busy} className="w-full justify-center">
              Log in
            </Button>
            <p className="text-center text-xs text-slate-500">
              Forgot your password? Use “Forgot password?” in the login window on <Link to="/" className="font-semibold text-primary-700">the website</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
