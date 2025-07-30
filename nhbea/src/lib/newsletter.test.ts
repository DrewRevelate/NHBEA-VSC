import { addNewsletterSubscriber, getNewsletterSubscribers, unsubscribeNewsletter } from './newsletter';
import { NewsletterSubscriber } from '@/types/newsletter';

// Mock firebase/firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
}));

// Mock firebase
jest.mock('./firebase', () => ({
  db: {},
}));

import { doc, getDoc, setDoc, updateDoc, getDocs, collection } from 'firebase/firestore';

const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;

describe('Newsletter Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addNewsletterSubscriber', () => {
    const mockDocRef = {};

    beforeEach(() => {
      mockDoc.mockReturnValue(mockDocRef as any);
    });

    it('should successfully add a new subscriber', async () => {
      const email = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      } as any);
      mockSetDoc.mockResolvedValue(undefined);

      const result = await addNewsletterSubscriber(email);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Thank you for subscribing! You will receive our latest updates.');
      expect(mockDoc).toHaveBeenCalledWith({}, 'newsletterSubscribers', email);
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        email,
        timestamp: expect.any(Date),
        status: 'active',
      });
    });

    it('should normalize email address', async () => {
      const email = 'TEST@EXAMPLE.COM';
      const normalizedEmail = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      } as any);
      mockSetDoc.mockResolvedValue(undefined);

      await addNewsletterSubscriber(email);

      expect(mockDoc).toHaveBeenCalledWith({}, 'newsletterSubscribers', normalizedEmail);
      expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, {
        email: normalizedEmail,
        timestamp: expect.any(Date),
        status: 'active',
      });
    });

    it('should reject invalid email format', async () => {
      const invalidEmail = 'invalid-email';

      const result = await addNewsletterSubscriber(invalidEmail);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please enter a valid email address.');
      expect(result.error).toBe('Invalid email format');
      expect(mockDoc).not.toHaveBeenCalled();
    });

    it('should handle already subscribed email', async () => {
      const email = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email,
          status: 'active',
          timestamp: new Date(),
        }),
      } as any);

      const result = await addNewsletterSubscriber(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('You are already subscribed to our newsletter.');
      expect(result.error).toBe('Email already subscribed');
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should reactivate unsubscribed email', async () => {
      const email = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email,
          status: 'unsubscribed',
          timestamp: new Date(),
        }),
      } as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await addNewsletterSubscriber(email);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Welcome back! Your newsletter subscription has been reactivated.');
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        status: 'active',
        timestamp: expect.any(Date),
      });
    });

    it('should handle database errors gracefully', async () => {
      const email = 'test@example.com';
      
      mockGetDoc.mockRejectedValue(new Error('Database connection failed'));

      const result = await addNewsletterSubscriber(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Something went wrong. Please try again later.');
      expect(result.error).toBe('Database connection failed');
    });

    it('should handle empty email', async () => {
      const result = await addNewsletterSubscriber('');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please enter a valid email address.');
      expect(result.error).toBe('Invalid email format');
    });

    it('should handle whitespace-only email', async () => {
      const result = await addNewsletterSubscriber('   ');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please enter a valid email address.');
      expect(result.error).toBe('Invalid email format');
    });

    it('should trim whitespace from email', async () => {
      const email = '  test@example.com  ';
      const trimmedEmail = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      } as any);
      mockSetDoc.mockResolvedValue(undefined);

      await addNewsletterSubscriber(email);

      expect(mockDoc).toHaveBeenCalledWith({}, 'newsletterSubscribers', trimmedEmail);
    });
  });

  describe('getNewsletterSubscribers', () => {
    beforeEach(() => {
      mockCollection.mockReturnValue({} as any);
    });

    it('should return list of subscribers', async () => {
      const mockSubscribers: NewsletterSubscriber[] = [
        {
          email: 'user1@example.com',
          timestamp: new Date(),
          status: 'active',
        },
        {
          email: 'user2@example.com',
          timestamp: new Date(),
          status: 'active',
        },
      ];

      const mockSnapshot = {
        docs: mockSubscribers.map(subscriber => ({
          data: () => subscriber,
        })),
      };

      mockGetDocs.mockResolvedValue(mockSnapshot as any);

      const result = await getNewsletterSubscribers();

      expect(result).toEqual(mockSubscribers);
      expect(mockCollection).toHaveBeenCalledWith({}, 'newsletterSubscribers');
    });

    it('should return empty array on database error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Database error'));

      const result = await getNewsletterSubscribers();

      expect(result).toEqual([]);
    });
  });

  describe('unsubscribeNewsletter', () => {
    const mockDocRef = {};

    beforeEach(() => {
      mockDoc.mockReturnValue(mockDocRef as any);
    });

    it('should successfully unsubscribe existing email', async () => {
      const email = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email,
          status: 'active',
          timestamp: new Date(),
        }),
      } as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await unsubscribeNewsletter(email);

      expect(result.success).toBe(true);
      expect(result.message).toBe('You have been successfully unsubscribed from our newsletter.');
      expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
        status: 'unsubscribed',
        timestamp: expect.any(Date),
      });
    });

    it('should handle non-existent email', async () => {
      const email = 'nonexistent@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      } as any);

      const result = await unsubscribeNewsletter(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Email address not found in our newsletter list.');
      expect(result.error).toBe('Email not found');
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const email = 'test@example.com';
      
      mockGetDoc.mockRejectedValue(new Error('Database error'));

      const result = await unsubscribeNewsletter(email);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Something went wrong. Please try again later.');
      expect(result.error).toBe('Database error');
    });

    it('should normalize email before unsubscribing', async () => {
      const email = 'TEST@EXAMPLE.COM';
      const normalizedEmail = 'test@example.com';
      
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: normalizedEmail,
          status: 'active',
          timestamp: new Date(),
        }),
      } as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      await unsubscribeNewsletter(email);

      expect(mockDoc).toHaveBeenCalledWith({}, 'newsletterSubscribers', normalizedEmail);
    });
  });
});