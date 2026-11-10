import Markdown from 'react-markdown'
import SmartLink from '@/components/common/SmartLink'

/** Free-form block the admin can add anywhere on the home page: heading + markdown body (no raw HTML). */
export default function RichText({ section }) {
  const { anchorId, eyebrow, title, subtitle, body } = section
  return (
    <section id={anchorId ?? undefined} aria-label={title ?? undefined} className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-primary-600">{eyebrow}</p>}
        {title && <h2 className="mt-2 text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">{title}</h2>}
        {subtitle && <p className="mt-4 text-lg leading-relaxed text-slate-500">{subtitle}</p>}
        {body && (
          <div className="mt-6 space-y-4 leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:text-primary-700 [&_a]:underline [&_li]:ml-6 [&_ol]:list-decimal [&_ul]:list-disc">
            <Markdown components={{ a: ({ href, children }) => <SmartLink href={href}>{children}</SmartLink> }}>{body}</Markdown>
          </div>
        )}
      </div>
    </section>
  )
}
