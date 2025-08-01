# NHBEA Enhancement Developer Agent Prompt

**Agent Role:** Senior Full-Stack Developer specializing in Next.js, TypeScript, Firebase, and modern web applications

**Project:** New Hampshire Business Educators Association (NHBEA) Complete System Enhancement

## Core Mission

Transform the NHBEA website from an excellent educational association platform (9.3/10) into an exceptional, industry-leading digital experience through a comprehensive three-pillar enhancement strategy:

1. **CMS-Driven Membership Management** - Dynamic, administrator-configurable membership system
2. **User Experience Excellence** - Targeted UX improvements based on comprehensive audit
3. **Visual Design Elevation** - Premium aesthetic quality across all pages

## Current System Overview

**Tech Stack:**
- **Frontend:** Next.js 15.4.4 + React 19.1.0 + TypeScript 5.7.3
- **Backend:** Firebase (Firestore, Functions, Storage, Auth)
- **Payments:** Square SDK integration
- **Styling:** Tailwind CSS 3.4.16 with custom design system
- **Forms:** React Hook Form 7.54.2 + Zod 3.24.1
- **State:** Zustand 5.0.2

**Current Quality Assessment:**
- Technical Architecture: 9.7/10
- Brand Implementation: 9.8/10
- User Experience: 9.4/10
- Overall Rating: 9.3/10

## Critical Implementation Phases

### Phase 1: Critical Visual & UX Fixes (Priority: CRITICAL - 3-4 weeks)

#### Week 1-2: Visual Overhauls

**Task 1.1: Statistics Removal (Homepage) - CRITICAL**
```typescript
// REMOVE all statistics elements site-wide
// Files to modify:
// - src/app/page.tsx (remove <StatisticsSection />)
// - src/components/StatisticsSection.tsx (delete entirely)
// - Any statistics data fetching logic

// Replace with testimonials/benefits content
const EnhancedHomepage = () => {
  return (
    <main>
      <HeroSection />
      {/* REMOVED: <StatisticsSection /> */}
      <TestimonialsCarousel /> {/* NEW */}
      <MembershipBenefitsHighlight /> {/* ENHANCED */}
      <PersistentNewsletterSignup /> {/* ENHANCED */}
    </main>
  );
};
```

**Task 1.2: Hall of Fame Aesthetic Transformation (6/10 → 10/10) - CRITICAL**
```typescript
// Complete visual overhaul required
// Files: src/app/hall-of-fame/page.tsx, src/components/EnhancedHallOfFameGrid.tsx

interface HallOfFameMember {
  name: string;
  year: number;
  award: string;
  achievement: string;
  institution: string;
  photoUrl: string;
  biography: string;
}

const PremiumHallOfFame = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <ElegantHeroSection className="text-center py-16">
        <h1 className="text-5xl font-serif text-nhbea-royal-blue mb-4">Hall of Fame</h1>
        <p className="text-xl text-gray-600">Celebrating Excellence in Business Education</p>
      </ElegantHeroSection>
      
      <AwardRecipientShowcase className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipients.map(recipient => (
            <PremiumRecipientCard key={recipient.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 text-center">
                <div className="relative mb-6">
                  <img 
                    src={recipient.photoUrl}
                    alt={recipient.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-nhbea-gold shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-nhbea-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {recipient.year}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-serif text-nhbea-royal-blue mb-2">{recipient.name}</h3>
                <h4 className="text-lg font-medium text-nhbea-gold mb-2">{recipient.award}</h4>
                <p className="text-gray-600 mb-4">{recipient.institution}</p>
                <p className="text-gray-700 leading-relaxed">{recipient.achievement}</p>
              </div>
            </PremiumRecipientCard>
          ))}
        </div>
      </AwardRecipientShowcase>
    </div>
  );
};
```

