import { createProfessionalMembershipPayment, validateSquareWebhookSignature } from './payments';
import type { ProfessionalMembershipFormData } from './membershipValidation';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock environment variables
const originalEnv = process.env;

describe('Payment Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      SQUARE_APPLICATION_ID: 'test-app-id',
      SQUARE_ACCESS_TOKEN: 'test-access-token',
      SQUARE_LOCATION_ID: 'test-location-id',
      SUPPORT_EMAIL: 'test@nhbea.org'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockMembershipData: ProfessionalMembershipFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    institution: 'Test University',
    position: 'Professor',
    yearsExperience: 10,
    address: '123 Main St',
    city: 'Manchester',
    state: 'NH',
    zipCode: '03101',
    membershipType: 'new',
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true
    }
  };

  describe('createProfessionalMembershipPayment', () => {
    it('creates payment link successfully', async () => {
      const mockSquareResponse = {
        payment_link: {
          id: 'test-payment-link-id',
          version: 1,
          url: 'https://checkout.squareupsandbox.com/test-link',
          long_url: 'https://checkout.squareupsandbox.com/test-link-long',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          order_request: {},
          checkout_options: {}
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSquareResponse
      } as Response);

      const result = await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      expect(result.success).toBe(true);
      expect(result.paymentUrl).toBe('https://checkout.squareupsandbox.com/test-link');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://connect.squareupsandbox.com/v2/online-checkout/payment-links',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-access-token',
            'Square-Version': '2023-10-18'
          })
        })
      );
    });

    it('handles Square API errors', async () => {
      const mockErrorResponse = {
        errors: [
          {
            category: 'INVALID_REQUEST_ERROR',
            code: 'MISSING_REQUIRED_PARAMETER',
            detail: 'Missing required parameter: location_id'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockErrorResponse
      } as Response);

      const result = await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing required parameter: location_id');
    });

    it('handles missing environment variables', async () => {
      delete process.env.SQUARE_ACCESS_TOKEN;

      const result = await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment system configuration error');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment system error');
    });

    it('uses correct payment amount and currency', async () => {
      const mockSquareResponse = {
        payment_link: {
          id: 'test-payment-link-id',
          version: 1,
          url: 'https://checkout.squareupsandbox.com/test-link',
          long_url: 'https://checkout.squareupsandbox.com/test-link-long',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          order_request: {},
          checkout_options: {}
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSquareResponse
      } as Response);

      await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.order_request.order.line_items[0].base_price_money).toEqual({
        amount: 5000, // $50.00 in cents
        currency: 'USD'
      });
    });

    it('includes customer information in payment request', async () => {
      const mockSquareResponse = {
        payment_link: {
          id: 'test-payment-link-id',
          version: 1,
          url: 'https://checkout.squareupsandbox.com/test-link',
          long_url: 'https://checkout.squareupsandbox.com/test-link-long',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          order_request: {},
          checkout_options: {}
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSquareResponse
      } as Response);

      await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.invoice_recipient.contact_information).toEqual({
        email_address: mockMembershipData.email,
        phone_number: mockMembershipData.phone
      });

      expect(requestBody.payment_note).toBe(
        `NHBEA Professional Membership - ${mockMembershipData.firstName} ${mockMembershipData.lastName}`
      );
    });

    it('uses production URLs in production environment', async () => {
      process.env.NODE_ENV = 'production';

      const mockSquareResponse = {
        payment_link: {
          id: 'test-payment-link-id',
          version: 1,
          url: 'https://checkout.squareup.com/test-link',
          long_url: 'https://checkout.squareup.com/test-link-long',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          order_request: {},
          checkout_options: {}
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSquareResponse
      } as Response);

      await createProfessionalMembershipPayment(
        mockMembershipData,
        'https://example.com/success',
        'https://example.com/failure'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://connect.squareup.com/v2/online-checkout/payment-links',
        expect.any(Object)
      );
    });
  });

  describe('validateSquareWebhookSignature', () => {
    it('validates webhook signature correctly', () => {
      const crypto = require('crypto');
      const body = '{"test": "data"}';
      const webhookKey = 'test-webhook-key';
      
      const expectedSignature = crypto
        .createHmac('sha256', webhookKey)
        .update(body)
        .digest('base64');

      const isValid = validateSquareWebhookSignature(body, expectedSignature, webhookKey);
      expect(isValid).toBe(true);
    });

    it('rejects invalid webhook signature', () => {
      const body = '{"test": "data"}';
      const invalidSignature = 'invalid-signature';
      const webhookKey = 'test-webhook-key';

      const isValid = validateSquareWebhookSignature(body, invalidSignature, webhookKey);
      expect(isValid).toBe(false);
    });

    it('handles signature validation errors gracefully', () => {
      // Mock crypto to throw an error
      const originalCrypto = require('crypto');
      const mockCrypto = {
        createHmac: () => {
          throw new Error('Crypto error');
        }
      };
      
      jest.doMock('crypto', () => mockCrypto);

      const body = '{"test": "data"}';
      const signature = 'test-signature';
      const webhookKey = 'test-webhook-key';

      const isValid = validateSquareWebhookSignature(body, signature, webhookKey);
      expect(isValid).toBe(false);

      // Restore original crypto
      jest.doMock('crypto', () => originalCrypto);
    });
  });
});