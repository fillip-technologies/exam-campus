import { CircleHelp } from 'lucide-react'
import Accordion from '@/components/common/Accordion'
import SectionShell from './SectionShell'

/** faqs: [{ question, answer }] */
export default function FaqSection({ examName, faqs = [] }) {
  if (!faqs.length) return null
  return (
    <SectionShell icon={CircleHelp} id="faqs" title={`${examName} FAQs`}>
      <Accordion
        defaultOpen={['faq-0']}
        items={faqs.map((f, i) => ({ id: `faq-${i}`, title: f.question, content: <p>{f.answer}</p> }))}
      />
    </SectionShell>
  )
}
