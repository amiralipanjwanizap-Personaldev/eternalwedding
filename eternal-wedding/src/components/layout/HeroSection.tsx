import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-20">
      {/* Left */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-20">
        <div className="section-eyebrow">Your complete wedding suite</div>
        <h1 className="font-display text-5xl lg:text-7xl font-light leading-[1.05] text-deep mb-6">
          Where your love <em className="text-rose not-italic font-light">story</em> begins
        </h1>
        <p className="text-base leading-relaxed text-slate max-w-md mb-10">
          Beautiful wedding websites, digital invitations, guest RSVP, photo sharing and more — all in one elegantly designed place.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/auth/signup" className="btn-primary">Create your wedding</Link>
          <a href="#demo" className="btn-secondary">See a demo</a>
        </div>

        <div className="flex gap-10 mt-12 pt-8 border-t border-blush">
          {[['500+','Designs'],['200k+','Couples'],['4.9★','Rated']].map(([num,label]) => (
            <div key={label} className="text-center">
              <span className="font-display text-3xl font-light text-deep block">{num}</span>
              <span className="text-xs tracking-widest uppercase text-slate">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Phone mockup */}
      <div className="relative bg-cream hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(232,197,176,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(201,169,110,0.25) 0%, transparent 50%)' }}
        />
        <div className="relative animate-float">
          <div className="w-[220px] bg-white rounded-[32px] border-[8px] border-deep overflow-hidden"
            style={{ boxShadow: '40px 40px 0 #E8C5B0, -20px -20px 0 #F0DFB8' }}>
            <div className="bg-gradient-to-br from-ivory to-cream p-4 min-h-[420px] flex flex-col gap-3">
              <div className="text-center py-1">
                <div className="font-display text-xl font-light text-deep">Amara & James</div>
                <div className="text-[10px] tracking-[0.15em] uppercase text-rose mt-0.5">14 · June · 2026</div>
              </div>
              <div className="bg-blush rounded-lg h-24 flex items-center justify-center font-display italic text-deep/60 text-sm">
                Our Story
              </div>
              {[
                { icon: '📍', title: 'Venue', sub: 'The Grand Pavilion, Nairobi' },
                { icon: '✉️', title: 'RSVP Open', sub: '42 guests confirmed' },
                { icon: '📸', title: 'Photo Gallery', sub: '128 photos shared' },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-md p-2.5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold-light flex items-center justify-center text-sm flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-deep">{item.title}</div>
                    <div className="text-[10px] text-slate">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 right-0 font-display text-[8rem] font-light leading-none pointer-events-none select-none"
          style={{ color: 'rgba(196,130,106,0.07)' }}>
          Love
        </div>
      </div>
    </section>
  )
}
