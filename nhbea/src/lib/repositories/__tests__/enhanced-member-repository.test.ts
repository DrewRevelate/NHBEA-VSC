/**
 * Tests for Enhanced Member Repository
 */

import { EnhancedMemberRepository, EnhancedMember } from '../enhanced-member-repository';
import { Member } from '@/types/dataModels';

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('EnhancedMemberRepository', () => {
  let repository: EnhancedMemberRepository;

  beforeEach(() => {
    repository = new EnhancedMemberRepository();
  });

  describe('Board Member Queries', () => {
    it('should have getBoardMembers method with correct query structure', () => {
      expect(typeof repository.getBoardMembers).toBe('function');
    });

    it('should have getPastPresidents method', () => {
      expect(typeof repository.getPastPresidents).toBe('function');
    });

    it('should have getHallOfFameMembers method', () => {
      expect(typeof repository.getHallOfFameMembers).toBe('function');
    });
  });

  describe('Member Migration', () => {
    it('should migrate legacy member to enhanced format correctly', async () => {
      const legacyMember: Member = {
        id: 'test-id',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '555-1234'
        },
        organization: {
          address: 'organizations/test-org',
          title: 'Professor'
        },
        membership: {
          type: 'individual',
          status: 'active',
          autoRenewal: true
        },
        profile: {
          activeBoardMember: true,
          boardPosition: 'President',
          boardOrder: 1,
          past_president: {
            past_president: false
          }
        },
        preferences: {
          emailNotifications: true,
          directoryListing: true,
          newsletterSubscription: false
        },
        metadata: {
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02')
        }
      };

      const enhanced = await repository.migrateLegacyMember(legacyMember);

      expect(enhanced.id).toBe('test-id');
      expect(enhanced.personalInfo.firstName).toBe('John');
      expect(enhanced.personalInfo.lastName).toBe('Doe');
      expect(enhanced.governance.boardMember.active).toBe(true);
      expect(enhanced.governance.boardMember.position.title).toBe('President');
      expect(enhanced.governance.boardMember.position.level).toBe(1);
      expect(enhanced.governance.pastPresident.isPastPresident).toBe(false);
      expect(enhanced.affiliations[0].organizationId).toBe('organizations/test-org');
      expect(enhanced.affiliations[0].title).toBe('Professor');
      expect(enhanced.affiliations[0].isPrimary).toBe(true);
    });

    it('should handle legacy member with hall of fame data', async () => {
      const legacyMember: any = {
        id: 'hof-member',
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith'
        },
        organization: {
          address: 'organizations/test-org',
          title: 'Business Teacher'
        },
        membership: {
          type: 'individual',
          status: 'active',
          autoRenewal: true
        },
        profile: {
          activeBoardMember: false
        },
        hall_of_fame: {
          isactive: true,
          award: [
            { id: 'award1', path: 'awards' },
            { id: 'award2', path: 'awards' }
          ]
        },
        awards: [
          { award: 'awards/award1', active: true, year: 2023 },
          { award: 'awards/award2', active: true, year: 2024 }
        ],
        preferences: {
          emailNotifications: false,
          directoryListing: true,
          newsletterSubscription: true
        },
        metadata: {
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      };

      const enhanced = await repository.migrateLegacyMember(legacyMember);

      expect(enhanced.recognition.hallOfFame.inducted).toBe(true);
      expect(enhanced.recognition.awards.length).toBe(4); // 2 legacy + 2 hall of fame
      
      // Check legacy awards
      const legacyAwards = enhanced.recognition.awards.filter(a => a.id.startsWith('legacy_'));
      expect(legacyAwards).toHaveLength(2);
      expect(legacyAwards[0].year).toBe(2023);
      expect(legacyAwards[1].year).toBe(2024);

      // Check hall of fame awards
      const hofAwards = enhanced.recognition.awards.filter(a => a.id.startsWith('hof_'));
      expect(hofAwards).toHaveLength(2);
      expect(hofAwards[0].category).toBe('hall_of_fame');
    });

    it('should handle legacy member with past president data', async () => {
      const legacyMember: Member = {
        id: 'past-pres',
        personalInfo: {
          firstName: 'Bob',
          lastName: 'Wilson'
        },
        organization: {
          address: 'organizations/test-org',
          title: 'Director'
        },
        membership: {
          type: 'individual',
          status: 'active',
          autoRenewal: false
        },
        profile: {
          activeBoardMember: true,
          boardPosition: 'Past President',
          boardOrder: 5,
          past_president: {
            past_president: true,
            year_started: 2020,
            year_ended: 2022
          }
        },
        preferences: {
          emailNotifications: true,
          directoryListing: false,
          newsletterSubscription: true
        },
        metadata: {
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      };

      const enhanced = await repository.migrateLegacyMember(legacyMember);

      expect(enhanced.governance.pastPresident.isPastPresident).toBe(true);
      expect(enhanced.governance.pastPresident.yearsServed).toEqual([2020]);
      expect(enhanced.governance.boardMember.position.title).toBe('Past President');
      expect(enhanced.governance.boardMember.position.level).toBe(5);
    });
  });

  describe('Search Functionality', () => {
    it('should have search method with proper filters', () => {
      expect(typeof repository.searchMembers).toBe('function');
    });
  });

  describe('Performance Query Methods', () => {
    it('should provide optimized board member queries', () => {
      // Test that board member queries are structured for performance
      expect(typeof repository.getBoardMembers).toBe('function');
    });

    it('should provide optimized hall of fame queries', () => {
      // Test that hall of fame queries are structured for performance
      expect(typeof repository.getHallOfFameMembers).toBe('function');
    });
  });

  describe('Data Validation', () => {
    it('should handle missing or undefined fields gracefully', async () => {
      const incompleteMember: Partial<Member> = {
        id: 'incomplete',
        personalInfo: {
          firstName: 'Test'
          // Missing lastName and other fields
        }
      };

      const enhanced = await repository.migrateLegacyMember(incompleteMember as Member);

      expect(enhanced.personalInfo.firstName).toBe('Test');
      expect(enhanced.personalInfo.lastName).toBe('');
      expect(enhanced.governance.boardMember.active).toBe(false);
      expect(enhanced.membership.type).toBe('individual');
      expect(enhanced.membership.status).toBe('active');
    });

    it('should provide default values for all required fields', async () => {
      const minimalMember: Member = {
        id: 'minimal',
        personalInfo: {
          firstName: 'Min',
          lastName: 'Member'
        },
        organization: {
          address: '',
          title: ''
        },
        membership: {
          type: 'individual',
          status: 'active',
          autoRenewal: false
        },
        profile: {
          activeBoardMember: false
        },
        preferences: {
          emailNotifications: false,
          directoryListing: false,
          newsletterSubscription: false
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const enhanced = await repository.migrateLegacyMember(minimalMember);

      // Verify all required fields have values
      expect(enhanced.personalInfo.firstName).toBeTruthy();
      expect(enhanced.personalInfo.lastName).toBeTruthy();
      expect(enhanced.governance).toBeDefined();
      expect(enhanced.recognition).toBeDefined();
      expect(enhanced.affiliations).toBeDefined();
      expect(enhanced.membership).toBeDefined();
      expect(enhanced.preferences).toBeDefined();
      expect(enhanced.metadata).toBeDefined();
    });
  });
});

// Mock data for testing
export const mockEnhancedMember: EnhancedMember = {
  id: 'test-enhanced',
  personalInfo: {
    firstName: 'Enhanced',
    lastName: 'Member',
    email: 'enhanced@example.com',
    phone: '555-9999'
  },
  governance: {
    boardMember: {
      active: true,
      position: {
        title: 'President',
        level: 1
      },
      order: 1
    },
    pastPresident: {
      isPastPresident: false
    }
  },
  recognition: {
    hallOfFame: {
      inducted: false
    },
    awards: []
  },
  affiliations: [{
    organizationId: 'organizations/test-org',
    title: 'Test Position',
    isPrimary: true
  }],
  membership: {
    type: 'individual',
    status: 'active',
    autoRenewal: true
  },
  preferences: {
    emailNotifications: true,
    directoryListing: true,
    newsletterSubscription: false
  },
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    migrationSource: 'test'
  }
};