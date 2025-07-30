# Component Specifications

## Design System Approach

We will use the existing ShadCN UI component library, which is built on Tailwind CSS. This provides a set of accessible, unstyled components that can be tailored to our specific brand needs. We will not be creating a new design system from scratch.

## Core Components

### Base UI Components
- **Buttons**: Primary, secondary, and tertiary button styles for various actions
- **Input Fields**: Text inputs, email inputs, phone number inputs with proper validation styling
- **Forms**: Complete form layouts with proper spacing, validation messages, and submission states
- **Cards**: For displaying members, awards, board members, and other content blocks
- **Tables**: For data display with sorting and filtering capabilities
- **Navigation elements**: Header navigation, footer navigation, and mobile menu components

### Conference-Specific Components

#### ConferenceHero
```tsx
interface ConferenceHeroProps {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  registrationUrl: string;
  backgroundImage?: string;
  earlyBirdDeadline?: string;
}
```
- Large hero section with conference branding
- Prominent registration call-to-action
- Key event details (date, location, theme)
- Countdown timer for early bird pricing
- Background image or video support

#### ConferenceSchedule
```tsx
interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  room: string;
  description: string;
  track: string;
}

interface ConferenceScheduleProps {
  days: {
    date: string;
    sessions: Session[];
  }[];
  showFilters: boolean;
}
```
- Multi-day schedule grid view
- Track-based filtering
- Speaker modal popups
- Session detail expansion
- Add to calendar functionality
- Mobile-responsive timeline view

#### SpeakerGrid
```tsx
interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  photo: string;
  sessions: string[];
  linkedin?: string;
  twitter?: string;
}

interface SpeakerGridProps {
  speakers: Speaker[];
  featured?: string[];
  showBios: boolean;
}
```
- Responsive grid layout
- Featured speaker highlighting
- Bio modal overlays
- Social media links
- Session cross-references

#### RegistrationForm
```tsx
interface RegistrationFormProps {
  memberDiscount: number;
  earlyBirdDiscount: number;
  registrationTiers: {
    id: string;
    name: string;
    price: number;
    benefits: string[];
  }[];
  onSubmit: (data: RegistrationData) => void;
}
```
- Multi-step form with progress indicator
- Dynamic pricing based on membership status
- Dietary restrictions and accessibility needs
- Payment integration with Square
- Confirmation email triggers

#### VenueInformation
```tsx
interface VenueInformationProps {
  name: string;
  address: string;
  description: string;
  amenities: string[];
  directions: string;
  parking: string;
  accessibility: string;
  mapEmbedUrl: string;
}
```
- Interactive venue map
- Transportation information
- Accessibility details
- Nearby hotel recommendations
- Parking instructions

### Awards-Specific Components

#### AwardsGrid
```tsx
interface Award {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  deadline: string;
  recipients?: Recipient[];
}

interface AwardsGridProps {
  awards: Award[];
  showNominationForm: boolean;
  currentYear: number;
}
```
- Award category display
- Nomination deadline tracking
- Past recipient showcases
- Nomination form integration

#### NominationForm
```tsx
interface NominationFormProps {
  awardId: string;
  requiredFields: string[];
  maxFileSize: number;
  allowedFileTypes: string[];
  onSubmit: (data: NominationData) => void;
}
```
- Multi-section nomination form
- File upload for supporting documents
- Character limits and validation
- Draft saving functionality
- Submission confirmation

#### HallOfFameDisplay
```tsx
interface Recipient {
  id: string;
  name: string;
  award: string;
  year: number;
  organization: string;
  achievement: string;
  photo?: string;
}

interface HallOfFameDisplayProps {
  recipients: Recipient[];
  groupBy: 'year' | 'award' | 'name';
  showSearch: boolean;
}
```
- Searchable recipient database
- Multiple view modes (grid, list, timeline)
- Achievement highlighting
- Photo galleries

### Membership-Specific Components

#### MembershipTiers
```tsx
interface MembershipTier {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  popular?: boolean;
}

interface MembershipTiersProps {
  tiers: MembershipTier[];
  currentMembership?: string;
  showComparison: boolean;
}
```
- Side-by-side tier comparison
- Benefit highlighting
- Upgrade/downgrade options
- Popular tier indication

#### MemberDirectory
```tsx
interface Member {
  id: string;
  name: string;
  organization: string;
  location: string;
  specializations: string[];
  contactInfo: ContactInfo;
  profileImage?: string;
}

interface MemberDirectoryProps {
  members: Member[];
  searchFilters: FilterOptions;
  showContact: boolean;
  isLoggedIn: boolean;
}
```
- Advanced search and filtering
- Contact information protection
- Networking facilitation
- Export capabilities (for members)

