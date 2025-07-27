import { getHomepageContent, getContentSections, defaultHomepageContent } from './content';
import { db } from './firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

// Mock Firebase functions
jest.mock('./firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn()
}));

const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockOrderBy = orderBy as jest.MockedFunction<typeof orderBy>;

describe('Content Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHomepageContent', () => {
    it('should return homepage content when document exists', async () => {
      const mockContent = {
        heroTitle: 'Test Title',
        heroSubtitle: 'Test Subtitle',
        missionTitle: 'Test Mission',
        missionContent: 'Test Mission Content',
        aboutTitle: 'Test About',
        aboutContent: 'Test About Content'
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockContent
      } as any);

      const result = await getHomepageContent();
      expect(result).toEqual(mockContent);
      expect(mockDoc).toHaveBeenCalledWith(db, 'content', 'homepage');
    });

    it('should return null when document does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false
      } as any);

      const result = await getHomepageContent();
      expect(result).toBeNull();
    });

    it('should throw error when Firebase fails', async () => {
      mockGetDoc.mockRejectedValue(new Error('Firebase error'));

      await expect(getHomepageContent()).rejects.toThrow('Failed to fetch homepage content');
    });
  });

  describe('getContentSections', () => {
    it('should return content sections excluding homepage', async () => {
      const mockSections = [
        {
          id: 'section1',
          data: () => ({ title: 'Section 1', content: 'Content 1', order: 1 })
        },
        {
          id: 'homepage',
          data: () => ({ title: 'Homepage', content: 'Homepage content' })
        },
        {
          id: 'section2',
          data: () => ({ title: 'Section 2', content: 'Content 2', order: 2 })
        }
      ];

      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => mockSections.forEach(callback)
      } as any);

      const result = await getContentSections();
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'section1',
        title: 'Section 1',
        content: 'Content 1',
        order: 1
      });
      expect(result[1]).toEqual({
        id: 'section2',
        title: 'Section 2',
        content: 'Content 2',
        order: 2
      });
    });

    it('should return empty array when no sections exist', async () => {
      mockGetDocs.mockResolvedValue({
        forEach: (callback: any) => {}
      } as any);

      const result = await getContentSections();
      expect(result).toEqual([]);
    });

    it('should throw error when Firebase fails', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(getContentSections()).rejects.toThrow('Failed to fetch content sections');
    });
  });

  describe('defaultHomepageContent', () => {
    it('should have all required properties', () => {
      expect(defaultHomepageContent).toHaveProperty('heroTitle');
      expect(defaultHomepageContent).toHaveProperty('heroSubtitle');
      expect(defaultHomepageContent).toHaveProperty('missionTitle');
      expect(defaultHomepageContent).toHaveProperty('missionContent');
      expect(defaultHomepageContent).toHaveProperty('aboutTitle');
      expect(defaultHomepageContent).toHaveProperty('aboutContent');
      
      expect(typeof defaultHomepageContent.heroTitle).toBe('string');
      expect(defaultHomepageContent.heroTitle.length).toBeGreaterThan(0);
    });

    it('should have meaningful content', () => {
      expect(defaultHomepageContent.heroTitle).toContain('Business Educators');
      expect(defaultHomepageContent.heroSubtitle).toContain('business education');
      expect(defaultHomepageContent.missionContent.length).toBeGreaterThan(50);
      expect(defaultHomepageContent.aboutContent.length).toBeGreaterThan(50);
    });
  });
});