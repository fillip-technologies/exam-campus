import KeyFacts from '@/components/hub/KeyFacts'
import { BookOpen } from 'lucide-react'
import Accordion from '@/components/common/Accordion'
import SectionShell, { Disclaimer } from '@/components/hub/SectionShell'

/** subjects: [{ name, topics: [] }]  Subject -> Topics. */
export default function ClassSyllabus({ className, subjects }) {
  if (!subjects?.length) return null
  return (
    <SectionShell
      icon={BookOpen}
      id="syllabus"
      title={`${className} Syllabus`}
      intro="Subject-wise topics covered in the tests. Open a subject to see its topics."
    >
      <KeyFacts
        className="mb-6"
        facts={[
          { label: "Subjects", value: subjects.length },
          { label: "Topics", value: subjects.reduce((n, s) => n + s.topics.length, 0) },
        ]}
      />
      <Accordion
        multiple
        defaultOpen={[subjects[0].name]}
        items={subjects.map((s) => ({
          id: s.name,
          title: s.name,
          meta: `${s.topics.length} topics`,
          content: (
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {s.topics.map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-400" />
                  {t}
                </li>
              ))}
            </ul>
          ),
        }))}
      />
      <Disclaimer>
        Topics follow the common NCERT-based curriculum. Chapter names and their order differ by board and school, so please check your school syllabus.
      </Disclaimer>
    </SectionShell>
  )
}
