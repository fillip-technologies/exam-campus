/** YouTube helpers: accept any link an admin might paste and play it on our own page (embedded). */

const ID = /^[\w-]{11}$/

/**
 * Video id from a YouTube link or a bare id. Handles watch?v=, youtu.be/, /embed/, /shorts/ and /live/ links.
 * Returns null for anything else.
 */
export function youtubeId(input) {
  if (!input) return null
  const s = String(input).trim()
  if (ID.test(s)) return s
  let url
  try {
    url = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '')
  let id = null
  if (host === 'youtu.be') id = url.pathname.split('/')[1]
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)?.[1] ?? null
  }
  return id && ID.test(id) ? id : null
}

/** 480x360 still; object-cover in a 16:9 box crops its letterbox bars. */
export const youtubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** Privacy-enhanced embed that starts playing (the click that opened it counts as the user gesture). */
export const youtubeEmbedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`
