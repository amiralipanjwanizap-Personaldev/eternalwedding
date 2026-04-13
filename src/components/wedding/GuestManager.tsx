'use client'
import { useState, useTransition } from 'react'
import { addGuest, updateGuest, deleteGuest } from '@/lib/actions'
import type { Guest, GuestForm, RSVPStatus } from '@/types'
import toast from 'react-hot-toast'
import { UserPlus, Search, Trash2, Edit2, Mail, Check, Clock, X, Download } from 'lucide-react'

const EMPTY_FORM: GuestForm = {
  first_name: '', last_name: '', email: '', phone: '',
  group_name: '', plus_one: false, plus_one_name: '',
  dietary_notes: '', notes: '',
}

const STATUS_CONFIG: Record<RSVPStatus, { label: string; color: string; icon: React.ReactNode }> = {
  attending: { label: 'Attending',  color: 'bg-green-50 text-green-700',   icon: <Check size={11} /> },
  declined:  { label: 'Declined',   color: 'bg-red-50 text-red-600',       icon: <X size={11} /> },
  pending:   { label: 'Pending',    color: 'bg-gold-light/60 text-slate',  icon: <Clock size={11} /> },
}

export function GuestManager({ weddingId, initialGuests }: {
  weddingId: string
  initialGuests: Guest[]
}) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<RSVPStatus | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [form, setForm] = useState<GuestForm>(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()

  const filtered = guests.filter(g => {
    const matchSearch = !search || [g.first_name, g.last_name, g.email, g.group_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || g.rsvp_status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    all: guests.length,
    attending: guests.filter(g => g.rsvp_status === 'attending').length,
    pending:   guests.filter(g => g.rsvp_status === 'pending').length,
    declined:  guests.filter(g => g.rsvp_status === 'declined').length,
  }

  function openAdd() {
    setEditingGuest(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(guest: Guest) {
    setEditingGuest(guest)
    setForm({
      first_name: guest.first_name, last_name: guest.last_name ?? '',
      email: guest.email ?? '', phone: guest.phone ?? '',
      group_name: guest.group_name ?? '', plus_one: guest.plus_one,
      plus_one_name: guest.plus_one_name ?? '',
      dietary_notes: guest.dietary_notes ?? '', notes: guest.notes ?? '',
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      if (editingGuest) {
        const res = await updateGuest(editingGuest.id, form)
        if (res.error) { toast.error(res.error); return }
        setGuests(gs => gs.map(g => g.id === editingGuest.id ? { ...g, ...form } : g))
        toast.success('Guest updated')
      } else {
        const res = await addGuest(weddingId, form)
        if (res.error) { toast.error(res.error); return }
        if (res.data) setGuests(gs => [res.data as Guest, ...gs])
        toast.success('Guest added')
      }
      setShowModal(false)
    })
  }

  function handleDelete(guest: Guest) {
    if (!confirm(`Remove ${guest.first_name} ${guest.last_name ?? ''}?`)) return
    startTransition(async () => {
      const res = await deleteGuest(guest.id)
      if (res.error) { toast.error(res.error); return }
      setGuests(gs => gs.filter(g => g.id !== guest.id))
      toast.success('Guest removed')
    })
  }

  function exportCSV() {
    const headers = ['First Name','Last Name','Email','Phone','Group','RSVP','Meal','Dietary','Plus One']
    const rows = guests.map(g => [
      g.first_name, g.last_name ?? '', g.email ?? '', g.phone ?? '',
      g.group_name ?? '', g.rsvp_status, g.meal_choice ?? '',
      g.dietary_notes ?? '', g.plus_one ? (g.plus_one_name ?? 'Yes') : 'No',
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'guest-list.csv'
    a.click()
  }

  return (
    <div>
      {/* Stats + actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(['all','attending','pending','declined'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all ${
                filter === f ? 'bg-deep text-ivory border-deep' : 'border-blush text-slate hover:border-rose hover:text-rose'
              }`}>
              {f} <span className="ml-1 opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-ghost flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <UserPlus size={14} /> Add guest
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/50" />
        <input className="input-field pl-10" placeholder="Search by name, email or group..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white border border-blush overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-2xl font-light text-deep mb-2">No guests yet</p>
            <p className="text-slate text-sm mb-6">Add your first guest to get started</p>
            <button onClick={openAdd} className="btn-primary">Add first guest</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush bg-ivory/50">
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-slate font-normal">Name</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-slate font-normal">Email</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-slate font-normal">Group</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-slate font-normal">RSVP</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-slate font-normal">Meal</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-slate font-normal">+1</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => {
                  const status = STATUS_CONFIG[g.rsvp_status]
                  return (
                    <tr key={g.id} className={`border-b border-blush/40 hover:bg-ivory/50 transition-colors ${i % 2 === 0 ? '' : 'bg-ivory/20'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blush/40 flex items-center justify-center text-xs font-medium text-deep flex-shrink-0">
                            {g.first_name[0]}{g.last_name?.[0] ?? ''}
                          </div>
                          <span className="text-sm text-deep font-medium">{g.first_name} {g.last_name ?? ''}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {g.email ? (
                          <a href={`mailto:${g.email}`} className="text-sm text-slate hover:text-rose flex items-center gap-1">
                            <Mail size={12} />{g.email}
                          </a>
                        ) : <span className="text-slate/40 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate">{g.group_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.color}`}>
                          {status.icon}{status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate">{g.meal_choice ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{g.plus_one ? (g.plus_one_name || '✓') : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(g)} className="p-1.5 text-slate/50 hover:text-rose transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(g)} className="p-1.5 text-slate/50 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-deep/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blush">
              <h2 className="font-display text-2xl font-light text-deep">
                {editingGuest ? 'Edit guest' : 'Add guest'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate hover:text-rose transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First name *</label>
                  <input className="input-field" required value={form.first_name}
                    onChange={e => setForm(f => ({...f, first_name: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Last name</label>
                  <input className="input-field" value={form.last_name}
                    onChange={e => setForm(f => ({...f, last_name: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input-field" type="email" value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" value={form.phone}
                    onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Group / Family</label>
                  <input className="input-field" placeholder="e.g. Smith Family" value={form.group_name}
                    onChange={e => setForm(f => ({...f, group_name: e.target.value}))} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="plus_one" checked={form.plus_one}
                  onChange={e => setForm(f => ({...f, plus_one: e.target.checked}))}
                  className="w-4 h-4 accent-rose" />
                <label htmlFor="plus_one" className="text-sm text-slate cursor-pointer">Bringing a plus one</label>
              </div>
              {form.plus_one && (
                <div>
                  <label className="label">Plus one name</label>
                  <input className="input-field" value={form.plus_one_name}
                    onChange={e => setForm(f => ({...f, plus_one_name: e.target.value}))} />
                </div>
              )}
              <div>
                <label className="label">Dietary notes</label>
                <input className="input-field" placeholder="Allergies, preferences..." value={form.dietary_notes}
                  onChange={e => setForm(f => ({...f, dietary_notes: e.target.value}))} />
              </div>
              <div>
                <label className="label">Internal notes</label>
                <textarea className="input-field resize-none" rows={2} value={form.notes}
                  onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 text-center">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn-rose flex-1 text-center disabled:opacity-60">
                  {isPending ? 'Saving...' : editingGuest ? 'Update guest' : 'Add guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
