import Link from 'next/link'

const plans = [
  {
    name: 'Classic', badge: 'Essentials', price: '39', featured: false,
    features: ['Wedding website', '50 design themes', 'RSVP management', 'Guest list up to 100', 'Photo gallery (50 photos)', 'Email notifications'],
  },
  {
    name: 'Complete', badge: 'Most Popular', price: '79', featured: true,
    features: ['Everything in Classic', '500+ premium themes', 'Digital invitations', 'Unlimited guests', 'Unlimited photos', 'Push notifications', 'Custom domain', 'Live photo streaming'],
  },
  {
    name: 'Luxury', badge: 'Premium', price: '149', featured: false,
    features: ['Everything in Complete', 'Dedicated designer', 'Bespoke theme design', 'Printed stationery set', 'Priority support', 'Video cover pages', 'Digital guestbook'],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-24 px-8 lg:px-16">
      <div className="section-eyebrow">Simple pricing</div>
      <h2 className="font-display text-5xl font-light text-deep mb-12">
        One payment. <em className="text-rose not-italic">Forever</em> yours.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-blush/30">
        {plans.map(p => (
          <div key={p.name} className={`p-10 flex flex-col relative ${p.featured ? 'bg-deep -mt-4 -mb-4 z-10' : 'bg-white'}`}>
            <span className={`text-xs tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4 w-fit ${p.featured ? 'bg-gold/20 text-gold' : 'bg-blush/40 text-slate'}`}>
              {p.badge}
            </span>
            <h3 className={`font-display text-3xl font-light mb-1 ${p.featured ? 'text-ivory' : 'text-deep'}`}>{p.name}</h3>
            <div className={`font-display text-5xl font-light mb-1 flex items-start gap-1 ${p.featured ? 'text-ivory' : 'text-deep'}`}>
              <sup className="text-xl mt-3">$</sup>{p.price}
            </div>
            <p className={`text-sm mb-8 ${p.featured ? 'text-ivory/50' : 'text-slate'}`}>one-time · lifetime access</p>
            <ul className="flex flex-col gap-3 flex-1">
              {p.features.map(f => (
                <li key={f} className={`text-sm flex items-start gap-2 ${p.featured ? 'text-ivory/70' : 'text-slate'}`}>
                  <span className={p.featured ? 'text-gold' : 'text-rose'}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className={`mt-8 block text-center px-6 py-3 text-xs tracking-widest uppercase transition-all ${p.featured ? 'bg-rose text-white hover:bg-gold' : 'border border-deep text-deep hover:bg-deep hover:text-ivory'}`}>
              Get started
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
