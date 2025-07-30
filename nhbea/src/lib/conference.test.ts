import { 
  getConferenceSpeakers, 
  getConferenceAgenda, 
  getConferenceFAQs, 
  getVenueDetails, 
  getSocialMediaConfig, 
  getConferenceTheme,
  getEnhancedConferenceData 
} from './conference';
import { db } from './firebase';

// Mock Firebase functions
jest.mock('./firebase', () => ({
  db: {},
}));

// Mock Firestore functions
const mockQuery = jest.fn();
const mockCollection = jest.fn();
const mockOrderBy = jest.fn();
const mockGetDocs = jest.fn();
const mockDoc = jest.fn();
const mockGetDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: mockCollection,
  query: mockQuery,
  orderBy: mockOrderBy,
  getDocs: mockGetDocs,
  doc: mockDoc,
  getDoc: mockGetDoc,
  where: jest.fn(),
}));

// Mock the legacy conference functions
jest.mock('./conference', () => ({
  ...jest.requireActual('./conference'),
  getConferenceById: jest.fn(),
}));

import { getConferenceById } from './conference';
const mockGetConferenceById = getConferenceById as jest.MockedFunction<typeof getConferenceById>;

describe('Conference Enhanced Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConferenceSpeakers', () => {
    it('should fetch and return speakers successfully', async () => {
      const mockSpeakers = [
        {
          id: 'speaker-1',
          name: 'Dr. Jane Smith',
          title: 'Professor',
          organization: 'University',
          bio: 'Expert in business education',
          featured: true,
          isKeynote: true,
          sessionIds: ['session-1'],
          expertise: ['Teaching', 'Research']
        }
      ];

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockSpeakers.forEach((speaker, index) => {
            callback({
              id: speaker.id,
              data: () => ({ ...speaker, id: undefined })
            });
          });
        })
      };

      mockCollection.mockReturnValue('mock-collection');
      mockQuery.mockReturnValue('mock-query');
      mockOrderBy.mockReturnValue('mock-order');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await getConferenceSpeakers('conference-2025');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'speaker-1',
        name: 'Dr. Jane Smith',
        title: 'Professor'
      });
    });

    it('should return empty array on error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));

      const result = await getConferenceSpeakers('conference-2025');

      expect(result).toEqual([]);
    });
  });

  describe('getConferenceAgenda', () => {
    it('should fetch and return agenda with sessions', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          title: 'Keynote Session',
          track: 'Main',
          startTime: { toDate: () => new Date('2025-10-15T09:00:00') },
          endTime: { toDate: () => new Date('2025-10-15T10:00:00') },
          type: 'keynote',
          speaker: 'speaker-1'
        }
      ];

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockSessions.forEach((session) => {
            callback({
              id: session.id,
              data: () => ({ ...session, id: undefined })
            });
          });
        })
      };

      mockCollection.mockReturnValue('mock-collection');
      mockQuery.mockReturnValue('mock-query');
      mockOrderBy.mockReturnValue('mock-order');
      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await getConferenceAgenda('conference-2025');

      expect(result).toBeDefined();
      expect(result!.sessions).toHaveLength(1);
      expect(result!.sessions[0].title).toBe('Keynote Session');
      expect(result!.tracks).toContain('Main');
      expect(result!.timeSlots).toHaveLength(1);
    });

    it('should return null on error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));

      const result = await getConferenceAgenda('conference-2025');

      expect(result).toBeNull();
    });
  });

  describe('getConferenceFAQs', () => {
    it('should fetch and return FAQs', async () => {
      const mockFAQs = [
        {
          id: 'faq-1',
          category: 'registration',
          question: 'How do I register?',
          answer: 'Click the register button',
          order: 1,
          lastUpdated: { toDate: () => new Date() }
        }
      ];

      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          mockFAQs.forEach((faq) => {
            callback({
              id: faq.id,
              data: () => ({ ...faq, id: undefined })
            });
          });
        })
      };

      mockGetDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await getConferenceFAQs('conference-2025');

      expect(result).toHaveLength(1);
      expect(result[0].question).toBe('How do I register?');
      expect(result[0].category).toBe('registration');
    });

    it('should return empty array on error', async () => {
      mockGetDocs.mockRejectedValue(new Error('Firestore error'));

      const result = await getConferenceFAQs('conference-2025');

      expect(result).toEqual([]);
    });
  });

  describe('getVenueDetails', () => {
    it('should fetch and return venue details', async () => {
      const mockVenueData = {
        name: 'Test Venue',
        description: 'A great venue',
        address: {
          street: '123 Main St',
          city: 'Manchester',
          state: 'NH',
          zipCode: '03101'
        },
        facilities: [],
        accessibility: {
          wheelchairAccessible: true,
          elevatorAccess: true,
          accessibleParking: true,
          accessibleRestrooms: true,
          hearingLoopAvailable: false,
          signLanguageInterpreter: true,
          largeTextMaterials: true
        },
        parking: {
          available: true,
          free: true,
          cost: 0,
          spaces: 100,
          validationAvailable: false
        },
        nearbyAccommodations: [],
        transportation: {
          publicTransit: true,
          airportShuttles: [],
          rideshareRecommended: true,
          walkingDistance: {
            fromDowntown: '0.5 miles',
            fromStation: '0.3 miles'
          }
        }
      };

      const mockDocSnap = {
        exists: () => true,
        data: () => mockVenueData
      };

      mockDoc.mockReturnValue('mock-doc-ref');
      mockGetDoc.mockResolvedValue(mockDocSnap);

      const result = await getVenueDetails('conference-2025');

      expect(result).toBeDefined();
      expect(result!.name).toBe('Test Venue');
      expect(result!.address.city).toBe('Manchester');
    });

    it('should return null when document does not exist', async () => {
      const mockDocSnap = {
        exists: () => false
      };

      mockGetDoc.mockResolvedValue(mockDocSnap);

      const result = await getVenueDetails('conference-2025');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockGetDoc.mockRejectedValue(new Error('Firestore error'));

      const result = await getVenueDetails('conference-2025');

      expect(result).toBeNull();
    });
  });

  describe('getSocialMediaConfig', () => {
    it('should fetch and return social media config', async () => {
      const mockSocialConfig = {
        hashtag: 'TestConf2025',
        twitterHandle: 'test_conf',
        enableTwitterFeed: true,
        enableInstagramFeed: false,
        enableSocialSharing: true,
        liveUpdatesEnabled: true
      };

      const mockDocSnap = {
        exists: () => true,
        data: () => mockSocialConfig
      };

      mockGetDoc.mockResolvedValue(mockDocSnap);

      const result = await getSocialMediaConfig('conference-2025');

      expect(result).toEqual(mockSocialConfig);
    });

    it('should return null when document does not exist', async () => {
      const mockDocSnap = {
        exists: () => false
      };

      mockGetDoc.mockResolvedValue(mockDocSnap);

      const result = await getSocialMediaConfig('conference-2025');

      expect(result).toBeNull();
    });
  });

  describe('getConferenceTheme', () => {
    it('should fetch and return conference theme', async () => {
      const mockTheme = {
        primaryColor: '#2563eb',
        secondaryColor: '#4f46e5',
        accentColor: '#06b6d4',
        brandingElements: {
          shapingTheFuture: true,
          animatedElements: true
        }
      };

      const mockDocSnap = {
        exists: () => true,
        data: () => mockTheme
      };

      mockGetDoc.mockResolvedValue(mockDocSnap);

      const result = await getConferenceTheme('conference-2025');

      expect(result).toEqual(mockTheme);
    });

    it('should return null when document does not exist', async () => {
      const mockDocSnap = {
        exists: () => false
      };

      mockGetDoc.mockResolvedValue(mockDocSnap);

      const result = await getConferenceTheme('conference-2025');

      expect(result).toBeNull();
    });
  });

  describe('getEnhancedConferenceData', () => {
    it('should fetch complete enhanced conference data', async () => {
      const mockBaseConference = {
        id: 'conference-2025',
        title: 'Test Conference',
        description: 'A test conference',
        year: 2025,
        schedule: {
          date: new Date('2025-10-15'),
          startTime: '09:00',
          endTime: '17:00',
          timezone: 'America/New_York'
        },
        location: {
          venue: 'Test Venue',
          address: {
            street: '123 Main St',
            city: 'Manchester',
            state: 'NH',
            zipCode: '03101'
          }
        },
        registration: {
          isOpen: true,
          openDate: new Date('2025-07-01'),
          closeDate: new Date('2025-10-10'),
          capacity: 100,
          currentCount: 50,
          waitlistEnabled: true,
          fees: {
            member: 100,
            nonMember: 150,
            student: 50
          },
          requiredFields: ['fullName', 'email'],
          waitingList: []
        },
        media: {},
        status: 'published' as const,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'test',
          featured: false
        }
      };

      mockGetConferenceById.mockResolvedValue(mockBaseConference);

      // Mock all the enhanced feature functions to return null/empty
      mockGetDocs.mockResolvedValue({ forEach: jest.fn() });
      mockGetDoc.mockResolvedValue({ exists: () => false });

      const result = await getEnhancedConferenceData('conference-2025');

      expect(result).toBeDefined();
      expect(result!.id).toBe('conference-2025');
      expect(result!.title).toBe('Test Conference');
    });

    it('should return null when base conference not found', async () => {
      mockGetConferenceById.mockResolvedValue(null);

      const result = await getEnhancedConferenceData('conference-2025');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockGetConferenceById.mockRejectedValue(new Error('Database error'));

      const result = await getEnhancedConferenceData('conference-2025');

      expect(result).toBeNull();
    });
  });
});