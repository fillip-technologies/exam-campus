import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { loadEnv } from 'vite'

/**
 * Build-time SEO for the SPA (crawlers and link previews do not run JavaScript):
 *  - index.html: absolute og:image when VITE_SITE_URL is set (WhatsApp and Facebook need an absolute image URL)
 *  - dist/sitemap.xml: the listing pages plus every live exam hub, its papers page and live class pages, read
 *    from the public API (GET /public/layout), and a "Sitemap:" line appended to dist/robots.txt
 * Without VITE_SITE_URL (e.g. local builds) it does nothing except print a note.
 */
export default function seo() {
  let env = {}
  let outDir = 'dist'
  const siteUrl = () => (env.VITE_SITE_URL ?? '').replace(/\/$/, '')

  return {
    name: 'examcampus-seo',
    apply: 'build',
    configResolved(config) {
      env = loadEnv(config.mode, config.root, 'VITE_')
      outDir = resolve(config.root, config.build.outDir) // outDir may already be absolute
    },
    transformIndexHtml(html) {
      const site = siteUrl()
      if (!site) return html
      // Only the image becomes absolute. No canonical / og:url here: this one file serves every route, so a fixed
      // URL would mark every page as a copy of the home page.
      return html.replace('content="/images/brand/logo-wordmark.png"', `content="${site}/images/brand/logo-wordmark.png"`)
    },
    async closeBundle() {
      const site = siteUrl()
      if (!site) {
        console.log('\n[seo] VITE_SITE_URL is not set: skipped sitemap.xml (set it to the live domain, e.g. https://examcampus.in).')
        return
      }
      const paths = new Set(['/', '/exams', '/test-series', '/free-tests', '/previous-year-papers'])
      const api = (env.VITE_API_URL ?? '').replace(/\/$/, '')
      try {
        const res = await fetch(`${api}/api/v1/public/layout`, { signal: AbortSignal.timeout(10_000) })
        const layout = await res.json()
        // every live exam / class link anywhere in the menus (null hrefs = not live)
        const walk = (node) => {
          if (Array.isArray(node)) return node.forEach(walk)
          if (!node || typeof node !== 'object') return
          for (const [k, v] of Object.entries(node)) {
            if (k === 'href' && typeof v === 'string' && /^\/(exams|academic)\/[\w-]+$/.test(v)) {
              paths.add(v)
              if (v.startsWith('/exams/')) paths.add(`${v}/previous-year-papers`)
            } else walk(v)
          }
        }
        walk(layout)
      } catch (err) {
        console.warn(`[seo] could not read exams from the API (${err.message}); sitemap.xml has the listing pages only.`)
      }

      const today = new Date().toISOString().slice(0, 10)
      const urls = [...paths].sort().map((p) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')
      writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      const robots = join(outDir, 'robots.txt')
      writeFileSync(robots, `${readFileSync(robots, 'utf8').trimEnd()}\n\nSitemap: ${site}/sitemap.xml\n`)
      console.log(`[seo] wrote sitemap.xml with ${paths.size} URLs`)
    },
  }
}
