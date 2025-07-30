'use client';

import { useState, useEffect } from 'react';

interface MissionSectionProps {
  title?: string;
  content?: string;
  imageURL?: string;
}

export default function EnhancedMissionSection({ 
  title = "Our Mission",
  content = "The New Hampshire Business Educators Association is dedicated to promoting excellence in business education throughout the state.",
  imageURL 
}: MissionSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const missionPillars = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Educational Excellence",
      description: "Promoting the highest standards in business education curriculum and innovative teaching methodologies that prepare students for tomorrow's challenges.",
      color: "from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Professional Development",
      description: "Supporting continuous growth and career advancement through workshops, certifications, and networking opportunities for our educator community.",
      color: "from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)]"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Community Impact",
      description: "Building stronger communities through quality business education, student success initiatives, and meaningful industry partnerships.",
      color: "from-[var(--nhbea-accent-green)] to-[var(--nhbea-accent-green-dark)]"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white via-slate-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[var(--nhbea-royal-blue)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[var(--nhbea-accent-orange)]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced title section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block px-4 py-2 bg-[var(--nhbea-royal-blue)]/10 text-[var(--nhbea-royal-blue)] rounded-full text-sm font-semibold mb-6">
              What Drives Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Our <span className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] bg-clip-text text-transparent">Mission</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
                {content}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through professional development, networking opportunities, and innovative programs, we empower educators to inspire the next generation of business leaders while fostering strong connections between academia and industry.
              </p>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-accent-orange)] rounded-full mx-auto mt-8"></div>
          </div>

          {/* Enhanced mission pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {missionPillars.map((pillar, index) => (
              <div 
                key={index}
                className={`group transition-all duration-700 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 h-full">
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {pillar.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[var(--nhbea-royal-blue)] transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced call to action */}
          <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-3xl p-12 text-white shadow-2xl">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Make an Impact?
                </h3>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Join our community of dedicated educators and help shape the future of business education in New Hampshire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/membership/professional"
                    className="group px-8 py-4 bg-[var(--nhbea-accent-orange)] text-white font-bold rounded-2xl hover:bg-[var(--nhbea-accent-orange-dark)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[var(--nhbea-accent-orange)]/25 relative overflow-hidden"
                  >
                    <span className="relative z-10">Join Our Mission</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--nhbea-accent-orange-dark)] to-[var(--nhbea-accent-orange)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  <a 
                    href="/conference"
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Events
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}