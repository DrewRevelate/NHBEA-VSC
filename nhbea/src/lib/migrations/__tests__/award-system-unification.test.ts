/**
 * Tests for Award System Unification Migration
 */

import { 
  unifyMemberAwards,
  analyzeAwardSystems,
  validateAwardUnification
} from '../award-system-unification';

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined)
  })),
  doc: jest.fn()
}));

describe('Award System Unification Migration', () => {
  
  describe('unifyMemberAwards', () => {
    it('should unify legacy awards and hall of fame into single system', () => {
      const memberData = {
        awards: [
          { award: 'awards/award1', active: true, year: 2023 },
          { award: 'awards/award2', active: false, year: 2022 }
        ],
        hall_of_fame: {
          isactive: true,
          award: [
            { id: 'hof1', year: 2024 },
            { id: 'hof2', year: 2023 }
          ]
        }
      };

      const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(memberData);

      // Should have 4 awards total (2 legacy + 2 hall of fame)
      expect(unifiedAwards).toHaveLength(4);

      // Check legacy awards
      const legacyAwards = unifiedAwards.filter(a => a.source === 'legacy_awards');
      expect(legacyAwards).toHaveLength(2);
      expect(legacyAwards[0].awardId).toBe('awards/award1');
      expect(legacyAwards[0].active).toBe(true);
      expect(legacyAwards[0].year).toBe(2023);
      
      expect(legacyAwards[1].awardId).toBe('awards/award2');
      expect(legacyAwards[1].active).toBe(false);
      expect(legacyAwards[1].year).toBe(2022);

      // Check hall of fame awards
      const hofAwards = unifiedAwards.filter(a => a.source === 'hall_of_fame');
      expect(hofAwards).toHaveLength(2);
      expect(hofAwards[0].category).toBe('hall_of_fame');
      expect(hofAwards[0].year).toBe(2024);

      // Check hall of fame status
      expect(hallOfFameStatus.inducted).toBe(true);
      expect(hallOfFameStatus.inductionYear).toBe(2023); // Earliest year
    });

    it('should handle member with only legacy awards', () => {
      const memberData = {
        awards: [
          { award: 'awards/solo', active: true, year: 2021 }
        ]
      };

      const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(memberData);

      expect(unifiedAwards).toHaveLength(1);
      expect(unifiedAwards[0].source).toBe('legacy_awards');
      expect(unifiedAwards[0].awardId).toBe('awards/solo');
      
      expect(hallOfFameStatus.inducted).toBe(false);
      expect(hallOfFameStatus.inductionYear).toBeUndefined();
    });

    it('should handle member with only hall of fame awards', () => {
      const memberData = {
        hall_of_fame: {
          isactive: true,
          award: [
            { id: 'hof_only', year: 2020 }
          ]
        }
      };

      const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(memberData);

      expect(unifiedAwards).toHaveLength(1);
      expect(unifiedAwards[0].source).toBe('hall_of_fame');
      expect(unifiedAwards[0].awardId).toBe('hof_only');
      
      expect(hallOfFameStatus.inducted).toBe(true);
      expect(hallOfFameStatus.inductionYear).toBe(2020);
    });

    it('should handle member with no awards', () => {
      const memberData = {
        personalInfo: {
          firstName: 'No',
          lastName: 'Awards'
        }
      };

      const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(memberData);

      expect(unifiedAwards).toHaveLength(0);
      expect(hallOfFameStatus.inducted).toBe(false);
    });

    it('should remove duplicate awards based on awardId and year', () => {
      const memberData = {
        awards: [
          { award: 'awards/duplicate', active: true, year: 2023 },
          { award: 'awards/duplicate', active: false, year: 2023 } // Same award, same year
        ],
        hall_of_fame: {
          isactive: true,
          award: [
            { id: 'unique', year: 2023 }
          ]
        }
      };

      const { unifiedAwards } = unifyMemberAwards(memberData);

      // Should have 2 awards (1 duplicate removed + 1 hall of fame)
      expect(unifiedAwards).toHaveLength(2);
      
      const duplicateAwards = unifiedAwards.filter(a => a.awardId === 'awards/duplicate');
      expect(duplicateAwards).toHaveLength(1);
    });

    it('should handle malformed award data gracefully', () => {
      const memberData = {
        awards: [
          { /* missing award field */ active: true, year: 2023 },
          { award: 'awards/valid', /* missing year */ active: true }
        ],
        hall_of_fame: {
          isactive: true,
          award: [
            { id: 'hof_award', /* missing year */ }
          ]
        }
      };

      const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(memberData);

      expect(unifiedAwards).toHaveLength(3);
      
      // Should provide defaults for missing fields
      expect(unifiedAwards[0].awardId).toBe(''); // Default empty string
      expect(unifiedAwards[1].year).toBe(new Date().getFullYear()); // Default current year
      expect(unifiedAwards[2].year).toBe(new Date().getFullYear()); // Default current year for HOF
      
      expect(hallOfFameStatus.inducted).toBe(true);
    });

    it('should preserve award categories and descriptions', () => {
      const memberData = {
        awards: [
          { award: 'awards/categorized', active: true, year: 2023, category: 'excellence' }
        ]
      };

      const { unifiedAwards } = unifyMemberAwards(memberData);

      expect(unifiedAwards[0].category).toBe('excellence');
    });
  });

  describe('Data Validation', () => {
    it('should handle edge cases in award data', () => {
      const edgeCases = [
        { awards: null, hall_of_fame: null },
        { awards: [], hall_of_fame: {} },
        { awards: undefined, hall_of_fame: undefined },
        { awards: 'invalid', hall_of_fame: 'invalid' }
      ];

      edgeCases.forEach((memberData, index) => {
        const { unifiedAwards, hallOfFameStatus } = unifyMemberAwards(memberData);
        
        expect(unifiedAwards).toHaveLength(0);
        expect(hallOfFameStatus.inducted).toBe(false);
      });
    });
  });
});

// Mock data for integration testing
export const mockMemberWithBothAwardSystems = {
  id: 'dual-awards',
  personalInfo: {
    firstName: 'Dual',
    lastName: 'Awards'
  },
  awards: [
    { award: 'awards/teaching-excellence', active: true, year: 2022 },
    { award: 'awards/innovation', active: true, year: 2023 }
  ],
  hall_of_fame: {
    isactive: true,
    award: [
      { id: 'educator-of-year', year: 2024 },
      { id: 'lifetime-achievement', year: 2024 }
    ]
  }
};

export const mockMemberWithConflictingAwards = {
  id: 'conflicting-awards',
  personalInfo: {
    firstName: 'Conflicting',
    lastName: 'Awards'
  },
  awards: [
    { award: 'awards/duplicate-award', active: true, year: 2023 }
  ],
  hall_of_fame: {
    isactive: true,
    award: [
      { id: 'duplicate-award', year: 2023 } // Same award referenced differently
    ]
  }
};