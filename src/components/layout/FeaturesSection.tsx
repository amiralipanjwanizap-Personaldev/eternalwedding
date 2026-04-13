// FeaturesSection
export function FeaturesSection() {
  const features = [
    { icon: '💌', title: 'Digital Invitations', desc: 'Send stunning save-the-dates and invitations matching your theme. Track opens in real time.' },
    { icon: '🌐', title: 'Wedding Website', desc: 'Beautiful, mobile-responsive site. Share your story, schedule, travel info and registry.' },
    { icon: '✅', title: 'RSVP Management', desc: 'Collect RSVPs with custom questions — meal choices, song requests, dietary needs.' },
    { icon: '📸', title: 'Photo Sharing', desc: 'Private gallery where guests upload and share moments. Stream live via Airplay on the day.' },
    { icon: '🔔', title: 'Notifications', desc: 'Keep guests informed with push notifications and email updates automatically.' },
    { icon: '🔒', title: 'Privacy Controls', desc: 'Control exactly what each guest sees. Hide events from specific guests. Password protect.' },
  ]
  return (
    <section id="features" className="bg-deep py-24 px-8 lg:px-16">
      <div className="section-eyebrow" style={{ color: '#C9A96E' }}>
        <span className="w-6 h-px bg-gold block" />
        Everything you need
      </div>
      <h2 className="font-display text-5xl font-light text-ivory mb-12">
        One suite. <em className="text-gold">Infinite</em> possibilities.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        {features.map(f => (
          <div key={f.title} className="p-10 border border-white/5 hover:bg-white/5 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-xl mb-5">{f.icon}</div>
            <h3 className="font-display text-xl font-light text-ivory mb-2">{f.title}</h3>
            <p className="text-sm leading-relaxed text-ivory/50">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
