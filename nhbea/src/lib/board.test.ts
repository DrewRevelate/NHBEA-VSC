import { getBoardMembers, defaultBoardMembers } from './board';
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

describe('Board Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBoardMembers', () => {
    it('should return board members list', async () => {
      const mockBoardMembers = [
        {
          id: 'member1',
          data: () => ({ name: 'John Doe', title: 'President', bio: 'Bio 1', order: 1 })
        },
        {
          id: 'member2',
          data: () => ({ name: 'Jane Smith', title: 'Vice President', bio: 'Bio 2', order: 2 })
        }
      ];

      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => mockBoardMembers.forEach(callback)
      } as any);

      const result = await getBoardMembers();
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'member1',
        name: 'John Doe',
        title: 'President',
        bio: 'Bio 1',
        order: 1
      });
      expect(result[1]).toEqual({
        id: 'member2',
        name: 'Jane Smith',
        title: 'Vice President',
        bio: 'Bio 2',
        order: 2
      });
      
      expect(mockOrderBy).toHaveBeenCalledWith('order', 'asc');
    });

    it('should return empty array when no board members exist', async () => {
      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {}
      } as any);

      const result = await getBoardMembers();
      expect(result).toEqual([]);
    });

    it('should throw error when Firebase fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(getBoardMembers()).rejects.toThrow('Failed to fetch board members');
    });
  });

  describe('defaultBoardMembers', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(defaultBoardMembers)).toBe(true);
      expect(defaultBoardMembers.length).toBeGreaterThan(0);
      
      defaultBoardMembers.forEach(member => {
        expect(member).toHaveProperty('id');
        expect(member).toHaveProperty('name');
        expect(member).toHaveProperty('title');
        expect(member).toHaveProperty('bio');
        expect(typeof member.name).toBe('string');
        expect(typeof member.title).toBe('string');
        expect(typeof member.bio).toBe('string');
        expect(member.name.length).toBeGreaterThan(0);
      });
    });

    it('should have meaningful content', () => {
      expect(defaultBoardMembers[0].name).toContain(' ');
      expect(defaultBoardMembers[0].bio.length).toBeGreaterThan(20);
      expect(defaultBoardMembers.some(m => m.title === 'President')).toBe(true);
    });
  });
});