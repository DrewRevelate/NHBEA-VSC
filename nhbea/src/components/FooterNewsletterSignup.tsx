'use client';

import { useState } from 'react';
import { addNewsletterSubscriber } from '@/lib/newsletter';
import { NewsletterSubmissionResult } from '@/types/newsletter';

export default function FooterNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<NewsletterSubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        error: 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isSubmitting}
          className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-accent-gold)]/50 focus:border-[var(--nhbea-accent-gold)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Email address for newsletter subscription"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-[var(--nhbea-accent-gold)] hover:bg-[var(--nhbea-accent-gold-dark)] text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-accent-gold)]/50 focus:ring-offset-2 focus:ring-offset-[var(--nhbea-royal-blue-dark)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      
      {/* Success/Error Messages */}
      {result && (
        <div 
          className={`p-3 rounded-lg text-sm ${
            result.success 
              ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
              : 'bg-red-500/20 border border-red-400/30 text-red-100'
          }`}
          role={result.success ? 'status' : 'alert'}
          aria-live="polite"
        >
          {result.message}
        </div>
      )}
      
      <p className="text-white/60 text-xs">
        No spam, unsubscribe anytime
      </p>
    </div>
  );
}