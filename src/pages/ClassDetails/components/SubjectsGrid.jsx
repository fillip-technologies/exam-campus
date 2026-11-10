import KeyFacts from '@/components/hub/KeyFacts'
import { Check, Library } from 'lucide-react'
import SectionShell from '@/components/hub/SectionShell'

/** subjects: [{ name, summary, testTypes: [] }] */
export default function SubjectsGrid({ className, subjects }) {
  if (!subjects?.length) return null
  return (
    <SectionShell
      icon={Library}
      id="subjects"
      title={`${className} Subjects`}
      intro="The Test Series covers every core subject, with tests you can take right after a chapter."
    >
      <KeyFacts
        className="mb-6"
        facts={[
          { label: "Subjects", value: subjects.length },
          { label: "Test types", value: [...new Set(subjects.flatMap((s) => s.testTypes))].length },
        ]}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <li key={s.name} className="rounded-md border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-ink">{s.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.summary}</p>
            <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-700">
              {s.testTypes.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-primary-600" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
