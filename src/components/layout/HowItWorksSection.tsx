export function HowItWorksSection() {
  const steps = [
    { num: '1', title: 'Choose a design', desc: 'Browse 500+ gorgeous themes and pick the one that speaks to your style. Customise colours, fonts and layout instantly.' },
    { num: '2', title: 'Add your details', desc: 'Enter your wedding info — date, venue, schedule, story, travel details, registry links and more.' },
    { num: '3', title: 'Invite your guests', desc: 'Upload your guest list and send digital invitations. Collect RSVPs and manage everything from your dashboard.' },
    { num: '4', title: 'Celebrate together', desc: 'On the day, guests share photos in your private gallery. Relive it all forever after.' },
  ]
  return (
    <section id="how" className="bg-ivory py-24 px-8 lg:px-16">
      <div className="section-eyebrow">Getting started</div>
      <h2 className="font-display text-5xl font-light text-deep mb-16">
        Up and running in <em className="text-rose not-italic">minutes</em>
      </h2>
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-blush" />
        {steps.map(s => (
          <div key={s.num} className="text-center relative">
            <div className="w-14 h-14 rounded-full border-2 border-rose flex items-center justify-center mx-auto mb-6 bg-ivory relative z-10">
              <span className="font-display text-2xl font-light text-rose">{s.num}</span>
            </div>
            <h3 className="font-display text-xl font-light text-deep mb-3">{s.title}</h3>
            <p className="text-sm leading-relaxed text-slate">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
