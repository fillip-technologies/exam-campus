import KeyFacts from '@/components/hub/KeyFacts'
import { ListChecks } from 'lucide-react'
import SectionShell, { Disclaimer } from '@/components/hub/SectionShell'
import { formatMinutes } from '@/lib/format'

const sum = (rows, key) => (rows.every((r) => r[key] != null) ? rows.reduce((t, r) => t + r[key], 0) : null)

const stageFacts = (stage) => [
  { label: "Questions", value: sum(stage.sections, "questions") },
  { label: "Marks", value: sum(stage.sections, "marks") },
  { label: "Duration", value: sum(stage.sections, "durationMinutes") != null ? formatMinutes(sum(stage.sections, "durationMinutes")) : null },
  { label: "Negative marking", value: stage.negativeMarkingShort, tone: "accent" },
]

function StageTable({ stage }) {
  const { sections } = stage
  const show = {
    questions: sections.some((s) => s.questions != null),
    marks: sections.some((s) => s.marks != null),
    duration: sections.some((s) => s.durationMinutes != null),
    negative: sections.some((s) => s.negativeMarking),
  }
  const totals = {
    questions: sum(sections, 'questions'),
    marks: sum(sections, 'marks'),
    durationMinutes: sum(sections, 'durationMinutes'),
  }
  const cell = 'px-4 py-3'

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="w-full min-w-[28rem] text-left text-sm sm:text-base">
        <caption className="sr-only">{stage.name}</caption>
        <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th scope="col" className={cell}>Section</th>
            {show.questions && <th scope="col" className={`${cell} text-right`}>Questions</th>}
            {show.marks && <th scope="col" className={`${cell} text-right`}>Marks</th>}
            {show.duration && <th scope="col" className={`${cell} text-right`}>Duration</th>}
            {show.negative && <th scope="col" className={cell}>Negative marking</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sections.map((s) => (
            <tr key={s.name}>
              <th scope="row" className={`${cell} font-semibold text-ink`}>{s.name}</th>
              {show.questions && <td className={`${cell} text-right tabular-nums`}>{s.questions ?? '—'}</td>}
              {show.marks && <td className={`${cell} text-right tabular-nums`}>{s.marks ?? '—'}</td>}
              {show.duration && <td className={`${cell} text-right tabular-nums`}>{s.durationMinutes != null ? formatMinutes(s.durationMinutes) : '—'}</td>}
              {show.negative && <td className={cell}>{s.negativeMarking ?? '—'}</td>}
            </tr>
          ))}
        </tbody>
        {sections.length > 1 && (
          <tfoot className="border-t-2 border-slate-200 bg-surface font-bold text-ink">
            <tr>
              <th scope="row" className={cell}>Total</th>
              {show.questions && <td className={`${cell} text-right tabular-nums`}>{totals.questions ?? '—'}</td>}
              {show.marks && <td className={`${cell} text-right tabular-nums`}>{totals.marks ?? '—'}</td>}
              {show.duration && <td className={`${cell} text-right tabular-nums`}>{totals.durationMinutes != null ? formatMinutes(totals.durationMinutes) : '—'}</td>}
              {show.negative && <td className={cell} />}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

/** examPattern: { summary, stages: [{ name, description, negativeMarking, sections, notes }], disclaimer } */
export default function ExamPattern({ examName, pattern }) {
  if (!pattern?.stages?.length) return null
  return (
    <SectionShell icon={ListChecks} id="exam-pattern" title={`${examName} Exam Pattern`} intro={pattern.summary}>
      <div className="space-y-9">
        {pattern.stages.map((stage) => (
          <div key={stage.name}>
            <h3 className="text-xl font-semibold text-ink">{stage.name}</h3>
            {stage.description && <p className="mt-1.5 max-w-3xl leading-relaxed text-slate-600">{stage.description}</p>}
            {stage.negativeMarking && (
              <p className="mt-2 text-sm font-semibold text-accent-700">Negative marking: {stage.negativeMarking}</p>
            )}
            <KeyFacts facts={stageFacts(stage)} className="mt-4" />
            <div className="mt-4">
              <StageTable stage={stage} />
            </div>
            {stage.notes?.map((n) => (
              <p key={n} className="mt-3 text-sm leading-relaxed text-slate-500">{n}</p>
            ))}
          </div>
        ))}
      </div>
      {pattern.disclaimer && <Disclaimer>{pattern.disclaimer}</Disclaimer>}
    </SectionShell>
  )
}
