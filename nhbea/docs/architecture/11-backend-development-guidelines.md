# 11. Backend Development Guidelines

## 11.1 Code Organization Standards

### Service Layer Pattern
```typescript
// /src/lib/services/membershipService.ts
export class MembershipService {
  constructor(
    private memberRepo: MemberRepository,
    private paymentService: PaymentService,
    private emailService: EmailService
  ) {}

  async processApplication(data: MembershipApplication) {
    // 1. Validate business rules
    const validation = await this.validateApplication(data);
    if (!validation.isValid) {
      throw new BusinessRuleError(validation.errors);
    }

    // 2. Create member record
    const member = await this.memberRepo.create(data);

    // 3. Generate payment link
    const payment = await this.paymentService.createPaymentLink({
      amount: this.calculateFee(data),
      metadata: { memberId: member.id }
    });

    // 4. Send confirmation email
    await this.emailService.sendApplicationReceived(member.email);

    return { member, paymentUrl: payment.url };
  }
}
```

### Error Handling Patterns
```typescript
// Consistent error handling across all backend code
export async function apiHandler<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler();
    return NextResponse.json({ data: result });
  } catch (error) {
    logger.error(error);
    
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred' } },
      { status: 500 }
    );
  }
}
```

## 11.2 TypeScript Best Practices

### Strict Type Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type-Safe Database Operations
```typescript
// Use discriminated unions for operation results
type DbResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Type-safe query builders
const memberQuery = db
  .collection('members')
  .where('status', '==', 'active')
  .withConverter(memberConverter);
```

## 11.3 Performance Guidelines

### Query Optimization Rules
1. **Always use indexes** for queries with multiple conditions
2. **Limit result sets** - default to 50, max 200
3. **Use projections** to fetch only needed fields
4. **Implement cursor-based pagination** for large datasets

### Caching Implementation
```typescript
// Redis-like caching with Upstash
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  
  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttl });
  return fresh;
}
```

## 11.4 Testing Requirements

### Test Coverage Standards
- **Unit Tests**: 90% coverage for business logic
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys (membership, conference registration)

### Mock Strategy
```typescript
// Mock external services for testing
jest.mock('@/lib/services/paymentService', () => ({
  createPaymentLink: jest.fn().mockResolvedValue({
    url: 'https://square.link/test',
    id: 'test_payment_123'
  })
}));
```

## 11.5 Documentation Standards

### API Documentation
- All endpoints must have JSDoc comments
- Include request/response examples
- Document error scenarios
- Maintain Postman collection for testing

### Code Documentation
```typescript
/**
 * Processes a professional membership application
 * @param data - The membership application data
 * @returns The created member and payment URL
 * @throws {ValidationError} If application data is invalid
 * @throws {PaymentError} If payment link creation fails
 */
async processApplication(data: MembershipApplication): Promise<ApplicationResult>
```
