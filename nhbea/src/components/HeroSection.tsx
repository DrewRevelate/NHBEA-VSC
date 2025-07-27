import Image from 'next/image';
import { HomepageContent } from '@/types/content';

interface HeroSectionProps {
  content: HomepageContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Hero section"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
      </div>
      
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse [will-change:opacity]"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full animate-pulse delay-1000 [will-change:opacity]"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full animate-bounce delay-500 [will-change:transform]"></div>
      </div>

      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-50"
      >
        Skip to main content
      </a>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading with improved typography */}
          <div className="mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                {content.heroTitle}
              </span>
            </h1>
          </div>
          
          {/* Subtitle with better spacing */}
          <div className="mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              {content.heroSubtitle}
            </p>
          </div>

          {/* Hero image with modern styling */}
          {content.heroImageURL && (
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/20 border border-white/20 backdrop-blur-sm">
                  <Image
                    src={content.heroImageURL}
                    alt="NHBEA Hero"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
          </div>
          <span className="text-sm text-slate-500 font-medium">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}