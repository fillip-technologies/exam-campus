import { useState } from 'react'

/**
 * Round logo for an exam's conducting body. Loads /images/exam-logos/<org>.png and
 * falls back to a text monogram until that file exists.
 */
export default function ExamLogo({ org, name, className = 'size-9' }) {
  const [failed, setFailed] = useState(false)
  const label = org.toUpperCase()

  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200 ${className}`}>
      {failed ? (
        <span
          aria-hidden="true"
          className={`font-bold tracking-tight text-primary-700 ${label.length > 4 ? 'text-[0.5rem]' : 'text-[0.6rem]'}`}
        >
          {label}
        </span>
      ) : (
        <img
          src={`/images/exam-logos/${org}.png`}
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
