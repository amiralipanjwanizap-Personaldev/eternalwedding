'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 bg-ivory/92 backdrop-blur-md border-b border-rose/10 ${scrolled ? 'py-3 px-16' : 'py-5 px-16'}`}>
      <Link href="/" className="font-display text-2xl font-light tracking-widest text-deep">
        E<span className="text-rose italic">ternal</span>
      </Link>

      <ul className="hidden md:flex gap-10 list-none">
        {[['#features','Features'],['#themes','Themes'],['#how','How it works'],['#pricing','Pricing']].map(([href,label]) => (
          <li key={href}>
            <a href={href} className="text-xs tracking-widest uppercase text-slate hover:text-rose transition-colors font-body">
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <Link href="/auth/login" className="text-xs tracking-widest uppercase text-slate hover:text-rose transition-colors font-body">
          Login
        </Link>
        <Link href="/auth/signup" className="btn-primary">
          Get started
        </Link>
      </div>
    </nav>
  )
}
