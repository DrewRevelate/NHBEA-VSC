import Link from 'next/link';
import { Sponsor } from '@/types/sponsors';
import SponsorImage from './SponsorImage';

interface SponsorsSectionProps {
  sponsors: Sponsor[];
}

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header with brand styling */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-6">
            Our Sponsors
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            We are grateful to our sponsors who support business education in New Hampshire
          </p>
        </div>
        
        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 mb-16">
          {sponsors.map((sponsor, index) => (
            <Link
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block opacity-0 animate-[fadeInUp_0.6s_ease-out_${index * 100}ms_forwards]`}
            >
              <div className="relative bg-white rounded-2xl shadow-lg border-2 border-[var(--color-border-primary)] p-8 aspect-square flex items-center justify-center group-hover:scale-105 group-hover:shadow-xl group-hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-500">
                {/* Brand-consistent hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 to-[var(--nhbea-royal-blue-light)]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <SponsorImage
                  logoURL={sponsor.logoURL}
                  sponsorName={sponsor.name}
                />
              </div>
              
              {/* Brand-consistent tooltip */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-[var(--nhbea-royal-blue-dark)] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                {sponsor.name}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[var(--nhbea-royal-blue-dark)] rotate-45"></div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Brand-consistent Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-white rounded-3xl p-8 lg:p-12 shadow-xl border-2 border-[var(--color-border-primary)] hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--nhbea-royal-blue-deeper)]">
              Interested in becoming a sponsor?
            </h3>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-md leading-relaxed">
              Join our community of supporters and help shape the future of business education.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-semibold rounded-2xl hover:from-[var(--nhbea-accent-orange-dark)] hover:to-[var(--nhbea-accent-orange)] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Contact Us
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}