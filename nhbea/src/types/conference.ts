export interface Conference {
  // Document ID: conference-2025, conference-2026, etc.
  id: string;
  
  // Basic Information
  title: string;
  description: string;
  year: number;
  
  // Event Details
  schedule: {
    date: Date;
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
    timezone: string;  // "America/New_York"
  };
  
  // Location
  location: {
    venue: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    virtualOption?: boolean;
    virtualLink?: string;
  };
  
  // Registration Management
  registration: {
    isOpen: boolean;
    openDate: Date;
    closeDate: Date;
    capacity: number;
    currentCount: number; // Maintained via Cloud Functions
    waitlistEnabled: boolean;
    
    // Pricing
    fees: {
      member: number;
      nonMember: number;
      student: number;
      earlyBird?: {
        amount: number;
        deadline: Date;
      };
    };
    
    // Requirements
    requiredFields: string[];
    waitingList: string[]; // Array of member IDs
  };
  
  // Content & Media
  media: {
    imageURL?: string;
    brochureURL?: string;
    programURL?: string;
  };
  
  // AI/Automation Hints
  aiHint?: string; // For automated content generation
  
  // Status Management
  status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'completed' | 'cancelled';
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    featured: boolean;
  };
}

export interface Registrant {
  // Document ID: auto-generated
  id: string;
  
  // Conference Reference
  conferenceId: string;
  conferenceTitle: string; // Denormalized for easy queries
  conferenceYear: number;
  
  // Registrant Information
  participant: {
    fullName: string;
    email: string;
    phone?: string;
    institution: string;
    membershipId?: string; // Link to members collection
    membershipStatus: 'member' | 'non-member' | 'student';
  };
  
  // Registration Details
  registration: {
    registrationDate: Date;
    registrationType: 'regular' | 'early_bird' | 'student' | 'speaker';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
    totalAmount: number;
    discountApplied?: string;
    
    // Payment Integration
    paymentDetails?: {
      squareOrderId?: string;
      transactionId?: string;
      paymentMethod: string;
      paidAt?: Date;
    };
  };
  
  // Preferences
  preferences: {
    dietaryRestrictions?: string;
    accessibilityNeeds?: string;
    sessionPreferences?: string[];
    networkingOptIn: boolean;
  };
  
  // Status Tracking
  status: 'registered' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  
  // Communication Log
  communications: {
    confirmationSent: boolean;
    remindersSent: number;
    lastContactDate?: Date;
  };
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    source: 'website' | 'admin' | 'import';
  };
}

// Utility types for conference operations
export type CreateConferenceData = Omit<Conference, 'id' | 'metadata'> & {
  metadata?: Partial<Conference['metadata']>;
};

export type UpdateConferenceData = Partial<Omit<Conference, 'id' | 'metadata'>> & {
  metadata?: Partial<Conference['metadata']>;
};

export type CreateRegistrantData = Omit<Registrant, 'id' | 'metadata'> & {
  metadata?: Partial<Registrant['metadata']>;
};

export type UpdateRegistrantData = Partial<Omit<Registrant, 'id' | 'metadata'>> & {
  metadata?: Partial<Registrant['metadata']>;
};