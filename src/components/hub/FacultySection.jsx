import { useState } from 'react'
import { Play, Users } from 'lucide-react'
import VideoModal from '@/components/common/VideoModal'
import { youtubeId } from '@/lib/youtube'
import SectionShell from './SectionShell'

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

/**
 * Teacher cards with an optional "Play Demo" that opens the teacher's YouTube demo in the on-site popup.
 * faculty: [{ id, name, subject, experience?, photo?, demoVideoUrl? }]
 */
export default function FacultySection({ examName, faculty }) {
  const [video, setVideo] = useState(null)
  if (!faculty?.length) return null

  return (
    <SectionShell icon={Users} id="faculty" title={`Learn from ${examName} Experts`} intro="Meet the teachers behind our courses. Watch a short demo from each of them.">
      <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {faculty.map((f) => {
          const demoId = youtubeId(f.demoVideoUrl)
          return (
            <li key={f.id ?? f.name} className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 text-center">
              {f.photo ? (
                <img src={f.photo} alt="" loading="lazy" className="size-20 rounded-full object-cover ring-4 ring-primary-50" />
              ) : (
                <span className="grid size-20 place-items-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 ring-4 ring-primary-50" aria-hidden="true">
                  {initials(f.name)}
                </span>
              )}
              <p className="mt-3 font-bold text-ink">{f.name}</p>
              {f.subject && <p className="text-sm font-semibold text-primary-600">{f.subject}</p>}
              {f.experience && <p className="mt-0.5 text-xs text-slate-500">{f.experience}</p>}
              {demoId && (
                <button
                  type="button"
                  onClick={() => setVideo({ id: demoId, title: `${f.name}: Demo Class` })}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  <Play className="size-3 fill-current" aria-hidden="true" />
                  Play Demo
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {video && <VideoModal videoId={video.id} title={video.title} onClose={() => setVideo(null)} />}
    </SectionShell>
  )
}
