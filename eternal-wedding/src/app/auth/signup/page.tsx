'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    toast.success('Account created! Welcome to Eternal.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-deep p-16">
        <Link href="/" className="font-display text-2xl font-light tracking-widest text-ivory">
          E<span className="text-gold italic">ternal</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl font-light text-ivory leading-tight mb-6">
            Begin your beautiful <em className="text-rose">love story</em> here
          </h2>
          <p className="text-ivory/50 text-sm leading-relaxed max-w-sm">
            Join thousands of couples who've created unforgettable wedding experiences with Eternal.
          </p>
          <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
            {[['200k+','Couples'],['500+','Themes'],['4.9★','Rating']].map(([n,l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-light text-gold">{n}</div>
                <div className="text-xs tracking-widest uppercase text-ivory/40 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-ivory/20 text-xs">© 2026 Eternal Wedding Suite</p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-8 py-16 bg-ivory">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="font-display text-xl font-light tracking-widest text-deep lg:hidden block mb-8">
              E<span className="text-rose italic">ternal</span>
            </Link>
            <h1 className="font-display text-3xl font-light text-deep">Create your account</h1>
            <p className="text-slate text-sm mt-2">Free to start — no credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="label">Full name</label>
              <input className="input-field" type="text" placeholder="Your name" required
                value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} />
            </div>
            <div>
              <label className="label">Email address</label>
              <input className="input-field" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input-field" type="password" placeholder="Minimum 8 characters" required minLength={8}
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
            </div>
            <button type="submit" disabled={loading} className="btn-rose w-full text-center mt-2 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create my wedding suite →'}
            </button>
          </form>

          <p className="text-sm text-slate mt-6 text-center">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-rose hover:underline">Sign in</Link>
          </p>

          <p className="text-xs text-slate/50 mt-8 text-center leading-relaxed">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
