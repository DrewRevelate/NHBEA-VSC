'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  awardNominationFormSchema, 
  awardSelectionSchema,
  nomineeInformationSchema,
  nominatorInformationSchema,
  nominationDetailsSchema,
  awardValidationUtils,
  type AwardNominationFormData,
  type AwardSelectionData,
  type NomineeInformationData,
  type NominatorInformationData,
  type NominationDetailsData
} from '@/lib/awardValidation';
import type { Award } from '@/types/dataModels';

interface AwardNominationFormProps {
  awards: Award[];
  onSubmit: (data: AwardNominationFormData) => Promise<{
    success: boolean;
    message: string;
    nominationId?: string;
    error?: string;
  }>;
}

interface FormStepProps {
  awards: Award[];
  onNext: (data?: any) => void;
  onPrevious?: () => void;
  isLoading?: boolean;
  initialData?: any;
}

/**
 * Step 1: Award Selection
 */
function AwardSelectionStep({ awards, onNext, isLoading, initialData }: FormStepProps) {
  const methods = useForm<AwardSelectionData>({
    resolver: zodResolver(awardSelectionSchema),
    mode: 'onBlur',
    defaultValues: initialData
  });

  const { register, handleSubmit, watch, formState: { errors, isValid } } = methods;
  const selectedAwardId = watch('awardId');
  const selectedAward = awards.find(award => award.id === selectedAwardId);

  const onSubmit = (data: AwardSelectionData) => {
    onNext(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select an Award</h2>
          <p className="text-gray-600 mb-6">
            Choose the award for which you would like to submit a nomination.
          </p>
        </div>

        <div className="space-y-4">
          {awards.map((award) => (
            <label
              key={award.id}
              className="block p-4 border rounded-lg cursor-pointer transition-colors"
              style={{
                borderColor: selectedAwardId === award.id ? `var(--nhbea-royal-blue)` : `var(--color-border-primary)`,
                backgroundColor: selectedAwardId === award.id ? `var(--nhbea-royal-blue-subtle)` : 'transparent'
              }}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  value={award.id}
                  {...register('awardId')}
                  className="mt-1 h-4 w-4"
                  style={{
                    color: `var(--nhbea-royal-blue)`,
                    borderColor: `var(--color-border-primary)`,
                    '--focus-ring-color': `var(--nhbea-royal-blue)`
                  } as React.CSSProperties}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{award.name}</h3>
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: award.category === 'Excellence' ? `var(--nhbea-royal-blue-subtle)` :
                          award.category === 'Lifetime' ? `var(--nhbea-accent-gold)40` :
                          award.category === 'Innovation' ? `var(--nhbea-accent-green)40` :
                          `var(--nhbea-accent-orange)40`,
                        color: award.category === 'Excellence' ? `var(--nhbea-royal-blue-dark)` :
                          award.category === 'Lifetime' ? `var(--nhbea-accent-gold-dark)` :
                          award.category === 'Innovation' ? `var(--nhbea-accent-green-dark)` :
                          `var(--nhbea-accent-orange-dark)`
                      }}
                    >
                      {award.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {award.description.substring(0, 200)}...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Deadline: {award.deadline.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {selectedAwardId === award.id && (
                <input
                  type="hidden"
                  value={award.category}
                  {...register('awardCategory')}
                />
              )}
            </label>
          ))}
        </div>

        {errors.awardId && (
          <p className="text-red-600 text-sm">{errors.awardId.message}</p>
        )}

        {selectedAward && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Award Details</h4>
            <p className="text-sm text-gray-700 mb-3">{selectedAward.description}</p>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-medium text-gray-900 mb-1">Eligibility Criteria</h5>
              <p className="text-sm text-gray-600">{selectedAward.eligibility}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="px-6 py-2"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

/**
 * Step 2: Nominee Information
 */
function NomineeInformationStep({ onNext, onPrevious, isLoading, initialData }: FormStepProps) {
  const methods = useForm<NomineeInformationData>({
    resolver: zodResolver(nomineeInformationSchema),
    mode: 'onBlur',
    defaultValues: initialData
  });

  const { register, handleSubmit, formState: { errors, isValid } } = methods;

  const onSubmit = (data: NomineeInformationData) => {
    onNext(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nominee Information</h2>
          <p className="text-gray-600 mb-6">
            Please provide information about the person you are nominating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nomineeName" className="block text-sm font-medium text-gray-700 mb-2">
              Nominee Full Name *
            </label>
            <input
              id="nomineeName"
              type="text"
              {...register('nomineeInfo.name')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="Enter nominee's full name"
            />
            {errors.nomineeInfo?.name && (
              <p className="text-red-600 text-sm mt-1">{errors.nomineeInfo.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nomineeEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Nominee Email Address *
            </label>
            <input
              id="nomineeEmail"
              type="email"
              {...register('nomineeInfo.email')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="nominee@example.com"
            />
            {errors.nomineeInfo?.email && (
              <p className="text-red-600 text-sm mt-1">{errors.nomineeInfo.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nomineeOrganization" className="block text-sm font-medium text-gray-700 mb-2">
              Organization/School
            </label>
            <input
              id="nomineeOrganization"
              type="text"
              {...register('nomineeInfo.organization')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="School or organization name"
            />
            {errors.nomineeInfo?.organization && (
              <p className="text-red-600 text-sm mt-1">{errors.nomineeInfo.organization.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nomineePosition" className="block text-sm font-medium text-gray-700 mb-2">
              Position/Title
            </label>
            <input
              id="nomineePosition"
              type="text"
              {...register('nomineeInfo.position')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="Job title or position"
            />
            {errors.nomineeInfo?.position && (
              <p className="text-red-600 text-sm mt-1">{errors.nomineeInfo.position.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            onClick={onPrevious}
            variant="outline"
            className="px-6 py-2"
            disabled={isLoading}
          >
            Previous
          </Button>
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="px-6 py-2"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

/**
 * Step 3: Nominator Information
 */
function NominatorInformationStep({ onNext, onPrevious, isLoading, initialData }: FormStepProps) {
  const methods = useForm<NominatorInformationData>({
    resolver: zodResolver(nominatorInformationSchema),
    mode: 'onBlur',
    defaultValues: initialData
  });

  const { register, handleSubmit, formState: { errors, isValid } } = methods;

  const onSubmit = (data: NominatorInformationData) => {
    onNext(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Information</h2>
          <p className="text-gray-600 mb-6">
            Please provide your contact information as the nominator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nominatorName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Full Name *
            </label>
            <input
              id="nominatorName"
              type="text"
              {...register('nominatorInfo.name')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="Enter your full name"
            />
            {errors.nominatorInfo?.name && (
              <p className="text-red-600 text-sm mt-1">{errors.nominatorInfo.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nominatorEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email Address *
            </label>
            <input
              id="nominatorEmail"
              type="email"
              {...register('nominatorInfo.email')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="your@example.com"
            />
            {errors.nominatorInfo?.email && (
              <p className="text-red-600 text-sm mt-1">{errors.nominatorInfo.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nominatorOrganization" className="block text-sm font-medium text-gray-700 mb-2">
              Your Organization/School
            </label>
            <input
              id="nominatorOrganization"
              type="text"
              {...register('nominatorInfo.organization')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="Your school or organization"
            />
            {errors.nominatorInfo?.organization && (
              <p className="text-red-600 text-sm mt-1">{errors.nominatorInfo.organization.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nominatorPosition" className="block text-sm font-medium text-gray-700 mb-2">
              Your Position/Title
            </label>
            <input
              id="nominatorPosition"
              type="text"
              {...register('nominatorInfo.position')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`,
                '--focus-border-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
              placeholder="Your job title or position"
            />
            {errors.nominatorInfo?.position && (
              <p className="text-red-600 text-sm mt-1">{errors.nominatorInfo.position.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            onClick={onPrevious}
            variant="outline"
            className="px-6 py-2"
            disabled={isLoading}
          >
            Previous
          </Button>
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="px-6 py-2"
          >
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

/**
 * Step 4: Nomination Details
 */
function NominationDetailsStep({ onNext, onPrevious, isLoading, initialData }: FormStepProps) {
  const methods = useForm<NominationDetailsData>({
    resolver: zodResolver(nominationDetailsSchema),
    mode: 'onBlur',
    defaultValues: initialData
  });

  const { register, handleSubmit, watch, formState: { errors, isValid } } = methods;
  const nominationText = watch('nominationText');
  const characterCount = nominationText?.length || 0;

  const onSubmit = (data: NominationDetailsData) => {
    onNext(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nomination Statement</h2>
          <p className="text-gray-600 mb-6">
            Please provide a detailed statement explaining why this person deserves the award.
          </p>
        </div>

        <div>
          <label htmlFor="nominationText" className="block text-sm font-medium text-gray-700 mb-2">
            Nomination Statement *
          </label>
          <textarea
            id="nominationText"
            rows={8}
            {...register('nominationText')}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
            style={{
              borderColor: `var(--color-border-primary)`,
              '--focus-ring-color': `var(--nhbea-royal-blue)`,
              '--focus-border-color': `var(--nhbea-royal-blue)`
            } as React.CSSProperties}
            placeholder="Describe the nominee's achievements, contributions, and why they deserve this award..."
          />
          <div className="flex justify-between items-center mt-2">
            {errors.nominationText && (
              <p className="text-red-600 text-sm">{errors.nominationText.message}</p>
            )}
            <p className={`text-sm ${
              characterCount < 50 ? 'text-red-600' : 
              characterCount > 1900 ? 'text-orange-600' : 
              'text-gray-500'
            }`}>
              {characterCount}/2000 characters {characterCount < 50 && `(${50 - characterCount} more needed)`}
            </p>
          </div>
        </div>


        <div>
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('agreedToTerms')}
              className="mt-1 h-4 w-4 rounded"
              style={{
                color: `var(--nhbea-royal-blue)`,
                borderColor: `var(--color-border-primary)`,
                '--focus-ring-color': `var(--nhbea-royal-blue)`
              } as React.CSSProperties}
            />
            <span className="text-sm text-gray-700">
              I agree that the information provided is accurate and I have permission to nominate this individual. 
              I understand that false information may disqualify the nomination. *
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="text-red-600 text-sm mt-1">{errors.agreedToTerms.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            onClick={onPrevious}
            variant="outline"
            className="px-6 py-2"
            disabled={isLoading}
          >
            Previous
          </Button>
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="px-6 py-2"
          >
            {isLoading ? 'Submitting...' : 'Submit Nomination'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

/**
 * Main Multi-Step Award Nomination Form
 */
export default function AwardNominationForm({ awards, onSubmit }: AwardNominationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AwardNominationFormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const totalSteps = 4;

  const handleNext = (stepData?: any) => {
    // Merge step data into form data
    if (stepData) {
      setFormData(prev => ({ ...prev, ...stepData }));
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Pass the final step data to handleSubmit
      handleSubmit(stepData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalStepData?: any) => {
    try {
      setIsLoading(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      // Merge final step data - this is crucial for the last step
      const completeFormData = finalStepData ? { ...formData, ...finalStepData } : formData;
      
      // Validate complete form data
      const validation = awardValidationUtils.validateNominationForm(completeFormData);
      if (!validation.isValid) {
        setSubmitError('Form validation failed. Please check all required fields and try again.');
        console.error('Form validation failed:', validation.errors);
        return;
      }

      // Submit the form
      const result = await onSubmit(validation.data!);
      
      if (result.success) {
        setSubmitSuccess(result.message || 'Nomination submitted successfully!');
        // Note: The onSubmit handler should redirect to success page, but we show success message here too
      } else {
        setSubmitError(result.message || 'Failed to submit nomination. Please try again.');
        console.error('Submission failed:', result.error);
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Error submitting nomination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out awards that have passed their deadline
  const availableAwards = awards.filter(award => new Date() <= award.deadline);

  if (availableAwards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">No Awards Available</h2>
        <p className="text-yellow-700">
          All award nomination deadlines have passed. Please check back next year for new nomination opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < totalSteps ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep
                    ? 'text-white'
                    : step === currentStep
                    ? 'border-2'
                    : ''
                }`}
                style={{
                  backgroundColor: step < currentStep ? `var(--nhbea-royal-blue)` :
                    step === currentStep ? `var(--nhbea-royal-blue-subtle)` :
                    `var(--nhbea-gray-200)`,
                  color: step < currentStep ? 'white' :
                    step === currentStep ? `var(--nhbea-royal-blue)` :
                    `var(--nhbea-gray-500)`,
                  borderColor: step === currentStep ? `var(--nhbea-royal-blue)` : 'transparent'
                }}
              >
                {step < currentStep ? '✓' : step}
              </div>
              {step < totalSteps && (
                <div
                  className="flex-1 h-1 mx-4"
                  style={{
                    backgroundColor: step < currentStep ? `var(--nhbea-royal-blue)` : `var(--nhbea-gray-200)`
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Select Award</span>
          <span>Nominee Info</span>
          <span>Your Info</span>
          <span>Submit</span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{submitSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: `var(--nhbea-royal-blue-subtle)`, borderColor: `var(--nhbea-royal-blue-lighter)` }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: `var(--nhbea-royal-blue)` }}></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium" style={{ color: `var(--nhbea-royal-blue-dark)` }}>Submitting your nomination...</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Steps */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {currentStep === 1 && (
          <AwardSelectionStep 
            awards={availableAwards} 
            onNext={handleNext}
            isLoading={isLoading}
            initialData={formData}
          />
        )}
        {currentStep === 2 && (
          <NomineeInformationStep 
            awards={availableAwards}
            onNext={handleNext} 
            onPrevious={handlePrevious}
            isLoading={isLoading}
            initialData={formData}
          />
        )}
        {currentStep === 3 && (
          <NominatorInformationStep 
            awards={availableAwards}
            onNext={handleNext} 
            onPrevious={handlePrevious}
            isLoading={isLoading}
            initialData={formData}
          />
        )}
        {currentStep === 4 && (
          <NominationDetailsStep 
            awards={availableAwards}
            onNext={handleNext} 
            onPrevious={handlePrevious}
            isLoading={isLoading}
            initialData={formData}
          />
        )}
      </div>
    </div>
  );
}