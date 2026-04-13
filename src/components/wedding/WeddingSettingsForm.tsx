'use client'
import { useState, useTransition } from 'react'
import { updateWedding, publishWedding } from '@/lib/actions'
import type { Wedding } from '@/types'
import { THEMES } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function WeddingSettingsForm({ wedding }: { wedding: Wedding }) {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    partner1_name: wedding.partner1_name,
    partner2_name: wedding.partner2_name,
    wedding_date: wedding.wedding_date ?? '',
    venue_name: wedding.venue_name ?? '',
    venue_address: wedding.venue_address ?? '',
    venue_city: wedding.venue_city ?? '',
    venue_country: wedding.venue_country ?? '',
    story: wedding.story ?? '',
    theme: wedding.theme,
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateWedding(wedding.id, form)
      if (res.error) toast.error(res.error)
      else toast.success('Wedding details saved!')
    })
  }

  function handlePublishToggle() {
    startTransition(async () => {
      const res = await publishWedding(wedding.id, !wedding.is_published)
      if (res.error) toast.error(res.error)
      else toast.success(wedding.is_published ? 'Site unpublished' : '🎉 Your site is now live!')
    })
  }

  const siteUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/wedding/${wedding.slug}`

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      {/* Publish status */}
      <div className={`p-5 border flex items-center justify-between gap-4 ${
        wedding.is_published ? 'border-green-200 bg-green-50' : 'border-blush bg-ivory'
      }`}>
        <div>
          <p className="text-sm font-medium text-deep">
            {wedding.is_published ? '● Your site is live' : '○ Your site is unpublished'}
          </p>
          {wedding.is_published ? (
            <Link href={`/wedding/${wedding.slug}`} target="_blank"
              className="text-xs text-rose hover:underline flex items-center gap-1 mt-0.5">
              {siteUrl} <ExternalLink size={11} />
            </Link>
          ) : (
            <p className="text-xs text-slate mt-0.5">Publish to share with guests</p>
          )}
        </div>
        <button type="button" onClick={handlePublishToggle} disabled={isPending}
          className={`flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 border transition-all disabled:opacity-60 flex-shrink-0 ${
            wedding.is_published
              ? 'border-rose/40 text-rose hover:bg-rose hover:text-white'
              : 'bg-deep text-ivory border-deep hover:bg-rose hover:border-rose'
          }`}>
          {wedding.is_published ? <><EyeOff size={13} /> Unpublish</> : <><Eye size={13} /> Publish site</>}
        </button>
      </div>

      {/* Couple names */}
      <div>
        <h3 className="font-display text-xl font-light text-deep mb-4">The couple</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Partner 1</label>
            <input className="input-field" value={form.partner1_name} required
              onChange={e => setForm(f => ({...f, partner1_name: e.target.value}))} />
          </div>
          <div>
            <label className="label">Partner 2</label>
            <input className="input-field" value={form.partner2_name} required
              onChange={e => setForm(f => ({...f, partner2_name: e.target.value}))} />
          </div>
        </div>
      </div>

      {/* Date & venue */}
      <div>
        <h3 className="font-display text-xl font-light text-deep mb-4">Date & venue</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="label">Wedding date</label>
            <input className="input-field" type="date" value={form.wedding_date}
              onChange={e => setForm(f => ({...f, wedding_date: e.target.value}))} />
          </div>
          <div>
            <label className="label">Venue name</label>
            <input className="input-field" placeholder="e.g. The Grand Pavilion" value={form.venue_name}
              onChange={e => setForm(f => ({...f, venue_name: e.target.value}))} />
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input-field" placeholder="Street address" value={form.venue_address}
              onChange={e => setForm(f => ({...f, venue_address: e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input className="input-field" value={form.venue_city}
                onChange={e => setForm(f => ({...f, venue_city: e.target.value}))} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input-field" value={form.venue_country}
                onChange={e => setForm(f => ({...f, venue_country: e.target.value}))} />
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div>
        <h3 className="font-display text-xl font-light text-deep mb-4">Your story</h3>
        <label className="label">Tell guests how you met</label>
        <textarea className="input-field resize-none" rows={5}
          placeholder="Share the story of how you met, your proposal, or what makes your love unique..."
          value={form.story}
          onChange={e => setForm(f => ({...f, story: e.target.value}))} />
      </div>

      {/* Theme */}
      <div>
        <h3 className="font-display text-xl font-light text-deep mb-4">Design theme</h3>
        <div className="grid grid-cols-4 gap-3">
          {THEMES.map(t => (
            <button key={t.id} type="button"
              onClick={() => setForm(f => ({...f, theme: t.id as any}))}
              className={`group flex flex-col gap-2 text-left transition-all`}>
              <div className={`h-20 rounded-sm overflow-hidden border-2 transition-all ${
                form.theme === t.id ? 'border-rose scale-[1.02]' : 'border-transparent hover:border-blush'
              }`}>
                <div className="w-full h-full" style={{
                  background: `linear-gradient(135deg, ${t.bg}, ${t.primary})`
                }} />
              </div>
              <span className={`text-xs tracking-wider uppercase ${form.theme === t.id ? 'text-rose' : 'text-slate'}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={isPending} className="btn-rose disabled:opacity-60">
          {isPending ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
