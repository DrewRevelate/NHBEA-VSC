'use client';

import { useState, useEffect } from 'react';

interface StatisticItemProps {
  value: string;
  label: string;
  delay: number;
}

function StatisticItem({ value, label, delay }: StatisticItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`text-center transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="bg-white rounded-2xl p-8 border-l-4 border-[var(--nhbea-royal-blue)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-l-[var(--nhbea-royal-blue-dark)] group">
        <div className="text-4xl md:text-5xl font-bold mb-3">
          <span className="text-[var(--nhbea-royal-blue)] group-hover:text-[var(--nhbea-royal-blue-dark)] transition-colors duration-300">
            {value}
          </span>
        </div>
        <div className="text-[var(--nhbea-gray-600)] font-semibold text-lg">{label}</div>
      </div>
    </div>
  );
}

export default function StatisticsSection() {
  return (
    <section className="relative py-20 bg-[var(--color-bg-primary)] overflow-hidden">
      {/* Brand-consistent background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/10 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-[var(--nhbea-royal-blue-light)]/10 to-transparent rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[var(--nhbea-royal-blue-deeper)]">
              NHBEA by the Numbers
            </span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Join a thriving community of business educators making a difference across New Hampshire
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <StatisticItem
            value="250+"
            label="Active Members"
            delay={200}
          />
          <StatisticItem
            value="102"
            label="Years of Excellence"
            delay={400}
          />
          <StatisticItem
            value="2"
            label="Prestigious Awards"
            delay={600}
          />
          <StatisticItem
            value="1"
            label="Annual Conference"
            delay={800}
          />
        </div>

        {/* Brand-consistent Call-to-action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 border-2 border-[var(--nhbea-royal-blue)]/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--nhbea-royal-blue-light)] to-[var(--nhbea-royal-blue)] rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--nhbea-accent-gold)] to-[var(--nhbea-accent-gold-dark)] rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
            </div>
            <span className="text-[var(--color-text-primary)] font-semibold group-hover:text-[var(--nhbea-royal-blue)] transition-colors duration-300">Join 250+ educators shaping the future</span>
          </div>
        </div>
      </div>
    </section>
  );
}