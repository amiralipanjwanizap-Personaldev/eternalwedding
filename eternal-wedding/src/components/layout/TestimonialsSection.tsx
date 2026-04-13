export function TestimonialsSection() {
  const testimonials = [
    { quote: 'Our guests couldn\'t stop talking about how beautiful our wedding site was. The RSVP system saved us so many hours of chasing people up.', couple: 'Zara & Kwame', location: 'Lagos, Nigeria' },
    { quote: 'Setting it up took less than an afternoon. The photo gallery on the wedding day was magical — everyone was uploading moments in real time.', couple: 'Priya & Daniel', location: 'Nairobi, Kenya' },
    { quote: 'Worth every penny. We had guests from four different countries and the travel section made coordinating everything so seamless.', couple: 'Fatima & Luca', location: 'Dar es Salaam, Tanzania' },
  ]
  return (
    <section className="bg-cream py-24 px-8 lg:px-16">
      <div className="section-eyebrow">Couples love us</div>
      <h2 className="font-display text-5xl font-light text-deep mb-12">
        Stories from our <em className="text-rose not-italic">community</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.couple} className="bg-white border border-blush p-8 relative">
            <span className="font-display text-7xl text-blush absolute top-2 left-5 leading-none select-none">"</span>
            <div className="text-xs tracking-wider text-gold mb-3">★★★★★</div>
            <p className="font-display text-lg italic leading-relaxed text-deep mt-4 mb-6">
              {t.quote}
            </p>
            <p className="text-xs tracking-widest uppercase text-rose">{t.couple} — {t.location}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
