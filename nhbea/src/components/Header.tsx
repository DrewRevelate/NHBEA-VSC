'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderLogo } from '@/components/Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const pathname = usePathname();
  const membershipButtonRef = useRef<HTMLButtonElement>(null);
  const membershipMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMembershipOpen(false);
  }, [pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false);
      }
      
      if (isMembershipOpen && membershipMenuRef.current && !membershipMenuRef.current.contains(target) && !membershipButtonRef.current?.contains(target)) {
        setIsMembershipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isMembershipOpen]);

  // Handle menu link clicks
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsMembershipOpen(false);
  };

  // Handle keyboard navigation for membership dropdown
  const handleMembershipKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsMembershipOpen(!isMembershipOpen);
        break;
      case 'Escape':
        setIsMembershipOpen(false);
        membershipButtonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isMembershipOpen) {
          setIsMembershipOpen(true);
        } else {
          // Focus first link in dropdown
          const firstLink = membershipMenuRef.current?.querySelector('a');
          firstLink?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isMembershipOpen) {
          // Focus last link in dropdown
          const links = membershipMenuRef.current?.querySelectorAll('a');
          links?.[links.length - 1]?.focus();
        }
        break;
    }
  };

  // Handle keyboard navigation within dropdown menu
  const handleDropdownLinkKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    const links = membershipMenuRef.current?.querySelectorAll('a');
    const currentIndex = links ? Array.from(links).indexOf(event.currentTarget) : -1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (links && currentIndex < links.length - 1) {
          (links[currentIndex + 1] as HTMLElement).focus();
        } else {
          membershipButtonRef.current?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (links && currentIndex > 0) {
          (links[currentIndex - 1] as HTMLElement).focus();
        } else {
          membershipButtonRef.current?.focus();
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsMembershipOpen(false);
        membershipButtonRef.current?.focus();
        break;
      case 'Tab':
        // Let natural tab behavior work but close menu if tabbing out
        if (currentIndex === links!.length - 1 && !event.shiftKey) {
          setIsMembershipOpen(false);
        }
        break;
    }
  };

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur-sm relative z-50">
      <div className="nhbea-container">
        <nav className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <HeaderLogo />

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
            <div className="relative">
              <button 
                ref={membershipButtonRef}
                className={`nhbea-nav-link flex items-center space-x-1 ${isMembershipOpen ? 'text-primary' : ''}`}
                onClick={() => setIsMembershipOpen(!isMembershipOpen)}
                onKeyDown={handleMembershipKeyDown}
                aria-expanded={isMembershipOpen}
                aria-haspopup="true"
                aria-controls="membership-menu"
              >
                <span>Membership</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isMembershipOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                ref={membershipMenuRef}
                id="membership-menu"
                className={`absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg transition-all duration-200 z-[60] ${
                  isMembershipOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                role="menu"
                aria-labelledby="membership-button"
              >
                <div className="py-2">
                  <Link 
                    href="/membership/professional" 
                    className="block px-4 py-3 text-sm text-card-foreground hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                    onClick={handleLinkClick}
                    onKeyDown={handleDropdownLinkKeyDown}
                    role="menuitem"
                    tabIndex={isMembershipOpen ? 0 : -1}
                  >
                    Professional Membership
                  </Link>
                  <Link 
                    href="/membership/student" 
                    className="block px-4 py-3 text-sm text-card-foreground hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                    onClick={handleLinkClick}
                    onKeyDown={handleDropdownLinkKeyDown}
                    role="menuitem"
                    tabIndex={isMembershipOpen ? 0 : -1}
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
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Mobile Menu */}
            <div className="relative z-50 md:hidden border-t border-border py-4 bg-background">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="nhbea-nav-link block py-2"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              <Link 
                href="/about" 
                className="nhbea-nav-link block py-2"
                onClick={handleLinkClick}
              >
                About
              </Link>
              <Link 
                href="/conference" 
                className="nhbea-nav-link block py-2"
                onClick={handleLinkClick}
              >
                Conference
              </Link>
              <Link 
                href="/awards" 
                className="nhbea-nav-link block py-2"
                onClick={handleLinkClick}
              >
                Awards
              </Link>
              <Link 
                href="/hall-of-fame" 
                className="nhbea-nav-link block py-2"
                onClick={handleLinkClick}
              >
                Hall of Fame
              </Link>
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="text-sm font-medium text-muted-foreground mb-3">Membership</div>
                <Link 
                  href="/membership/professional" 
                  className="nhbea-nav-link block py-2 pl-4"
                  onClick={handleLinkClick}
                >
                  Professional Membership
                </Link>
                <Link 
                  href="/membership/student" 
                  className="nhbea-nav-link block py-2 pl-4"
                  onClick={handleLinkClick}
                >
                  Student Membership
                </Link>
              </div>
              
              <Link 
                href="/membership/professional" 
                className="nhbea-button-primary w-full mt-4 text-center"
                onClick={handleLinkClick}
              >
                Join Today
              </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}