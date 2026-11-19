/** Structured data for search engines. `data` is a schema.org object (or { '@graph': [...] }). */
export default function JsonLd({ data }) {
  // "<" is escaped so text from the CMS can never close the script tag
  const json = JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
