import { getPastPresidents, defaultPastPresidents } from './pastPresidents';
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

describe('Past Presidents Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPastPresidents', () => {
    it('should return past presidents list in descending order', async () => {
      const mockPresidents = [
        {
          id: 'president1',
          data: () => ({ name: 'Robert Johnson', term: '2022-2023', order: 1 })
        },
        {
          id: 'president2',
          data: () => ({ name: 'Mary Davis', term: '2021-2022', order: 2 })
        }
      ];

      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => mockPresidents.forEach(callback)
      } as any);

      const result = await getPastPresidents();
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'president1',
        name: 'Robert Johnson',
        term: '2022-2023',
        order: 1
      });
      expect(result[1]).toEqual({
        id: 'president2',
        name: 'Mary Davis',
        term: '2021-2022',
        order: 2
      });
      
      expect(mockOrderBy).toHaveBeenCalledWith('order', 'desc');
    });

    it('should return empty array when no past presidents exist', async () => {
      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {}
      } as any);

      const result = await getPastPresidents();
      expect(result).toEqual([]);
    });

    it('should throw error when Firebase fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(getPastPresidents()).rejects.toThrow('Failed to fetch past presidents');
    });
  });

  describe('defaultPastPresidents', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(defaultPastPresidents)).toBe(true);
      expect(defaultPastPresidents.length).toBeGreaterThan(0);
      
      defaultPastPresidents.forEach(president => {
        expect(president).toHaveProperty('id');
        expect(president).toHaveProperty('name');
        expect(president).toHaveProperty('term');
        expect(typeof president.name).toBe('string');
        expect(typeof president.term).toBe('string');
        expect(president.name.length).toBeGreaterThan(0);
      });
    });

    it('should have valid term format', () => {
      defaultPastPresidents.forEach(president => {
        expect(president.term).toMatch(/^\d{4}-\d{4}$/);
      });
    });

    it('should be ordered by most recent first (descending)', () => {
      for (let i = 0; i < defaultPastPresidents.length - 1; i++) {
        const currentYear = parseInt(defaultPastPresidents[i].term.split('-')[0]);
        const nextYear = parseInt(defaultPastPresidents[i + 1].term.split('-')[0]);
        expect(currentYear).toBeGreaterThanOrEqual(nextYear);
      }
    });
  });
});