import Link from 'next/link';
import FooterNewsletterSignup from '@/components/FooterNewsletterSignup';
import { FooterLogo } from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-[var(--nhbea-royal-blue-dark)] text-white relative overflow-hidden mt-auto">
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
              <p className="text-white/80 leading-relaxed">
                The New Hampshire Business Education Association promotes excellence in business education throughout the state since 1923.
              </p>
            </div>
            
            {/* Organization Stats */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-white/70">
                <svg className="w-4 h-4 mr-2 text-[var(--nhbea-accent-gold)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Founded in 1923
              </div>
              <div className="flex items-center text-sm text-white/70">
                <svg className="w-4 h-4 mr-2 text-[var(--nhbea-accent-gold)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                Educators Across New Hampshire
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About NHBEA</span>
                </Link>
              </li>
              <li>
                <Link href="/conference" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Annual Conference</span>
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Awards Program</span>
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Hall of Fame</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Membership</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/membership/professional" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Professional</span>
                </Link>
              </li>
              <li>
                <Link href="/membership/student" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Student</span>
                </Link>
              </li>
              <li>
                <Link href="/membership/benefits" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Member Benefits</span>
                </Link>
              </li>
              <li>
                <Link href="/membership/renewal" className="text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Renewal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Stay Connected</h4>
            <p className="text-white/80 mb-6 leading-relaxed">
              Get updates on events, opportunities, and industry insights delivered to your inbox.
            </p>
            
            <FooterNewsletterSignup />
            
            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[var(--nhbea-accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Professional Development Since 1923
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
              <p className="text-white/70 text-sm">
                &copy; {new Date().getFullYear()} New Hampshire Business Education Association. All rights reserved.
              </p>
              <p className="text-white/60 text-xs mt-1">
                Advancing business education excellence across New Hampshire.
              </p>
              <p className="text-white/60 text-sm mt-2">
                Website by{' '}
                <a 
                  href="https://revelateoperations.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--nhbea-accent-gold)] hover:text-[var(--nhbea-accent-gold-light)] transition-colors duration-200"
                >
                  Drew Lambert of Revelate Operations, LLC
                </a>
              </p>
            </div>
            
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6">
              <Link href="/privacy" className="text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Contact Us
              </Link>
              <Link href="/sitemap" className="text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors duration-200 text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}