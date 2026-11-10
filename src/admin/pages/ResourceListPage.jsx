import { useParams } from 'react-router-dom'
import ResourceTable from '../components/ResourceTable'
import { getResource } from '../resources'
import { PageHeader } from '../ui'
import NotFound from './NotFound'

export default function ResourceListPage() {
  const { resource } = useParams()
  const r = getResource(resource)
  if (!r) return <NotFound />
  return (
    <div className="space-y-6">
      <PageHeader title={r.label} subtitle={r.help} />
      <ResourceTable key={resource} resourceKey={resource} />
      {(r.extraLists ?? []).map((l) => (
        <div key={l.label} className="rounded-lg border border-slate-200 bg-white p-4">
          <ResourceTable resourceKey={l.resource} fixed={l.filter} preset={l.preset} compact title={l.label} />
        </div>
      ))}
    </div>
  )
}
