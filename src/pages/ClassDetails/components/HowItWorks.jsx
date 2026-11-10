import { ListOrdered } from 'lucide-react'
import SectionShell from '@/components/hub/SectionShell'

/** steps: [{ title, text }] */
export default function HowItWorks({ steps }) {
  if (!steps?.length) return null
  return (
    <SectionShell icon={ListOrdered} id="how-it-works" title="How the Test Series Works">
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="border-t-2 border-primary-600 pt-4">
            <span className="text-sm font-bold tabular-nums text-primary-600">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-1 text-lg font-semibold text-ink">{s.title}</h3>
            <p className="mt-1.5 leading-relaxed text-slate-600">{s.text}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
