/**
 * Clean-up for placeholder links in admin data.
 *
 * The CMS was seeded with anchors such as "#all-exams" or "#about" before the pages behind them existed.
 * resolveHref() sends the ones that now have a page to that page and turns the ones that still lead nowhere
 * into `null`, which every link component renders as plain text (or hides), never as a dead click.
 * Setting a real link in the admin panel always wins, because only these exact placeholder values are touched.
 */

/** Placeholder anchors that now have a page. */
const PAGE_FOR_PLACEHOLDER = {
  '#start': '/exams',
  '#all-exams': '/exams',
  '#all-test-series': '/test-series',
  '#all-free-tests': '/free-tests',
  '#all-previous-papers': '/previous-year-papers',
}

/** Placeholder anchors with no page or section anywhere yet. */
const NOWHERE = new Set([
  '#',
  '#about',
  '#contact',
  '#blog',
  '#notifications',
  '#results',
  '#campus-store',
  '#terms-of-use',
  '#privacy-policy',
  '#refund-policy',
  '#youtube',
  '#instagram',
  '#facebook',
  '#telegram',
])

/** For links inside page content: placeholder -> page, dead placeholder -> null, everything else unchanged. */
export function resolveHref(href) {
  if (!href) return null
  if (PAGE_FOR_PLACEHOLDER[href]) return PAGE_FOR_PLACEHOLDER[href]
  if (NOWHERE.has(href)) return null
  return href
}

/** Home sections that site-wide links (header, footer) point at with a bare anchor. */
const HOME_SECTIONS = new Set(['home', 'test-series', 'free-tests', 'exams', 'pass', 'faq', 'why', 'experience', 'app'])

/** Sections that have a full page of their own now: site-wide links go there instead. */
const GLOBAL_PAGES = { '#test-series': '/test-series', '#free-tests': '/free-tests', '#exams': '/exams', '#syllabus': '/exams' }

/**
 * Header dropdown items the admin has not linked yet, but whose page exists now (matched by the item's title).
 * A link set in the admin panel always wins.
 */
const DEFAULT_MENU_LINKS = {
  'Full-Length Mock Tests': '/test-series',
  'Sectional Tests': '/test-series?tab=sectional',
  'Topic-wise Tests': '/test-series?tab=topic-wise',
  'Previous Year Papers': '/previous-year-papers',
}

/** Href for a header dropdown item: the admin's link, else a page that fits its title, else null. */
const menuItemHref = (item) => (item.href ? resolveGlobalHref(item.href) : (DEFAULT_MENU_LINKS[item.title] ?? null))

/**
 * Header menus without dead ends: dropdown items get their page where one exists; the rest keep href null and
 * render as a muted "Soon" row (MenuLink), never as a link that goes nowhere. A dropdown footer link that
 * leads nowhere is dropped.
 */
export function cleanNav(nav = []) {
  return nav.map((n) => {
    if (!n.items) return n
    const items = n.items.map((i) => ({ ...i, href: menuItemHref(i) }))
    const footerHref = n.footer ? resolveGlobalHref(n.footer.href) : null
    return { ...n, items, footer: footerHref ? { ...n.footer, href: footerHref } : null }
  })
}

/**
 * For site-wide links (header, footer), which are clicked from every page: a bare "#section" only exists on
 * the home page, so it becomes a page of its own when there is one, "/#section" for other home sections,
 * and null when no such section exists.
 */
export function resolveGlobalHref(href) {
  const h = resolveHref(href)
  if (!h || !/^#[\w-]+$/.test(h)) return h
  if (GLOBAL_PAGES[h]) return GLOBAL_PAGES[h]
  return HOME_SECTIONS.has(h.slice(1)) ? `/${h}` : null
}
