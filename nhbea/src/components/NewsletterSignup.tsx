'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NewsletterFormData, NewsletterSubmissionResult } from '@/types/newsletter';
import { addNewsletterSubscriber } from '@/lib/newsletter';

// Zod schema for email validation
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
});

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function NewsletterSignup({ 
  className = '', 
  variant = 'default' 
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<NewsletterSubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await addNewsletterSubscriber(data.email);
      setSubmissionResult(result);

      if (result.success) {
        reset(); // Clear form on success
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setSubmissionResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <section 
      className={`relative ${isCompact ? 'py-8' : 'py-16 lg:py-24'} ${className}`}
      role="region"
      aria-label="Newsletter subscription"
    >
      {/* Brand-consistent background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--nhbea-royal-blue-subtle)]/20 to-[var(--color-bg-secondary)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
      </div>
      
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        aria-hidden="true"
        role="presentation"
      >
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/10 to-transparent rounded-full animate-pulse delay-300 [will-change:opacity]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-[var(--nhbea-royal-blue-light)]/10 to-transparent rounded-full animate-pulse delay-700 [will-change:opacity]"></div>
      </div>

      <div className="relative container mx-auto px-6">
        <div className={`max-w-2xl mx-auto text-center ${isCompact ? 'space-y-4' : 'space-y-6'}`}>
          {/* Header */}
          <div className="space-y-3">
            <h2 className={`font-bold ${isCompact ? 'text-xl' : 'text-3xl lg:text-4xl'}`}>
              <span className="text-[var(--nhbea-royal-blue-deeper)]">
                Never Miss an Opportunity
              </span>
            </h2>
            <p className={`text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed ${isCompact ? 'text-sm' : 'text-lg'}`}>
              Get exclusive access to professional development opportunities, networking events, and resources that advance your career in business education.
            </p>
            
            {/* Trust signals */}
            <div className="flex items-center justify-center space-x-6 pt-2">
              <div className="flex items-center space-x-2 text-[var(--color-text-muted)] text-sm">
                <svg className="w-4 h-4 text-[var(--nhbea-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--color-text-muted)] text-sm">
                <svg className="w-4 h-4 text-[var(--nhbea-royal-blue)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>

          {/* Newsletter Form with brand styling */}
          <div className={`p-6 ${isCompact ? 'lg:p-8' : 'lg:p-10'} rounded-2xl bg-white border-2 border-[var(--color-border-primary)] shadow-lg hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-300`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate role="form">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                    disabled={isSubmitting}
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-primary)]
                      placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)]/20 focus:border-[var(--nhbea-royal-blue)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200 ease-out
                      ${errors.email ? 'border-[var(--nhbea-error)] focus:border-[var(--nhbea-error)] focus:ring-[var(--nhbea-error)]/20' : 'border-[var(--color-border-primary)]'}
                    `}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p 
                      id="email-error" 
                      className="mt-2 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    px-6 py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)]
                    hover:from-[var(--nhbea-accent-orange-dark)] hover:to-[var(--nhbea-accent-orange)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-accent-orange)]/50 focus:ring-offset-2 focus:ring-offset-white
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[var(--nhbea-accent-orange)] disabled:hover:to-[var(--nhbea-accent-orange-dark)]
                    transition-all duration-200 ease-out
                    shadow-lg hover:shadow-xl
                    transform hover:scale-105 disabled:hover:scale-100
                    [will-change:transform]
                    ${isCompact ? 'text-sm' : 'text-base'}
                  `}
                  aria-label={isSubmitting ? 'Subscribing to newsletter...' : 'Subscribe to newsletter'}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg 
                        className="animate-spin h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </form>

            {/* Success/Error Messages */}
            {submissionResult && (
              <div 
                className={`mt-4 p-4 rounded-lg ${
                  submissionResult.success 
                    ? 'bg-green-50/80 border border-green-200 text-green-800' 
                    : 'bg-red-50/80 border border-red-200 text-red-800'
                }`}
                role={submissionResult.success ? 'status' : 'alert'}
                aria-live="polite"
              >
                <p className="text-sm font-medium">
                  {submissionResult.message}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
            We respect your privacy. Unsubscribe at any time. 
            By subscribing, you agree to our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}