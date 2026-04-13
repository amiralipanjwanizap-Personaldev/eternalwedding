'use client'
import { useState, useCallback, useTransition } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { deletePhoto } from '@/lib/actions'
import type { Photo } from '@/types'
import toast from 'react-hot-toast'
import { Upload, Trash2, X, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { formatFileSize } from '@/lib/utils'

export function PhotoManager({ weddingId, initialPhotos, userId }: {
  weddingId: string
  initialPhotos: Photo[]
  userId: string
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [isPending, startTransition] = useTransition()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setUploadProgress(0)
    const supabase = createClient()
    const uploaded: Photo[] = []

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]
      const ext = file.name.split('.').pop()
      const path = `${userId}/${weddingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: storageError } = await supabase.storage
        .from('wedding-photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (storageError) {
        toast.error(`Failed to upload ${file.name}`)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(path)

      const { data: photo, error: dbError } = await supabase
        .from('photos')
        .insert({
          wedding_id: weddingId,
          uploader_id: userId,
          storage_path: path,
          public_url: publicUrl,
          file_size: file.size,
        })
        .select()
        .single()

      if (!dbError && photo) uploaded.push(photo as Photo)
      setUploadProgress(Math.round(((i + 1) / acceptedFiles.length) * 100))
    }

    setPhotos(prev => [...uploaded, ...prev])
    setUploading(false)
    setUploadProgress(0)
    if (uploaded.length) toast.success(`${uploaded.length} photo${uploaded.length > 1 ? 's' : ''} uploaded`)
  }, [weddingId, userId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 20 * 1024 * 1024,
    multiple: true,
  })

  function handleDelete(photo: Photo) {
    if (!confirm('Delete this photo?')) return
    startTransition(async () => {
      const res = await deletePhoto(photo.id, photo.storage_path)
      if (res.error) { toast.error(res.error); return }
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      toast.success('Photo deleted')
    })
  }

  return (
    <div>
      {/* Drop zone */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-all mb-8 ${
        isDragActive ? 'border-rose bg-rose/5' : 'border-blush hover:border-rose/50 hover:bg-ivory'
      }`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-blush/30 flex items-center justify-center">
            <Upload size={24} className="text-rose" strokeWidth={1.5} />
          </div>
          {uploading ? (
            <>
              <p className="text-sm text-slate">Uploading... {uploadProgress}%</p>
              <div className="w-48 h-1 bg-blush rounded-full overflow-hidden">
                <div className="h-full bg-rose transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </>
          ) : isDragActive ? (
            <p className="font-display text-xl font-light text-rose">Drop photos here</p>
          ) : (
            <>
              <p className="font-display text-xl font-light text-deep">Drag & drop photos here</p>
              <p className="text-sm text-slate">or click to browse — JPG, PNG, WebP up to 20MB each</p>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      {photos.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Gallery grid */}
      {photos.length === 0 ? (
        <div className="py-16 text-center text-slate">
          <p className="font-display text-2xl font-light text-deep mb-2">No photos yet</p>
          <p className="text-sm">Upload your first photos above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="group relative aspect-square bg-cream overflow-hidden">
              <Image
                src={photo.public_url}
                alt={photo.caption ?? 'Wedding photo'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-deep/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => setLightbox(photo)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">
                  <ZoomIn size={14} className="text-white" />
                </button>
                <button onClick={() => handleDelete(photo)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500/80 flex items-center justify-center transition-colors">
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
              {/* File size badge */}
              {photo.file_size && (
                <div className="absolute bottom-1 left-1 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatFileSize(photo.file_size)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox.public_url}
              alt={lightbox.caption ?? ''}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  )
}
