# NHBEA Application Architecture Document

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Data Models](#data-models)
3. [API Specification](#api-specification)
4. [Components](#components)
5. [External APIs](#external-apis)
6. [Core Workflows](#core-workflows)
7. [Database Schema](#database-schema)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Development and Deployment](#development-and-deployment)

## Tech Stack

### Frontend
- **Framework**: Next.js 15.4.4 with React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.17 with tailwindcss-animate
- **UI Components**: 
  - Radix UI (@radix-ui/react-select, @radix-ui/react-slot, @radix-ui/react-tabs)
  - Lucide React (icons)
  - Class Variance Authority (component variants)
- **Forms**: React Hook Form 7.61.1 with Zod 4.0.10 validation
- **State Management**: Zustand 5.0.7
- **Build & Deployment**: Static export for Firebase hosting

### Backend
- **Runtime**: Node.js 20 (Firebase Functions)
- **Framework**: Express.js 5.1.0 with CORS 2.8.5
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Functions**: Firebase Functions v2

### Third-Party Services
- **Payments**: Square API 43.0.1 (Sandbox/Production)
- **Email**: Built-in Firebase capabilities
- **Hosting**: Firebase Hosting
- **Analytics**: Firebase Analytics (implied)

### Development Tools
- **Package Manager**: npm
- **Type Checking**: TypeScript with strict mode
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js built-in bundler

## Data Models

### Core Entity Relationships
```
Member 1:N PaymentRecord
Member 1:N AwardNomination (as nominator)
Member 1:1 Organization (reference)
Conference 1:N ConferenceRegistrant
Conference 1:N ConferenceSession
Conference 1:N ConferenceSpeaker
Award 1:N AwardNomination
```

### Member Data Model
```typescript
interface Member {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  membership: {
    type: 'individual' | 'student' | 'retired' | 'honorary';
    status: 'active' | 'inactive' | 'suspended' | 'expired';
    membershipYear?: string;
    renewalDate?: Date;
    autoRenewal: boolean;
    joinDate?: Date;
  };
  organization: {
    address: string; // Reference to Organization document
    title: string;   // Position at organization
  };
  profile: {
    activeBoardMember: boolean;
    boardPosition?: string;
    boardOrder?: number;
    bio?: string;
    past_president?: {
      past_president: boolean;
      year_started?: number;
      year_ended?: number;
    };
    isHallOfFame?: boolean;
    hallOfFameYear?: number;
  };
  preferences: {
    emailNotifications: boolean;
    directoryListing: boolean;
    newsletterSubscription: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
  };
}
```

### Conference Registration Data Model
```typescript
interface ConferenceRegistrant {
  id: string;
  conferenceId: string;
  memberId?: string; // null for non-members
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    organization?: string;
  };
  registrationDate: Date;
  registrationStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount: number;
  squarePaymentId?: string;
  squareOrderId?: string;
  checkedIn: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}
```

### Award Nomination Data Model
```typescript
interface AwardNomination {
  id: string;
  awardId: string;
  nomineeInfo: {
    name: string;
    email?: string;
    organization?: string;
    position?: string;
  };
  nominatorInfo: {
    name: string;
    email: string;
    organization?: string;
    position?: string;
    memberId?: string;
  };
  awardCategory: string;
  nominationText: string;
  supportingDocuments?: string[];
  submissionDate: Date;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
}
```

## API Specification

### Base URL
- Development: `http://localhost:5001/nhbea-project/us-central1/api`
- Production: `https://us-central1-nhbea-project.cloudfunctions.net/api`

### Authentication
All administrative endpoints require Firebase Auth tokens in the Authorization header:
```
Authorization: Bearer <firebase-auth-token>
```

### Endpoints

#### Membership API
```
POST /api/membership
Content-Type: application/json

Request Body:
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string",
  "institution": "string",
  "position": "string",
  "membershipType": "new" | "renewal",
  "communicationPreferences": {
    "newsletter": boolean,
    "updates": boolean,
    "events": boolean
  }
}

Response:
{
  "success": boolean,
  "message": "string",
  "paymentUrl": "string", // Square payment link
  "error"?: "string"
}
```

#### Award Nominations API
```
POST /api/nominations
Content-Type: application/json

Request Body:
{
  "awardId": "string",
  "awardCategory": "string",
  "nomineeInfo": {
    "name": "string",
    "email": "string",
    "organization": "string",
    "position": "string"
  },
  "nominatorInfo": {
    "name": "string", 
    "email": "string",
    "organization": "string",
    "position": "string"
  },
  "nominationText": "string",
  "agreedToTerms": boolean
}

Response:
{
  "success": boolean,
  "message": "string",
  "nominationId": "string",
  "error"?: "string"
}
```

#### Conference Registration API
```
POST /api/conference/register
Content-Type: application/json

Request Body:
{
  "conferenceId": "string",
  "conferenceTitle": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "institution": "string",
  "membershipStatus": "member" | "non-member" | "student",
  "registrationType": "string",
  "totalAmount": number,
  "dietaryRestrictions": "string",
  "accessibilityNeeds": "string",
  "agreeToTerms": boolean
}

Response:
{
  "success": boolean,
  "message": "string",
  "paymentUrl": "string",
  "registrantId": "string",
  "error"?: "string"
}
```

#### Square Webhook
```
POST /api/square/webhook
Content-Type: application/json
Headers: x-square-hmacsha256-signature

Handles payment confirmation events from Square
```

#### Health Check
```
GET /api/health

Response:
{
  "status": "healthy",
  "runtime": "nodejs20",
  "timestamp": "ISO-8601-string"
}
```

## Components

### Core Layout Components
- `Header.tsx` - Main navigation with responsive design
- `Footer.tsx` - Site footer with newsletter signup
- `Layout.tsx` - Root application layout wrapper
- `Logo.tsx` - NHBEA logo component

### Form Components
- `FormField.tsx` - Reusable form input field
- `FormSelect.tsx` - Dropdown select component
- `FormCheckbox.tsx` - Checkbox input component
- `FormProgressIndicator.tsx` - Multi-step form progress

### Dynamic Form Components
- `ProfessionalMembershipForm.tsx` - Professional membership registration
- `StudentMembershipForm.tsx` - Student membership application
- `AwardNominationForm.tsx` - Award nomination submission
- `ConferenceRegistrationForm.tsx` - Conference registration

### Content Display Components
- `FlexibleHero.tsx` - Reusable hero section component
- `EnhancedAboutSection.tsx` - About page content section
- `EnhancedMissionSection.tsx` - Mission statement display
- `BoardMembersSection.tsx` - Board member grid display
- `PastPresidentsSection.tsx` - Past presidents showcase
- `EnhancedHallOfFameGrid.tsx` - Hall of fame member grid
- `SponsorsSection.tsx` - Sponsor logos and information

### Admin Interface Components
```
src/components/admin/
├── UserManagement.tsx
├── MembershipApproval.tsx
├── NominationReview.tsx
└── ConferenceManagement.tsx
```

### Utility Components
- `MemberImage.tsx` - Optimized member photo display
- `NewsletterSignup.tsx` - Email subscription form
- `StructuredData.tsx` - SEO structured data
- `PerformanceMonitor.tsx` - Client-side performance tracking
- `DarkModeToggle.tsx` - Theme switching capability

## External APIs

### Square Payments Integration
```typescript
// Square Client Configuration
const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox
});

// Payment Link Creation
const createPaymentLinkResponse = await checkoutApi.createPaymentLink({
  idempotencyKey: registrantId,
  quickPay: {
    name: "Conference Registration",
    priceMoney: {
      amount: totalAmount * 100, // Convert to cents
      currency: 'USD'
    },
    locationId: locationId
  },
  checkoutOptions: {
    redirectUrl: `${baseUrl}/conference/success`,
    merchantSupportEmail: 'support@nhbea.org'
  }
});
```

### Firebase Services Integration
```typescript
// Firestore Database
import { getFirestore, collection, doc, addDoc, updateDoc } from 'firebase/firestore';

// Firebase Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase Authentication
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
```

### Email Notifications
- Conference registration confirmations
- Membership application receipts
- Award nomination acknowledgments
- Administrative notifications

## Core Workflows

### Membership Registration Workflow
1. **Form Submission**
   - User fills out professional membership form
   - Client-side validation with Zod schemas
   - Form data sent to `/api/membership`

2. **Server Processing**
   - Server-side validation
   - Data sanitization and preparation
   - Temporary storage in pending collection

3. **Payment Processing**
   - Square payment link creation
   - Redirect to Square checkout
   - Webhook handles payment confirmation

4. **Completion**
   - Payment confirmed via webhook
   - Member record created in Firestore
   - Confirmation email sent

### Conference Registration Workflow
1. **Registration Form**
   - User provides personal and professional information
   - Membership status determines pricing
   - Special needs and preferences captured

2. **Data Storage**
   - Registrant record created immediately
   - Payment status set to 'pending'
   - Square payment link generated

3. **Payment Processing**
   - User redirected to Square checkout
   - Payment completion triggers webhook
   - Registration status updated to 'confirmed'

4. **Post-Registration**
   - Confirmation email with receipt
   - Calendar invitation (if applicable)
   - Check-in preparation

### Award Nomination Workflow
1. **Nomination Submission**
   - Nominator provides nominee and self information
   - Detailed nomination text (50-2000 characters)
   - Supporting documents upload

2. **Storage and Review**
   - Nomination stored in Firestore
   - Admin notification sent
   - Status tracking ('pending' → 'under_review' → 'approved'/'rejected')

3. **Administrative Review**
   - Admin interface for nomination review
   - Review notes and decision recording
   - Status updates and notifications

### Admin Configuration Workflow
1. **Content Management**
   - Board member information updates
   - Award configuration and deadlines
   - Conference setup and management

2. **User Management**
   - Member status updates
   - Payment record management
   - Communication preferences

3. **Reporting and Analytics**
   - Membership statistics
   - Conference attendance tracking
   - Financial reporting

## Database Schema

### Firestore Collections Structure
```
nhbea-project/
├── members/                    # Member records
│   ├── {memberId}/
│   │   ├── personalInfo/
│   │   ├── membership/
│   │   ├── organization/
│   │   ├── profile/
│   │   ├── preferences/
│   │   └── metadata/
│   └── paymentRecords/         # Subcollection
├── organizations/              # Institution data
├── conferences/                # Conference definitions
├── conferenceRegistrants/      # Registration records
├── awards/                     # Award definitions
├── nominations/                # Award nominations
├── sponsors/                   # Sponsor information
├── content/                    # CMS content pages
├── newsletterSubscribers/      # Email subscriptions
└── configurations/             # System settings
```

### Data Relationships and Constraints
- Member documents reference organization documents
- Conference registrants reference member documents (optional)
- Nominations reference award documents
- Payment records maintain audit trail
- All documents include metadata for tracking

### Indexes and Performance
```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "members",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "membership.status", "order": "ASCENDING" },
        { "fieldPath": "membership.type", "order": "ASCENDING" },
        { "fieldPath": "metadata.createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "conferenceRegistrants", 
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "conferenceId", "order": "ASCENDING" },
        { "fieldPath": "paymentStatus", "order": "ASCENDING" },
        { "fieldPath": "registrationDate", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Frontend Architecture

### Component Hierarchy
```
App (layout.tsx)
├── Header
├── Main Content
│   ├── Page Components
│   │   ├── Home (page.tsx)
│   │   ├── About (about/page.tsx)
│   │   ├── Membership
│   │   │   ├── Professional (membership/professional/page.tsx)
│   │   │   └── Student (membership/student/page.tsx)
│   │   ├── Awards (awards/page.tsx)
│   │   ├── Conference (conference/page.tsx)
│   │   └── Hall of Fame (hall-of-fame/page.tsx)
│   └── Admin Section
│       ├── Dashboard (admin/page.tsx)
│       ├── User Management (admin/users/page.tsx)
│       └── Login (admin/login/page.tsx)
└── Footer
```

### State Management Architecture
```typescript
// Zustand stores
interface AppState {
  // User authentication state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Form state
  currentForm: FormData | null;
  formProgress: number;
  
  // Performance monitoring
  pageLoadTimes: Record<string, number>;
}

// Store actions
interface AppActions {
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  updateFormProgress: (progress: number) => void;
  trackPageLoad: (page: string, time: number) => void;
}
```

### Routing Structure
- **Static Routes**: `/`, `/about`, `/awards`, `/hall-of-fame`
- **Dynamic Routes**: `/conference/[id]`, `/awards/[category]`
- **API Routes**: `/api/membership`, `/api/nominations`, `/api/conference/register`
- **Protected Routes**: `/admin/*` (requires authentication)

### Performance Optimizations
- Static site generation with Next.js export
- Image optimization with Firebase Storage URLs
- Component lazy loading for admin sections
- Service worker for offline functionality
- Performance monitoring with custom hooks

## Backend Architecture

### Firebase Functions Structure
```
functions/
├── index.js                   # Main entry point
├── api/
│   ├── membership.js         # Membership endpoints
│   ├── nominations.js        # Award nomination endpoints
│   ├── conference.js         # Conference registration
│   └── square.js             # Payment webhooks
├── triggers/
│   ├── onUserCreate.js       # New user setup
│   ├── onPaymentComplete.js  # Payment processing
│   └── onNominationSubmit.js # Notification triggers
└── utils/
    ├── validation.js         # Input validation
    ├── email.js              # Email utilities
    └── square.js             # Square API helpers
```

### Payment Processing Architecture
```typescript
// Square Integration Flow
1. Create Payment Link
   ↓
2. User Completes Payment
   ↓  
3. Square Webhook Notification
   ↓
4. Update Firestore Records
   ↓
5. Send Confirmation Email
```

### Error Handling Strategy
```typescript
// Centralized error handling
interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Error response format
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid form data provided',
    details: ['Email is required', 'Phone format invalid']
  }
}
```

### Security Measures
- Firebase Security Rules for Firestore
- CORS configuration for API endpoints
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Webhook signature verification for Square

### Monitoring and Logging
- Firebase Functions logs
- Custom error tracking
- Performance metrics collection
- Payment transaction logging
- User activity monitoring

## Development and Deployment

### Environment Configuration
```bash
# Development
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nhbea-dev
SQUARE_ENVIRONMENT=sandbox
SQUARE_ACCESS_TOKEN=sandbox_token

# Production  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nhbea-prod
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=production_token
```

### Build Process
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start", 
    "deploy": "npm run build && firebase deploy",
    "deploy:hosting": "npm run build && firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions"
  }
}
```

### Deployment Pipeline
1. **Development**
   - Local development with Firebase emulators
   - Hot reloading with Next.js dev server
   - Local Square sandbox testing

2. **Staging**
   - Firebase hosting preview channels
   - Integration testing with staging database
   - Payment flow testing with Square sandbox

3. **Production**
   - Firebase hosting deployment
   - Functions deployment with proper environment variables
   - Square production payment processing
   - Monitoring and alerting setup

### Firebase Configuration
```json
// firebase.json
{
  "hosting": {
    "public": "out",
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|ico|svg)",
        "headers": [
          {
            "key": "Cache-Control", 
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### Quality Assurance
- TypeScript strict mode for type safety
- ESLint configuration for code quality
- Form validation with Zod schemas
- Unit testing for critical functions
- Integration testing for payment flows
- Performance monitoring and optimization

### Backup and Recovery
- Firestore automatic backups
- Payment transaction audit logs
- Configuration version control
- Disaster recovery procedures
- Data export capabilities

---

This architecture document provides a comprehensive overview of the NHBEA application structure, covering all major components, workflows, and technical decisions. The system is designed for scalability, maintainability, and reliable payment processing while providing a modern user experience.