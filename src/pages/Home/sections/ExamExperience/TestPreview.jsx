import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

/* Sample mock-test screen. Looks like the real exam window; only the
   timer, answer selection and Previous/Next work. The content comes from the
   EXAM_EXPERIENCE section's `config.preview` (admin panel); these are the fallbacks. */

const defaultQuestions = [
  { n: 11, text: 'Find the next number in the series: 3, 6, 12, 24, ?', options: ['36', '42', '48', '60'] },
  { n: 12, text: 'A train 150 m long passes a pole in 15 seconds. What is the speed of the train in km/h?', options: ['36', '40', '45', '54'] },
  { n: 13, text: 'The simple interest on ₹8,000 for 3 years is ₹2,400. What is the rate of interest per annum?', options: ['8%', '10%', '12%', '15%'] },
]

const defaultSections = ['English Language', 'Quantitative Aptitude', 'Reasoning Ability']
const letters = ['A', 'B', 'C', 'D', 'E', 'F']
const paletteSize = 30

// Fixed sample progress for the palette (other numbers are "not visited")
const baseStatus = {
  1: 'answered', 2: 'answered', 3: 'answered', 4: 'answered', 5: 'answered', 6: 'answered', 7: 'answered',
  8: 'answered', 9: 'marked', 10: 'answered', 11: 'unanswered', 15: 'marked',
}

const statusStyle = {
  answered: 'bg-primary-600 text-white',
  unanswered: 'bg-primary-100 text-primary-800',
  marked: 'bg-accent-500 text-primary-900',
  notVisited: 'bg-white text-slate-500 ring-1 ring-inset ring-slate-300',
}

const legend = [
  { key: 'answered', label: 'Answered' },
  { key: 'unanswered', label: 'Not answered' },
  { key: 'marked', label: 'Marked' },
  { key: 'notVisited', label: 'Not visited' },
]

const pad = (n) => String(n).padStart(2, '0')

function useCountdown(startSeconds) {
  const [left, setLeft] = useState(startSeconds)
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  return `${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`
}

export default function TestPreview({ preview = {} }) {
  const questions = preview.questions?.length ? preview.questions : defaultQuestions
  const sections = preview.sections?.length ? preview.sections : defaultSections
  const total = preview.totalQuestions ?? 100
  const title = preview.title ?? 'SBI PO Prelims · Full Mock 12'
  const meta = preview.meta ?? `${total} questions · 60 minutes`
  const marking = preview.marking ?? { correct: '+1', wrong: '−0.25' }
  const [index, setIndex] = useState(Math.min(1, questions.length - 1))
  const [answers, setAnswers] = useState({})
  const time = useCountdown(42 * 60 + 18)
  const q = questions[index]

  const statusOf = (n) => (answers[n] ? 'answered' : (n === q.n ? 'unanswered' : baseStatus[n] ?? 'notVisited'))

  return (
    <div
      role="group"
      aria-label="Sample online mock test screen"
      className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl shadow-primary-900/10"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 bg-primary-800 px-4 py-3 text-white sm:px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-base">{title}</p>
          <p className="text-xs text-primary-200">{meta}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-sm bg-white/10 px-3 py-1.5" role="timer" aria-label="Time left">
          <Clock className="size-4 text-accent-400" aria-hidden="true" />
          <span className="font-mono text-base font-bold tabular-nums sm:text-lg">{time}</span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-surface px-2 no-scrollbar sm:px-3" aria-hidden="true">
        {sections.map((s, i) => (
          <span
            key={s}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold sm:text-[0.8rem] ${
              i === Math.min(1, sections.length - 1) ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500'
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-[1fr_13.5rem]">
        {/* Question */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between text-sm">
            <p className="font-bold text-ink">
              Question {q.n} <span className="font-medium text-slate-500">of {total}</span>
            </p>
            <p className="text-xs font-semibold text-slate-500">
              <span className="text-primary-700">{marking.correct}</span> / <span className="text-accent-700">{marking.wrong}</span>
            </p>
          </div>

          <p className="mt-4 text-base font-medium leading-relaxed text-ink">{q.text}</p>

          <div role="radiogroup" aria-label={`Options for question ${q.n}`} className="mt-5 space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = answers[q.n] === letters[i]
              return (
                <button
                  key={letters[i]}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((a) => ({ ...a, [q.n]: letters[i] }))}
                  className={`flex w-full items-center gap-3 rounded-sm border px-3.5 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600 ${
                    selected
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-slate-200 text-slate-700 hover:border-primary-200 hover:bg-primary-50/50'
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      selected ? 'bg-primary-600 text-white' : 'ring-1 ring-inset ring-slate-300 text-slate-500'
                    }`}
                  >
                    {letters[i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Palette */}
        <div className="border-t border-slate-200 bg-surface p-4 sm:border-l sm:border-t-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Question palette</p>
          <ol className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-5" aria-hidden="true">
            {Array.from({ length: paletteSize }, (_, i) => i + 1).map((n) => (
              <li
                key={n}
                className={`grid aspect-square place-items-center rounded-sm text-xs font-semibold ${statusStyle[statusOf(n)]} ${
                  n === q.n ? 'ring-2 ring-primary-800 ring-offset-1' : ''
                }`}
              >
                {n}
              </li>
            ))}
          </ol>
          <ul className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[0.7rem] text-slate-600">
            {legend.map((l) => (
              <li key={l.key} className="flex items-center gap-1.5">
                <span className={`size-3 shrink-0 rounded-sm ${statusStyle[l.key]}`} aria-hidden="true" />
                {l.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-sm px-4 py-2 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600"
        >
          Previous
        </button>
        <span className="hidden text-xs font-semibold text-accent-700 sm:inline">Mark for review</span>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          disabled={index === questions.length - 1}
          className="rounded-sm bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600"
        >
          Save &amp; Next
        </button>
      </div>
    </div>
  )
}
