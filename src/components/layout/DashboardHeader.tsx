'use client'
import Link from 'next/link'
import { ExternalLink, Eye, EyeOff } from 'lucide-react'
import type { Wedding } from '@/types'
import { publishWedding } from '@/lib/actions'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function DashboardHeader({ wedding }: {
  wedding: Pick<Wedding,'id','slug','is_published'> | null
}) {
  const [publishing, setPublishing] = useState(false)

  async function togglePublish() {
    if (!wedding) return
    setPublishing(true)
    const res = await publishWedding(wedding.id, !wedding.is_published)
    if (res.error) toast.error(res.error)
    else toast.success(wedding.is_published ? 'Site unpublished' : 'Site is now live!')
    setPublishing(false)
  }

  return (
    <header className="bg-white border-b border-blush px-8 py-4 flex items-center justify-end gap-4">
      {wedding && (
        <>
          {wedding.is_published && (
            <Link href={`/wedding/${wedding.slug}`} target="_blank"
              className="flex items-center gap-2 text-xs text-slate hover:text-rose transition-colors">
              <ExternalLink size={14} />
              View live site
            </Link>
          )}
          <button onClick={togglePublish} disabled={publishing}
            className={`flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 border transition-all disabled:opacity-60 ${
              wedding.is_published
                ? 'border-rose/40 text-rose hover:bg-rose hover:text-white'
                : 'border-deep text-deep hover:bg-deep hover:text-ivory'
            }`}>
            {wedding.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
            {publishing ? 'Updating...' : wedding.is_published ? 'Unpublish' : 'Publish site'}
          </button>
        </>
      )}
    </header>
  )
}
