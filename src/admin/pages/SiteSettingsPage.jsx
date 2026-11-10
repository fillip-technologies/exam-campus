import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { api } from '@/api/client'
import { useAuth } from '@/context/auth/useAuth'
import { hasRole } from '@/services/authService'
import { useAdminMutation } from '../api'
import { FieldInput } from '../components/fields'
import { toFormValues, toPayload } from '../formValues'
import { Button, Card, ErrorBox, PageHeader, Spinner, useToast } from '../ui'

/** The single SiteSetting row (backend: GET/PATCH /admin/site-settings, ADMIN to change). */
const fields = [
  { key: 'siteName', label: 'Site name', kind: 'text', required: true, half: true, group: 'Brand' },
  { key: 'tagline', label: 'Tagline', kind: 'text', half: true, group: 'Brand', help: '"One Campus All Exam" under the logo.' },
  { key: 'logoMarkUrl', label: 'Logo mark', kind: 'image', group: 'Brand' },
  { key: 'logoWordmarkUrl', label: 'Logo wordmark', kind: 'image', group: 'Brand', help: 'Empty = the site name as text.' },
  { key: 'faviconUrl', label: 'Favicon', kind: 'image', group: 'Brand' },
  { key: 'headerLoginLabel', label: 'Login button label', kind: 'text', required: true, half: true, group: 'Header' },
  { key: 'headerCtaLabel', label: 'Main button label', kind: 'text', required: true, half: true, group: 'Header' },
  { key: 'headerCta', label: 'Main button links to', kind: 'link', prefix: 'headerCta', group: 'Header' },
  { key: 'searchPlaceholder', label: 'Search placeholder', kind: 'text', group: 'Header' },
  { key: 'footerTagline', label: 'Footer tagline', kind: 'textarea', group: 'Footer' },
  { key: 'copyrightText', label: 'Copyright text', kind: 'text', group: 'Footer', help: 'Shown after "© <year>".' },
  { key: 'developerName', label: '"Designed & Developed by" name', kind: 'text', half: true, group: 'Footer' },
  { key: 'developerUrl', label: 'Developer URL', kind: 'url', half: true, group: 'Footer' },
  { key: 'developerLogoUrl', label: 'Developer logo', kind: 'image', group: 'Footer' },
  { key: 'contactEmail', label: 'Contact email', kind: 'text', half: true, group: 'Contact' },
  { key: 'contactPhone', label: 'Contact phone', kind: 'text', half: true, group: 'Contact' },
  { key: 'address', label: 'Address', kind: 'textarea', group: 'Contact' },
  { key: 'seoTitleTemplate', label: 'Title template', kind: 'text', group: 'SEO & analytics', help: 'e.g. "%s | ExamCampus"' },
  { key: 'defaultMetaDescription', label: 'Default meta description', kind: 'textarea', group: 'SEO & analytics' },
  { key: 'defaultOgImageUrl', label: 'Default share image', kind: 'image', group: 'SEO & analytics' },
  { key: 'analyticsId', label: 'Analytics id', kind: 'text', group: 'SEO & analytics' },
  { key: 'maintenanceMode', label: 'Maintenance mode', kind: 'bool', group: 'System' },
]

const groups = [...new Set(fields.map((f) => f.group))]

export default function SiteSettingsPage() {
  const q = useQuery({ queryKey: ['admin', 'site-settings'], queryFn: () => api('/admin/site-settings') })
  if (q.isError) return <ErrorBox error={q.error} onRetry={() => q.refetch()} />
  if (q.isPending) return <Spinner />
  return <SettingsForm key={q.data.updatedAt} settings={q.data} />
}

function SettingsForm({ settings }) {
  const { user } = useAuth()
  const toast = useToast()
  const canWrite = hasRole(user, 'ADMIN')
  const [values, setValues] = useState(() => toFormValues(fields, settings))
  const [errors, setErrors] = useState({})
  const save = useAdminMutation((body) => api('/admin/site-settings', { method: 'PATCH', body }), {
    resource: 'site-settings',
    onSuccess: () => {
      setErrors({})
      toast('Settings saved')
    },
    onError: (err) => setErrors(err.fieldErrors ?? {}),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save.mutate(toPayload(fields, values))
      }}
      className="space-y-4"
    >
      <PageHeader title="Brand & settings" subtitle={canWrite ? 'Logo, header buttons, footer text, contact details and SEO defaults.' : 'Only an admin can change these settings.'} />
      <fieldset disabled={!canWrite} className="space-y-4">
        {groups.map((g) => (
          <Card key={g} title={g}>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields
                .filter((f) => f.group === g)
                .map((f) => (
                  <FieldInput key={f.key} field={f} values={values} setValues={setValues} errors={errors} />
                ))}
            </div>
          </Card>
        ))}
      </fieldset>
      {save.error && <ErrorBox error={save.error} />}
      {canWrite && (
        <div className="sticky bottom-0 z-10 flex gap-2 rounded-lg border border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <Button type="submit" variant="primary" icon={Save} busy={save.isPending}>
            Save settings
          </Button>
        </div>
      )}
    </form>
  )
}
