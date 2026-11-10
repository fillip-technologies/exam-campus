import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { slugify } from '@/lib/slugify'

const columns = [
  {
    title: 'Popular Exams',
    links: ['SBI PO', 'IBPS PO', 'SSC CGL', 'RRB NTPC', 'BPSC TRE', 'CTET', 'UPSC CSE', 'NDA'].map((n) => ({
      label: n,
      href: `/exams/${slugify(n)}`,
    })),
  },
  {
    title: 'Test Series',
    links: [
      { label: 'Banking & Insurance', href: '#test-series' },
      { label: 'SSC', href: '#test-series' },
      { label: 'Teaching', href: '#test-series' },
      { label: 'Railway', href: '#test-series' },
      { label: 'UPSC & State PSC', href: '#test-series' },
      { label: 'Defence', href: '#test-series' },
    ],
  },
  {
    title: 'Free Resources',
    links: [
      { label: 'Free Mock Tests', href: '#free-tests' },
      { label: 'Previous Year Papers', href: '#test-series' },
      { label: 'Exam Notifications', href: '#notifications' },
      { label: 'Syllabus & Exam Pattern', href: '#syllabus' },
      { label: 'Results', href: '#results' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Blog', href: '#blog' },
      { label: 'Campus Store', href: '#campus-store' },
      { label: 'Help & Support', href: '#faq' },
    ],
  },
]

const year = new Date().getFullYear()
const legal = ['Terms of Use', 'Privacy Policy', 'Refund Policy']
const social = ['YouTube', 'Instagram', 'Facebook', 'Telegram']

const linkCls =
  'text-primary-200 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-200">
      <div className="mx-auto grid w-full gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8 lg:px-12 lg:py-14">
        <div>
          <div className="inline-block rounded-md bg-white px-3 py-2">
            <Logo />
          </div>
          <p className="mt-3 max-w-xs leading-relaxed">
            Test series and online practice for government and competitive exams.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {social.map((s) => (
              <li key={s}>
                <a href={`#${s.toLowerCase()}`} className={linkCls}>
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/") ? (
                    <Link to={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className={linkCls}>
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full flex-col gap-3 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>&copy; {year} ExamCampus. All rights reserved.</p>
          <a
            href="https://filliptechnologies.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Designed and developed by Fillip Technologies (opens in a new tab)"
            className="flex items-center gap-2.5 rounded-sm text-primary-200 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span>Designed &amp; Developed by</span>
            <img
              src="/images/brand/fillip-technologies.png"
              alt=""
              width="384"
              height="74"
              loading="lazy"
              className="h-6 w-auto"
            />
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legal.map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className={linkCls}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
