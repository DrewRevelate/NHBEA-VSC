'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AboutSectionProps {
  title: string;
  content: string;
  imageURL?: string;
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="flex items-start space-x-4 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/60 transition-all duration-300">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-2">{title}</h4>
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedAboutSection({ title, content, imageURL }: AboutSectionProps) {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 -right-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  {title || "About NHBEA"}
                </span>
              </h2>
              
              <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed">
                {(content || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="font-light">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4 pt-6">
              <FeatureCard
                delay={200}
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                }
                title="64 Years of Excellence"
                description="Since 1960, dedicated to advancing business education in New Hampshire"
              />

              <FeatureCard
                delay={400}
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Statewide Network"
                description="Connecting educators across New Hampshire to share resources and best practices"
              />

              <FeatureCard
                delay={600}
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                }
                title="Innovation Focus"
                description="Leading the way in modern business education and emerging teaching methodologies"
              />
            </div>

            {/* CTA Section */}
            <div className="pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/membership/professional"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 hover:scale-105"
                >
                  Become a Member
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="/conference"
                  className="inline-flex items-center justify-center px-6 py-3 text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-white/50 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-all duration-300"
                >
                  View Conference
                </a>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative lg:order-first">
            {imageURL && imageURL.trim() !== '' ? (
              <div className="relative group">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-white/20 backdrop-blur-sm">
                  <Image
                    src={imageURL}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
              </div>
            ) : (
              // Fallback visual element when no image
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-12 shadow-lg">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-800">NHBEA</h3>
                      <p className="text-slate-600">New Hampshire Business Educators Association</p>
                      <div className="text-sm text-slate-500 font-medium">Est. 1960</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}