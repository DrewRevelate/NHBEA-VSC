import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { Conference, Registrant, CreateConferenceData, UpdateConferenceData, CreateRegistrantData, UpdateRegistrantData } from '@/types/conference';

/**
 * Conference and Registration Management API for NHBEA Phase 1
 * Handles conference events and attendee registration
 */

// Get current active conference
export async function getCurrentConference(): Promise<Conference | null> {
  try {
    const currentYear = new Date().getFullYear();
    const q = query(
      collection(db, 'conference'),
      where('year', '==', currentYear),
      where('status', 'in', ['published', 'registration_open'])
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        schedule: {
          ...data.schedule,
          date: data.schedule?.date?.toDate() || new Date()
        },
        registration: {
          ...data.registration,
          openDate: data.registration?.openDate?.toDate() || new Date(),
          closeDate: data.registration?.closeDate?.toDate() || new Date(),
          fees: {
            ...data.registration?.fees,
            earlyBird: data.registration?.fees?.earlyBird ? {
              ...data.registration.fees.earlyBird,
              deadline: data.registration.fees.earlyBird.deadline?.toDate() || new Date()
            } : undefined
          }
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Conference;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching current conference:', error);
    throw new Error('Failed to fetch current conference');
  }
}

// Get all conferences
export async function getAllConferences(): Promise<Conference[]> {
  try {
    const q = query(collection(db, 'conference'), orderBy('year', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const conferences: Conference[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conferences.push({
        id: doc.id,
        ...data,
        schedule: {
          ...data.schedule,
          date: data.schedule?.date?.toDate() || new Date()
        },
        registration: {
          ...data.registration,
          openDate: data.registration?.openDate?.toDate() || new Date(),
          closeDate: data.registration?.closeDate?.toDate() || new Date(),
          fees: {
            ...data.registration?.fees,
            earlyBird: data.registration?.fees?.earlyBird ? {
              ...data.registration.fees.earlyBird,
              deadline: data.registration.fees.earlyBird.deadline?.toDate() || new Date()
            } : undefined
          }
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Conference);
    });
    
    return conferences;
  } catch (error) {
    console.error('Error fetching conferences:', error);
    throw new Error('Failed to fetch conferences');
  }
}

// Get conference by ID
export async function getConferenceById(conferenceId: string): Promise<Conference | null> {
  try {
    const docRef = doc(db, 'conference', conferenceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        schedule: {
          ...data.schedule,
          date: data.schedule?.date?.toDate() || new Date()
        },
        registration: {
          ...data.registration,
          openDate: data.registration?.openDate?.toDate() || new Date(),
          closeDate: data.registration?.closeDate?.toDate() || new Date(),
          fees: {
            ...data.registration?.fees,
            earlyBird: data.registration?.fees?.earlyBird ? {
              ...data.registration.fees.earlyBird,
              deadline: data.registration.fees.earlyBird.deadline?.toDate() || new Date()
            } : undefined
          }
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Conference;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching conference by ID:', error);
    throw new Error('Failed to fetch conference');
  }
}

// Create a new conference
export async function createConference(conferenceData: CreateConferenceData): Promise<string> {
  try {
    const now = new Date();
    const conferenceWithMetadata = {
      ...conferenceData,
      registration: {
        ...conferenceData.registration,
        currentCount: 0
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        featured: false,
        ...conferenceData.metadata
      }
    };
    
    const docRef = await addDoc(collection(db, 'conference'), conferenceWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating conference:', error);
    throw new Error('Failed to create conference');
  }
}

// Update an existing conference
export async function updateConference(conferenceId: string, updateData: UpdateConferenceData): Promise<void> {
  try {
    const docRef = doc(db, 'conference', conferenceId);
    const updateWithMetadata = {
      ...updateData,
      metadata: {
        ...updateData.metadata,
        updatedAt: new Date()
      }
    };
    
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating conference:', error);
    throw new Error('Failed to update conference');
  }
}

// REGISTRANT MANAGEMENT

// Get all registrants for a specific conference
export async function getConferenceRegistrants(conferenceId: string): Promise<Registrant[]> {
  try {
    const q = query(
      collection(db, 'registrants'),
      where('conferenceId', '==', conferenceId),
      orderBy('registration.registrationDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const registrants: Registrant[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      registrants.push({
        id: doc.id,
        ...data,
        registration: {
          ...data.registration,
          registrationDate: data.registration?.registrationDate?.toDate() || new Date(),
          paymentDetails: data.registration?.paymentDetails ? {
            ...data.registration.paymentDetails,
            paidAt: data.registration.paymentDetails.paidAt?.toDate()
          } : undefined
        },
        communications: {
          ...data.communications,
          lastContactDate: data.communications?.lastContactDate?.toDate()
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Registrant);
    });
    
    return registrants;
  } catch (error) {
    console.error('Error fetching conference registrants:', error);
    throw new Error('Failed to fetch conference registrants');
  }
}

// Register a participant for a conference
export async function registerForConference(registrantData: CreateRegistrantData): Promise<string> {
  try {
    const now = new Date();
    const registrantWithMetadata = {
      ...registrantData,
      status: 'registered',
      communications: {
        ...registrantData.communications,
        confirmationSent: false,
        remindersSent: 0
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        source: 'website',
        ...registrantData.metadata
      }
    };
    
    const docRef = await addDoc(collection(db, 'registrants'), registrantWithMetadata);
    
    // Update conference registration count
    await updateConferenceRegistrationCount(registrantData.conferenceId, 1);
    
    return docRef.id;
  } catch (error) {
    console.error('Error registering for conference:', error);
    throw new Error('Failed to register for conference');
  }
}

// Update registrant information
export async function updateRegistrant(registrantId: string, updateData: UpdateRegistrantData): Promise<void> {
  try {
    const docRef = doc(db, 'registrants', registrantId);
    const updateWithMetadata = {
      ...updateData,
      metadata: {
        ...updateData.metadata,
        updatedAt: new Date()
      }
    };
    
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating registrant:', error);
    throw new Error('Failed to update registrant');
  }
}

// Cancel a registration
export async function cancelRegistration(registrantId: string): Promise<void> {
  try {
    const registrant = await getRegistrantById(registrantId);
    if (!registrant) {
      throw new Error('Registrant not found');
    }
    
    await updateRegistrant(registrantId, {
      status: 'cancelled',
      metadata: { updatedAt: new Date() }
    });
    
    // Update conference registration count
    await updateConferenceRegistrationCount(registrant.conferenceId, -1);
  } catch (error) {
    console.error('Error cancelling registration:', error);
    throw new Error('Failed to cancel registration');
  }
}

// Get registrant by ID
export async function getRegistrantById(registrantId: string): Promise<Registrant | null> {
  try {
    const docRef = doc(db, 'registrants', registrantId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        registration: {
          ...data.registration,
          registrationDate: data.registration?.registrationDate?.toDate() || new Date(),
          paymentDetails: data.registration?.paymentDetails ? {
            ...data.registration.paymentDetails,
            paidAt: data.registration.paymentDetails.paidAt?.toDate()
          } : undefined
        },
        communications: {
          ...data.communications,
          lastContactDate: data.communications?.lastContactDate?.toDate()
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Registrant;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching registrant by ID:', error);
    throw new Error('Failed to fetch registrant');
  }
}

// Update conference registration count (helper function)
async function updateConferenceRegistrationCount(conferenceId: string, incrementValue: number): Promise<void> {
  try {
    const docRef = doc(db, 'conference', conferenceId);
    await updateDoc(docRef, {
      'registration.currentCount': increment(incrementValue)
    });
  } catch (error) {
    console.error('Error updating registration count:', error);
    // Don't throw here to avoid breaking registration flow
  }
}

// Check if registration is available for a conference
export async function checkRegistrationAvailability(conferenceId: string): Promise<{
  isAvailable: boolean;
  spotsRemaining: number;
  registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
}> {
  try {
    const conference = await getConferenceById(conferenceId);
    if (!conference) {
      return {
        isAvailable: false,
        spotsRemaining: 0,
        registrationStatus: 'closed'
      };
    }
    
    const now = new Date();
    const { registration } = conference;
    
    // Check if registration period is active
    if (now < registration.openDate) {
      return {
        isAvailable: false,
        spotsRemaining: registration.capacity - registration.currentCount,
        registrationStatus: 'not_started'
      };
    }
    
    if (now > registration.closeDate || !registration.isOpen) {
      return {
        isAvailable: false,
        spotsRemaining: registration.capacity - registration.currentCount,
        registrationStatus: 'closed'
      };
    }
    
    const spotsRemaining = registration.capacity - registration.currentCount;
    
    if (spotsRemaining <= 0) {
      return {
        isAvailable: registration.waitlistEnabled,
        spotsRemaining: 0,
        registrationStatus: 'full'
      };
    }
    
    return {
      isAvailable: true,
      spotsRemaining,
      registrationStatus: 'open'
    };
  } catch (error) {
    console.error('Error checking registration availability:', error);
    return {
      isAvailable: false,
      spotsRemaining: 0,
      registrationStatus: 'closed'
    };
  }
}

// Default fallback conference for development/testing
export const defaultConference: Conference = {
  id: 'conference-2025',
  title: '2025 NHBEA Annual Conference',
  description: 'Join us for our annual conference featuring the latest in business education trends, networking opportunities, and professional development sessions.',
  year: 2025,
  schedule: {
    date: new Date('2025-10-15'),
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/New_York'
  },
  location: {
    venue: 'Manchester Downtown Hotel',
    address: {
      street: '700 Elm St',
      city: 'Manchester',
      state: 'NH',
      zipCode: '03101'
    },
    virtualOption: false
  },
  registration: {
    isOpen: true,
    openDate: new Date('2025-07-01'),
    closeDate: new Date('2025-10-10'),
    capacity: 150,
    currentCount: 0,
    waitlistEnabled: true,
    fees: {
      member: 100,
      nonMember: 150,
      student: 50,
      earlyBird: {
        amount: 75,
        deadline: new Date('2025-09-01')
      }
    },
    requiredFields: ['fullName', 'email', 'institution'],
    waitingList: []
  },
  media: {
    imageURL: '/images/conference-2025.jpg'
  },
  status: 'registration_open',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    featured: true
  }
};