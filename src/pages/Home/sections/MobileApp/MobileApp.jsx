import { useState } from 'react'
import { BarChart3, Check, ClipboardCheck, Smartphone, Trophy } from 'lucide-react'

const features = [
  { icon: ClipboardCheck, text: 'Take mock tests anywhere' },
  { icon: BarChart3, text: 'Track your progress after every test' },
  { icon: Smartphone, text: 'Smooth, exam-style experience on your phone' },
]

const palette = ['a', 'a', 'a', 'a', 'm', 'a', 'a', 'c', 'n', 'n', 'n', 'n']
const paletteStyle = {
  a: 'bg-primary-600 text-white',
  m: 'bg-accent-500 text-white',
  c: 'bg-sun-400 text-primary-900 ring-2 ring-primary-800',
  n: 'bg-slate-100 text-slate-400',
}

/* Decorative phone showing the test screen. Static, hidden from assistive tech. */
function Phone() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-56 shrink-0 sm:w-60">
      <div className="overflow-hidden rounded-[2rem] border-[6px] border-primary-900 bg-white shadow-2xl shadow-black/30">
        <div className="bg-primary-800 px-4 pb-3 pt-4 text-white">
          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/20" />
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] font-bold">BPSC TRE · Mock 8</span>
            <span className="rounded-sm bg-white/15 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold text-sun-300">01:42:18</span>
          </div>
        </div>

        <div className="px-4 pb-5 pt-3">
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-primary-600">Question 12 of 100</p>
          <div className="mt-2 space-y-1.5">
            <div className="h-1.5 w-full rounded-sm bg-slate-200" />
            <div className="h-1.5 w-4/5 rounded-sm bg-slate-200" />
          </div>

          <div className="mt-3 space-y-1.5">
            {['A', 'B', 'C', 'D'].map((o) => (
              <div
                key={o}
                className={`flex items-center gap-2 rounded-sm border px-2 py-1.5 text-[0.65rem] font-medium ${
                  o === 'B' ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-slate-200 text-slate-600'
                }`}
              >
                <span className={`grid size-4 place-items-center rounded-full text-[0.55rem] font-bold ${o === 'B' ? 'bg-primary-600 text-white' : 'ring-1 ring-inset ring-slate-300'}`}>
                  {o}
                </span>
                Option {o}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-6 gap-1">
            {palette.map((p, i) => (
              <span key={i} className={`grid aspect-square place-items-center rounded-sm text-[0.55rem] font-bold ${paletteStyle[p]}`}>
                {i + 1}
              </span>
            ))}
          </div>

          <div className="mt-3 rounded-sm bg-accent-500 py-2 text-center text-[0.7rem] font-bold text-primary-900">Save &amp; Next</div>
        </div>
      </div>

      {/* result chips */}
      <div className="absolute -left-6 top-24 hidden items-center gap-2 rounded-md bg-white px-3 py-2 shadow-lg shadow-black/20 sm:flex">
        <span className="grid size-7 place-items-center rounded-md bg-sun-400 text-primary-900">
          <Trophy className="size-4" />
        </span>
        <span>
          <span className="block text-[0.6rem] font-medium text-slate-500">Your score</span>
          <span className="block text-sm font-bold text-ink">72/100</span>
        </span>
      </div>
      <div className="absolute -right-6 bottom-20 hidden items-center gap-2 rounded-md bg-white px-3 py-2 shadow-lg shadow-black/20 sm:flex">
        <span className="grid size-7 place-items-center rounded-md bg-primary-600 text-white">
          <BarChart3 className="size-4" />
        </span>
        <span>
          <span className="block text-[0.6rem] font-medium text-slate-500">Accuracy</span>
          <span className="block text-sm font-bold text-ink">78%</span>
        </span>
      </div>
    </div>
  )
}

export default function MobileApp() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: send `email` to the waitlist backend / mailing list.
    setDone(true)
  }

  return (
    <section id="app" aria-labelledby="app-title" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white">
          {/* background shapes */}
          <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-sun-400/25" />
          <div aria-hidden="true" className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-accent-500/25" />
          <div
            aria-hidden="true"
            className="absolute left-8 top-8 hidden size-28 opacity-40 [background-image:radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:14px_14px] lg:block"
          />

          <div className="relative grid items-center gap-10 px-6 pt-10 sm:px-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:px-16 lg:pt-0">
            <div className="lg:py-16">
              <span className="inline-flex items-center gap-2 rounded-md bg-sun-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-900">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-900/50" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary-900" />
                </span>
                Launching soon
              </span>

              <h2 id="app-title" className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                The ExamCampus app is{' '}
                <span className="text-sun-300">on its way.</span>
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-100">
                Practise mock tests and test series on your phone, wherever you are. Get notified the moment the app is live.
              </p>

              <ul className="mt-6 space-y-3">
                {features.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-primary-50">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/15">
                      <Icon className="size-4 text-sun-300" aria-hidden="true" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              {done ? (
                <p role="status" className="mt-8 flex items-center gap-2 font-semibold text-sun-300">
                  <Check className="size-5" aria-hidden="true" />
                  Thanks! We&rsquo;ll let you know when the app launches.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="mt-8 max-w-lg">
                  <label htmlFor="app-email" className="mb-2 block text-sm font-semibold text-primary-100">
                    Get notified at launch
                  </label>
                  <div className="flex flex-col gap-2 rounded-xl bg-white p-1.5 sm:flex-row">
                    <input
                      id="app-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      className="h-12 min-w-0 flex-1 rounded-lg bg-transparent px-4 text-base text-ink placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-12 shrink-0 rounded-lg bg-accent-500 px-6 text-base font-bold text-primary-900 transition-colors hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
                    >
                      Notify Me
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Phone peeks up from the bottom edge of the banner */}
            <div className="flex justify-center lg:self-end lg:pt-12">
              <div className="-mb-28 sm:-mb-32 lg:-mb-16">
                <Phone />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
