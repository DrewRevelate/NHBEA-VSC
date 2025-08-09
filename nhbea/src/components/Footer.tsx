'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FooterLogo } from '@/components/Logo';
import { Suspense } from 'react';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';

// Dynamically import FooterNewsletterSignup to prevent SSR issues
const FooterNewsletterSignup = dynamic(
  () => import('@/components/FooterNewsletterSignup'),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-12 bg-white/10 rounded-lg mb-3"></div>
        <div className="h-12 bg-[var(--nhbea-accent-gold)]/50 rounded-lg"></div>
      </div>
    )
  }
);

export default function Footer() {
  return (
    <footer className="bg-[var(--nhbea-royal-blue-dark)] text-[var(--nhbea-gray-50)] relative overflow-hidden mt-auto">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--nhbea-royal-blue)] via-transparent to-[var(--nhbea-accent-gold)]"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <FooterLogo className="mb-4" />
              <p className="text-[var(--nhbea-gray-50)]/90 leading-relaxed text-sm">
                Empowering business educators and students across New Hampshire since 1923. Join our community of professionals dedicated to excellence in business education.
              </p>
            </div>
            
            {/* Organization Highlights */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-[var(--nhbea-gray-50)]">
                <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Serving educators since 1923</span>
              </div>
              <div className="flex items-center text-sm text-[var(--nhbea-gray-50)]">
                <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Professional development & networking</span>
              </div>
              <div className="flex items-center text-sm text-[var(--nhbea-gray-50)]">
                <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Supporting NH business education</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-[var(--nhbea-gray-50)]/80">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-[var(--nhbea-accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@nhbea.org" className="hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200">
                    info@nhbea.org
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-[var(--nhbea-gray-50)] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group text-sm">
                  <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About NHBEA</span>
                </Link>
              </li>
              <li>
                <Link href="/conference" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group text-sm">
                  <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Annual Conference</span>
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group text-sm">
                  <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Awards Program</span>
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group text-sm">
                  <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Hall of Fame</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Join NHBEA */}
          <div>
            <h4 className="text-lg font-bold text-[var(--nhbea-gray-50)] mb-6">Join NHBEA</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/membership/professional" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-start group text-sm">
                  <svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <div>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 font-medium block">Professional Membership</span>
                    <span className="text-xs text-[var(--nhbea-gray-50)]/60 mt-1 block">For educators & business professionals</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/membership/student" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-start group text-sm">
                  <svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <div>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 font-medium block">Student Membership</span>
                    <span className="text-xs text-[var(--nhbea-gray-50)]/60 mt-1 block">For students & recent graduates</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/membership/benefits" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group text-sm">
                  <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Member Benefits</span>
                </Link>
              </li>
              <li>
                <Link href="/membership/renewal" className="text-[var(--nhbea-gray-50)]/90 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group text-sm">
                  <svg className="w-4 h-4 mr-3 text-[var(--nhbea-accent-gold)]/60 group-hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Renew Membership</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Connected Section */}
          <div>
            <h4 className="text-lg font-bold text-[var(--nhbea-gray-50)] mb-6">Stay Connected</h4>
            <p className="text-[var(--nhbea-gray-50)]/90 mb-6 leading-relaxed text-sm">
              Join our mailing list for updates on conferences, professional development opportunities, and business education news.
            </p>
            
            <StandardErrorBoundary 
              fallback={(props) => (
                <div className="text-[var(--nhbea-gray-50)]/70 text-sm bg-white/5 rounded-lg p-4">
                  <p className="font-medium mb-2">Newsletter signup temporarily unavailable</p>
                  <p>Please contact us directly at <a href="mailto:info@nhbea.org" className="text-[var(--nhbea-accent-gold)] hover:underline">info@nhbea.org</a></p>
                </div>
              )}
            >
              <Suspense fallback={
                <div className="animate-pulse">
                  <div className="h-12 bg-white/10 rounded-lg mb-3"></div>
                  <div className="h-12 bg-[var(--nhbea-accent-gold)]/50 rounded-lg"></div>
                </div>
              }>
                <FooterNewsletterSignup />
              </Suspense>
            </StandardErrorBoundary>
            
            {/* Resources & Community */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h5 className="text-sm font-semibold text-[var(--nhbea-gray-50)] mb-4">What You'll Get</h5>
              <div className="space-y-3 text-sm">
                <div className="flex items-start text-[var(--nhbea-gray-50)]/80">
                  <svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--nhbea-accent-gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Conference announcements & early registration</span>
                </div>
                <div className="flex items-start text-[var(--nhbea-gray-50)]/80">
                  <svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--nhbea-accent-gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Professional development opportunities</span>
                </div>
                <div className="flex items-start text-[var(--nhbea-gray-50)]/80">
                  <svg className="w-4 h-4 mr-3 mt-0.5 text-[var(--nhbea-accent-gold)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Business education news & resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-[var(--nhbea-gray-50)]/70 text-sm">
                &copy; {new Date().getFullYear()} New Hampshire Business Education Association. All rights reserved.
              </p>
              <p className="text-[var(--nhbea-gray-50)]/60 text-xs mt-1">
                Advancing business education excellence across New Hampshire.
              </p>
              <p className="text-[var(--nhbea-gray-50)]/60 text-sm mt-2">
                Website by{' '}
                <a 
                  href="https://DrewLambert.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--nhbea-accent-gold)] hover:text-[var(--nhbea-accent-gold-light)] transition-colors duration-200"
                >
                  Drew Lambert
                </a>
              </p>
            </div>
            
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6">
              <Link href="/privacy" className="text-[var(--nhbea-gray-50)]/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-[var(--nhbea-gray-50)]/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-[var(--nhbea-gray-50)]/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Contact Us
              </Link>
              <Link href="/sitemap" className="text-[var(--nhbea-gray-50)]/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}