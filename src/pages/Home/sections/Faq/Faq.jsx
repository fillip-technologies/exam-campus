import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

// PLACEHOLDER answers: review each one against ExamCampus's real policies before launch.
const faqs = [
  {
    q: 'What is a test series?',
    a: 'A test series is a set of mock tests designed around a specific exam. It helps you practise the paper pattern, manage your time and see how you are performing before the real exam.',
  },
  {
    q: 'What is included in an ExamCampus test series?',
    a: 'Each test series includes full-length mock tests, sectional tests, topic-wise tests and previous year papers, along with a detailed analysis after every test.',
  },
  {
    q: 'How do I take a test?',
    a: 'After enrolling, log in to your account and open the test from My Tests. The test runs online in a timed exam-style interface that works on your phone, tablet or computer.',
  },
  {
    q: 'Can I try a test before buying a test series?',
    a: 'Yes. You can take free mock tests for popular exams to experience the platform before you purchase a test series.',
  },
  {
    q: 'In which languages are the tests available?',
    a: 'Tests are available in Hindi and English. The language options for each test series are shown on its details page.',
  },
  {
    q: 'Will I get solutions and performance analysis?',
    a: 'Yes. After submitting a test you can see your score, accuracy, time taken, subject-wise performance and detailed solutions for every question.',
  },
  {
    q: 'How long is a test series valid?',
    a: 'The validity depends on the test series or plan you choose and is shown on its details page before you buy.',
  },
  {
    q: 'How can I contact support?',
    a: 'You can reach our support team through the Contact Us page. We will help you with enrolment, access to your tests and any other questions.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:px-12 lg:py-16">
        <div>
          <h2 id="faq-title" className="text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:leading-[1.1]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-500">
            Can&rsquo;t find what you are looking for? Visit our{' '}
            <a href="#contact" className="font-semibold text-primary-700 underline-offset-4 hover:underline">
              Contact Us
            </a>{' '}
            page.
          </p>
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-ink transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {f.q}
                    {isOpen ? (
                      <Minus className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                    ) : (
                      <Plus className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                    )}
                  </button>
                </h3>
                {isOpen && (
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="animate-fade-in pb-5 pr-9 leading-relaxed text-slate-600">
                    {f.a}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
