'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur-sm relative z-50">
      <div className="nhbea-container">
        <nav className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200"
          >
            NHBEA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nhbea-nav-link">
              Home
            </Link>
            <Link href="/about" className="nhbea-nav-link">
              About
            </Link>
            <Link href="/conference" className="nhbea-nav-link">
              Conference
            </Link>
            <Link href="/awards" className="nhbea-nav-link">
              Awards
            </Link>
            <Link href="/hall-of-fame" className="nhbea-nav-link">
              Hall of Fame
            </Link>
            
            {/* Membership Dropdown */}
            <div className="relative group">
              <button className="nhbea-nav-link flex items-center space-x-1">
                <span>Membership</span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div className="py-2">
                  <Link 
                    href="/membership/professional" 
                    className="block px-4 py-3 text-sm text-card-foreground hover:bg-muted transition-colors"
                  >
                    Professional Membership
                  </Link>
                  <Link 
                    href="/membership/student" 
                    className="block px-4 py-3 text-sm text-card-foreground hover:bg-muted transition-colors"
                  >
                    Student Membership
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link 
              href="/membership/professional" 
              className="nhbea-button-primary text-sm"
            >
              Join Today
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center w-8 h-8 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="nhbea-nav-link block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="nhbea-nav-link block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/conference" 
                className="nhbea-nav-link block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Conference
              </Link>
              <Link 
                href="/awards" 
                className="nhbea-nav-link block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Awards
              </Link>
              <Link 
                href="/hall-of-fame" 
                className="nhbea-nav-link block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Hall of Fame
              </Link>
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="text-sm font-medium text-muted-foreground mb-3">Membership</div>
                <Link 
                  href="/membership/professional" 
                  className="nhbea-nav-link block py-2 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Professional Membership
                </Link>
                <Link 
                  href="/membership/student" 
                  className="nhbea-nav-link block py-2 pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Student Membership
                </Link>
              </div>
              
              <Link 
                href="/membership/professional" 
                className="nhbea-button-primary w-full mt-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Today
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}