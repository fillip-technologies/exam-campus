import KeyFacts from '@/components/hub/KeyFacts'
import { UserCheck } from 'lucide-react'
import SectionShell, { Disclaimer } from '@/components/hub/SectionShell'

/** Renders content blocks: { type: 'paragraph' | 'list' | 'note', text | items } */
export function ContentBlocks({ blocks }) {
  return (
    <div className="space-y-3 leading-relaxed text-slate-600">
      {blocks.map((b, i) => {
        if (b.type === 'list') {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-primary-400">
              {b.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }
        if (b.type === 'note') {
          return (
            <p key={i} className="rounded-sm bg-surface px-4 py-3 text-sm text-slate-600">
              <strong className="font-semibold text-ink">Note: </strong>
              {b.text}
            </p>
          )
        }
        return <p key={i}>{b.text}</p>
      })}
    </div>
  )
}

/** eligibility: { sections: [{ title, blocks }], disclaimer? } */
export default function EligibilitySection({ examName, eligibility }) {
  if (!eligibility?.sections?.length) return null
  return (
    <SectionShell icon={UserCheck} id="eligibility" title={`${examName} Eligibility Criteria`}>
      <KeyFacts facts={eligibility.highlights} className="mb-8" />
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {eligibility.sections.map((s) => (
          <div key={s.title}>
            <h3 className="mb-2 border-l-4 border-primary-600 pl-3 text-lg font-semibold text-ink">{s.title}</h3>
            <ContentBlocks blocks={s.blocks} />
          </div>
        ))}
      </div>
      {eligibility.disclaimer && <Disclaimer>{eligibility.disclaimer}</Disclaimer>}
    </SectionShell>
  )
}
