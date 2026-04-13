import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: weddings } = await supabase
    .from('weddings')
    .select('id, slug, partner1_name, partner2_name, is_published')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const wedding = weddings?.[0] ?? null

  return (
    <div className="min-h-screen flex bg-ivory">
      <DashboardSidebar wedding={wedding} userEmail={user.email ?? ''} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader wedding={wedding} />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
