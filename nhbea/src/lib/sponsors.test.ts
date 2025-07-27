import { getSponsors, defaultSponsors } from './sponsors';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Mock Firebase functions
jest.mock('./firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn()
}));

const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockOrderBy = orderBy as jest.MockedFunction<typeof orderBy>;

describe('Sponsors Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSponsors', () => {
    it('should return sponsors list', async () => {
      const mockSponsors = [
        {
          id: 'sponsor1',
          data: () => ({ name: 'Sponsor 1', logoURL: '/logo1.png', website: 'https://sponsor1.com', order: 1 })
        },
        {
          id: 'sponsor2',
          data: () => ({ name: 'Sponsor 2', logoURL: '/logo2.png', website: 'https://sponsor2.com', order: 2 })
        }
      ];

      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => mockSponsors.forEach(callback)
      } as any);

      const result = await getSponsors();
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'sponsor1',
        name: 'Sponsor 1',
        logoURL: '/logo1.png',
        website: 'https://sponsor1.com',
        order: 1
      });
      expect(result[1]).toEqual({
        id: 'sponsor2',
        name: 'Sponsor 2',
        logoURL: '/logo2.png',
        website: 'https://sponsor2.com',
        order: 2
      });
      
      expect(mockOrderBy).toHaveBeenCalledWith('order', 'asc');
    });

    it('should return empty array when no sponsors exist', async () => {
      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {}
      } as any);

      const result = await getSponsors();
      expect(result).toEqual([]);
    });

    it('should throw error when Firebase fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(getSponsors()).rejects.toThrow('Failed to fetch sponsors');
    });
  });

  describe('defaultSponsors', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(defaultSponsors)).toBe(true);
      expect(defaultSponsors.length).toBeGreaterThan(0);
      
      defaultSponsors.forEach(sponsor => {
        expect(sponsor).toHaveProperty('id');
        expect(sponsor).toHaveProperty('name');
        expect(sponsor).toHaveProperty('logoURL');
        expect(sponsor).toHaveProperty('website');
        expect(typeof sponsor.name).toBe('string');
        expect(typeof sponsor.logoURL).toBe('string');
        expect(typeof sponsor.website).toBe('string');
      });
    });
  });
});