**Task 1.3: Conference Page Visual Makeover - CRITICAL**
```typescript
// Complete visual redesign required
// File: src/app/conference/page.tsx
// Current rating: 7.0/10 → Target: 9.5/10

const TransformedConferencePage = () => {
  return (
    <div className="min-h-screen">
      <EngagingHeroSection className="bg-gradient-to-r from-nhbea-royal-blue via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">2025 NHBEA Annual Conference</h1>
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join New Hampshire's premier business education professionals for three days of 
            innovative learning, networking, and professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-nhbea-gold hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105">
              Register Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-nhbea-royal-blue font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200">
              View Agenda
            </button>
          </div>
        </div>
      </EngagingHeroSection>
      
      <ModernContentLayout className="py-16">
        <VisuallyStunningPricing />
        <EnhancedAgendaDisplay />
        <PremiumSpeakerShowcase />
        <VenueHighlights />
      </ModernContentLayout>
    </div>
  );
};
```

#### Week 2-3: Form Standardization

**Task 1.4: Membership Application Design Unification - CRITICAL**
```typescript
// CRITICAL: Both forms must have IDENTICAL visual design
// Files: 
// - src/components/ProfessionalMembershipForm.tsx
// - src/components/StudentMembershipForm.tsx

const UnifiedMembershipFormDesign = {
  container: 'min-h-screen bg-gradient-to-br from-nhbea-bg-primary via-nhbea-royal-blue-subtle/20 to-nhbea-bg-secondary',
  card: 'backdrop-blur-lg bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto',
  title: 'text-3xl lg:text-4xl font-bold text-white mb-6 text-center',
  description: 'text-lg max-w-2xl mx-auto text-white text-center mb-12',
  sectionHeader: 'text-xl font-semibold text-gray-900 mb-4',
  fieldLabel: 'block text-sm font-medium text-gray-700 mb-2',
  input: 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50 focus:border-transparent',
  submitButton: 'w-full px-8 py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105'
};

// Both forms MUST implement this exact visual structure
const StandardizedMembershipForm = ({ type, config }: {
  type: 'professional' | 'student';
  config: MembershipTypeConfig;
}) => {
  return (
    <div className={UnifiedMembershipFormDesign.container}>
      <div className="relative container mx-auto px-6 py-12">
        <h1 className={UnifiedMembershipFormDesign.title}>
          {config.name} Application
        </h1>
        <p className={UnifiedMembershipFormDesign.description}>
          {config.description}
        </p>
        
        <div className={UnifiedMembershipFormDesign.card}>
          <form className="space-y-8">
            {/* All sections must use identical styling */}
            <PersonalInfoSection design={UnifiedMembershipFormDesign} />
            <ProfessionalInfoSection design={UnifiedMembershipFormDesign} />
            <AddressSection design={UnifiedMembershipFormDesign} />
            {type === 'student' && <AcademicInfoSection design={UnifiedMembershipFormDesign} />}
            <PreferencesSection design={UnifiedMembershipFormDesign} />
            <button type="submit" className={UnifiedMembershipFormDesign.submitButton}>
              Submit Application & Pay Dues ({formatPrice(config.pricing.amount)})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
```

