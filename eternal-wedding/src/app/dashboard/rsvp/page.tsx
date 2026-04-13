import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EventsManager } from '@/components/wedding/EventsManager'

export default async function SchedulePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: weddings } = await supabase
    .from('weddings').select('id').eq('owner_id', user.id).limit(1)
  const wedding = weddings?.[0]
  if (!wedding) redirect('/dashboard')

  const { data: events } = await supabase
    .from('events').select('*').eq('wedding_id', wedding.id).order('sort_order')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-deep">Schedule & Events</h1>
        <p className="text-slate text-sm mt-1">Add your ceremony, reception and other events</p>
      </div>
      <EventsManager weddingId={wedding.id} initialEvents={events ?? []} />
    </div>
  )
}
