/**
 * V1 Data Model Types - Aligned with existing CSV structure
 * These types match exactly what's in your V1 Data export
 */

// Member - Matches Members.csv structure exactly
export interface V1Member {
  id: string;
  
  // Personal Information (nested as in V1)
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  };
  
  // Organization (nested as in V1)
  organization: {
    address: string; // Reference like "organizations/hzLJH8GFPglBkzhHUH21"
    title: string;   // Job title like "Business Teacher"
  };
  
  // Membership (nested as in V1)
  membership: {
    type: 'individual' | 'institutional' | 'student' | 'honorary';
    membershipYear?: string | null;
    status: 'active' | 'inactive' | 'pending' | 'expired';
    renewalDate?: Date | null;
    autoRenewal: boolean;
    joinDate?: Date | null;
  };
  
  // Profile (nested as in V1)
  profile: {
    activeBoardMember: boolean;
    boardPosition?: string; // "President", "Past President", etc.
    boardOrder?: number;    // 1, 2, 3, etc.
    bio?: string;
  };
  
  // Preferences (nested as in V1)
  preferences: {
    emailNotifications: boolean;
    directoryListing: boolean;
    newsletterSubscription: boolean;
  };
  
  // Metadata (nested as in V1)
  metadata: {
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Organization - Matches Organizations.csv structure exactly
export interface V1Organization {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university' | 'business' | 'government' | 'nonprofit' | 'other';
  isActive: boolean;
  
  // Address (nested as in V1)
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Contact (nested as in V1)
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Registrant - Matches Registrants.csv structure exactly
export interface V1Registrant {
  id: string;
  
  // Participant (nested as in V1)
  participant: {
    institution: string;
    fullName?: {
      first_name?: string;
      last_name?: string;
    };
    phone?: string;
    email: string;
    membershipStatus: 'member' | 'non-member' | 'student';
  };
  
  // Registration (nested as in V1)
  registration: {
    registrationType: 'regular' | 'early_bird' | 'student' | 'speaker';
    totalAmount: number;
    registrationDate: Date;
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  };
  
  status: 'registered' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  
  // Preferences (nested as in V1)
  preferences: {
    networkingOptIn: boolean;
    accessibilityNeeds?: string;
    sessionPreferences?: string[];
    dietaryRestrictions?: string;
  };
  
  // Communications (nested as in V1)
  communications: {
    remindersSent: number;
    confirmationSent: boolean;
  };
  
  // Conference Info
  conferenceTitle: string;
  conferenceId: string;
  conferenceYear: number;
  
  // Metadata (nested as in V1)
  metadata: {
    updatedAt: Date;
    source: string;
    createdAt: Date;
  };
}

// Sponsor - Matches Sponsors.csv structure exactly
export interface V1Sponsor {
  id: string;
  name: string;
  website: string;
  order: number;
  logo?: string;
}

// Additional types for collections not in V1 but needed
export interface V1Conference {
  id: string;
  title: string;
  year: number;
  description?: string;
  date?: Date;
  location?: string;
  registrationOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface V1Content {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageURL?: string;
  missionTitle: string;
  missionContent: string;
  aboutTitle: string;
  aboutContent: string;
}

export interface V1PastPresident {
  id: string;
  name: string;
  term: string;
  order: number;
}

// Utility types for CRUD operations
export type CreateV1MemberData = Omit<V1Member, 'id' | 'metadata'> & {
  metadata?: Partial<V1Member['metadata']>;
};

export type UpdateV1MemberData = Partial<Omit<V1Member, 'id' | 'metadata'>> & {
  metadata?: Partial<V1Member['metadata']>;
};

export type CreateV1OrganizationData = Omit<V1Organization, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateV1RegistrantData = Omit<V1Registrant, 'id' | 'metadata'>;
export type CreateV1SponsorData = Omit<V1Sponsor, 'id'>;
export type CreateV1ConferenceData = Omit<V1Conference, 'id' | 'createdAt' | 'updatedAt'>;

// Helper function to extract organization ID from reference string
export function extractOrganizationId(reference: string): string {
  // "organizations/hzLJH8GFPglBkzhHUH21" -> "hzLJH8GFPglBkzhHUH21"
  return reference.split('/').pop() || '';
}

// Helper function to create organization reference string
export function createOrganizationReference(organizationId: string): string {
  return `organizations/${organizationId}`;
}