import { useState } from 'react'

/**
 * Round logo for an exam's conducting body. Uses `src` (the organization's logo from the admin) or
 * /images/exam-logos/<org>.png, and falls back to a text monogram (org key, else the name's initials).
 */
export default function ExamLogo({ org, name, src, className = 'size-9' }) {
  const [failed, setFailed] = useState(false)
  const label = (org || (name ?? '').split(/\s+/).map((w) => w[0]).join('').slice(0, 3) || '?').toUpperCase()
  const url = src || (org ? `/images/exam-logos/${org}.png` : null)

  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200 ${className}`}>
      {failed || !url ? (
        <span
          aria-hidden="true"
          className={`font-bold tracking-tight text-primary-700 ${label.length > 4 ? 'text-[0.5rem]' : 'text-[0.6rem]'}`}
        >
          {label}
        </span>
      ) : (
        <img
          src={url}
          alt=""
          title={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-contain p-1"
        />
      )}
    </span>
  )
}
