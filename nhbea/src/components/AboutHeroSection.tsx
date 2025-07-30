'use client';

interface AboutHeroSectionProps {
  className?: string;
}

export default function AboutHeroSection({ className = '' }: AboutHeroSectionProps) {
  return (
    <section 
      className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${className}`}
      role="banner"
      aria-label="About NHBEA hero section"
    >
      {/* Clean royal blue brand background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]">
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
      

      {/* Skip to content link for accessibility */}
      <a 
        href="#about-main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 nhbea-button-primary z-50"
      >
        Skip to main content
      </a>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Split layout for storytelling */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left: Story Content */}
          <div className="space-y-8">
            {/* Clean section indicator */}
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.1s_forwards]">
              <div className="inline-flex items-center space-x-3 text-white/90">
                <div className="w-8 h-px bg-white/80"></div>
                <span className="text-sm font-medium tracking-wider uppercase">About NHBEA</span>
              </div>
            </div>

            {/* Main heading with proper history */}
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                64 Years of 
                <span className="block">Educational Excellence</span>
              </h1>
            </div>
            
            {/* Accurate institutional narrative */}
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
              <p className="text-lg md:text-xl text-white leading-relaxed max-w-2xl">
                Since 1960, the New Hampshire Business Education Association has served as the 
                premier professional organization for business educators across our state. We're 
                dedicated to advancing excellence in business education and empowering the next 
                generation of business leaders.
              </p>
            </div>

            {/* Key highlights as narrative points */}
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-white/80 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-white/90">
                    <span className="font-semibold text-white">Established 1960</span> by dedicated educators 
                    committed to advancing the highest standards of business education excellence.
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-white/80 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-white/90">
                    <span className="font-semibold text-white">500+ active members</span> representing 
                    educational institutions and professional organizations across New Hampshire.
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-white/80 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-white/90">
                    <span className="font-semibold text-white">Annual awards program</span> honoring 
                    exceptional contributions to educational excellence and career achievement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Timeline/Stats */}
          <div className="space-y-8">
            {/* Clean stats showcase */}
            <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Our Impact</h3>
                
                <div className="space-y-6">
                  {/* Established */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                      <span className="text-white font-bold text-lg">64</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Years of Excellence</div>
                      <div className="text-sm text-white/80">Serving NH educators since 1960</div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                      <span className="text-white font-bold text-lg">500+</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Active Members</div>
                      <div className="text-sm text-white/80">Educators & professionals</div>
                    </div>
                  </div>

                  {/* Schools */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20">
                      <span className="text-white font-bold text-lg">50+</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Partner Schools</div>
                      <div className="text-sm text-white/80">Across New Hampshire</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}