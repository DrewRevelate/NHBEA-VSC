# 8. REST API Specifications

## 8.1 API Design Principles
- **RESTful conventions** for resource endpoints
- **JSON** as the primary data format
- **ISO 8601** for all date/time values
- **UUID v4** for resource identifiers
- **Semantic HTTP status codes** for responses

## 8.2 Common Response Formats

### Success Response
```json
{
  "data": {
    "id": "member_123",
    "type": "member",
    "attributes": { ... }
  },
  "meta": {
    "timestamp": "2025-07-28T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "fields": {
        "email": ["Invalid email format"]
      }
    }
  }
}
```

## 8.3 Endpoint Specifications

### Membership API
```yaml
POST /api/membership
Content-Type: application/json

Request:
{
  "type": "professional",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  },
  "organizationId": "string",
  "position": "string",
  "isRenewal": boolean,
  "previousMemberNumber": "string?"
}

Response: 201 Created
{
  "data": {
    "applicationId": "app_123",
    "paymentUrl": "https://square.link/...",
    "expiresAt": "2025-07-28T11:00:00Z"
  }
}
```

### Conference Registration API
```yaml
POST /api/conference
Content-Type: application/json

Request:
{
  "conferenceId": "conference-2025",
  "participant": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "organization": "string"
  },
  "registrationType": "early_bird|regular|student",
  "memberNumber": "string?",
  "preferences": {
    "dietaryRestrictions": "string?",
    "accessibilityNeeds": "string?"
  }
}

Response: 201 Created
{
  "data": {
    "registrationId": "reg_123",
    "paymentUrl": "https://square.link/...",
    "amount": 75.00,
    "currency": "USD"
  }
}
```

### Payment Webhook Handler
```yaml
POST /api/membership/webhook
POST /api/conference/webhook
X-Square-Signature: {signature}

Request: Square webhook payload

Response: 200 OK
{
  "processed": true
}
```

## 8.4 API Rate Limiting

| Endpoint | Rate Limit | Window |
|----------|------------|---------|
| POST /api/membership | 5 requests | 1 hour |
| POST /api/conference | 10 requests | 1 hour |
| POST /api/newsletter | 3 requests | 1 minute |
| GET /api/* | 100 requests | 1 minute |

## 8.5 API Versioning Strategy
- Version included in URL path when breaking changes occur
- Current version: v1 (implicit, not in URL)
- Future versions: /api/v2/membership
