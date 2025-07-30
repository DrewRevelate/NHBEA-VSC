'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { professionalMembershipSchema, type ProfessionalMembershipFormData } from '@/lib/membershipValidation';
import { MembershipSubmissionResult } from '@/types/membership';

// US states for dropdown
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

interface ProfessionalMembershipFormProps {
  onSubmit: (data: ProfessionalMembershipFormData) => Promise<MembershipSubmissionResult>;
  className?: string;
}

export default function ProfessionalMembershipForm({ 
  onSubmit, 
  className = '' 
}: ProfessionalMembershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<MembershipSubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<ProfessionalMembershipFormData>({
    resolver: zodResolver(professionalMembershipSchema) as any,
    defaultValues: {
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true
      },
      membershipType: 'new'
    }
  });

  const membershipType = watch('membershipType');

  const handleFormSubmit = async (data: ProfessionalMembershipFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await onSubmit(data);
      setSubmissionResult(result);

      if (result.success && result.paymentUrl) {
        // Redirect to payment URL
        window.location.href = result.paymentUrl;
      }
    } catch (error) {
      console.error('Membership application error:', error);
      setSubmissionResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (fieldName: keyof ProfessionalMembershipFormData | string) => `
    nhbea-form-input
    ${errors[fieldName as keyof ProfessionalMembershipFormData] ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}
  `;

  const renderError = (fieldName: keyof ProfessionalMembershipFormData | string, id: string) => {
    const error = errors[fieldName as keyof ProfessionalMembershipFormData];
    if (!error) return null;
    
    return (
      <p id={id} className="nhbea-form-error" role="alert">
        {error.message}
      </p>
    );
  };

  return (
    <div className={`nhbea-container ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
          Professional Membership Application
        </h1>
        <p className="nhbea-text-large max-w-2xl mx-auto">
          Join the New Hampshire Business Educators Association and connect with fellow educators 
          across the state. Annual membership fee: $50.00
        </p>
      </div>

      {/* Form */}
      <div className="nhbea-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8" noValidate>
          
          {/* Membership Type */}
          <div className="nhbea-form-group">
            <h2 className="text-xl font-semibold text-foreground mb-4">Membership Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="new"
                  {...register('membershipType')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary nhbea-focus-ring"
                />
                <span className="text-foreground">New Membership</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="renewal"
                  {...register('membershipType')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary nhbea-focus-ring"
                />
                <span className="text-foreground">Membership Renewal</span>
              </label>
            </div>
            {renderError('membershipType', 'membershipType-error')}
          </div>

          {/* Previous Member Number (only for renewals) */}
          {membershipType === 'renewal' && (
            <div className="space-y-2">
              <label htmlFor="previousMemberNumber" className="block text-sm font-medium text-slate-700">
                Previous Member Number *
              </label>
              <input
                id="previousMemberNumber"
                type="text"
                placeholder="Enter your previous member number"
                {...register('previousMemberNumber')}
                disabled={isSubmitting}
                className={inputClassName('previousMemberNumber')}
                aria-invalid={errors.previousMemberNumber ? 'true' : 'false'}
                aria-describedby={errors.previousMemberNumber ? 'previousMemberNumber-error' : undefined}
              />
              {renderError('previousMemberNumber', 'previousMemberNumber-error')}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  {...register('firstName')}
                  disabled={isSubmitting}
                  className={inputClassName('firstName')}
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {renderError('firstName', 'firstName-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register('lastName')}
                  disabled={isSubmitting}
                  className={inputClassName('lastName')}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {renderError('lastName', 'lastName-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  disabled={isSubmitting}
                  className={inputClassName('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {renderError('email', 'email-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...register('phone')}
                  disabled={isSubmitting}
                  className={inputClassName('phone')}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {renderError('phone', 'phone-error')}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="institution" className="block text-sm font-medium text-slate-700">
                  Institution *
                </label>
                <input
                  id="institution"
                  type="text"
                  placeholder="School, college, or organization"
                  {...register('institution')}
                  disabled={isSubmitting}
                  className={inputClassName('institution')}
                  aria-invalid={errors.institution ? 'true' : 'false'}
                  aria-describedby={errors.institution ? 'institution-error' : undefined}
                />
                {renderError('institution', 'institution-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="block text-sm font-medium text-slate-700">
                  Position/Title *
                </label>
                <input
                  id="position"
                  type="text"
                  placeholder="Your job title or position"
                  {...register('position')}
                  disabled={isSubmitting}
                  className={inputClassName('position')}
                  aria-invalid={errors.position ? 'true' : 'false'}
                  aria-describedby={errors.position ? 'position-error' : undefined}
                />
                {renderError('position', 'position-error')}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-slate-700">
                  Years of Experience in Education *
                </label>
                <input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  max="70"
                  placeholder="Enter years of experience"
                  {...register('yearsExperience', { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={inputClassName('yearsExperience')}
                  aria-invalid={errors.yearsExperience ? 'true' : 'false'}
                  aria-describedby={errors.yearsExperience ? 'yearsExperience-error' : undefined}
                />
                {renderError('yearsExperience', 'yearsExperience-error')}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Address Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                  Street Address *
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter your street address"
                  {...register('address')}
                  disabled={isSubmitting}
                  className={inputClassName('address')}
                  aria-invalid={errors.address ? 'true' : 'false'}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                />
                {renderError('address', 'address-error')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    {...register('city')}
                    disabled={isSubmitting}
                    className={inputClassName('city')}
                    aria-invalid={errors.city ? 'true' : 'false'}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                  />
                  {renderError('city', 'city-error')}
                </div>

                <div className="space-y-2">
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700">
                    State *
                  </label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="state"
                        disabled={isSubmitting}
                        className={inputClassName('state')}
                        aria-invalid={errors.state ? 'true' : 'false'}
                        aria-describedby={errors.state ? 'state-error' : undefined}
                      >
                        <option value="">Select state</option>
                        {US_STATES.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {renderError('state', 'state-error')}
                </div>

                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700">
                    ZIP Code *
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    placeholder="12345"
                    {...register('zipCode')}
                    disabled={isSubmitting}
                    className={inputClassName('zipCode')}
                    aria-invalid={errors.zipCode ? 'true' : 'false'}
                    aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                  />
                  {renderError('zipCode', 'zipCode-error')}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Communication Preferences</h2>
            <p className="text-sm text-slate-600">
              Select how you'd like to receive communications from NHBEA:
            </p>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('communicationPreferences.newsletter')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 mt-1"
                />
                <div>
                  <span className="text-slate-700 font-medium">Newsletter</span>
                  <p className="text-sm text-slate-600">Receive our monthly newsletter with updates and resources</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('communicationPreferences.updates')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 mt-1"
                />
                <div>
                  <span className="text-slate-700 font-medium">General Updates</span>
                  <p className="text-sm text-slate-600">Important announcements and association news</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('communicationPreferences.events')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 mt-1"
                />
                <div>
                  <span className="text-slate-700 font-medium">Event Notifications</span>
                  <p className="text-sm text-slate-600">Conference announcements and professional development opportunities</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 rounded-xl font-semibold text-white text-lg
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white/50
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600
                transition-all duration-200 ease-out
                shadow-lg hover:shadow-xl
                transform hover:scale-105 disabled:hover:scale-100
                [will-change:transform]"
              aria-label={isSubmitting ? 'Processing membership application...' : 'Submit application and proceed to payment'}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg 
                    className="animate-spin h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Application...
                </span>
              ) : (
                'Submit Application & Pay Dues ($50.00)'
              )}
            </button>
          </div>

          {/* Success/Error Messages */}
          {submissionResult && !submissionResult.paymentUrl && (
            <div 
              className={`p-4 rounded-xl ${
                submissionResult.success 
                  ? 'bg-green-50/80 border border-green-200 text-green-800' 
                  : 'bg-red-50/80 border border-red-200 text-red-800'
              }`}
              role={submissionResult.success ? 'status' : 'alert'}
              aria-live="polite"
            >
              <p className="font-medium">
                {submissionResult.message}
              </p>
            </div>
          )}
        </form>

        {/* Privacy Notice */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            By submitting this application, you agree to our privacy policy and terms of service. 
            Your information will be used solely for membership purposes and association communications.
          </p>
        </div>
      </div>
    </div>
  );
}