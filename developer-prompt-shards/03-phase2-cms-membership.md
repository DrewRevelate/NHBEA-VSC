# Phase 2: CMS-Driven Membership System

[← Back to Index](./index.md) | [← Previous: Phase 1](./02-phase1-visual-ux.md) | [Next: Phase 3 →](./04-phase3-advanced-ux.md)

**Priority:** HIGH  
**Timeline:** 4-5 weeks  
**Impact:** Administrator autonomy and dynamic content management

## Task 2.1: Dynamic Membership Configuration Architecture

### Firestore Schema Design

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
```

### Repository Implementation

```typescript
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

## Task 2.2: Dynamic Form System

### Dynamic Form Renderer

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
```

### Dynamic Field Component

```typescript
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

## Task 2.3: Admin CMS Interface

### Membership Type Editor

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

### Form Builder Component

```typescript
const FormBuilder = ({ fields, sections, onChange }: {
  fields: FormFieldConfig[];
  sections: FormSectionConfig[];
  onChange: (form: { fields: FormFieldConfig[]; sections: FormSectionConfig[] }) => void;
}) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null);

  const addField = (field: FormFieldConfig) => {
    onChange({
      fields: [...fields, field],
      sections
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormFieldConfig>) => {
    onChange({
      fields: fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
      sections
    });
  };

  const deleteField = (fieldId: string) => {
    onChange({
      fields: fields.filter(f => f.id !== fieldId),
      sections
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Form Configuration</h3>
      
      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800">{section.title}</h4>
              <button
                onClick={() => setSelectedSection(section.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                + Add Field
              </button>
            </div>
            
            <div className="space-y-2">
              {fields.filter(f => f.section === section.id).map(field => (
                <FieldConfigItem
                  key={field.id}
                  field={field}
                  onEdit={() => setEditingField(field)}
                  onDelete={() => deleteField(field.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={(updates) => {
            updateField(editingField.id, updates);
            setEditingField(null);
          }}
          onCancel={() => setEditingField(null)}
        />
      )}
    </div>
  );
};
```

## Task 2.4: Dynamic Square Payment Integration

### Payment Service Enhancement

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

### Payment Webhook Handler

```typescript
// Firebase Function for handling Square webhooks
export const handleSquareWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['x-square-signature'] as string;
  const body = req.rawBody;

  // Verify webhook signature
  if (!verifyWebhookSignature(body, signature, process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!)) {
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(body.toString());

  switch (event.type) {
    case 'payment.created':
      await handlePaymentCreated(event.data);
      break;
    case 'payment.updated':
      await handlePaymentUpdated(event.data);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send('OK');
});

async function handlePaymentCreated(data: any) {
  const paymentLinkId = data.payment_link_id;
  
  // Find the payment intent
  const intentSnapshot = await firestore
    .collection('paymentIntents')
    .where('paymentLinkId', '==', paymentLinkId)
    .limit(1)
    .get();

  if (intentSnapshot.empty) {
    console.error(`Payment intent not found for ${paymentLinkId}`);
    return;
  }

  const intent = intentSnapshot.docs[0];
  const intentData = intent.data();

  // Create membership record
  await firestore.collection('members').add({
    ...intentData.memberData,
    membershipTypeId: intentData.membershipTypeId,
    membershipTypeVersion: intentData.membershipTypeVersion,
    paymentId: data.payment.id,
    status: 'active',
    joinedAt: new Date(),
    expiresAt: calculateExpiryDate(intentData.membershipTypeId)
  });

  // Update payment intent status
  await intent.ref.update({
    status: 'completed',
    completedAt: new Date(),
    paymentId: data.payment.id
  });

  // Send confirmation email
  await sendMembershipConfirmation(intentData.memberData.email, intentData.membershipTypeId);
}
```

## Phase 2 Validation Checklist

- [ ] Admin users can modify membership pricing without developer involvement
- [ ] New membership types can be created and published within 1 hour
- [ ] Form configuration changes reflect immediately on public site
- [ ] Payment processing adapts automatically to pricing changes
- [ ] 80% of content updates handled through admin interface
- [ ] Webhook processing creates membership records automatically
- [ ] Dynamic forms validate based on admin configuration
- [ ] Discount logic applies correctly based on conditions

---

**Next:** [Phase 3: Advanced UX Features →](./04-phase3-advanced-ux.md)