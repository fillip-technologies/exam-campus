import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLayout } from '@/api/public'

const GA4_ID = /^G-[A-Z0-9]+$/
let loadedId = null

function loadGa4(id) {
  if (loadedId) return
  loadedId = id
  window.dataLayer = window.dataLayer || []
  // gtag must push the `arguments` object itself; an array (rest params) is silently ignored by Google's script
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}

/**
 * Google Analytics 4 from Site settings → "Analytics id" (G-XXXXXXX). Production builds only, never on /admin.
 * The site is a single-page app, so a page_view is sent on every route change. Render it after the page content
 * so the page has set its title first.
 */
export default function Analytics() {
  const { data } = useLayout()
  const id = data?.site.analyticsId
  const { pathname } = useLocation()

  useEffect(() => {
    if (!import.meta.env.PROD || !id || !GA4_ID.test(id) || pathname.startsWith('/admin')) return
    loadGa4(id)
    window.gtag('event', 'page_view', { page_path: pathname, page_location: window.location.href, page_title: document.title })
  }, [id, pathname])

  return null
}
