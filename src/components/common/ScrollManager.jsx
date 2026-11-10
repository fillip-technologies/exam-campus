import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** On navigation: scroll to the #hash target if there is one, otherwise to the top of the page. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
