'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatDate, formatTime, THEMES } from '@/lib/utils'
import { RSVPForm } from '@/components/wedding/RSVPForm'
import { GuestbookForm } from '@/components/wedding/GuestbookForm'
import { MapPin, Clock, Gift, BookOpen, Camera, ChevronDown } from 'lucide-react'
import type { Wedding, WeddingEvent, TravelInfo, RegistryLink, GuestbookEntry } from '@/types'

type FullWedding = Wedding & {
  events: WeddingEvent[]
  travel_info: TravelInfo[]
  registry_links: RegistryLink[]
  guestbook_entries: GuestbookEntry[]
}

const TABS = ['story', 'schedule', 'rsvp', 'gallery', 'travel', 'registry', 'guestbook'] as const
type Tab = typeof TABS[number]

export function WeddingPublicPage({ wedding }: { wedding: FullWedding }) {
  const [activeTab, setActiveTab] = useState<Tab>('story')
  const [countdown, setCountdown] = useState({ days: 0, hrs: 0, min: 0, sec: 0 })
  const theme = THEMES.find(t => t.id === wedding.theme) ?? THEMES[0]

  useEffect(() => {
    if (!wedding.wedding_date) return
    const target = new Date(wedding.wedding_date + 'T14:00:00').getTime()
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) return
      setCountdown({
        days: Math.floor(diff / 86400000),
        hrs:  Math.floor((diff % 86400000) / 3600000),
        min:  Math.floor((diff % 3600000) / 60000),
        sec:  Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [wedding.wedding_date])

  const tabLabels: Record<Tab, string> = {
    story: 'Our Story', schedule: 'Schedule', rsvp: 'RSVP',
    gallery: 'Gallery', travel: 'Travel', registry: 'Registry', guestbook: 'Guestbook',
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAF7F2' }}>

      {/* Hero banner */}
      <div className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.primary} 60%, #3D2C2C 100%)` }}>
        {wedding.cover_image_url && (
          <Image src={wedding.cover_image_url} alt="Cover" fill className="object-cover opacity-30" />
        )}
        <div className="relative text-center px-8">
          <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-4">
            {wedding.venue_city}{wedding.venue_country ? `, ${wedding.venue_country}` : ''}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-6xl md:text-8xl font-light text-white leading-none mb-4">
            {wedding.partner1_name}<br />
            <span className="text-4xl md:text-5xl opacity-70">&</span><br />
            {wedding.partner2_name}
          </h1>
          {wedding.wedding_date && (
            <p className="text-white/80 text-sm tracking-[0.2em] uppercase mt-4">
              {formatDate(wedding.wedding_date)}
            </p>
          )}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <ChevronDown size={20} />
        </div>
      </div>

      {/* Countdown */}
      {wedding.wedding_date && new Date(wedding.wedding_date) > new Date() && (
        <div className="bg-white border-b border-blush py-6 px-4">
          <div className="max-w-lg mx-auto flex justify-center gap-8 md:gap-16">
            {[
              { value: countdown.days, label: 'Days' },
              { value: countdown.hrs,  label: 'Hours' },
              { value: countdown.min,  label: 'Minutes' },
              { value: countdown.sec,  label: 'Seconds' },
            ].map(u => (
              <div key={u.label} className="text-center">
                <div style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-4xl font-light text-deep leading-none">
                  {String(u.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] tracking-widest uppercase text-slate mt-1">{u.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-blush">
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-4 text-xs tracking-widest uppercase transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-rose text-rose'
                  : 'border-transparent text-slate hover:text-deep'
              }`}>
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* STORY */}
        {activeTab === 'story' && (
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-6">Our Story</h2>
            {wedding.story ? (
              <div className="text-slate leading-[1.9] text-base whitespace-pre-wrap">{wedding.story}</div>
            ) : (
              <p className="text-slate italic">Coming soon…</p>
            )}
            {wedding.venue_name && (
              <div className="mt-10 p-6 bg-cream border border-blush">
                <p className="text-xs tracking-widest uppercase text-rose mb-3">Venue</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-deep">
                  {wedding.venue_name}
                </p>
                {wedding.venue_address && (
                  <p className="text-sm text-slate mt-1 flex items-center gap-1">
                    <MapPin size={13} />{wedding.venue_address}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-8">Schedule</h2>
            {wedding.events.length === 0 ? (
              <p className="text-slate italic">Schedule coming soon…</p>
            ) : (
              <div className="flex flex-col gap-6">
                {wedding.events
                  .filter(e => e.is_public)
                  .sort((a, b) => {
                    if (!a.event_date) return 1
                    if (!b.event_date) return -1
                    return a.event_date.localeCompare(b.event_date) || (a.start_time ?? '').localeCompare(b.start_time ?? '')
                  })
                  .map(ev => (
                    <div key={ev.id} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: theme.primary }} />
                      <div className="flex-1 pb-6 border-b border-blush/50 last:border-0">
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          className="text-2xl font-light text-deep">{ev.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate">
                          {ev.event_date && (
                            <span className="flex items-center gap-1">
                              <Clock size={13} />
                              {formatDate(ev.event_date)}
                              {ev.start_time && ` · ${formatTime(ev.start_time)}`}
                              {ev.end_time && ` – ${formatTime(ev.end_time)}`}
                            </span>
                          )}
                          {ev.venue_name && (
                            <span className="flex items-center gap-1">
                              <MapPin size={13} />{ev.venue_name}
                            </span>
                          )}
                        </div>
                        {ev.description && <p className="text-sm text-slate mt-2">{ev.description}</p>}
                        {ev.dress_code && (
                          <p className="text-xs text-slate/60 mt-2 italic">Dress code: {ev.dress_code}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* RSVP */}
        {activeTab === 'rsvp' && (
          <div className="max-w-lg mx-auto">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-2">RSVP</h2>
            <p className="text-slate text-sm mb-8">Kindly reply by {wedding.wedding_date ? formatDate(wedding.wedding_date) : 'the date noted'}</p>
            <RSVPForm weddingId={wedding.id} events={wedding.events} />
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-8">Gallery</h2>
            <GalleryGrid weddingId={wedding.id} />
          </div>
        )}

        {/* TRAVEL */}
        {activeTab === 'travel' && (
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-8">Travel & Accommodation</h2>
            {wedding.travel_info.length === 0 ? (
              <p className="text-slate italic">Travel information coming soon…</p>
            ) : (
              <div className="flex flex-col gap-4">
                {wedding.travel_info
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map(info => (
                    <div key={info.id} className="p-5 bg-white border border-blush">
                      <p className="text-xs tracking-widest uppercase text-rose mb-2">{info.section}</p>
                      <h3 className="text-lg font-medium text-deep mb-1">{info.title}</h3>
                      {info.description && <p className="text-sm text-slate leading-relaxed">{info.description}</p>}
                      {info.address && (
                        <p className="text-sm text-slate mt-2 flex items-center gap-1">
                          <MapPin size={12} />{info.address}
                        </p>
                      )}
                      {info.url && (
                        <a href={info.url} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-rose hover:underline mt-2 block">
                          Visit website →
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* REGISTRY */}
        {activeTab === 'registry' && (
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-3">Gift Registry</h2>
            <p className="text-slate text-sm mb-8">Your presence is the greatest gift. If you'd like to give, here are some ideas.</p>
            {wedding.registry_links.length === 0 ? (
              <p className="text-slate italic">Registry details coming soon…</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wedding.registry_links
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map(reg => (
                    <a key={reg.id} href={reg.url} target="_blank" rel="noopener noreferrer"
                      className="p-5 bg-white border border-blush hover:border-rose transition-colors flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-blush/30 flex items-center justify-center flex-shrink-0">
                        <Gift size={18} className="text-rose" />
                      </div>
                      <div>
                        <p className="font-medium text-deep text-sm">{reg.store_name}</p>
                        <p className="text-xs text-slate group-hover:text-rose transition-colors mt-0.5">View registry →</p>
                      </div>
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* GUESTBOOK */}
        {activeTab === 'guestbook' && (
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl font-light text-deep mb-8">Guestbook</h2>
            <GuestbookForm weddingId={wedding.id} />
            <div className="mt-10 flex flex-col gap-5">
              {wedding.guestbook_entries
                .filter(e => e.is_approved)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(entry => (
                  <div key={entry.id} className="p-5 bg-white border border-blush relative">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      className="absolute top-2 left-4 text-5xl text-blush leading-none select-none">"</span>
                    <p className="text-slate leading-relaxed mt-4 text-sm">{entry.message}</p>
                    <p className="text-xs tracking-widest uppercase text-rose mt-3">{entry.author_name}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-blush mt-16 py-8 text-center">
        <p style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-2xl font-light text-deep mb-1">
          {wedding.partner1_name} & {wedding.partner2_name}
        </p>
        <p className="text-xs tracking-widest uppercase text-slate">
          {wedding.wedding_date ? formatDate(wedding.wedding_date) : ''}
          {wedding.venue_city ? ` · ${wedding.venue_city}` : ''}
        </p>
        <p className="text-xs text-slate/30 mt-4">
          Created with <span className="text-rose">Eternal</span>
        </p>
      </footer>
    </div>
  )
}

// Inline gallery fetcher
function GalleryGrid({ weddingId }: { weddingId: string }) {
  const [photos, setPhotos] = useState<Array<{ id: string; public_url: string; caption: string | null }>>([])
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase.from('photos')
        .select('id, public_url, caption')
        .eq('wedding_id', weddingId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .then(({ data }) => setPhotos(data ?? []))
    })
  }, [weddingId])

  if (photos.length === 0) {
    return (
      <div className="py-16 text-center">
        <Camera size={40} className="text-blush mx-auto mb-4" strokeWidth={1} />
        <p className="text-slate text-sm">Photos will appear here as guests share them</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map(p => (
          <div key={p.id} className="group relative aspect-square bg-cream overflow-hidden cursor-pointer"
            onClick={() => setLightbox(p.public_url)}>
            <Image src={p.public_url} alt={p.caption ?? ''} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="25vw" />
            <div className="absolute inset-0 bg-deep/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image src={lightbox} alt="" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  )
}