### Navigation Components

#### MainNavigation
```tsx
interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  authRequired?: boolean;
}

interface MainNavigationProps {
  items: NavigationItem[];
  isLoggedIn: boolean;
  userRole: string;
  logo: string;
}
```
- Responsive mega menu
- Authentication-based visibility
- Mobile hamburger menu
- Breadcrumb integration

#### MemberPortalSidebar
```tsx
interface MemberPortalSidebarProps {
  user: Member;
  menuItems: NavigationItem[];
  notificationCount: number;
}
```
- Collapsible sidebar navigation
- User profile summary
- Notification indicators
- Quick action buttons

## Branding & Style Guide

### Visual Identity

The design incorporates the existing NHBEA logo and maintains professional academic branding while ensuring modern web accessibility and usability standards.

### Color System Reference

**Note**: The complete color system is defined in the [Brand Identity System](./brand-identity-system.md). This section provides a quick reference for component development.

#### Primary Brand Colors
```css
:root {
  /* Conservative Royal Blue System */
  --nhbea-royal-blue: #2563eb;          /* Primary brand color */
  --nhbea-royal-blue-dark: #1e40af;     /* Headers, emphasis */
  --nhbea-royal-blue-deeper: #1e3a8a;   /* Maximum authority */
  --nhbea-royal-blue-light: #3b82f6;    /* Links, secondary elements */
  --nhbea-royal-blue-lighter: #60a5fa;  /* Backgrounds, success states */
  
  /* Strategic Accent Colors (10% usage rule) */
  --nhbea-accent-orange: #ea580c;        /* Primary CTA accent */
  --nhbea-accent-gold: #fbbf24;          /* Achievement highlights */
  --nhbea-accent-green: #059669;         /* Progress, growth */
}
```

### Typography System Reference

**Note**: The complete typography hierarchy and implementation details are defined in the [Brand Identity System](./brand-identity-system.md). Key elements for component development:

#### Professional Font System
- **Primary**: Inter (headings, UI elements, navigation)
- **Secondary**: Georgia (long-form content, formal documents)
- **Font loading**: Google Fonts with fallbacks to system fonts

#### Typography Usage in Components
```css
/* Component-specific typography classes */
.component-title {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--nhbea-royal-blue);
}

.component-description {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--nhbea-gray-700);
}
```

### Spacing System

```css
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### Button System Reference

**Note**: Complete button specifications with advanced hover effects and brand-compliant styling are detailed in the [Brand Identity System](./brand-identity-system.md). Key button variants:

#### Button Hierarchy
1. **Primary Button**: Conservative royal blue, standard actions
2. **CTA Button**: Orange accent, high-priority actions (limited use)
3. **Secondary Button**: Outlined style, alternative actions
4. **Ghost Button**: Minimal style, tertiary actions

#### Component Implementation Example
```tsx
// Reference implementation - see Brand Identity System for complete CSS
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'cta' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Usage follows 60-30-10 rule: 
// - Primary buttons (blue): 60% of button usage
// - Secondary buttons (outlined): 30% of usage  
// - CTA buttons (orange): 10% of usage (max 1-2 per page)
```

### Card System Reference

**Note**: Enhanced card specifications with sophisticated hover effects and brand-compliant styling are detailed in the [Brand Identity System](./brand-identity-system.md).

#### Card Variants
1. **Standard Card**: Clean, professional for general content
2. **Featured Card**: Royal blue gradient for highlighted content  
3. **Interactive Card**: Enhanced hover effects for clickable content
4. **Heritage Card**: Traditional styling for historical content

#### Key Features
- Subtle brand accent reveals on hover
- Consistent border radius and shadow system
- Royal blue accent bars for visual hierarchy
- Smooth micro-interactions aligned with brand personality

### Form Styles

#### Input Fields
```css
.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--nhbea-gray-300);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--nhbea-primary-blue);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input.error {
  border-color: var(--nhbea-error);
}
```

#### Labels
```css
.form-label {
  display: block;
  font-weight: 500;
  color: var(--nhbea-gray-700);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}
```

### Navigation Styles

#### Main Navigation
```css
.main-nav {
  background-color: var(--nhbea-white);
  border-bottom: 1px solid var(--nhbea-gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: var(--nhbea-gray-700);
  font-weight: 500;
  padding: var(--space-4) var(--space-5);
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--nhbea-primary-blue);
  background-color: var(--nhbea-gray-50);
}
```

### Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Animation and Transitions

#### Standard Transitions
```css
.transition-standard {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Hover Effects
```css
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

This comprehensive style guide ensures consistent visual design across all NHBEA Connect components while maintaining accessibility and professional appearance standards.