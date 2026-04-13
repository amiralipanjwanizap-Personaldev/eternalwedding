import { createClient } from '@/lib/supabase/server'
import type { Wedding, Guest, WeddingStats } from '@/types'

export async function getWeddingBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('weddings')
    .select(`
      *,
      events(*),
      travel_info(*),
      registry_links(*),
      guestbook_entries(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) return null
  return data
}

export async function getWeddingByOwner(userId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('weddings')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getWeddingStats(weddingId: string): Promise<WeddingStats | null> {
  const supabase = createClient()

  const { data: guests } = await supabase
    .from('guests')
    .select('rsvp_status')
    .eq('wedding_id', weddingId)

  const { count: photoCount } = await supabase
    .from('photos')
    .select('id', { count: 'exact', head: true })
    .eq('wedding_id', weddingId)
    .eq('is_approved', true)

  const { data: wedding } = await supabase
    .from('weddings')
    .select('wedding_date')
    .eq('id', weddingId)
    .single()

  if (!guests) return null

  const total = guests.length
  const attending = guests.filter(g => g.rsvp_status === 'attending').length
  const declined = guests.filter(g => g.rsvp_status === 'declined').length
  const pending = guests.filter(g => g.rsvp_status === 'pending').length

  let days: number | null = null
  if (wedding?.wedding_date) {
    const diff = Math.ceil(
      (new Date(wedding.wedding_date).getTime() - Date.now()) / 86400000
    )
    days = diff > 0 ? diff : 0
  }

  return {
    total_guests: total,
    attending,
    declined,
    pending,
    total_photos: photoCount ?? 0,
    days_until_wedding: days,
  }
}

export async function getGuests(weddingId: string, search?: string) {
  const supabase = createClient()
  let query = supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,group_name.ilike.%${search}%`
    )
  }

  const { data } = await query
  return data ?? []
}

export async function getPhotos(weddingId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('photos')
    .select('*')
    .eq('wedding_id', weddingId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
  return data ?? []
}
