import { useEffect } from 'react'

/** Sets the document title and meta description while the page is shown (the description is restored on leave). */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  useEffect(() => {
    if (!description) return
    let meta = document.querySelector('meta[name="description"]')
    const created = !meta
    if (created) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    const previous = meta.getAttribute('content')
    meta.setAttribute('content', description)
    return () => {
      if (created) meta.remove()
      else meta.setAttribute('content', previous ?? '')
    }
  }, [description])
}
