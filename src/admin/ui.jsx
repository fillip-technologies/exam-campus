import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, X } from 'lucide-react'

/* Small UI kit for the admin panel: same design tokens as the site, denser layout. */

export const inputCls =
  'w-full rounded-md bg-white px-3 py-2 text-sm text-ink ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-slate-50 disabled:text-slate-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
  accent: 'bg-accent-500 text-primary-900 hover:bg-accent-400 disabled:opacity-60',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-60',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-60',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-ink disabled:opacity-50',
  dangerGhost: 'text-red-700 hover:bg-red-50 disabled:opacity-50',
}

export function Button({ variant = 'secondary', size = 'md', busy = false, icon: Icon, children, className = '', ...rest }) {
  const sizes = { sm: 'h-8 px-2.5 text-xs gap-1.5', md: 'h-9 px-3.5 text-sm gap-2', icon: 'size-8 justify-center' }
  return (
    <button
      type="button"
      disabled={busy || rest.disabled}
      className={`inline-flex shrink-0 items-center rounded-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : Icon && <Icon className="size-4" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function Card({ title, actions, children, className = '', bodyClass = 'p-5' }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
          {title && <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

export function PageHeader({ title, subtitle, actions, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {children}
        <h1 className="truncate text-2xl font-semibold tracking-tight text-primary-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

const tones = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  DRAFT: 'bg-slate-100 text-slate-600 ring-slate-200',
  COMING_SOON: 'bg-sun-100 text-amber-800 ring-amber-200',
  ARCHIVED: 'bg-red-50 text-red-700 ring-red-200',
  NEW: 'bg-accent-50 text-accent-700 ring-accent-100',
  IN_PROGRESS: 'bg-primary-50 text-primary-700 ring-primary-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  on: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  off: 'bg-slate-100 text-slate-500 ring-slate-200',
}

export function Badge({ tone, children }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide ring-1 ring-inset ${tones[tone] ?? tones.DRAFT}`}>
      {children}
    </span>
  )
}

export const StatusBadge = ({ status }) => (status ? <Badge tone={status}>{status.replace('_', ' ')}</Badge> : null)

export function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
      <Loader2 className="size-5 animate-spin text-primary-600" aria-hidden="true" /> {label}
    </div>
  )
}

export function ErrorBox({ error, onRetry }) {
  if (!error) return null
  return (
    <div role="alert" className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-semibold">{error.message}</p>
        {error.issues?.length > 0 && (
          <ul className="mt-1 list-disc pl-5">
            {error.issues.map((i) => (
              <li key={`${i.path}-${i.message}`}>
                <code className="text-xs">{i.path}</code>: {i.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}

export function Empty({ children }) {
  return <p className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">{children}</p>
}

/** Accessible modal dialog (focus trap light: focuses the panel, Escape closes). */
export function Modal({ title, onClose, children, footer, size = 'md' }) {
  const ref = useRef(null)
  const uid = useId()
  useEffect(() => {
    const prev = document.activeElement
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [onClose])
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-5xl' }
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-primary-900/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={uid} className={`w-full ${widths[size]} animate-pop rounded-lg bg-white shadow-2xl outline-none`}>
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 id={uid} className="text-base font-semibold text-ink">
            {title}
          </h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </Button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</footer>}
      </div>
    </div>
  )
}

/** Confirmation dialog: confirm({ title, message, confirmLabel, danger }) resolves true / false. */
const ConfirmContext = createContext(null)
const ToastContext = createContext(null)

export function AdminUiProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const [toasts, setToasts] = useState([])

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setDialog({ ...opts, resolve })
      }),
    [],
  )
  const close = (value) => {
    dialog?.resolve(value)
    setDialog(null)
  }

  const toast = useCallback((message, tone = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'error' ? 6000 : 3000)
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      <ToastContext.Provider value={toast}>
        {children}
        {dialog && (
          <Modal
            title={dialog.title ?? 'Are you sure?'}
            size="sm"
            onClose={() => close(false)}
            footer={
              <>
                <Button onClick={() => close(false)}>Cancel</Button>
                <Button variant={dialog.danger ? 'danger' : 'primary'} onClick={() => close(true)}>
                  {dialog.confirmLabel ?? 'Confirm'}
                </Button>
              </>
            }
          >
            <p className="text-sm leading-relaxed text-slate-600">{dialog.message}</p>
          </Modal>
        )}
        <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex max-w-sm animate-pop items-start gap-2 rounded-md px-4 py-3 text-sm font-medium shadow-lg ${
                t.tone === 'error' ? 'bg-red-700 text-white' : 'bg-primary-900 text-white'
              }`}
            >
              {t.tone === 'error' ? <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />}
              {t.message}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => useContext(ConfirmContext)
export const useToast = () => useContext(ToastContext)

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={Boolean(checked)}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 ${checked ? 'bg-primary-600' : 'bg-slate-300'}`}
    >
      <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
