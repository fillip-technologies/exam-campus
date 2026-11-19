import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { youtubeEmbedUrl } from '@/lib/youtube'

/**
 * Plays a YouTube video in a popup on our own page. Render it only while open; unmounting stops the video.
 * Esc, the close button or a click on the dark backdrop calls `onClose`.
 */
export default function VideoModal({ videoId, title, onClose }) {
  const ref = useRef(null)

  // Native modal dialog: traps focus and makes the page inert. Also lock page scroll and restore focus on close.
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()
    return () => {
      document.body.style.overflow = overflow
      if (dialog.open) dialog.close()
      previous?.focus?.()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto w-[min(64rem,calc(100vw-2rem))] max-w-none overflow-visible bg-transparent p-0 text-white backdrop:bg-slate-950/85 backdrop:backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="min-w-0 truncate text-base font-semibold sm:text-lg">{title}</p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close video"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="aspect-video overflow-hidden rounded-md bg-black shadow-2xl">
        <iframe
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="size-full"
        />
      </div>
    </dialog>
  )
}
