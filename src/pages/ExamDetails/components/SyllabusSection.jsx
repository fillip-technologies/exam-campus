import KeyFacts from '@/components/hub/KeyFacts'
import { Download, BookOpen } from 'lucide-react'
import Accordion from '@/components/common/Accordion'
import SectionShell from '@/components/hub/SectionShell'

/** syllabus: { officialUrl?, stages: [{ name, subjects: [{ name, topics }] }] }  Stage -> Subject -> Topics. */
export default function SyllabusSection({ examName, syllabus }) {
  if (!syllabus?.stages?.length) return null

  return (
    <SectionShell
      icon={BookOpen}
      id="syllabus"
      title={`${examName} Syllabus`}
      intro="Stage-wise and subject-wise topics. Open a subject to see its topics."
    >
      <KeyFacts
        className="mb-6"
        facts={[
          { label: "Stages", value: syllabus.stages.length },
          { label: "Subjects", value: syllabus.stages.reduce((n, st) => n + st.subjects.length, 0) },
          { label: "Topics", value: syllabus.stages.reduce((n, st) => n + st.subjects.reduce((m, sub) => m + sub.topics.length, 0), 0) },
        ]}
      />
      {syllabus.officialUrl && (
        <a
          href={syllabus.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-primary-700 ring-1 ring-inset ring-primary-200 transition-colors hover:bg-primary-50 hover:ring-primary-600"
        >
          <Download className="size-4" aria-hidden="true" />
          Download Official Syllabus
        </a>
      )}

      <div className="space-y-9">
        {syllabus.stages.map((stage, si) => (
          <div key={stage.name}>
            <h3 className="mb-2 text-xl font-semibold text-ink">{stage.name}</h3>
            <Accordion
              multiple
              defaultOpen={si === 0 ? [`${stage.name}-0`] : []}
              items={stage.subjects.map((subject, i) => ({
                id: `${stage.name}-${i}`,
                title: subject.name,
                meta: `${subject.topics.length} topics`,
                content: (
                  <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {subject.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                ),
              }))}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
