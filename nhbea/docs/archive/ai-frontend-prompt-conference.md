# AI Frontend Generation Prompt: NHBEA "Shaping the Future" Conference Page

## Project Context

You are building a responsive conference page for the **NHBEA (National High School Business Education Association) 2025 Annual Conference** titled **"Shaping the Future"**. This conference focuses on AI, sustainability, and digital economy trends for business educators. The site uses **Next.js 15 with TypeScript**, **Tailwind CSS**, **ShadCN UI components**, and **Firebase Firestore** for data management.

### Tech Stack:
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS with mobile-first responsive design
- **Components**: ShadCN UI component library
- **Backend**: Firebase Firestore (serverless architecture)
- **Payment**: Square API integration via Firebase Cloud Functions

## High-Level Goal

Create a professional, engaging, and fully responsive conference page (`/src/app/conference/page.tsx`) that showcases the NHBEA 2025 Conference with the theme "Shaping the Future" and enables seamless registration functionality. The page must inspire business educators to attend while providing all necessary conference information and a frictionless registration experience.

## Detailed Step-by-Step Instructions

### 1. Page Structure and Layout
1. Create the main conference page component at `/src/app/conference/page.tsx`
2. Import necessary components, types, and utilities from the existing codebase
3. Implement the following layout structure (mobile-first):
   - Hero section with conference branding and key details
   - Theme overview section highlighting AI, sustainability, and digital economy
   - Conference details (date, location, schedule)
   - Speaker highlights and session previews
   - Pricing and registration section
   - Call-to-action for registration
   - FAQ section addressing common questions

### 2. Hero Section Implementation
1. Create a visually striking hero with the conference theme "Shaping the Future"
2. Display conference title: "2025 NHBEA Annual Conference: Shaping the Future"
3. Include subtitle emphasizing AI, sustainability, and digital economy for business educators
4. Show key conference details: October 15, 2025 | Manchester Downtown Hotel, NH
5. Add prominent "Register Now" CTA button
6. Use gradient backgrounds and modern typography to convey innovation
7. Ensure full responsiveness with appropriate text sizing and spacing

### 3. Theme Overview Section
1. Create a dedicated section explaining the "Shaping the Future" theme
2. Include three key focus areas with icons and descriptions:
   - **AI in Business Education**: How artificial intelligence is transforming curriculum and teaching methods
   - **Sustainability & Green Business**: Preparing students for the sustainable economy of tomorrow
   - **Digital Economy Trends**: Understanding the future of work and commerce
3. Use engaging visuals and modern card layouts
4. Implement smooth animations and hover effects

### 4. Conference Details Section
1. Display comprehensive conference information using clean, scannable layouts:
   - **Date & Time**: October 15, 2025, 9:00 AM - 5:00 PM (EST)
   - **Venue**: Manchester Downtown Hotel, 700 Elm St, Manchester, NH 03101
   - **Format**: In-person networking and sessions
   - **Capacity**: Limited to 150 attendees
2. Include a mini-schedule preview with key session highlights
3. Add an interactive element showing registration status and spots remaining

### 5. Pricing & Registration Section
1. Display pricing tiers clearly:
   - **Early Bird** (before Sept 1): $75
   - **NHBEA Members**: $100
   - **Non-Members**: $150
   - **Students**: $50
2. Highlight early bird savings with countdown timer if applicable
3. Include registration benefits and what's included
4. Add a prominent registration form integration

### 6. Registration Form Integration
1. Import and use the existing `ConferenceRegistrationForm` component
2. Ensure proper form validation using the existing `conferenceValidation` utilities
3. Handle form submission with appropriate loading states and error handling
4. Redirect to Square payment processing upon successful form submission
5. Display clear privacy and terms information

### 7. FAQ Section
1. Include common questions about:
   - Registration process and payment
   - Conference agenda and sessions
   - Venue information and accommodations
   - Cancellation and refund policies
   - Special dietary requirements and accessibility
2. Use an accordion-style layout for clean presentation

### 8. Call-to-Action Elements
1. Strategically place registration CTAs throughout the page
2. Use urgency elements like "Limited Seats Available" or "Early Bird Pricing Ends Soon"
3. Include social proof elements if available (past attendee testimonials)

## Code Examples, Data Structures & Constraints

### Required Imports:
```typescript
import { Suspense } from 'react';
import { getCurrentConference, checkRegistrationAvailability } from '@/lib/conference';
import { ConferenceRegistrationFormWrapper } from '@/components/ConferenceRegistrationFormWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Clock, Zap, Leaf, TrendingUp } from 'lucide-react';
```

