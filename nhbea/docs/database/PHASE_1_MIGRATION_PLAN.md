# NHBEA Database Schema - Phase 1 Migration Plan

**Phase 1 Goal**: Implement core operational collections for membership and conference management

**Timeline**: 2 months  
**Priority**: Immediate implementation  
**Status**: Ready for execution

## Phase 1 Collections Overview

### Core Collections (4 collections)
1. **members** - Enhanced member management
2. **conference** - Event management  
3. **registrants** - Conference attendees
4. **site_settings** - Consolidated site configuration

## 1. Enhanced Members Collection

### Optimized Structure
```typescript
interface Member {
  // Document ID: auto-generated or custom member ID
  
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    preferredName?: string;
  };
  
  // Membership Details
  membership: {
    type: 'individual' | 'institutional' | 'student' | 'honorary';
    status: 'active' | 'inactive' | 'pending' | 'expired';
    joinDate: Timestamp;
    renewalDate: Timestamp;
    membershipYear: string; // "2025"
    autoRenewal: boolean;
  };
  
  // Professional Information
  organization: {
    name: string;
    position: string;
    title?: string;
    website?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // System Fields
  profile: {
    imageURL?: string;
    bio?: string;
    activeBoardMember: boolean;
    boardPosition?: string;
    boardOrder?: number;
  };
  
  // Preferences & Settings
  preferences: {
    emailNotifications: boolean;
    directoryListing: boolean;
    newsletterSubscription: boolean;
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy?: string;
    lastLoginAt?: Timestamp;
  };
}
```

### Migration from Current boardMembers
```javascript
// Migration script: boardMembers → members
const migrateBoardMembers = async () => {
  const boardMembers = await getBoardMembers();
  
  for (const member of boardMembers) {
    const enhancedMember = {
      personalInfo: {
        firstName: member.name.split(' ')[0],
        lastName: member.name.split(' ').slice(1).join(' '),
        email: `${member.name.toLowerCase().replace(' ', '.')}@nhbea.org`
      },
      membership: {
        type: 'individual',
        status: 'active',
        joinDate: new Date(),
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        membershipYear: '2025',
        autoRenewal: false
      },
      organization: {
        name: 'NHBEA',
        position: member.title
      },
      profile: {
        imageURL: member.imageURL,
        bio: member.bio,
        activeBoardMember: true,
        boardPosition: member.title,
        boardOrder: member.order
      },
      preferences: {
        emailNotifications: true,
        directoryListing: true,
        newsletterSubscription: true
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'migration_script'
      }
    };
    
    await addMember(enhancedMember);
  }
};
```

## 2. Enhanced Conference Collection

### Optimized Structure
```typescript
interface Conference {
  // Document ID: conference-2025, conference-2026, etc.
  
  // Basic Information
  title: string;
  description: string;
  year: number;
  
  // Event Details
  schedule: {
    date: Timestamp;
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
    openDate: Timestamp;
    closeDate: Timestamp;
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
        deadline: Timestamp;
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
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    featured: boolean;
  };
}
```

## 3. Enhanced Registrants Collection

### Optimized Structure
```typescript
interface Registrant {
  // Document ID: auto-generated
  
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
    registrationDate: Timestamp;
    registrationType: 'regular' | 'early_bird' | 'student' | 'speaker';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
    totalAmount: number;
    discountApplied?: string;
    
    // Payment Integration
    paymentDetails?: {
      squareOrderId?: string;
      transactionId?: string;
      paymentMethod: string;
      paidAt?: Timestamp;
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
    lastContactDate?: Timestamp;
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    source: 'website' | 'admin' | 'import';
  };
}
```

## 4. Consolidated Site Settings Collection

### Optimized Structure
```typescript
interface SiteSettings {
  // Document ID: "global" (single document)
  
  // Site Identity
  identity: {
    siteName: string;
    tagline: string;
    description: string;
    logoURL?: string;
    faviconURL?: string;
  };
  
  // Contact Information
  contact: {
    primaryEmail: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Social Media
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  
  // Content Settings
  content: {
    footerText: string;
    copyrightText: string;
    privacyPolicyURL?: string;
    termsOfServiceURL?: string;
  };
  
  // Feature Flags
  features: {
    membershipEnabled: boolean;
    conferenceRegistrationEnabled: boolean;
    nominationsEnabled: boolean;
    publicDirectoryEnabled: boolean;
    maintenanceMode: boolean;
  };
  
  // System Configuration
  system: {
    timezone: string;
    dateFormat: string;
    currency: string;
    analyticsId?: string;
  };
  
  // Metadata
  metadata: {
    updatedAt: Timestamp;
    updatedBy: string;
    version: string;
  };
}
```

## Migration Execution Plan

### Step 1: Backup Current Data
```bash
# Export current collections
firebase firestore:export gs://nhbea-backup/pre-phase1-migration/

# Create local backup of current code
git tag v1.2-pre-migration
git push origin v1.2-pre-migration
```

### Step 2: Create New Collection Structures
```typescript
// 1. Create enhanced members collection
const migrateMembers = async () => {
  // Migrate boardMembers → members (enhanced)
  // Migrate pastPresidents → members (historical)
};

// 2. Create conference collection  
const createConferences = async () => {
  // Create 2025 conference document
  // Set up registration structure
};

// 3. Consolidate site settings
const consolidateSettings = async () => {
  // Merge site_settings + sitesettings → site_settings
};
```

### Step 3: Update Application Code

