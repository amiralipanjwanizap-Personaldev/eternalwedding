'use server'

import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CreateWeddingForm, GuestForm, RSVPForm } from '@/types'

// ── AUTH ──────────────────────────────────────────────────

export async function signUp(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string

  const { error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name } },
  })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ── WEDDINGS ──────────────────────────────────────────────

export async function createWedding(form: CreateWeddingForm) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const slug = generateSlug(form.partner1_name, form.partner2_name)

  const { data, error } = await supabase
    .from('weddings')
    .insert({
      owner_id: user.id,
      slug,
      partner1_name: form.partner1_name,
      partner2_name: form.partner2_name,
      wedding_date: form.wedding_date || null,
      venue_city: form.venue_city || null,
      venue_country: form.venue_country || null,
      theme: form.theme || 'rose-garden',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { data }
}

export async function updateWedding(weddingId: string, updates: Partial<{
  partner1_name: string
  partner2_name: string
  wedding_date: string
  venue_name: string
  venue_address: string
  venue_city: string
  venue_country: string
  story: string
  theme: string
  is_published: boolean
  cover_image_url: string
}>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('weddings')
    .update(updates)
    .eq('id', weddingId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function publishWedding(weddingId: string, publish: boolean) {
  return updateWedding(weddingId, { is_published: publish })
}

// ── GUESTS ────────────────────────────────────────────────

export async function addGuest(weddingId: string, form: GuestForm) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('guests')
    .insert({
      wedding_id: weddingId,
      first_name: form.first_name,
      last_name: form.last_name || null,
      email: form.email || null,
      phone: form.phone || null,
      group_name: form.group_name || null,
      plus_one: form.plus_one,
      plus_one_name: form.plus_one_name || null,
      dietary_notes: form.dietary_notes || null,
      notes: form.notes || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/dashboard/guests')
  return { data }
}

export async function updateGuest(guestId: string, updates: Partial<GuestForm>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('guests')
    .update(updates)
    .eq('id', guestId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/guests')
  return { success: true }
}

export async function deleteGuest(guestId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('guests').delete().eq('id', guestId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/guests')
  return { success: true }
}

export async function importGuests(weddingId: string, rows: Array<{
  first_name: string; last_name?: string; email?: string; group_name?: string
}>) {
  const supabase = createClient()
  const guests = rows.map(r => ({
    wedding_id: weddingId,
    first_name: r.first_name,
    last_name: r.last_name || null,
    email: r.email || null,
    group_name: r.group_name || null,
  }))
  const { error } = await supabase.from('guests').insert(guests)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/guests')
  return { success: true }
}

// ── RSVP ──────────────────────────────────────────────────

export async function submitRSVP(guestId: string, form: RSVPForm) {
  const supabase = createClient()
  const { error } = await supabase
    .from('guests')
    .update({
      rsvp_status: form.rsvp_status,
      meal_choice: form.meal_choice || null,
      dietary_notes: form.dietary_notes || null,
      song_request: form.song_request || null,
      plus_one_name: form.plus_one_name || null,
    })
    .eq('id', guestId)

  if (error) return { error: error.message }

  // Add guestbook entry if they left a message
  if (form.message && form.rsvp_status === 'attending') {
    const { data: guest } = await supabase
      .from('guests')
      .select('first_name, last_name, wedding_id')
      .eq('id', guestId)
      .single()

    if (guest) {
      await supabase.from('guestbook_entries').insert({
        wedding_id: guest.wedding_id,
        author_name: `${guest.first_name} ${guest.last_name ?? ''}`.trim(),
        message: form.message,
      })
    }
  }

  return { success: true }
}

// ── EVENTS ────────────────────────────────────────────────

export async function addEvent(weddingId: string, event: {
  title: string; description?: string; event_date?: string;
  start_time?: string; end_time?: string; venue_name?: string;
  venue_address?: string; dress_code?: string; is_public?: boolean
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .insert({ wedding_id: weddingId, ...event })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { data }
}

export async function deleteEvent(eventId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('events').delete().eq('id', eventId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

// ── PHOTOS ────────────────────────────────────────────────

export async function deletePhoto(photoId: string, storagePath: string) {
  const supabase = createClient()
  await supabase.storage.from('wedding-photos').remove([storagePath])
  const { error } = await supabase.from('photos').delete().eq('id', photoId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/photos')
  return { success: true }
}

// ── GUESTBOOK ─────────────────────────────────────────────

export async function addGuestbookEntry(weddingId: string, authorName: string, message: string) {
  const supabase = createClient()
  const { error } = await supabase.from('guestbook_entries').insert({
    wedding_id: weddingId,
    author_name: authorName,
    message,
  })
  if (error) return { error: error.message }
  revalidatePath(`/wedding/${weddingId}`)
  return { success: true }
}
