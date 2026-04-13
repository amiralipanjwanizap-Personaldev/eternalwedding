import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getWeddingStats } from '@/lib/data'
import { CreateWeddingForm } from '@/components/wedding/CreateWeddingForm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users, Image, Calendar, MapPin, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const wedding = weddings?.[0] ?? null

  // If no wedding yet, show creation form
  if (!wedding) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-light text-deep">Let's create your wedding suite</h1>
          <p className="text-slate text-sm mt-2 leading-relaxed">
            Set up your wedding details and we'll create your beautiful site in seconds.
          </p>
        </div>
        <CreateWeddingForm />
      </div>
    )
  }

  const stats = await getWeddingStats(wedding.id)

  const statCards = [
    { label: 'Total guests',     value: stats?.total_guests ?? 0,  icon: Users,    href: '/dashboard/guests',  color: 'text-rose' },
    { label: 'Attending',        value: stats?.attending ?? 0,     icon: Users,    href: '/dashboard/guests',  color: 'text-green-600' },
    { label: 'Awaiting RSVP',    value: stats?.pending ?? 0,       icon: Calendar, href: '/dashboard/guests',  color: 'text-gold' },
    { label: 'Photos shared',    value: stats?.total_photos ?? 0,  icon: Image,    href: '/dashboard/photos',  color: 'text-blue-500' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-deep">
          {wedding.partner1_name} & {wedding.partner2_name}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          {wedding.wedding_date && (
            <span className="flex items-center gap-1.5 text-sm text-slate">
              <Calendar size={14} className="text-rose" />
              {formatDate(wedding.wedding_date)}
              {stats?.days_until_wedding !== null && stats!.days_until_wedding! > 0 && (
                <span className="text-rose ml-1">· {stats!.days_until_wedding} days to go</span>
              )}
            </span>
          )}
          {wedding.venue_city && (
            <span className="flex items-center gap-1.5 text-sm text-slate">
              <MapPin size={14} className="text-rose" />
              {wedding.venue_city}{wedding.venue_country ? `, ${wedding.venue_country}` : ''}
            </span>
          )}
          <span className={`text-xs tracking-widest uppercase px-2 py-0.5 rounded-full ${
            wedding.is_published ? 'bg-green-50 text-green-700' : 'bg-blush/40 text-slate'
          }`}>
            {wedding.is_published ? '● Live' : '○ Draft'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <Link key={s.label} href={s.href}
            className="card hover:border-rose/40 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <s.icon size={18} className={`${s.color} opacity-70`} strokeWidth={1.5} />
              <ArrowRight size={14} className="text-slate/30 group-hover:text-rose transition-colors" />
            </div>
            <div className="font-display text-4xl font-light text-deep">{s.value}</div>
            <div className="text-xs tracking-widest uppercase text-slate mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/guests" className="card hover:border-rose/40 transition-colors group flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center">
            <Users size={18} className="text-rose" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-light text-deep">Manage guests</h3>
          <p className="text-sm text-slate leading-relaxed">Add guests, track RSVPs and send invitations.</p>
          <span className="text-xs tracking-widest uppercase text-rose group-hover:gap-2 flex items-center gap-1 mt-auto">
            Open <ArrowRight size={12} />
          </span>
        </Link>

        <Link href="/dashboard/photos" className="card hover:border-rose/40 transition-colors group flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center">
            <Image size={18} className="text-rose" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-light text-deep">Photo gallery</h3>
          <p className="text-sm text-slate leading-relaxed">Upload photos and manage your guest gallery.</p>
          <span className="text-xs tracking-widest uppercase text-rose flex items-center gap-1 mt-auto">
            Open <ArrowRight size={12} />
          </span>
        </Link>

        <Link href="/dashboard/settings" className="card hover:border-rose/40 transition-colors group flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center">
            <Calendar size={18} className="text-rose" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-light text-deep">Wedding details</h3>
          <p className="text-sm text-slate leading-relaxed">Edit your story, events, travel info and more.</p>
          <span className="text-xs tracking-widest uppercase text-rose flex items-center gap-1 mt-auto">
            Open <ArrowRight size={12} />
          </span>
        </Link>
      </div>

      {/* Publish nudge */}
      {!wedding.is_published && (
        <div className="mt-8 bg-deep text-ivory p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-light mb-1">Ready to share your wedding?</h3>
            <p className="text-ivory/50 text-sm">Publish your site so guests can view it and RSVP.</p>
          </div>
          <Link href="/dashboard/settings" className="btn-rose flex-shrink-0">
            Publish site →
          </Link>
        </div>
      )}
    </div>
  )
}
