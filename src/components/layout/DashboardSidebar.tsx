'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Wedding } from '@/types'
import {
  LayoutDashboard, Users, Image, Settings, ExternalLink,
  LogOut, Heart, Calendar, MapPin
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/guests',   icon: Users,           label: 'Guests & RSVP' },
  { href: '/dashboard/photos',   icon: Image,           label: 'Photos' },
  { href: '/dashboard/rsvp',     icon: Calendar,        label: 'Schedule' },
  { href: '/dashboard/settings', icon: Settings,        label: 'Settings' },
]

export function DashboardSidebar({ wedding, userEmail }: {
  wedding: Pick<Wedding,'id','slug','partner1_name','partner2_name','is_published'> | null
  userEmail: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-deep flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="font-display text-xl font-light tracking-widest text-ivory">
          E<span className="text-gold italic">ternal</span>
        </Link>
        {wedding && (
          <p className="text-xs text-ivory/40 mt-1 truncate">
            {wedding.partner1_name} & {wedding.partner2_name}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all ${
                active ? 'bg-white/10 text-ivory' : 'text-ivory/50 hover:text-ivory hover:bg-white/5'
              }`}>
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}

        {/* View live site */}
        {wedding?.is_published && (
          <Link href={`/wedding/${wedding.slug}`} target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/40 hover:text-gold transition-colors mt-2">
            <ExternalLink size={16} strokeWidth={1.5} />
            View live site
          </Link>
        )}
      </nav>

      {/* User + Sign out */}
      <div className="px-4 pb-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-rose/30 flex items-center justify-center">
            <Heart size={14} className="text-rose" />
          </div>
          <span className="text-xs text-ivory/50 truncate">{userEmail}</span>
        </div>
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/40 hover:text-rose transition-colors w-full">
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
