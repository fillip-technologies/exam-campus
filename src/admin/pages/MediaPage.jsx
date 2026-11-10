import MediaLibrary from '../components/MediaLibrary'
import { Card, PageHeader } from '../ui'

export default function MediaPage() {
  return (
    <div>
      <PageHeader title="Media library" subtitle="Images and PDFs, stored in Cloudinary and served from its CDN. Copy a URL, or pick files straight from any image field." />
      <Card>
        <MediaLibrary />
      </Card>
    </div>
  )
}