#### New TypeScript Interfaces
```typescript
// File: src/types/members.ts
export interface Member { /* structure above */ }

// File: src/types/conference.ts  
export interface Conference { /* structure above */ }

// File: src/types/registrants.ts
export interface Registrant { /* structure above */ }

// File: src/types/siteSettings.ts
export interface SiteSettings { /* structure above */ }
```

#### Enhanced Data Fetching Functions
```typescript
// File: src/lib/members.ts
export async function getActiveMembers(): Promise<Member[]> {
  const q = query(
    collection(db, 'members'),
    where('membership.status', '==', 'active'),
    orderBy('personalInfo.lastName')
  );
  // Implementation
}

export async function getBoardMembers(): Promise<Member[]> {
  const q = query(
    collection(db, 'members'),
    where('profile.activeBoardMember', '==', true),
    orderBy('profile.boardOrder')
  );
  // Implementation
}

// File: src/lib/conference.ts
export async function getCurrentConference(): Promise<Conference | null> {
  // Get current year's conference
}

export async function getConferenceRegistrants(conferenceId: string): Promise<Registrant[]> {
  // Get all registrants for a conference
}
```

### Step 4: Update UI Components

#### Enhanced Board Members Section
```typescript
// File: src/components/BoardMembersSection.tsx
// Update to use new Member interface
// Add fallback to display from members collection where profile.activeBoardMember = true
```

#### New Member Directory Component
```typescript
// File: src/components/MemberDirectory.tsx
// Create public member directory
// Filter by preferences.directoryListing = true
```

#### Conference Registration Component
```typescript
// File: src/components/ConferenceRegistration.tsx  
// Create registration form
// Integrate with payment processing
```

### Step 5: Cloud Functions for Business Logic

```typescript
// File: functions/src/membershipTriggers.ts
export const updateMembershipStatus = functions.firestore
  .document('members/{memberId}')
  .onWrite(async (change, context) => {
    // Handle membership status changes
    // Send renewal reminders
    // Update board member displays
  });

// File: functions/src/conferenceTriggers.ts  
export const updateRegistrationCount = functions.firestore
  .document('registrants/{registrantId}')
  .onCreate(async (snap, context) => {
    // Update conference.registration.currentCount
    // Handle waitlist management
    // Send confirmation emails
  });
```

### Step 6: FireCMS Configuration Updates

```yaml
# File: firecms.config.js - Enhanced configuration
collections:
  members:
    name: "Members"
    path: "members"
    properties:
      personalInfo:
        dataType: "map"
        properties:
          firstName: { dataType: "string", validation: { required: true } }
          lastName: { dataType: "string", validation: { required: true } }
          email: { dataType: "string", validation: { required: true, email: true } }
      membership:
        dataType: "map"  
        properties:
          type: { 
            dataType: "string", 
            enumValues: ["individual", "institutional", "student", "honorary"]
          }
          status: {
            dataType: "string",
            enumValues: ["active", "inactive", "pending", "expired"]
          }
  
  conference:
    name: "Conferences"
    path: "conference"
    # ... detailed configuration
    
  registrants:
    name: "Conference Registrants"
    path: "registrants"
    # ... detailed configuration
```

## Testing Strategy

### Unit Tests
```typescript
// Test new data fetching functions
describe('Enhanced Members API', () => {
  test('getActiveMembers returns only active members', async () => {
    // Test implementation
  });
  
  test('getBoardMembers returns members ordered by boardOrder', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Test complete workflows
describe('Conference Registration Flow', () => {
  test('member can register for conference', async () => {
    // End-to-end registration test
  });
  
  test('registration count updates correctly', async () => {
    // Test Cloud Function triggers
  });
});
```

### Migration Validation
```typescript
// Verify data integrity after migration
describe('Data Migration Validation', () => {
  test('all board members migrated correctly', async () => {
    // Compare counts and data integrity
  });
  
  test('no data loss during migration', async () => {
    // Comprehensive data validation
  });
});
```

## Success Metrics

### Technical Metrics
- ✅ Zero data loss during migration
- ✅ All existing functionality maintained
- ✅ Page load times < 2 seconds
- ✅ 100% test coverage for new functions

### Business Metrics  
- ✅ Member management system functional
- ✅ Conference registration system operational
- ✅ Admin dashboard for member/conference management
- ✅ Board member display working from new structure

## Risk Mitigation

### Data Loss Prevention
- Complete backup before migration
- Staged migration with validation checkpoints
- Rollback procedures documented and tested

### Performance Monitoring
- Firestore query performance tracking
- Page load time monitoring
- Cost tracking for Firestore usage

### Rollback Plan
```bash
# If migration fails, restore from backup
firebase firestore:import gs://nhbea-backup/pre-phase1-migration/

# Revert code changes
git checkout v1.2-pre-migration
npm run deploy
```

## Next Steps After Phase 1

### Immediate (Week 1-2)
1. Execute migration scripts
2. Deploy updated application
3. Validate all functionality
4. Monitor performance and errors

### Short-term (Month 2)
1. User acceptance testing
2. Performance optimization
3. Documentation updates
4. Begin Phase 2 planning (awards & nominations)

### Success Criteria for Phase 2 Planning
- Phase 1 stable and performing well
- No critical issues with member/conference management
- Positive user feedback on new functionality
- Firestore performance meeting expectations

---

**Ready for implementation!** This plan provides a comprehensive roadmap for Phase 1 migration while maintaining system stability and preparing for future enhancements.