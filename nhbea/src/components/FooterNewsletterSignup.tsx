'use client';

import { useState, useEffect } from 'react';
import { addNewsletterSubscriber } from '@/lib/newsletter';
import { NewsletterSubmissionResult } from '@/types/newsletter';

export default function FooterNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<NewsletterSubmissionResult | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure component is mounted and Firebase is ready
    setIsReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isReady) {
      setResult({
        success: false,
        message: 'Please wait, the form is loading...',
        error: 'Not ready'
      });
      return;
    }
    
    if (!email.trim()) {
      setResult({
        success: false,
        message: 'Please enter your email address.',
        error: 'Empty email'
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const submissionResult = await addNewsletterSubscriber(email, 'website');
      setResult(submissionResult);
      
      if (submissionResult.success) {
        setEmail(''); // Clear form on success
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-[var(--spacing-4)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-3)]">
        <div>
          <label htmlFor="newsletter-email" className="block text-small font-medium text-[var(--nhbea-gray-50)]/90 mb-[var(--spacing-2)]">
            Email Address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            disabled={isSubmitting || !isReady}
            required
            className="w-full px-[var(--spacing-4)] py-[var(--spacing-3)] rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-[var(--nhbea-gray-50)] placeholder:text-[var(--nhbea-gray-50)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)]/50 focus:border-[var(--nhbea-royal-blue)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
            aria-describedby="newsletter-description newsletter-status"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="nhbea-button-cta w-full min-h-[48px] flex items-center justify-center touch-manipulation"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-[var(--spacing-2)]">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      
      {/* Success/Error Messages */}
      <div id="newsletter-status" aria-live="polite">
        {result && (
          <div 
            className={`p-[var(--spacing-3)] rounded-lg text-small ${
              result.success 
                ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                : 'bg-red-500/20 border border-red-400/30 text-red-300'
            }`}
            role={result.success ? 'status' : 'alert'}
          >
            {result.message}
          </div>
        )}
      </div>
      
      <p id="newsletter-description" className="text-[var(--nhbea-gray-50)]/60 text-caption">
        Get updates on events, opportunities, and industry insights. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}