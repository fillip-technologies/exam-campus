import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import { usePage } from '@/api/public'
import { pageState } from '@/components/common/LoadState'
import SmartLink from '@/components/common/SmartLink'

/** Markdown elements styled like the rest of the site. Raw HTML in the body is never rendered (react-markdown default). */
const components = {
  h1: (p) => <h2 className="mt-10 text-2xl font-semibold tracking-tight text-primary-900" {...p} />,
  h2: (p) => <h2 className="mt-10 text-2xl font-semibold tracking-tight text-primary-900" {...p} />,
  h3: (p) => <h3 className="mt-8 text-xl font-semibold text-ink" {...p} />,
  p: (p) => <p className="mt-4 leading-relaxed text-slate-700" {...p} />,
  ul: (p) => <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700" {...p} />,
  ol: (p) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700" {...p} />,
  a: ({ href, children }) => (
    <SmartLink href={href} className="font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900">
      {children}
    </SmartLink>
  ),
  blockquote: (p) => <blockquote className="mt-4 border-l-4 border-primary-200 pl-4 text-slate-600" {...p} />,
  table: (p) => <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm" {...p} /></div>,
  th: (p) => <th className="border-b border-slate-200 px-3 py-2 font-semibold" {...p} />,
  td: (p) => <td className="border-b border-slate-100 px-3 py-2" {...p} />,
}

/** CMS page (/pages/:slug): About, Terms, Privacy, Refund, Contact ... written in markdown in the admin panel. */
export default function CmsPage() {
  const { slug } = useParams()
  const query = usePage(slug)
  const page = query.data

  useEffect(() => {
    if (page) document.title = `${page.seo?.title ?? page.title} | ExamCampus`
  }, [page])

  const state = pageState(query)
  if (state) return state

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl">{page.title}</h1>
      <Markdown components={components}>{page.body ?? ''}</Markdown>
    </article>
  )
}
