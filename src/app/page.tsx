import Link from 'next/link'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { HeroSection } from '@/components/layout/HeroSection'
import { FeaturesSection } from '@/components/layout/FeaturesSection'
import { ThemesSection } from '@/components/layout/ThemesSection'
import { HowItWorksSection } from '@/components/layout/HowItWorksSection'
import { PricingSection } from '@/components/layout/PricingSection'
import { TestimonialsSection } from '@/components/layout/TestimonialsSection'
import { MarketingFooter } from '@/components/layout/MarketingFooter'

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <HeroSection />
      <FeaturesSection />
      <ThemesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />

      {/* CTA Band */}
      <section className="bg-rose py-20 px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display text-[12rem] text-white/5 leading-none select-none">♥</span>
        </div>
        <div className="relative">
          <h2 className="font-display text-5xl font-light text-white mb-4">
            Your love deserves to be celebrated beautifully
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join thousands of couples who've created their perfect wedding suite with Eternal
          </p>
          <Link href="/auth/signup" className="bg-white text-rose px-10 py-4 text-sm tracking-widest uppercase hover:bg-deep hover:text-white transition-colors font-body inline-block">
            Start your wedding site — it's free to try
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}