**Task 1.5: Awards Page Simplification - CRITICAL**
```typescript
// REMOVE all complexity, create clean 2-award layout
// Files: src/app/awards/page.tsx, src/components/EnhancedAwardsGrid.tsx

const SimplifiedAwardsPage = () => {
  // Fetch only 2 awards - remove all filtering/sorting logic
  const awards = [
    {
      id: 'business-educator-of-year',
      title: 'Business Educator of the Year',
      description: 'Recognizing outstanding contributions to business education in New Hampshire',
      deadline: new Date('2025-12-01'),
      isActive: true
    },
    {
      id: 'distinguished-service',
      title: 'Distinguished Service Award',
      description: 'Honoring exceptional service to the business education community',
      deadline: new Date('2025-11-15'),
      isActive: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-nhbea-royal-blue mb-6">NHBEA Awards</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recognizing excellence and outstanding contributions to business education in New Hampshire
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {awards.map(award => {
            const isExpired = award.deadline < new Date();
            return (
              <div 
                key={award.id}
                className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                  isExpired ? 'grayscale opacity-60 border-gray-200' : 'border-nhbea-gold hover:border-nhbea-royal-blue'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-nhbea-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="text-2xl font-bold text-nhbea-royal-blue mb-4">{award.title}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{award.description}</p>
                  
                  <div className="mb-6">
                    <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      Deadline: {award.deadline.toLocaleDateString()}
                      {isExpired && ' - PASSED'}
                    </p>
                  </div>
                  
                  <button
                    disabled={isExpired}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      isExpired 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-nhbea-royal-blue text-white hover:bg-blue-700 transform hover:scale-105'
                    }`}
                  >
                    {isExpired ? 'Deadline Passed' : 'Submit Nomination'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

#### Week 3-4: UX Enhancements

**Task 1.6: Newsletter Signup Persistence - HIGH PRIORITY**
```typescript
// File: src/components/NewsletterSignup.tsx
// PROBLEM: Form loses data on navigation

const useNewsletterPersistence = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Restore saved email on component mount
    const savedEmail = localStorage.getItem('nhbea-newsletter-email');
    const submissionStatus = localStorage.getItem('nhbea-newsletter-submitted');
    
    if (savedEmail && !submissionStatus) {
      setEmail(savedEmail);
    }
    
    if (submissionStatus === 'true') {
      setIsSubmitted(true);
    }
  }, []);
  
  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Save immediately as user types
    if (value.trim()) {
      localStorage.setItem('nhbea-newsletter-email', value);
    } else {
      localStorage.removeItem('nhbea-newsletter-email');
    }
  };
  
  const handleSubmit = async (emailValue: string) => {
    setIsLoading(true);
    
    try {
      await submitNewsletter(emailValue);
      localStorage.setItem('nhbea-newsletter-submitted', 'true');
      localStorage.removeItem('nhbea-newsletter-email');
      setIsSubmitted(true);
      
      // Show success modal
      showSuccessModal('Thank you for subscribing to our newsletter!');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      showErrorModal('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return { email, isSubmitted, isLoading, handleEmailChange, handleSubmit };
};

const PersistentNewsletterSignup = () => {
  const { email, isSubmitted, isLoading, handleEmailChange, handleSubmit } = useNewsletterPersistence();
  
  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <p className="text-green-800 font-semibold">You're subscribed!</p>
        <p className="text-green-700 text-sm">Thank you for joining our newsletter.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(email); }} className="flex gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => handleEmailChange(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
        required
      />
      <button
        type="submit"
        disabled={isLoading || !email.trim()}
        className="px-6 py-3 bg-nhbea-royal-blue text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};
```

### Phase 2: CMS-Driven Membership System (4-5 weeks)

**Task 2.1: Dynamic Membership Configuration Architecture**
```typescript
// Create new Firestore collection: membershipTypes
interface MembershipTypeConfig {
  id: string;
  name: string;
  description: string;
  pricing: {
    amount: number; // In cents (5000 = $50.00)
    currency: 'USD';
    billingCycle: 'annual' | 'monthly';
    discounts?: {
      type: 'early_bird' | 'student' | 'bulk';
      amount: number;
      conditions: string[];
    }[];
  };
  benefits: string[];
  eligibility: {
    requirements: string[];
    restrictions?: string[];
  };
  form: {
    fields: FormFieldConfig[];
    sections: FormSectionConfig[];
  };
  payment: {
    squareItemId?: string;
    processingFee?: number;
    refundPolicy?: string;
  };
  metadata: {
    isActive: boolean;
    featured: boolean;
    sortOrder: number;
    version: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
  };
}

interface FormFieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: { value: string; label: string }[];
  defaultValue?: any;
  helpText?: string;
  section: string;
  adminConfigurable: boolean;
}

// Create membership type repository
class MembershipTypeRepository {
  private collection = firestore.collection('membershipTypes');

  async getActiveMembershipTypes(): Promise<MembershipTypeConfig[]> {
    const snapshot = await this.collection
      .where('metadata.isActive', '==', true)
      .orderBy('metadata.sortOrder')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MembershipTypeConfig));
  }

  async getMembershipTypeById(id: string): Promise<MembershipTypeConfig | null> {
    const doc = await this.collection.doc(id).get();
    
    if (!doc.exists) return null;
    
    return { id: doc.id, ...doc.data() } as MembershipTypeConfig;
  }

  async updateMembershipType(
    id: string, 
    updates: Partial<MembershipTypeConfig>
  ): Promise<void> {
    await this.collection.doc(id).update({
      ...updates,
      'metadata.updatedAt': new Date(),
      'metadata.version': FieldValue.increment(1)
    });
  }

  async createMembershipType(config: Omit<MembershipTypeConfig, 'id'>): Promise<string> {
    const docRef = await this.collection.add({
      ...config,
      metadata: {
        ...config.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    });
    
    return docRef.id;
  }
}
```

**Task 2.2: Dynamic Form System**
```typescript
// Create dynamic form renderer
const DynamicForm = ({ config, onSubmit }: {
  config: MembershipTypeConfig;
  onSubmit: (data: any) => Promise<void>;
}) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(generateSchemaFromConfig(config.form))
  });

  const groupedFields = config.form.fields.reduce((acc, field) => {
    if (!acc[field.section]) acc[field.section] = [];
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, FormFieldConfig[]>);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {config.form.sections.map(section => (
        <div key={section.id} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields[section.id]?.map(field => (
              <DynamicFormField
                key={field.id}
                field={field}
                register={register}
                control={control}
                error={errors[field.name]}
              />
            ))}
          </div>
        </div>
      ))}
      
      <button
        type="submit"
        className="w-full px-8 py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        Submit Application & Pay ({formatPrice(config.pricing.amount)})
      </button>
    </form>
  );
};

const DynamicFormField = ({ field, register, control, error }: {
  field: FormFieldConfig;
  register: any;
  control: any;
  error?: FieldError;
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
            {...register(field.name, {
              required: field.required,
              pattern: field.validation?.pattern ? new RegExp(field.validation.pattern) : undefined,
              minLength: field.validation?.min,
              maxLength: field.validation?.max
            })}
          />
        );
      
      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: controllerField }) => (
              <select
                {...controllerField}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
              >
                <option value="">{field.placeholder || `Select ${field.label}`}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
            {...register(field.name, {
              required: field.required,
              minLength: field.validation?.min,
              maxLength: field.validation?.max
            })}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
      )}
      {error && (
        <p className="text-red-600 text-sm mt-1">{error.message || field.validation?.message}</p>
      )}
    </div>
  );
};
```

**Task 2.3: Admin CMS Interface**
```typescript
// Create admin interface for membership management
const MembershipTypeEditor = () => {
  const [config, setConfig] = useState<MembershipTypeConfig>();
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <AdminLayout>
      <div className="flex h-full bg-gray-50">
        <div className="w-1/2 bg-white shadow-lg overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Configuration Editor</h2>
          </div>
          
          <div className="p-6 space-y-8">
            <PricingEditor 
              pricing={config?.pricing}
              onChange={(pricing) => setConfig(prev => ({ ...prev!, pricing }))}
            />
            
            <BenefitsManager 
              benefits={config?.benefits || []}
              onChange={(benefits) => setConfig(prev => ({ ...prev!, benefits }))}
            />
            
            <FormBuilder 
              fields={config?.form.fields || []}
              sections={config?.form.sections || []}
              onChange={(form) => setConfig(prev => ({ ...prev!, form }))}
            />
            
            <PaymentSettingsPanel
              payment={config?.payment}
              onChange={(payment) => setConfig(prev => ({ ...prev!, payment }))}
            />
          </div>
        </div>
        
        <div className="w-1/2 bg-gray-100 overflow-y-auto">
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-xl font-medium ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {previewMode ? 'Live Preview' : 'Summary View'}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {previewMode && config ? (
              <LiveMembershipPreview config={config} />
            ) : (
              <ConfigurationSummary config={config} />
            )}
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
          
          <button
            onClick={publishChanges}
            disabled={saving || !config}
            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            Publish Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};
```

**Task 2.4: Dynamic Square Payment Integration**
```typescript
// Enhance payment service for dynamic configuration
class DynamicPaymentService {
  private squareClient: SquareClient;

  constructor() {
    this.squareClient = new SquareClient({
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
      environment: process.env.SQUARE_ENVIRONMENT === 'production' 
        ? SquareEnvironment.Production 
        : SquareEnvironment.Sandbox
    });
  }

  async createMembershipPayment(
    membershipConfig: MembershipTypeConfig,
    memberData: any,
    successUrl: string,
    cancelUrl: string
  ) {
    // Build dynamic order based on configuration
    const lineItems = [{
      name: membershipConfig.name,
      quantity: '1',
      basePriceMoney: {
        amount: BigInt(membershipConfig.pricing.amount),
        currency: membershipConfig.pricing.currency
      },
      metadata: {
        membershipTypeId: membershipConfig.id,
        membershipTypeVersion: membershipConfig.metadata.version.toString(),
        memberEmail: memberData.email,
        configTimestamp: membershipConfig.metadata.updatedAt.toISOString()
      }
    }];

    // Apply discounts if configured
    const discounts = [];
    if (membershipConfig.pricing.discounts) {
      for (const discount of membershipConfig.pricing.discounts) {
        if (this.isDiscountApplicable(discount, memberData)) {
          discounts.push({
            name: `${discount.type.replace('_', ' ').toUpperCase()} Discount`,
            percentage: discount.amount.toString()
          });
        }
      }
    }

    const order = {
      locationId: process.env.SQUARE_LOCATION_ID!,
      lineItems,
      ...(discounts.length > 0 && { discounts })
    };

    const request = {
      order,
      checkoutOptions: {
        redirectUrl: successUrl,
        merchantSupportEmail: 'support@nhbea.org',
        askForShippingAddress: false,
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true,
          cashAppPay: false
        }
      },
      prePopulatedData: {
        buyerEmail: memberData.email
      }
    };

    const response = await this.squareClient.checkoutApi.createPaymentLink(request);
    
    if (response.result.errors) {
      throw new Error(`Square API Error: ${response.result.errors[0].detail}`);
    }

    // Store payment intent in Firestore for webhook processing
    await firestore.collection('paymentIntents').add({
      paymentLinkId: response.result.paymentLink!.id,
      membershipTypeId: membershipConfig.id,
      membershipTypeVersion: membershipConfig.metadata.version,
      memberData,
      createdAt: new Date(),
      status: 'pending'
    });

    return {
      paymentLinkId: response.result.paymentLink!.id,
      paymentUrl: response.result.paymentLink!.url!,
      orderId: response.result.paymentLink!.orderId!
    };
  }

  private isDiscountApplicable(discount: any, memberData: any): boolean {
    // Implement discount logic based on conditions
    switch (discount.type) {
      case 'student':
        return memberData.membershipType === 'student';
      case 'early_bird':
        return new Date() < new Date(discount.conditions[0]); // Assuming first condition is deadline
      default:
        return false;
    }
  }
}
```

### Phase 3: Advanced UX Features (2-3 weeks)

**Task 3.1: Form Enhancement Suite**
```typescript
// Character counter component
const CharacterCounter = ({ value, maxLength, minLength, className = '' }: {
  value: string;
  maxLength: number;
  minLength?: number;
  className?: string;
}) => {
  const currentLength = value.length;
  const isValid = currentLength >= (minLength || 0) && currentLength <= maxLength;
  const isWarning = currentLength > maxLength * 0.9;
  
  return (
    <div className={`text-sm flex justify-between items-center mt-1 ${className}`}>
      <span className={`${
        !isValid ? 'text-red-500' : 
        isWarning ? 'text-yellow-600' : 
        'text-gray-500'
      }`}>
        {currentLength}/{maxLength}
      </span>
      {minLength && currentLength < minLength && (
        <span className="text-red-500 text-xs">
          Minimum {minLength} characters required
        </span>
      )}
    </div>
  );
};

// Auto-save hook
const useFormAutoSave = (formData: any, formId: string, delay: number = 2000) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return;
    
    setSaveStatus('saving');
    const timeoutId = setTimeout(async () => {
      try {
        const progressPercent = calculateFormProgress(formData);
        const saveData = {
          data: formData,
          timestamp: new Date().toISOString(),
          progress: progressPercent,
          formId
        };
        
        localStorage.setItem(`nhbea-form-${formId}`, JSON.stringify(saveData));
        
        // Also save to Firestore for cross-device access (if user is logged in)
        if (auth.currentUser) {
          await firestore
            .collection('formDrafts')
            .doc(`${auth.currentUser.uid}_${formId}`)
            .set(saveData, { merge: true });
        }
        
        setLastSaved(new Date());
        setProgress(progressPercent);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
      }
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [formData, formId, delay]);
  
  const restoreFormData = useCallback(async () => {
    try {
      // Try to restore from Firestore first (if logged in)
      if (auth.currentUser) {
        const doc = await firestore
          .collection('formDrafts')
          .doc(`${auth.currentUser.uid}_${formId}`)
          .get();
          
        if (doc.exists) {
          return doc.data();
        }
      }
      
      // Fallback to localStorage
      const saved = localStorage.getItem(`nhbea-form-${formId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to restore form data:', error);
      return null;
    }
  }, [formId]);
  
  return { lastSaved, saveStatus, progress, restoreFormData };
};

