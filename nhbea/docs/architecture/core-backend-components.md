# Core Backend Components

## 7.1 API Layer Strategy

### Static Frontend vs Cloud Functions Decision Matrix
| Use Case | Approach | Rationale |
|----------|----------|-----------|
| Form Submissions | Cloud Functions | Secure server-side processing, payment integration |
| Payment Processing | Cloud Functions | Webhook compatibility, explicit REST endpoint |
| Public Data Fetching | Static Generation + Client SDK | Direct database access, CDN caching |
| File Uploads | Cloud Functions | Streaming support, progress tracking |
| Admin Operations | Cloud Functions | Authentication context, secure processing |

Note: Server Actions are not available with static export - all dynamic operations use Cloud Functions.

### Firebase Cloud Functions Structure
```
Firebase Functions Deployment:
functions/
├── index.js                  # Main Cloud Function exports
└── package.json              # Function dependencies

Function Endpoints (via Firebase Hosting rewrites):
/api/membership               # POST - Process membership applications
/api/conference              # POST - Conference registration  
/api/newsletter              # POST - Newsletter signup
/api/health                  # GET - Health check endpoint

Note: Next.js API routes removed - incompatible with static export
```

## 7.2 Data Access Layer

### Repository Pattern Implementation
All database operations are abstracted through repository functions in `/src/lib/`:

```typescript
// Example structure for /src/lib/members.ts
export const memberRepository = {
  // Read operations
  async findById(id: string): Promise<Member | null>
  async findByEmail(email: string): Promise<Member | null>
  async listActive(limit?: number): Promise<Member[]>
  
  // Write operations  
  async create(data: CreateMemberDto): Promise<Member>
  async update(id: string, data: UpdateMemberDto): Promise<Member>
  async archive(id: string): Promise<void>
  
  // Business logic operations
  async processApplication(application: MemberApplication): Promise<ProcessResult>
  async generateMemberNumber(): Promise<string>
}
```

### Data Transfer Objects (DTOs)
- Use Zod schemas for all data validation
- Create separate DTOs for create, update, and response operations
- Transform between Firestore documents and DTOs in repository layer

## 7.3 Error Handling Strategy

### Error Classification
```typescript
// Error types in /src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors: ZodError) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, public paymentDetails?: any) {
    super('PAYMENT_ERROR', message, 402);
  }
}
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid membership application",
    "details": {
      "fields": {
        "email": "Invalid email format"
      }
    }
  }
}
```

## 7.4 Backend Security Patterns

### Input Validation Pipeline
1. **Client-side**: Basic validation for UX
2. **Server-side**: Comprehensive Zod validation before any processing
3. **Repository-level**: Type guards and business rule validation

### API Security Measures
- Rate limiting using Upstash Redis (10 requests per minute for form submissions)
- CORS configuration restricted to production domain
- Request size limits (1MB for standard requests, 10MB for file uploads)
- SQL injection prevention through parameterized Firestore queries

### Secret Management
```typescript
// Environment variable structure
NEXT_PUBLIC_FIREBASE_* // Client-safe Firebase config
FIREBASE_ADMIN_*       // Server-only admin credentials
SQUARE_*              // Payment API credentials
```

## 7.5 Logging & Monitoring

### Structured Logging
```typescript
// Logging utility in /src/lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (error: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};
```

### Monitoring Strategy
- Use Vercel Analytics for performance monitoring
- Firebase Performance Monitoring for database operations
- Custom error tracking with structured logs
- Payment transaction monitoring through Square Dashboard

## 7.6 Performance Optimization

### Caching Strategy
```typescript
// Caching approach for different data types
const CACHE_TIMES = {
  CONTENT: 3600,        // 1 hour for CMS content
  MEMBERS: 300,         // 5 minutes for member lists
  CONFERENCE: 60,       // 1 minute for conference data
  STATIC: 86400        // 24 hours for static data
};

// Implementation using Next.js caching
export async function getCachedContent() {
  return unstable_cache(
    async () => fetchContentFromFirestore(),
    ['content'],
    { revalidate: CACHE_TIMES.CONTENT }
  )();
}
```

### Database Query Optimization
- Use Firestore composite indexes for complex queries
- Implement pagination for large data sets
- Denormalize frequently accessed data
- Batch write operations where possible

## 7.7 Background Jobs & Async Processing

### Email Notifications
- Email notifications handled within the same Cloud Functions as payment processing
- Implement retry logic for failed email deliveries
- Asynchronous processing to prevent blocking API responses

### Data Migration Jobs
- V1 data import runs as a one-time migration script
- Progress tracking stored in Firestore
- Rollback capability through transaction logs

## 7.8 Testing Strategy for Backend

### Unit Testing
```typescript
// Example test structure
describe('MemberRepository', () => {
  beforeEach(() => {
    // Mock Firestore
  });
  
  it('should generate unique member numbers', async () => {
    const memberNumber = await memberRepository.generateMemberNumber();
    expect(memberNumber).toMatch(/^NHBEA-\d{4}-\d{4}$/);
  });
});
```

### Integration Testing
- Test API routes with supertest
- Mock external services (Square API, Firebase)
- Test error scenarios and edge cases
- Validate response formats against schemas

### Load Testing Considerations
- Expected load: <100 concurrent users
- Payment processing: <10 transactions per hour
- Conference registration peak: ~50 registrations per day