### Expected Conference Data Structure:
```typescript
interface ConferenceData {
  id: 'conference-2025';
  title: '2025 NHBEA Annual Conference';
  description: string;
  year: 2025;
  schedule: {
    date: Date; // October 15, 2025
    startTime: '09:00';
    endTime: '17:00';
    timezone: 'America/New_York';
  };
  location: {
    venue: 'Manchester Downtown Hotel';
    address: {
      street: '700 Elm St';
      city: 'Manchester';
      state: 'NH';
      zipCode: '03101';
    };
  };
  registration: {
    isOpen: boolean;
    capacity: 150;
    currentCount: number;
    fees: {
      member: 100;
      nonMember: 150;
      student: 50;
      earlyBird: { amount: 75; deadline: Date };
    };
  };
}
```

### Theme Colors (Tailwind Classes):
- Primary: `bg-blue-600`, `text-blue-600`
- Secondary: `bg-green-600`, `text-green-600` (sustainability theme)
- Accent: `bg-orange-500`, `text-orange-500` (innovation theme)
- Neutral: `bg-slate-100`, `text-slate-900`

### Responsive Breakpoints:
- Mobile: Default (< 640px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large Desktop: `xl:` (1280px+)

### Required Accessibility Features:
- All images must have proper `alt` attributes
- Proper heading hierarchy (h1, h2, h3)
- Focus management for interactive elements
- ARIA labels for complex UI components
- Color contrast ratios meeting WCAG 2.1 AA standards

### Data Fetching Pattern:
```typescript
export default async function ConferencePage() {
  const conference = await getCurrentConference();
  const availability = await checkRegistrationAvailability('conference-2025');
  
  if (!conference) {
    return <ConferenceNotFound />;
  }
  
  return (
    <div className="min-h-screen">
      {/* Page content */}
    </div>
  );
}
```

## Strict Scope Boundaries

### What You SHOULD Create/Modify:
- `/src/app/conference/page.tsx` - Main conference page component
- Add any necessary utility functions within the same file
- Enhance styling using existing Tailwind classes

### What You MUST NOT Touch:
- Do NOT modify existing `/src/lib/conference.ts` functions
- Do NOT alter `/src/components/ConferenceRegistrationForm.tsx` or its wrapper
- Do NOT change Firebase configuration or API routes
- Do NOT modify the existing data validation schemas
- Do NOT change the overall site header, footer, or navigation components
- Do NOT create new API endpoints or modify existing ones

### Component Integration Requirements:
- Use the existing `ConferenceRegistrationFormWrapper` component for registration
- Leverage existing ShadCN UI components from `/src/components/ui/`
- Follow the established TypeScript patterns from the codebase
- Maintain consistency with the existing design system

### Performance Requirements:
- Implement proper loading states for async operations
- Use Suspense boundaries where appropriate
- Optimize images with Next.js Image component
- Ensure Core Web Vitals compliance (< 3s FCP)

### Mobile-First Design Requirements:
1. **Mobile Layout (< 640px)**:
   - Single column layout
   - Stacked sections with adequate spacing
   - Thumb-friendly button sizes (min 44px height)
   - Collapsible navigation elements
   - Optimized typography for small screens

2. **Tablet Layout (768px+)**:
   - Two-column layouts where appropriate
   - Enhanced spacing and typography
   - Side-by-side content blocks

3. **Desktop Layout (1024px+)**:
   - Multi-column layouts for content sections
   - Hero sections with side-by-side content
   - Enhanced interactive elements
   - Larger typography and generous spacing

## Expected Output Format

```typescript
import { Suspense } from 'react';
import { getCurrentConference, checkRegistrationAvailability } from '@/lib/conference';
import { ConferenceRegistrationFormWrapper } from '@/components/ConferenceRegistrationFormWrapper';
// ... other imports

export default async function ConferencePage() {
  // Data fetching logic
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        {/* Hero content */}
      </section>
      
      {/* Theme Overview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        {/* Theme content */}
      </section>
      
      {/* Conference Details Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {/* Conference details */}
      </section>
      
      {/* Pricing & Registration Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading registration...</div>}>
          <ConferenceRegistrationFormWrapper />
        </Suspense>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {/* FAQ content */}
      </section>
    </div>
  );
}
```

## Important Final Notes

- **User Experience Priority**: Focus on creating an inspiring and trustworthy experience that motivates business educators to register
- **Business Context**: Remember this is for professional educators - maintain a balance between modern design and professional credibility
- **Registration Flow**: The registration form should feel seamless and secure, building confidence in the payment process
- **Content Strategy**: Emphasize the value proposition - how this conference will help educators prepare students for the future
- **Performance**: Ensure fast loading times as educators may be accessing this during school hours with varying connection quality

**CRITICAL REMINDER**: All AI-generated code will require careful human review, testing, and refinement before being considered production-ready. Pay special attention to accessibility compliance, form validation edge cases, and responsive behavior across all device sizes.