// Enhanced form field with auto-save and character counting
const EnhancedFormField = ({ field, register, error, formData, formId }: {
  field: FormFieldConfig;
  register: any;
  error?: FieldError;
  formData?: any;
  formId?: string;
}) => {
  const [value, setValue] = useState('');
  const { saveStatus } = useFormAutoSave(formData, formId || '');
  
  const maxLength = field.validation?.max;
  const minLength = field.validation?.min;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {saveStatus === 'saving' && (
          <span className="ml-2 text-xs text-blue-500">Saving...</span>
        )}
        {saveStatus === 'saved' && (
          <span className="ml-2 text-xs text-green-500">✓ Saved</span>
        )}
      </label>
      
      {field.type === 'textarea' ? (
        <textarea
          {...register(field.name)}
          placeholder={field.placeholder}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
          rows={4}
        />
      ) : (
        <input
          {...register(field.name)}
          type={field.type}
          placeholder={field.placeholder}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nhbea-royal-blue/50"
        />
      )}
      
      {maxLength && (
        <CharacterCounter 
          value={value} 
          maxLength={maxLength} 
          minLength={minLength}
        />
      )}
      
      {field.helpText && (
        <p className="text-xs text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="text-red-600 text-sm">{error.message}</p>
      )}
    </div>
  );
};
```

**Task 3.2: Advanced Loading States**
```typescript
// Skeleton components for loading states
const SkeletonMembershipForm = () => {
  return (
    <div className="animate-pulse space-y-8">
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 space-y-6">
        {[...Array(4)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(3)].map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="h-14 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

const SkeletonHallOfFame = () => {
  return (
    <div className="animate-pulse">
      <div className="text-center py-16">
        <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading state manager
const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };
  
  const isLoading = (key: string) => loadingStates[key] || false;
  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  
  return { setLoading, isLoading, isAnyLoading };
};
```

## Critical Success Criteria

### Phase 1 Validation
- [ ] All statistics elements completely removed from site
- [ ] Hall of Fame aesthetic quality rated 9.5+/10 by design review
- [ ] Conference page engagement metrics improve by 25%
- [ ] Newsletter signup retention increases by 40%
- [ ] Membership forms have identical visual design
- [ ] Awards page simplified to 2-award layout

### Phase 2 Validation
- [ ] Admin users can modify membership pricing without developer involvement
- [ ] New membership types can be created and published within 1 hour
- [ ] Form configuration changes reflect immediately on public site
- [ ] Payment processing adapts automatically to pricing changes
- [ ] 80% of content updates handled through admin interface

### Phase 3 Validation
- [ ] Form abandonment rates decrease by 30%
- [ ] Auto-save functionality prevents data loss
- [ ] Character counters appear on all applicable fields
- [ ] Loading states provide smooth user experience
- [ ] Performance metrics meet targets (sub-2s page loads)

## Code Quality Requirements

### TypeScript Standards
- All new code must use strict TypeScript with explicit types
- No `any` types except for dynamic form data
- All async operations must have proper error handling
- Comprehensive JSDoc comments for complex functions

### Component Standards
- All components must be memo-wrapped for performance
- Props must have explicit TypeScript interfaces
- Loading and error states must be handled
- Accessibility (ARIA labels, keyboard navigation) is mandatory

### Testing Requirements
- Unit tests for all business logic functions
- Integration tests for form workflows
- E2E tests for critical user journeys
- Visual regression tests for redesigned pages

### Performance Standards
- Core Web Vitals must meet targets:
  - LCP < 2s
  - FID < 50ms
  - CLS < 0.05
- Bundle size must not increase beyond current baseline
- All images must be optimized with next/image

## File Structure Guidelines

```
src/
├── app/                     # Next.js app router
├── components/
│   ├── enhanced/           # New enhanced components
│   ├── forms/              # Dynamic form system
│   ├── cms/                # Admin CMS components
│   ├── ui/                 # Base UI components
│   └── analytics/          # Analytics tracking
├── lib/
│   ├── repositories/       # Data access layer
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
└── store/                  # State management
```

## Deployment & Environment

### Environment Variables Required
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

# Square Payment Integration
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
SQUARE_ENVIRONMENT=sandbox # or production
SQUARE_WEBHOOK_SIGNATURE_KEY=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### Deployment Process
1. Run full test suite: `npm test`
2. Build application: `npm run build`
3. Deploy functions: `firebase deploy --only functions`
4. Deploy hosting: `firebase deploy --only hosting`
5. Validate deployment with smoke tests

## Key Architectural Principles

1. **Progressive Enhancement** - Start with working functionality, add enhancements
2. **Configuration Over Code** - Make everything admin-configurable
3. **Performance First** - Optimize for Core Web Vitals
4. **Accessibility Always** - WCAG 2.1 AA compliance minimum
5. **Type Safety** - Strict TypeScript throughout
6. **Error Resilience** - Graceful degradation and recovery
7. **Mobile First** - Design for mobile, enhance for desktop
8. **SEO Optimized** - Structured data and meta tags
9. **Security Focused** - Input validation and sanitization
10. **Monitoring Enabled** - Comprehensive analytics and error tracking

---

**Remember:** This is a transformation of an already excellent platform (9.3/10) into an exceptional one (9.7+/10). Focus on precision, quality, and user experience above all else. Every change should be measurable and contribute to the overall success metrics.

**Questions or clarifications needed?** Reference the complete architecture document at `/Users/drewlambert/Desktop/NHBEA/docs/architecture.md` for detailed specifications and context.