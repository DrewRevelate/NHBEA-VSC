import { awardsRepository, nominationsRepository, awardsUtils } from './awards';
import type { Award, AwardNomination } from '@/types/dataModels';

// Mock Firestore
jest.mock('./firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: 1640995200, nanoseconds: 0 })),
}));

const mockFirestore = jest.requireMock('firebase/firestore');

describe('Awards Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllActiveAwards', () => {
    it('should handle fetch errors gracefully', async () => {
      mockFirestore.getDocs.mockRejectedValue(new Error('Firestore error'));
      mockFirestore.collection.mockReturnValue('awards-collection');
      mockFirestore.query.mockReturnValue('awards-query');
      mockFirestore.where.mockReturnValue('where-clause');
      mockFirestore.orderBy.mockReturnValue('order-clause');

      await expect(awardsRepository.getAllActiveAwards()).rejects.toThrow('Failed to fetch awards data');
    });

    it('should fetch and return active awards with proper data transformation', async () => {
      const mockAwards = [
        {
          id: 'award1',
          data: () => ({
            name: 'Educator of the Year',
            icon: '🏆',
            description: 'Outstanding educator award',
            eligibility: 'Must be active teacher',
            deadline: { toDate: () => new Date('2025-05-01') },
            category: 'Excellence',
            isActive: true,
            createdAt: { toDate: () => new Date('2024-01-01') },
            updatedAt: { toDate: () => new Date('2024-01-01') },
          })
        }
      ];

      const mockSnapshot = {
        forEach: (callback: (doc: any) => void) => {
          mockAwards.forEach(callback);
        }
      };

      mockFirestore.getDocs.mockResolvedValue(mockSnapshot);
      mockFirestore.collection.mockReturnValue('awards-collection');
      mockFirestore.query.mockReturnValue('awards-query');
      mockFirestore.where.mockReturnValue('where-clause');
      mockFirestore.orderBy.mockReturnValue('order-clause');

      const result = await awardsRepository.getAllActiveAwards();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'award1',
        name: 'Educator of the Year',
        icon: '🏆',
        description: 'Outstanding educator award',
        eligibility: 'Must be active teacher',
        deadline: new Date('2025-05-01'),
        category: 'Excellence',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      expect(mockFirestore.collection).toHaveBeenCalledWith({}, 'awards');
      expect(mockFirestore.where).toHaveBeenCalledWith('isActive', '==', true);
    });

    it('should use cached data when cache is valid', async () => {
      // First call to populate cache
      const mockSnapshot = {
        forEach: jest.fn()
      };
      mockFirestore.getDocs.mockResolvedValue(mockSnapshot);

      await awardsRepository.getAllActiveAwards();
      
      // Clear the mock calls
      mockFirestore.getDocs.mockClear();
      
      // Second call should use cache (within 1 minute)
      await awardsRepository.getAllActiveAwards();
      
      expect(mockFirestore.getDocs).not.toHaveBeenCalled();
    });
  });

  describe('getAwardById', () => {
    it('should fetch and return specific award by ID', async () => {
      const mockAwardDoc = {
        exists: () => true,
        id: 'award1',
        data: () => ({
          name: 'Educator of the Year',
          icon: '🏆',
          description: 'Outstanding educator award',
          eligibility: 'Must be active teacher',
          deadline: { toDate: () => new Date('2025-05-01') },
          category: 'Excellence',
          isActive: true,
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        })
      };

      mockFirestore.getDoc.mockResolvedValue(mockAwardDoc);
      mockFirestore.doc.mockReturnValue('award-doc-ref');

      const result = await awardsRepository.getAwardById('award1');

      expect(result).toEqual({
        id: 'award1',
        name: 'Educator of the Year',
        icon: '🏆',
        description: 'Outstanding educator award',
        eligibility: 'Must be active teacher',
        deadline: new Date('2025-05-01'),
        category: 'Excellence',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      expect(mockFirestore.doc).toHaveBeenCalledWith({}, 'awards', 'award1');
    });

    it('should return null when award does not exist', async () => {
      const mockAwardDoc = {
        exists: () => false
      };

      mockFirestore.getDoc.mockResolvedValue(mockAwardDoc);

      const result = await awardsRepository.getAwardById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle fetch errors gracefully', async () => {
      mockFirestore.getDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(awardsRepository.getAwardById('award1')).rejects.toThrow('Failed to fetch award data');
    });
  });

  describe('getAllAwards', () => {
    it('should fetch all awards and sort them manually when ordered query fails', async () => {
      const mockAwards = [
        {
          id: 'award2',
          data: () => ({
            name: 'Lifetime Achievement',
            category: 'Lifetime',
            description: 'Lifetime award',
            eligibility: 'Retired educators',
            deadline: { toDate: () => new Date('2025-06-01') },
            isActive: true,
            createdAt: { toDate: () => new Date('2024-01-01') },
            updatedAt: { toDate: () => new Date('2024-01-01') },
          })
        },
        {
          id: 'award1',
          data: () => ({
            name: 'Educator of the Year',
            category: 'Excellence',
            description: 'Excellence award',
            eligibility: 'Active teachers',
            deadline: { toDate: () => new Date('2025-05-01') },
            isActive: true,
            createdAt: { toDate: () => new Date('2024-01-01') },
            updatedAt: { toDate: () => new Date('2024-01-01') },
          })
        }
      ];

      const mockSnapshot = {
        forEach: (callback: (doc: any) => void) => {
          mockAwards.forEach(callback);
        }
      };

      // Mock ordered query to fail first
      mockFirestore.getDocs
        .mockRejectedValueOnce(new Error('Index required'))
        .mockResolvedValueOnce(mockSnapshot);

      const result = await awardsRepository.getAllAwards();

      expect(result).toHaveLength(2);
      // Should be sorted by category, then name
      expect(result[0].category).toBe('Excellence');
      expect(result[1].category).toBe('Lifetime');
    });

    it('should return empty array on error instead of throwing', async () => {
      mockFirestore.getDocs.mockRejectedValue(new Error('Firestore error'));

      const result = await awardsRepository.getAllAwards();

      expect(result).toEqual([]);
    });

    it('should skip documents with missing required fields', async () => {
      const mockAwards = [
        {
          id: 'valid-award',
          data: () => ({
            name: 'Valid Award',
            category: 'Excellence',
            description: 'Valid award',
            eligibility: 'Everyone',
            isActive: true,
          })
        },
        {
          id: 'invalid-award',
          data: () => ({
            description: 'Missing name and category',
            eligibility: 'No one',
          })
        }
      ];

      const mockSnapshot = {
        forEach: (callback: (doc: any) => void) => {
          mockAwards.forEach(callback);
        }
      };

      mockFirestore.getDocs.mockResolvedValue(mockSnapshot);

      const result = await awardsRepository.getAllAwards();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Valid Award');
    });
  });

  describe('getAwardsByCategory', () => {
    it('should filter awards by category', async () => {
      // Mock getAllActiveAwards to return test data
      jest.spyOn(awardsRepository, 'getAllActiveAwards').mockResolvedValue([
        {
          id: 'award1',
          name: 'Excellence Award',
          category: 'Excellence',
          description: 'Test',
          eligibility: 'Test',
          deadline: new Date(),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'award2',
          name: 'Lifetime Award',
          category: 'Lifetime',
          description: 'Test',
          eligibility: 'Test',
          deadline: new Date(),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ] as Award[]);

      const result = await awardsRepository.getAwardsByCategory('Excellence');

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Excellence');
    });
  });
});

describe('Nominations Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNomination', () => {
    it('should create a new nomination with proper data transformation', async () => {
      const mockNominationData = {
        awardId: 'award1',
        awardCategory: 'Excellence' as const,
        nomineeInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          organization: 'Test School',
          position: 'Teacher'
        },
        nominatorInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          organization: 'Another School',
          position: 'Principal'
        },
        nominationText: 'Excellent teacher deserving recognition.',
        status: 'pending' as const,
      };

      const mockDocRef = { id: 'nomination123' };
      mockFirestore.addDoc.mockResolvedValue(mockDocRef);
      mockFirestore.collection.mockReturnValue('nominations-collection');

      const result = await nominationsRepository.createNomination(mockNominationData);

      expect(result).toBe('nomination123');
      expect(mockFirestore.addDoc).toHaveBeenCalledWith(
        'nominations-collection',
        {
          ...mockNominationData,
          submissionDate: { seconds: 1640995200, nanoseconds: 0 },
          status: 'pending'
        }
      );
    });

    it('should handle creation errors gracefully', async () => {
      const mockNominationData = {
        awardId: 'award1',
        awardCategory: 'Excellence' as const,
        nomineeInfo: { name: 'John Doe', email: 'john@example.com' },
        nominatorInfo: { name: 'Jane Smith', email: 'jane@example.com' },
        nominationText: 'Test nomination',
        status: 'pending' as const,
      };

      mockFirestore.addDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(nominationsRepository.createNomination(mockNominationData)).rejects.toThrow('Failed to submit nomination');
    });
  });

  describe('getNominationsByAward', () => {
    it('should fetch nominations for a specific award', async () => {
      const mockNominations = [
        {
          id: 'nom1',
          data: () => ({
            awardId: 'award1',
            awardCategory: 'Excellence',
            nomineeInfo: { name: 'John Doe', email: 'john@example.com' },
            nominatorInfo: { name: 'Jane Smith', email: 'jane@example.com' },
            nominationText: 'Great teacher',
            submissionDate: { toDate: () => new Date('2024-01-15') },
            status: 'pending',
            supportingDocuments: ['doc1.pdf'],
            reviewNotes: 'Under review'
          })
        }
      ];

      const mockSnapshot = {
        forEach: (callback: (doc: any) => void) => {
          mockNominations.forEach(callback);
        }
      };

      mockFirestore.getDocs.mockResolvedValue(mockSnapshot);
      mockFirestore.collection.mockReturnValue('nominations-collection');
      mockFirestore.query.mockReturnValue('nominations-query');
      mockFirestore.where.mockReturnValue('where-clause');
      mockFirestore.orderBy.mockReturnValue('order-clause');

      const result = await nominationsRepository.getNominationsByAward('award1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'nom1',
        awardId: 'award1',
        awardCategory: 'Excellence',
        nomineeInfo: { name: 'John Doe', email: 'john@example.com' },
        nominatorInfo: { name: 'Jane Smith', email: 'jane@example.com' },
        nominationText: 'Great teacher',
        submissionDate: new Date('2024-01-15'),
        status: 'pending',
        supportingDocuments: ['doc1.pdf'],
        reviewNotes: 'Under review'
      });

      expect(mockFirestore.where).toHaveBeenCalledWith('awardId', '==', 'award1');
      expect(mockFirestore.orderBy).toHaveBeenCalledWith('submissionDate', 'desc');
    });

    it('should handle missing supportingDocuments gracefully', async () => {
      const mockNominations = [
        {
          id: 'nom1',
          data: () => ({
            awardId: 'award1',
            awardCategory: 'Excellence',
            nomineeInfo: { name: 'John Doe', email: 'john@example.com' },
            nominatorInfo: { name: 'Jane Smith', email: 'jane@example.com' },
            nominationText: 'Great teacher',
            submissionDate: { toDate: () => new Date('2024-01-15') },
            status: 'pending',
            // supportingDocuments field missing
          })
        }
      ];

      const mockSnapshot = {
        forEach: (callback: (doc: any) => void) => {
          mockNominations.forEach(callback);
        }
      };

      mockFirestore.getDocs.mockResolvedValue(mockSnapshot);

      const result = await nominationsRepository.getNominationsByAward('award1');

      expect(result[0].supportingDocuments).toEqual([]);
    });

    it('should handle fetch errors gracefully', async () => {
      mockFirestore.getDocs.mockRejectedValue(new Error('Firestore error'));

      await expect(nominationsRepository.getNominationsByAward('award1')).rejects.toThrow('Failed to fetch nominations');
    });
  });
});

describe('Awards Utils', () => {
  describe('isDeadlinePassed', () => {
    it('should return true when deadline has passed', () => {
      const pastDate = new Date('2020-01-01');
      expect(awardsUtils.isDeadlinePassed(pastDate)).toBe(true);
    });

    it('should return false when deadline has not passed', () => {
      const futureDate = new Date('2030-01-01');
      expect(awardsUtils.isDeadlinePassed(futureDate)).toBe(false);
    });

    it('should handle current date edge case', () => {
      const now = new Date();
      const result = awardsUtils.isDeadlinePassed(now);
      // Should be false or true depending on exact timing, but should not throw
      expect(typeof result).toBe('boolean');
    });
  });
});