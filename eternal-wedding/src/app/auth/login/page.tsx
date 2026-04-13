'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) {
      toast.error('Invalid email or password')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-deep p-16">
        <Link href="/" className="font-display text-2xl font-light tracking-widest text-ivory">
          E<span className="text-gold italic">ternal</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl font-light text-ivory leading-tight mb-6">
            Welcome <em className="text-rose">back</em>
          </h2>
          <p className="text-ivory/50 text-sm leading-relaxed max-w-sm">
            Your wedding suite is waiting. Sign in to manage guests, update details and share your big day.
          </p>
        </div>
        <p className="text-ivory/20 text-xs">© 2026 Eternal Wedding Suite</p>
      </div>

      <div className="flex items-center justify-center px-8 py-16 bg-ivory">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="font-display text-xl font-light tracking-widest text-deep lg:hidden block mb-8">
              E<span className="text-rose italic">ternal</span>
            </Link>
            <h1 className="font-display text-3xl font-light text-deep">Sign in</h1>
            <p className="text-slate text-sm mt-2">Access your wedding dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="label">Email address</label>
              <input className="input-field" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input-field" type="password" placeholder="Your password" required
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
            </div>
            <button type="submit" disabled={loading} className="btn-rose w-full text-center mt-2 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="text-sm text-slate mt-6 text-center">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-rose hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
