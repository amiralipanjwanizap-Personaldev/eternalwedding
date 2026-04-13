import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPhotos } from '@/lib/data'
import { PhotoManager } from '@/components/wedding/PhotoManager'

export default async function PhotosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: weddings } = await supabase
    .from('weddings').select('id').eq('owner_id', user.id).limit(1)
  const wedding = weddings?.[0]
  if (!wedding) redirect('/dashboard')

  const photos = await getPhotos(wedding.id)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-deep">Photo Gallery</h1>
        <p className="text-slate text-sm mt-1">Upload and manage your wedding photos</p>
      </div>
      <PhotoManager weddingId={wedding.id} initialPhotos={photos} userId={user.id} />
    </div>
  )
}
