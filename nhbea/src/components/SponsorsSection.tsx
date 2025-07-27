import Image from 'next/image';
import Link from 'next/link';
import { Sponsor } from '@/types/sponsors';

interface SponsorsSectionProps {
  sponsors: Sponsor[];
}

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50/30 to-indigo-50/30"></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Our Sponsors
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            We are grateful to our sponsors who support business education in New Hampshire
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
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
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-900/10 border border-white/20 p-8 aspect-square flex items-center justify-center group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-900/20 transition-all duration-500">
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <Image
                  src={sponsor.logoURL}
                  alt={`${sponsor.name} logo`}
                  width={160}
                  height={160}
                  className="relative z-10 object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Create a simple SVG placeholder instead of relying on external file
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA0MEMyMCA0MCA0MCA2MCA0MCA4MEM0MCAxMDAgNjAgMTIwIDgwIDEyMEMxMDAgMTIwIDEyMCAxMDAgMTIwIDgwQzEyMCA2MCAxMDAgNDAgODAgNDBaIiBmaWxsPSIjOTlBM0FlIi8+CjwvdWU+';
                  }}
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
                {sponsor.name}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl shadow-blue-900/10 border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              Interested in becoming a sponsor?
            </h3>
            <p className="text-lg text-slate-600 max-w-md">
              Join our community of supporters and help shape the future of business education.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
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