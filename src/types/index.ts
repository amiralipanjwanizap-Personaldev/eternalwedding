export type RSVPStatus = 'pending' | 'attending' | 'declined'
export type WeddingTheme = 'rose-garden' | 'botanical' | 'golden-hour' | 'midnight-blue' | 'blush-romantic' | 'desert-sand' | 'ocean-breeze' | 'monochrome'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Wedding {
  id: string
  owner_id: string
  slug: string
  partner1_name: string
  partner2_name: string
  wedding_date: string | null
  venue_name: string | null
  venue_address: string | null
  venue_city: string | null
  venue_country: string | null
  story: string | null
  cover_image_url: string | null
  theme: WeddingTheme
  is_published: boolean
  password_hash: string | null
  custom_domain: string | null
  created_at: string
  updated_at: string
}

export interface WeddingEvent {
  id: string
  wedding_id: string
  title: string
  description: string | null
  event_date: string | null
  start_time: string | null
  end_time: string | null
  venue_name: string | null
  venue_address: string | null
  dress_code: string | null
  is_public: boolean
  sort_order: number
  created_at: string
}

export interface Guest {
  id: string
  wedding_id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  group_name: string | null
  rsvp_status: RSVPStatus
  meal_choice: string | null
  plus_one: boolean
  plus_one_name: string | null
  dietary_notes: string | null
  song_request: string | null
  invite_sent: boolean
  invite_sent_at: string | null
  events: string[] | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  wedding_id: string
  uploader_id: string | null
  uploader_name: string | null
  storage_path: string
  public_url: string
  caption: string | null
  is_approved: boolean
  width: number | null
  height: number | null
  file_size: number | null
  created_at: string
}

export interface TravelInfo {
  id: string
  wedding_id: string
  section: string
  title: string
  description: string | null
  url: string | null
  address: string | null
  sort_order: number
  created_at: string
}

export interface RegistryLink {
  id: string
  wedding_id: string
  store_name: string
  url: string
  sort_order: number
  created_at: string
}

export interface GuestbookEntry {
  id: string
  wedding_id: string
  author_name: string
  message: string
  is_approved: boolean
  created_at: string
}

// Dashboard stats
export interface WeddingStats {
  total_guests: number
  attending: number
  declined: number
  pending: number
  total_photos: number
  days_until_wedding: number | null
}

// Form types
export interface CreateWeddingForm {
  partner1_name: string
  partner2_name: string
  wedding_date: string
  venue_city: string
  venue_country: string
  theme: WeddingTheme
}

export interface GuestForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  group_name: string
  plus_one: boolean
  plus_one_name: string
  dietary_notes: string
  notes: string
}

export interface RSVPForm {
  rsvp_status: RSVPStatus
  meal_choice: string
  dietary_notes: string
  song_request: string
  plus_one_name: string
  message: string
}
