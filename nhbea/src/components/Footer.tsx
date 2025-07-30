import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30 mt-auto">
      <div className="nhbea-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">NHBEA</h3>
            <p className="nhbea-text-small leading-relaxed">
              The New Hampshire Business Education Association promotes excellence in business education throughout the state.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="nhbea-text-small hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/conference" className="nhbea-text-small hover:text-foreground transition-colors">
                  Annual Conference
                </Link>
              </li>
              <li>
                <Link href="/awards" className="nhbea-text-small hover:text-foreground transition-colors">
                  Awards Program
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="nhbea-text-small hover:text-foreground transition-colors">
                  Hall of Fame
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Membership</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/membership/professional" className="nhbea-text-small hover:text-foreground transition-colors">
                  Professional Membership
                </Link>
              </li>
              <li>
                <Link href="/membership/student" className="nhbea-text-small hover:text-foreground transition-colors">
                  Student Membership
                </Link>
              </li>
              <li>
                <Link href="/membership/benefits" className="nhbea-text-small hover:text-foreground transition-colors">
                  Member Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Stay Connected</h4>
            <p className="nhbea-text-small mb-4">
              Subscribe to our newsletter for updates on events, opportunities, and industry insights.
            </p>
            <NewsletterSignup variant="compact" className="mt-0" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="nhbea-text-small">
              &copy; {new Date().getFullYear()} New Hampshire Business Education Association. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="nhbea-text-small hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="nhbea-text-small hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="nhbea-text-small hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}