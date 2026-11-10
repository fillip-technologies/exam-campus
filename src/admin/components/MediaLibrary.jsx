import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Copy, FileText, Search, Trash2, Upload } from 'lucide-react'
import { api, qs } from '@/api/client'
import { useAdminMutation } from '../api'
import { Button, Empty, ErrorBox, inputCls, Spinner, useConfirm, useToast } from '../ui'

const FOLDERS = ['general', 'banners', 'posters', 'logos', 'pdfs', 'brand']

/**
 * Media library: upload (PNG, JPEG, WebP, GIF, AVIF, PDF) and browse files stored by the API.
 * With `onPick`, clicking a file returns it (used by image fields); otherwise it is the full media page.
 */
export default function MediaLibrary({ onPick }) {
  const [q, setQ] = useState('')
  const [folder, setFolder] = useState('')
  const [uploadFolder, setUploadFolder] = useState('general')
  const [alt, setAlt] = useState('')
  const fileRef = useRef(null)
  const confirm = useConfirm()
  const toast = useToast()

  const list = useQuery({ queryKey: ['admin', 'media', q, folder], queryFn: () => api(`/admin/media${qs({ q, folder, pageSize: 120 })}`) })

  const upload = useAdminMutation(
    (file) => {
      const body = new FormData()
      body.append('folder', uploadFolder)
      if (alt) body.append('alt', alt)
      body.append('file', file)
      return api('/admin/media', { method: 'POST', body })
    },
    {
      resource: 'media',
      onSuccess: (asset) => {
        toast('Uploaded')
        setAlt('')
        if (fileRef.current) fileRef.current.value = ''
        onPick?.(asset)
      },
    },
  )
  const remove = useAdminMutation((id) => api(`/admin/media/${id}`, { method: 'DELETE' }), { resource: 'media', onSuccess: () => toast('Deleted') })

  const onDelete = async (asset) => {
    const ok = await confirm({
      title: 'Delete this file?',
      message: 'Pages that still use its URL will show a broken image. This cannot be undone.',
      confirmLabel: 'Delete file',
      danger: true,
    })
    if (ok) remove.mutate(asset.id)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-dashed border-primary-200 bg-primary-50/40 p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_10rem_1fr_auto] sm:items-end">
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-ink">File</span>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf" className="block w-full text-sm" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-ink">Folder</span>
            <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} className={inputCls}>
              {FOLDERS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-ink">Alt text</span>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" className={inputCls} />
          </label>
          <Button
            variant="primary"
            icon={Upload}
            busy={upload.isPending}
            onClick={() => {
              const file = fileRef.current?.files?.[0]
              if (file) upload.mutate(file)
              else toast('Choose a file first', 'error')
            }}
          >
            Upload
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">PNG, JPEG, WebP, GIF, AVIF or PDF. SVG is not allowed (it can carry scripts).</p>
        {upload.error && (
          <div className="mt-2">
            <ErrorBox error={upload.error} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or alt text" className={`${inputCls} pl-9`} />
        </div>
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className={`${inputCls} w-40`} aria-label="Folder">
          <option value="">All folders</option>
          {FOLDERS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      {list.isPending ? (
        <Spinner />
      ) : list.isError ? (
        <ErrorBox error={list.error} onRetry={() => list.refetch()} />
      ) : list.data.items.length === 0 ? (
        <Empty>No files yet. Upload one above.</Empty>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {list.data.items.map((a) => (
            <li key={a.id} className="group overflow-hidden rounded-md border border-slate-200 bg-white">
              <button type="button" onClick={() => onPick?.(a)} className={`block w-full ${onPick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`} title={onPick ? 'Use this file' : a.key}>
                {a.mime.startsWith('image/') ? (
                  <img src={a.url} alt={a.alt ?? ''} loading="lazy" className="aspect-video w-full bg-slate-50 object-contain" />
                ) : (
                  <span className="grid aspect-video w-full place-items-center bg-slate-50 text-slate-500">
                    <FileText className="size-8" aria-hidden="true" />
                  </span>
                )}
              </button>
              <div className="flex items-center gap-1 border-t border-slate-100 px-2 py-1.5">
                <span className="min-w-0 flex-1 truncate text-xs text-slate-600" title={a.key}>
                  {a.alt || a.key.split('/').pop()}
                  {a.width ? <span className="text-slate-400"> · {a.width}×{a.height}</span> : null}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy URL"
                  onClick={() => navigator.clipboard?.writeText(a.url).then(() => toast('URL copied'))}
                >
                  <Copy className="size-3.5" />
                </Button>
                {!onPick && (
                  <Button variant="dangerGhost" size="icon" aria-label="Delete file" onClick={() => onDelete(a)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
