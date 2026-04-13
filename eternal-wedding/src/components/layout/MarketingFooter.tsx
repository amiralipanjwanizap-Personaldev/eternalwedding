import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="bg-deep text-ivory/60 py-16 px-8 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <div className="font-display text-2xl font-light tracking-widest text-ivory mb-4">
            E<span className="text-gold italic">ternal</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            The complete wedding suite for modern couples. Beautiful by design, effortless by nature.
          </p>
        </div>
        {[
          { heading: 'Product', links: [['#features','Features'],['#themes','Themes'],['#pricing','Pricing'],['#','Digital Invites'],['#','Mobile App']] },
          { heading: 'Planning', links: [['#','Wedding Timeline'],['#','Budget Guide'],['#','Registry Ideas'],['#','Travel Tips'],['#','Etiquette Guide']] },
          { heading: 'Support',  links: [['/auth/signup','Get Started'],['/auth/login','Login'],['#','Help Centre'],['#','Privacy Policy'],['#','Terms']] },
        ].map(col => (
          <div key={col.heading}>
            <h4 className="text-xs tracking-widest uppercase text-ivory mb-5">{col.heading}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-ivory/50 hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory/30">
        <span>© 2026 Eternal Wedding Suite. All rights reserved.</span>
        <span>Made with ♥ for couples everywhere</span>
      </div>
    </footer>
  )
}
