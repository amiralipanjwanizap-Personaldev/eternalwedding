'use client'
import { useState } from 'react'
import { addGuestbookEntry } from '@/lib/actions'
import toast from 'react-hot-toast'

export function GuestbookForm({ weddingId }: { weddingId: string }) {
  const [form, setForm] = useState({ name: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return
    setLoading(true)
    const res = await addGuestbookEntry(weddingId, form.name.trim(), form.message.trim())
    if (res.error) { toast.error(res.error); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
    toast.success('Your message has been added!')
  }

  if (submitted) {
    return (
      <div className="p-6 bg-cream border border-blush text-center">
        <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light text-deep mb-1">
          Thank you!
        </p>
        <p className="text-sm text-slate">Your message has been added to the guestbook.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cream border border-blush p-6 flex flex-col gap-4">
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light text-deep">
        Leave a message
      </h3>
      <div>
        <label className="label">Your name</label>
        <input className="input-field" required placeholder="Your name"
          value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
      </div>
      <div>
        <label className="label">Your message</label>
        <textarea className="input-field resize-none" rows={3} required
          placeholder="Share your wishes for the couple..."
          value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
      </div>
      <button type="submit" disabled={loading}
        className="bg-deep text-ivory px-6 py-3 text-xs tracking-widest uppercase hover:bg-rose transition-colors disabled:opacity-60 w-fit">
        {loading ? 'Posting...' : 'Add to guestbook →'}
      </button>
    </form>
  )
}
