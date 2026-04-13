'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MEAL_OPTIONS } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Check, X } from 'lucide-react'
import type { WeddingEvent } from '@/types'

export function RSVPForm({ weddingId, events }: { weddingId: string; events: WeddingEvent[] }) {
  const [step, setStep] = useState<'lookup' | 'form' | 'done'>('lookup')
  const [email, setEmail] = useState('')
  const [guest, setGuest] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    rsvp_status: '' as 'attending' | 'declined' | '',
    meal_choice: '',
    dietary_notes: '',
    song_request: '',
    plus_one_name: '',
    message: '',
  })

  async function lookupGuest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .ilike('email', email.trim())
      .single()

    if (!data) {
      toast.error("We couldn't find your invitation. Please check your email or contact the couple.")
      setLoading(false)
      return
    }
    setGuest(data)
    setForm(f => ({
      ...f,
      rsvp_status: data.rsvp_status === 'pending' ? '' : data.rsvp_status,
      meal_choice: data.meal_choice ?? '',
      dietary_notes: data.dietary_notes ?? '',
      song_request: data.song_request ?? '',
      plus_one_name: data.plus_one_name ?? '',
    }))
    setStep('form')
    setLoading(false)
  }

  async function submitRSVP(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rsvp_status) { toast.error('Please let us know if you\'re attending'); return }
    setLoading(true)
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
      .eq('id', guest.id)

    if (error) { toast.error('Something went wrong. Please try again.'); setLoading(false); return }

    if (form.message && form.rsvp_status === 'attending') {
      await supabase.from('guestbook_entries').insert({
        wedding_id: weddingId,
        author_name: `${guest.first_name} ${guest.last_name ?? ''}`.trim(),
        message: form.message,
      })
    }

    setStep('done')
    setLoading(false)
  }

  if (step === 'done') {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center ${
          form.rsvp_status === 'attending' ? 'bg-green-50' : 'bg-slate/10'
        }`}>
          {form.rsvp_status === 'attending'
            ? <Check size={28} className="text-green-600" />
            : <X size={28} className="text-slate" />}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-3xl font-light text-deep mb-2">
          {form.rsvp_status === 'attending' ? 'We can\'t wait to see you!' : 'You\'ll be missed'}
        </h3>
        <p className="text-slate text-sm">
          {form.rsvp_status === 'attending'
            ? `Thanks ${guest?.first_name}! Your RSVP has been confirmed. See you there!`
            : `Thanks for letting us know, ${guest?.first_name}. We'll miss you.`}
        </p>
      </div>
    )
  }

  if (step === 'lookup') {
    return (
      <form onSubmit={lookupGuest} className="flex flex-col gap-4">
        <p className="text-sm text-slate leading-relaxed">
          Enter the email address used when you received your invitation to find your RSVP.
        </p>
        <div>
          <label className="label">Your email address</label>
          <input className="input-field" type="email" required placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}
          className="bg-deep text-ivory px-6 py-3 text-xs tracking-widest uppercase hover:bg-rose transition-colors disabled:opacity-60">
          {loading ? 'Looking you up...' : 'Find my invitation →'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={submitRSVP} className="flex flex-col gap-5">
      <div className="p-4 bg-cream border border-blush">
        <p className="text-sm text-deep font-medium">
          Hi {guest?.first_name} {guest?.last_name ?? ''}!
        </p>
        <p className="text-xs text-slate mt-0.5">Please fill in your details below</p>
      </div>

      {/* Attending / Declining */}
      <div>
        <label className="label">Will you be attending? *</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button"
            onClick={() => setForm(f => ({...f, rsvp_status: 'attending'}))}
            className={`py-3 border text-sm transition-all flex items-center justify-center gap-2 ${
              form.rsvp_status === 'attending'
                ? 'bg-deep text-ivory border-deep'
                : 'border-blush text-slate hover:border-rose hover:text-rose'
            }`}>
            <Check size={14} /> Joyfully accepts
          </button>
          <button type="button"
            onClick={() => setForm(f => ({...f, rsvp_status: 'declined'}))}
            className={`py-3 border text-sm transition-all flex items-center justify-center gap-2 ${
              form.rsvp_status === 'declined'
                ? 'bg-slate text-ivory border-slate'
                : 'border-blush text-slate hover:border-slate hover:text-slate'
            }`}>
            <X size={14} /> Regretfully declines
          </button>
        </div>
      </div>

      {form.rsvp_status === 'attending' && (
        <>
          {/* Plus one */}
          {guest?.plus_one && (
            <div>
              <label className="label">Plus one name</label>
              <input className="input-field" placeholder="Guest name"
                value={form.plus_one_name} onChange={e => setForm(f => ({...f, plus_one_name: e.target.value}))} />
            </div>
          )}

          {/* Meal */}
          <div>
            <label className="label">Meal preference</label>
            <select className="input-field" value={form.meal_choice}
              onChange={e => setForm(f => ({...f, meal_choice: e.target.value}))}>
              <option value="">Select...</option>
              {MEAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Dietary */}
          <div>
            <label className="label">Dietary requirements</label>
            <input className="input-field" placeholder="Allergies, preferences..."
              value={form.dietary_notes} onChange={e => setForm(f => ({...f, dietary_notes: e.target.value}))} />
          </div>

          {/* Song request */}
          <div>
            <label className="label">Song request</label>
            <input className="input-field" placeholder="What song will get you on the dance floor?"
              value={form.song_request} onChange={e => setForm(f => ({...f, song_request: e.target.value}))} />
          </div>

          {/* Message */}
          <div>
            <label className="label">Leave a message for the couple</label>
            <textarea className="input-field resize-none" rows={3}
              placeholder="Share your wishes..."
              value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
          </div>
        </>
      )}

      <button type="submit" disabled={loading || !form.rsvp_status}
        className="bg-rose text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-deep transition-colors disabled:opacity-60">
        {loading ? 'Submitting...' : 'Send my RSVP →'}
      </button>
    </form>
  )
}
