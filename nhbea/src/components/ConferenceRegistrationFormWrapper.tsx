'use client';

import { useState } from 'react';
import { ConferenceRegistrationFormData } from '@/lib/conferenceValidation';
import ConferenceRegistrationForm from './ConferenceRegistrationForm';
import { Conference } from '@/types/conference';

interface ConferenceRegistrationFormWrapperProps {
  conference: Conference;
}

export default function ConferenceRegistrationFormWrapper({
  conference
}: ConferenceRegistrationFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ConferenceRegistrationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import validation and repository functions
      const { conferenceValidationUtils } = await import('@/lib/conferenceValidation');
      const { registrantsRepository } = await import('@/lib/conference');

      // Validate form data
      const validation = conferenceValidationUtils.validateRegistrationForm(data);
      if (!validation.isValid) {
        throw new Error(validation.errors?.join(', ') || 'Form validation failed');
      }

      const sanitizedData = validation.data!;

      // Prepare registrant data for database storage - match FireCMS collection structure
      const participantInfo = {
        fullName: sanitizedData.fullName.trim(),
        email: sanitizedData.email.toLowerCase().trim(),
        phone: sanitizedData.phone?.trim(),
        institution: sanitizedData.institution.trim(),
        jobTitle: sanitizedData.jobTitle?.trim(),
        membershipId: sanitizedData.membershipId?.trim(),
        membershipStatus: sanitizedData.membershipStatus,
      };
      
      // Handle address info properly - use individual fields from form validation schema
      const addressInfo = (sanitizedData.address || sanitizedData.city || sanitizedData.state || sanitizedData.zipCode) ? {
        street: sanitizedData.address?.trim(),
        city: sanitizedData.city?.trim(),
        state: sanitizedData.state?.trim(),
        zipCode: sanitizedData.zipCode?.trim(),
      } : undefined;

      const emergencyContact = sanitizedData.emergencyContact && 
        (sanitizedData.emergencyContact.name || sanitizedData.emergencyContact.phone) ? {
        name: sanitizedData.emergencyContact.name?.trim(),
        phone: sanitizedData.emergencyContact.phone?.trim(),
        relationship: sanitizedData.emergencyContact.relationship?.trim(),
      } : undefined;

      const registrantData = {
        conferenceId: conference.id,
        participantInfo,
        registrationType: sanitizedData.registrationType,
        ...(addressInfo && { addressInfo }),
        ...(emergencyContact && { emergencyContact }),
        dietaryRestrictions: sanitizedData.dietaryRestrictions?.trim(),
        accessibilityNeeds: sanitizedData.accessibilityNeeds?.trim(),
        sessionPreferences: sanitizedData.sessionPreferences || [],
        networkingOptIn: sanitizedData.networkingOptIn || false,
        marketingConsent: sanitizedData.marketingConsent || false,
        agreeToTerms: sanitizedData.agreeToTerms,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
      };

      // Store registrant in database
      const registrantId = await registrantsRepository.createRegistrant(registrantData);

      // Log successful submission (for monitoring)
      console.log('Conference registration submitted successfully:', {
        registrantId,
        conferenceId: conference.id,
        participantEmail: sanitizedData.email,
        membershipStatus: sanitizedData.membershipStatus,
        timestamp: new Date().toISOString()
      });

      // Registration successful - redirect to success page
      window.location.href = `/conference/success?registrantId=${registrantId}`;
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to submit registration')) {
          setError('Unable to submit registration at this time. Please try again later.');
        } else if (error.message.includes('firestore/')) {
          setError('Database connection error. Please check your internet connection and try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Registration Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConferenceRegistrationForm
        conference={conference}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}