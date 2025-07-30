'use client';

import { Suspense, useEffect, useState } from 'react';
import { getRegistrantById, getConferenceById, updateRegistrantPaymentStatus } from '@/lib/conference';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// Using inline SVG icons to match existing codebase pattern

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrantId = searchParams.get('registrantId');
  const conferenceId = searchParams.get('conferenceId');
  const transactionId = searchParams.get('transactionId');
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [registrant, setRegistrant] = useState<any>(null);
  const [conference, setConference] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (!registrantId || !conferenceId) {
          setError('Missing registration information');
          return;
        }

        const [registrantData, conferenceData] = await Promise.all([
          getRegistrantById(registrantId),
          getConferenceById(conferenceId)
        ]);

        if (!registrantData || !conferenceData) {
          setError('Registration or conference not found');
          return;
        }

        // Update payment status if transaction details are provided
        if ((transactionId || orderId) && registrantData.registration.paymentStatus === 'pending') {
          try {
            await updateRegistrantPaymentStatus(registrantId, {
              squareOrderId: orderId || undefined,
              transactionId: transactionId || undefined,
              paymentMethod: 'Square',
              paidAt: new Date()
            });
            // Refresh registrant data
            const updatedRegistrant = await getRegistrantById(registrantId);
            if (updatedRegistrant) {
              setRegistrant(updatedRegistrant);
            }
          } catch (error) {
            console.error('Error updating payment status:', error);
            // Continue with success page even if status update fails
            setRegistrant(registrantData);
          }
        } else {
          setRegistrant(registrantData);
        }

        setConference(conferenceData);
      } catch (err) {
        console.error('Error loading success page:', err);
        setError('Failed to load registration details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [registrantId, conferenceId, transactionId, orderId]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your registration details...</p>
      </div>
    );
  }

  if (error || !registrant || !conference) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Registration</h1>
        <p className="text-gray-600 mb-6">
          We couldn't find your registration information. Please contact support if you believe this is an error.
        </p>
        <Link href="/conference">
          <Button>Back to Conference</Button>
        </Link>
      </div>
    );
  }

  // Helper functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };


    return (
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for registering for {conference.title}
          </p>
        </div>

        {/* Registration Details */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Registration Details</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Participant Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {registrant.participant.fullName}</p>
                  <p><strong>Email:</strong> {registrant.participant.email}</p>
                  {registrant.participant.phone && (
                    <p><strong>Phone:</strong> {registrant.participant.phone}</p>
                  )}
                  <p><strong>Institution:</strong> {registrant.participant.institution}</p>
                  <p><strong>Membership Status:</strong> {registrant.participant.membershipStatus}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Registration Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Registration ID:</strong> {registrant.id}</p>
                  <p><strong>Registration Type:</strong> {registrant.registration.registrationType}</p>
                  <p><strong>Registration Fee:</strong> ${registrant.registration.totalAmount}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      registrant.registration.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registrant.registration.paymentStatus === 'paid' ? 'Paid' : 'Processing'}
                    </span>
                  </p>
                  {transactionId && (
                    <p><strong>Transaction ID:</strong> {transactionId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            {(registrant.preferences.dietaryRestrictions || registrant.preferences.accessibilityNeeds) && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Special Requirements</h3>
                <div className="space-y-2 text-sm">
                  {registrant.preferences.dietaryRestrictions && (
                    <p><strong>Dietary Restrictions:</strong> {registrant.preferences.dietaryRestrictions}</p>
                  )}
                  {registrant.preferences.accessibilityNeeds && (
                    <p><strong>Accessibility Needs:</strong> {registrant.preferences.accessibilityNeeds}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conference Information */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Conference Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{formatDate(conference.schedule.date)}</p>
                    <p className="text-gray-600">
                      {formatTime(conference.schedule.startTime)} - {formatTime(conference.schedule.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{conference.location.venue}</p>
                    <p className="text-gray-600">
                      {conference.location.address.street}<br />
                      {conference.location.address.city}, {conference.location.address.state} {conference.location.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• You will receive a confirmation email shortly</li>
                    <li>• Conference materials will be emailed closer to the event</li>
                    <li>• Check-in begins 30 minutes before the start time</li>
                    <li>• Bring a photo ID for registration verification</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href="mailto:support@nhbea.org" className="text-blue-600 hover:text-blue-800">
                        support@nhbea.org
                      </a>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>(555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Link href="/conference">
              <Button variant="outline">Back to Conference</Button>
            </Link>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            Save this page or take a screenshot for your records.
          </p>
        </div>
      </div>
    );
}

export default function ConferenceSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your registration details...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}