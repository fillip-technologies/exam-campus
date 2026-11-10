import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On navigation: scroll to the #hash target if there is one, otherwise to the top of the page.
 * Page content arrives from the API, so a hash target may appear a moment after navigation: wait for it (up to 4 s).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    const find = () => document.getElementById(id)
    const el = find()
    if (el) {
      el.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
    const observer = new MutationObserver(() => {
      const target = find()
      if (!target) return
      observer.disconnect()
      clearTimeout(timer)
      requestAnimationFrame(() => target.scrollIntoView())
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const timer = setTimeout(() => observer.disconnect(), 4000)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [pathname, hash])

  return null
}
