import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getGuests } from '@/lib/data'
import { GuestManager } from '@/components/wedding/GuestManager'

export default async function GuestsPage({ searchParams }: { searchParams: { search?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: weddings } = await supabase
    .from('weddings').select('id').eq('owner_id', user.id).limit(1)
  const wedding = weddings?.[0]
  if (!wedding) redirect('/dashboard')

  const guests = await getGuests(wedding.id, searchParams.search)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-deep">Guests & RSVP</h1>
        <p className="text-slate text-sm mt-1">Manage your guest list and track responses</p>
      </div>
      <GuestManager weddingId={wedding.id} initialGuests={guests} />
    </div>
  )
}
