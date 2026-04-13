import Link from 'next/link'

const themes = [
  { id: 'rose-garden',    label: 'Rose Garden',    gradient: 'linear-gradient(135deg,#E8D5C4,#C4826A,#3D2C2C)' },
  { id: 'botanical',      label: 'Botanical',      gradient: 'linear-gradient(135deg,#D4E8D4,#7A9E7A,#2C3D2C)' },
  { id: 'golden-hour',    label: 'Golden Hour',    gradient: 'linear-gradient(135deg,#E8E0D0,#C9A96E,#2C2C3D)' },
  { id: 'midnight-blue',  label: 'Midnight Blue',  gradient: 'linear-gradient(135deg,#D4D8E8,#6A7AC4,#2C2C3D)' },
  { id: 'blush-romantic', label: 'Blush Romantic', gradient: 'linear-gradient(135deg,#F5E6E8,#D4889A,#3D2C30)' },
  { id: 'desert-sand',    label: 'Desert Sand',    gradient: 'linear-gradient(135deg,#E8E0C4,#C4A86A,#3D3020)' },
  { id: 'ocean-breeze',   label: 'Ocean Breeze',   gradient: 'linear-gradient(135deg,#E0E8E8,#6AAAC4,#203038)' },
  { id: 'monochrome',     label: 'Monochrome',     gradient: 'linear-gradient(135deg,#EEE8E8,#888,#222)' },
]

export function ThemesSection() {
  return (
    <section id="themes" className="bg-white py-24 px-8 lg:px-16">
      <div className="section-eyebrow">Design themes</div>
      <h2 className="font-display text-5xl font-light text-deep mb-2">
        Pick a look as <em className="text-rose not-italic">unique</em> as your love
      </h2>
      <p className="text-slate text-base leading-relaxed max-w-md mt-3 mb-12">
        Choose from hundreds of curated designs. No design skills needed — simply enter your content and your site is ready.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {themes.map(t => (
          <div key={t.id} className="group cursor-pointer">
            <div className="relative h-48 rounded-sm overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105" style={{ background: t.gradient }} />
              <div className="absolute inset-0 bg-deep/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link href="/auth/signup" className="text-xs tracking-widest uppercase text-ivory border border-ivory/60 px-4 py-2">
                  Select →
                </Link>
              </div>
            </div>
            <p className="text-xs tracking-widest uppercase text-slate mt-2">{t.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
