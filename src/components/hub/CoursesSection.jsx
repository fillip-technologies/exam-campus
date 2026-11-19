import { useState } from 'react'
import { ArrowRight, BookOpen, CalendarDays, CirclePlay, GraduationCap, MonitorPlay, NotebookPen, Play, UserRound } from 'lucide-react'
import EnrollButton from '@/components/common/EnrollButton'
import VideoModal from '@/components/common/VideoModal'
import { Poster } from '@/components/common/CourseCard'
import { formatDate } from '@/lib/format'
import { youtubeId } from '@/lib/youtube'
import CourseMediaCarousel from './CourseMediaCarousel'
import ProductCard, { ModeBadge, ProductGrid, primaryAction, secondaryAction } from './ProductCard'
import SectionShell from './SectionShell'

const posterIcons = [
  { icon: MonitorPlay, label: 'Live Classes' },
  { icon: BookOpen, label: 'Recorded' },
  { icon: NotebookPen, label: 'Notes' },
  { icon: UserRound, label: 'Doubts' },
]

const counts = (c) =>
  c.stats?.length
    ? c.stats.map((s) => `${s.value} ${s.label}`)
    : [
        c.liveClasses > 0 && `${c.liveClasses} Live Classes`,
        c.recordedVideos > 0 && `${c.recordedVideos} Videos`,
        c.totalTests > 0 && `${c.totalTests} Tests`,
      ].filter(Boolean)

/**
 * Course card. Expected shape (one item of `courses` on GET /public/exams/:slug):
 * { id, title, subtitle?, mode: 'LIVE'|'RECORDED'|'HYBRID', languages?: string[], faculty?: string[],
 *   startDate?: 'YYYY-MM-DD', liveClasses?, recordedVideos?, totalTests?, stats?: [{ label, value }],
 *   media?: [{ type: 'image'|'youtube', url, alt?, title? }], demoVideoUrl?, offer?: string,
 *   coupon?: { code, discountPercent?, discountAmount?, label?, validTill? },
 *   price, originalPrice?, validity?, enrollUrl, detailsUrl? }
 */
function CourseCard({ course, examName, org, toneIndex, onPlay }) {
  const { title, subtitle, mode, languages, faculty, startDate, media, demoVideoUrl, price, originalPrice, validity, offer, coupon, enrollUrl, detailsUrl } = course
  const demoId = youtubeId(demoVideoUrl)
  const starts = formatDate(startDate ? String(startDate).slice(0, 10) : null)
  const what = counts(course)

  const meta = [
    what.length > 0 && { icon: MonitorPlay, text: what.join(' · ') },
    starts && { icon: CalendarDays, text: `Batch starts ${starts}` },
    faculty?.length > 0 && { icon: UserRound, text: `By ${faculty.join(', ')}` },
  ].filter(Boolean)

  return (
    <ProductCard
      media={
        <CourseMediaCarousel
          media={media}
          title={title}
          onPlay={onPlay}
          fallback={<Poster exam={examName} org={org} subtitle={subtitle} posterIcons={posterIcons} toneIndex={toneIndex} />}
        />
      }
      badge={mode && <ModeBadge mode={mode} />}
      category={subtitle}
      languages={languages?.join(' · ')}
      title={title}
      meta={meta}
      price={price}
      originalPrice={originalPrice}
      priceNote={validity && `Valid for ${validity}`}
      offer={offer}
      coupon={coupon}
      actions={[
        demoId ? (
          <button key="demo" type="button" onClick={() => onPlay({ id: demoId, title: `${title}: Live Demo` })} className={secondaryAction}>
            <CirclePlay className="size-4 text-red-600" aria-hidden="true" />
            Live Demo
          </button>
        ) : detailsUrl ? (
          <a key="details" href={detailsUrl} className={secondaryAction}>
            View Details
          </a>
        ) : null,
        <EnrollButton key="enroll" to={enrollUrl} what={title} className={primaryAction}>
          Enroll Now
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </EnrollButton>,
      ]}
    />
  )
}

/** Wide "free demo class" strip above the course cards. */
function DemoBanner({ examName, onPlay }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl bg-gradient-to-r from-primary-50 via-white to-accent-50 p-4 ring-1 ring-inset ring-primary-100 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3.5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30">
          <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2 text-base font-bold text-ink sm:text-lg">
            Free Live Demo Class
            <ModeBadge mode="LIVE" />
          </p>
          <p className="mt-0.5 text-sm text-slate-600">Attend a free {examName} class and see how we teach before you enroll.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onPlay}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <CirclePlay className="size-4" aria-hidden="true" />
        Watch Free Demo
      </button>
    </div>
  )
}

/**
 * courses: course packages (live / recorded classes) shown as a grid. One shared popup plays every video.
 * demoVideoUrl: the banner's video; defaults to the first course that has a demo.
 */
export default function CoursesSection({ examName, org, courses, demoVideoUrl, intro }) {
  const [video, setVideo] = useState(null)
  if (!courses?.length) return null
  const bannerId = youtubeId(demoVideoUrl) ?? courses.map((c) => youtubeId(c.demoVideoUrl)).find(Boolean)

  return (
    <SectionShell
      icon={GraduationCap}
      id="courses"
      title={`${examName} Courses`}
      intro={intro ?? `Live and recorded classes for the complete ${examName} syllabus, taught by expert faculty.`}
    >
      {bannerId && <DemoBanner examName={examName} onPlay={() => setVideo({ id: bannerId, title: `${examName}: Free Live Demo Class` })} />}
      <ProductGrid noun="courses">
        {courses.map((c, i) => (
          <CourseCard key={c.id} course={c} examName={examName} org={org} toneIndex={i} onPlay={setVideo} />
        ))}
      </ProductGrid>
      {video && <VideoModal videoId={video.id} title={video.title} onClose={() => setVideo(null)} />}
    </SectionShell>
  )
}
