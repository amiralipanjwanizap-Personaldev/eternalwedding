'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createWedding } from '@/lib/actions'
import { THEMES } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { WeddingTheme } from '@/types'

export function CreateWeddingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    partner1_name: '', partner2_name: '',
    wedding_date: '', venue_city: '', venue_country: '',
    theme: 'rose-garden' as WeddingTheme,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.partner1_name || !form.partner2_name) {
      toast.error('Please enter both partner names')
      return
    }
    setLoading(true)
    const res = await createWedding(form)
    if (res.error) {
      toast.error(res.error)
      setLoading(false)
      return
    }
    toast.success('Your wedding suite is ready!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Partner 1 name</label>
          <input className="input-field" placeholder="e.g. Amara" required
            value={form.partner1_name} onChange={e => setForm(f => ({...f, partner1_name: e.target.value}))} />
        </div>
        <div>
          <label className="label">Partner 2 name</label>
          <input className="input-field" placeholder="e.g. James" required
            value={form.partner2_name} onChange={e => setForm(f => ({...f, partner2_name: e.target.value}))} />
        </div>
      </div>

      <div>
        <label className="label">Wedding date</label>
        <input className="input-field" type="date"
          value={form.wedding_date} onChange={e => setForm(f => ({...f, wedding_date: e.target.value}))} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">City</label>
          <input className="input-field" placeholder="e.g. Nairobi"
            value={form.venue_city} onChange={e => setForm(f => ({...f, venue_city: e.target.value}))} />
        </div>
        <div>
          <label className="label">Country</label>
          <input className="input-field" placeholder="e.g. Kenya"
            value={form.venue_country} onChange={e => setForm(f => ({...f, venue_country: e.target.value}))} />
        </div>
      </div>

      <div>
        <label className="label">Choose a theme</label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {THEMES.map(t => (
            <button key={t.id} type="button"
              onClick={() => setForm(f => ({...f, theme: t.id as WeddingTheme}))}
              className={`relative h-16 rounded-sm overflow-hidden border-2 transition-all ${
                form.theme === t.id ? 'border-rose scale-105' : 'border-transparent hover:border-blush'
              }`}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.bg}, ${t.primary})` }} />
              {form.theme === t.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate mt-2">
          Selected: {THEMES.find(t => t.id === form.theme)?.label}
        </p>
      </div>

      <button type="submit" disabled={loading} className="btn-rose w-full text-center disabled:opacity-60 mt-2">
        {loading ? 'Creating your suite...' : 'Create my wedding suite →'}
      </button>
    </form>
  )
}
