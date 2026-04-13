'use client'
import { useState, useTransition } from 'react'
import { addEvent, deleteEvent } from '@/lib/actions'
import type { WeddingEvent } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Trash2, Clock, MapPin, X } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'

const EMPTY_EVENT = {
  title: '', description: '', event_date: '', start_time: '',
  end_time: '', venue_name: '', venue_address: '', dress_code: '', is_public: true,
}

export function EventsManager({ weddingId, initialEvents }: {
  weddingId: string
  initialEvents: WeddingEvent[]
}) {
  const [events, setEvents] = useState<WeddingEvent[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_EVENT)
  const [isPending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await addEvent(weddingId, form)
      if (res.error) { toast.error(res.error); return }
      if (res.data) setEvents(prev => [...prev, res.data as WeddingEvent])
      setForm(EMPTY_EVENT)
      setShowForm(false)
      toast.success('Event added')
    })
  }

  function handleDelete(eventId: string) {
    if (!confirm('Remove this event?')) return
    startTransition(async () => {
      const res = await deleteEvent(eventId)
      if (res.error) { toast.error(res.error); return }
      setEvents(prev => prev.filter(e => e.id !== eventId))
      toast.success('Event removed')
    })
  }

  return (
    <div>
      {events.length === 0 && !showForm ? (
        <div className="border border-dashed border-blush p-8 text-center rounded-sm">
          <p className="text-slate text-sm mb-4">No events added yet. Add your ceremony, reception and more.</p>
          <button onClick={() => setShowForm(true)} className="btn-ghost flex items-center gap-2 mx-auto">
            <Plus size={14} /> Add first event
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map(ev => (
            <div key={ev.id} className="card flex items-start justify-between gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-deep text-sm">{ev.title}</h4>
                  {!ev.is_public && (
                    <span className="text-[10px] tracking-widest uppercase bg-slate/10 text-slate px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate">
                  {ev.event_date && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {formatDate(ev.event_date)}
                      {ev.start_time && ` · ${formatTime(ev.start_time)}`}
                      {ev.end_time && ` – ${formatTime(ev.end_time)}`}
                    </span>
                  )}
                  {ev.venue_name && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />{ev.venue_name}
                    </span>
                  )}
                  {ev.dress_code && (
                    <span className="text-slate/60">Dress code: {ev.dress_code}</span>
                  )}
                </div>
                {ev.description && (
                  <p className="text-xs text-slate/70 mt-1 line-clamp-2">{ev.description}</p>
                )}
              </div>
              <button onClick={() => handleDelete(ev.id)}
                className="text-slate/30 hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="card mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-lg font-light text-deep">New event</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate hover:text-rose transition-colors">
              <X size={16} />
            </button>
          </div>
          <div>
            <label className="label">Event name *</label>
            <input className="input-field" placeholder="e.g. Ceremony, Reception, Rehearsal Dinner" required
              value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Date</label>
              <input className="input-field" type="date"
                value={form.event_date} onChange={e => setForm(f => ({...f, event_date: e.target.value}))} />
            </div>
            <div>
              <label className="label">Start time</label>
              <input className="input-field" type="time"
                value={form.start_time} onChange={e => setForm(f => ({...f, start_time: e.target.value}))} />
            </div>
            <div>
              <label className="label">End time</label>
              <input className="input-field" type="time"
                value={form.end_time} onChange={e => setForm(f => ({...f, end_time: e.target.value}))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Venue name</label>
              <input className="input-field"
                value={form.venue_name} onChange={e => setForm(f => ({...f, venue_name: e.target.value}))} />
            </div>
            <div>
              <label className="label">Dress code</label>
              <input className="input-field" placeholder="e.g. Black tie, Smart casual"
                value={form.dress_code} onChange={e => setForm(f => ({...f, dress_code: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input-field"
              value={form.venue_address} onChange={e => setForm(f => ({...f, venue_address: e.target.value}))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none" rows={2}
              value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_public" checked={form.is_public}
              onChange={e => setForm(f => ({...f, is_public: e.target.checked}))}
              className="w-4 h-4 accent-rose" />
            <label htmlFor="is_public" className="text-sm text-slate cursor-pointer">
              Visible to all guests
            </label>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 text-center">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-rose flex-1 text-center disabled:opacity-60">
              {isPending ? 'Adding...' : 'Add event'}
            </button>
          </div>
        </form>
      ) : events.length > 0 && (
        <button onClick={() => setShowForm(true)}
          className="mt-4 flex items-center gap-2 text-xs tracking-widest uppercase text-slate hover:text-rose transition-colors">
          <Plus size={14} /> Add another event
        </button>
      )}
    </div>
  )
}
