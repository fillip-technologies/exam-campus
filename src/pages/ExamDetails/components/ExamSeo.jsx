import JsonLd from '@/components/common/JsonLd'
import { usePageMeta } from '@/lib/usePageMeta'

/**
 * Search metadata for an exam hub: title, meta description and JSON-LD for the breadcrumb trail and the FAQs.
 * Google reads structured data that is rendered by JavaScript.
 */
export default function ExamSeo({ exam, slug }) {
  usePageMeta({
    title: exam.seo?.title && exam.seo.title !== exam.name ? exam.seo.title : `${exam.name} Exam Hub: Courses, Test Series, Syllabus, Pattern | ExamCampus`,
    description: exam.seo?.description || exam.description,
  })

  const origin = window.location.origin
  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: exam.name, item: `${origin}/exams/${slug}` },
      ],
    },
    exam.faqs?.length > 0 && {
      '@type': 'FAQPage',
      mainEntity: exam.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    },
  ].filter(Boolean)

  return <JsonLd data={{ '@graph': graph }} />
}
