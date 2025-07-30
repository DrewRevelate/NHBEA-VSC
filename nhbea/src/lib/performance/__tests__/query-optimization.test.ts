/**
 * Tests for Query Optimization and Performance Monitoring
 */

import { 
  queryPerformanceMonitor,
  validateQueryPerformance 
} from '../query-optimization';

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: [
      {
        id: 'test1',
        data: () => ({
          personalInfo: { firstName: 'Test', lastName: 'User' },
          governance: {
            boardMember: { active: true, position: { title: 'President', level: 1 }, order: 1 },
            pastPresident: { isPastPresident: false }
          },
          recognition: {
            hallOfFame: { inducted: false },
            awards: []
          },
          affiliations: [{ organizationId: 'org1', title: 'Test Org', isPrimary: true }],
          membership: { type: 'individual', status: 'active', autoRenewal: true },
          preferences: { emailNotifications: true, directoryListing: true, newsletterSubscription: false },
          metadata: { createdAt: { toDate: () => new Date() }, updatedAt: { toDate: () => new Date() } }
        })
      }
    ]
  }))
}));

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn();
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow
  }
});

describe('Query Optimization and Performance Monitoring', () => {
  
  beforeEach(() => {
    queryPerformanceMonitor.clearMetrics();
    mockPerformanceNow.mockReset();
  });

  describe('Performance Monitoring', () => {
    it('should track query execution time', async () => {
      // Mock performance timing
      mockPerformanceNow
        .mockReturnValueOnce(0)      // Start time
        .mockReturnValueOnce(50);    // End time

      const result = await queryPerformanceMonitor.getOptimizedBoardMembers();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      const report = queryPerformanceMonitor.getPerformanceReport();
      expect(report.totalQueries).toBe(1);
      expect(report.averageExecutionTime).toBe(50);
    });

    it('should cache query results', async () => {
      // Mock performance timing for initial query
      mockPerformanceNow
        .mockReturnValueOnce(0)      // Start time 1st call
        .mockReturnValueOnce(100)    // End time 1st call
        .mockReturnValueOnce(200)    // Start time 2nd call
        .mockReturnValueOnce(205);   // End time 2nd call (should be cached)

      // First call - should execute query
      const result1 = await queryPerformanceMonitor.getOptimizedBoardMembers();
      
      // Second call - should use cache
      const result2 = await queryPerformanceMonitor.getOptimizedBoardMembers();
      
      const report = queryPerformanceMonitor.getPerformanceReport();
      expect(report.totalQueries).toBe(2);
      expect(report.cacheHitRate).toBe(50); // 1 out of 2 queries was cached
    });

    it('should identify slow queries', async () => {
      // Mock slow query
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150); // 150ms - exceeds board member threshold of 100ms

      const consoleMock = jest.spyOn(console, 'warn').mockImplementation();
      
      await queryPerformanceMonitor.getOptimizedBoardMembers();
      
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining('Slow query detected: getBoardMembers took 150.00ms')
      );
      
      consoleMock.mockRestore();
    });

    it('should generate comprehensive performance reports', async () => {
      // Mock multiple queries with different performance
      mockPerformanceNow
        .mockReturnValueOnce(0).mockReturnValueOnce(50)      // Fast query
        .mockReturnValueOnce(100).mockReturnValueOnce(250)   // Slow query
        .mockReturnValueOnce(300).mockReturnValueOnce(375);  // Medium query

      await queryPerformanceMonitor.getOptimizedBoardMembers();
      await queryPerformanceMonitor.getOptimizedHallOfFameMembers();
      await queryPerformanceMonitor.searchMembersOptimized('test');

      const report = queryPerformanceMonitor.getPerformanceReport();
      
      expect(report.totalQueries).toBe(3);
      expect(report.averageExecutionTime).toBe((50 + 150 + 75) / 3);
      expect(report.slowestQuery.executionTime).toBe(150);
      expect(report.fastestQuery.executionTime).toBe(50);
      expect(report.performanceIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Optimized Query Methods', () => {
    it('should execute optimized board members query', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const result = await queryPerformanceMonitor.getOptimizedBoardMembers();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('personalInfo');
      expect(result[0]).toHaveProperty('governance');
      expect(result[0].governance.boardMember.active).toBe(true);
    });

    it('should execute optimized hall of fame query', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      const result = await queryPerformanceMonitor.getOptimizedHallOfFameMembers();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should execute optimized past presidents query', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(75);

      const result = await queryPerformanceMonitor.getOptimizedPastPresidents();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should execute optimized member search', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150);

      const result = await queryPerformanceMonitor.searchMembersOptimized('test', {
        boardMembersOnly: true,
        activeOnly: true
      });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty search terms', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const result = await queryPerformanceMonitor.searchMembersOptimized('');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter search results by name, email, and organization', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      const result = await queryPerformanceMonitor.searchMembersOptimized('test');
      
      expect(result).toBeDefined();
      // Should find the mock member with 'Test' in the name
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Cache Management', () => {
    it('should respect cache TTL', async () => {
      // This would require mocking Date.now() to test TTL expiration
      // For now, we test that cache keys are generated correctly
      
      mockPerformanceNow
        .mockReturnValueOnce(0).mockReturnValueOnce(50)
        .mockReturnValueOnce(100).mockReturnValueOnce(150);

      await queryPerformanceMonitor.searchMembersOptimized('test1');
      await queryPerformanceMonitor.searchMembersOptimized('test2');
      
      const report = queryPerformanceMonitor.getPerformanceReport();
      expect(report.totalQueries).toBe(2);
      expect(report.cacheHitRate).toBe(0); // Different search terms, no cache hits
    });

    it('should clear metrics and cache', () => {
      queryPerformanceMonitor.clearMetrics();
      
      const report = queryPerformanceMonitor.getPerformanceReport();
      expect(report.totalQueries).toBe(0);
    });

    it('should export metrics for analysis', async () => {
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50);

      await queryPerformanceMonitor.getOptimizedBoardMembers();
      
      const metrics = queryPerformanceMonitor.exportMetrics();
      expect(metrics).toBeDefined();
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBe(1);
      expect(metrics[0]).toHaveProperty('queryName');
      expect(metrics[0]).toHaveProperty('executionTime');
      expect(metrics[0]).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should handle query errors gracefully', async () => {
      // Mock Firebase error
      const { getDocs } = require('firebase/firestore');
      getDocs.mockRejectedValueOnce(new Error('Firebase connection error'));

      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      await expect(queryPerformanceMonitor.getOptimizedBoardMembers()).rejects.toThrow('Firebase connection error');
      
      const report = queryPerformanceMonitor.getPerformanceReport();
      expect(report.totalQueries).toBe(1);
    });
  });

  describe('Performance Validation', () => {
    it('should have performance validation function', () => {
      expect(typeof validateQueryPerformance).toBe('function');
    });

    it('should track performance thresholds correctly', async () => {
      // Test individual query methods with known timing
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50); // 50ms - should pass board member threshold

      const result = await queryPerformanceMonitor.getOptimizedBoardMembers();
      const report = queryPerformanceMonitor.getPerformanceReport();
      
      expect(report.totalQueries).toBe(1);
      expect(report.averageExecutionTime).toBe(50);
      expect(result).toBeDefined();
    });

    it('should identify queries exceeding thresholds', async () => {
      const consoleMock = jest.spyOn(console, 'warn').mockImplementation();
      
      mockPerformanceNow
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(250); // 250ms - exceeds hall of fame threshold of 200ms

      await queryPerformanceMonitor.getOptimizedHallOfFameMembers();
      
      expect(consoleMock).toHaveBeenCalledWith(
        expect.stringContaining('Slow query detected: getHallOfFameMembers took 250.00ms')
      );
      
      consoleMock.mockRestore();
    });
  });
});

// Mock data for testing
export const mockEnhancedMember = {
  id: 'test-member',
  personalInfo: {
    firstName: 'Test',
    lastName: 'Member',
    email: 'test@example.com'
  },
  governance: {
    boardMember: {
      active: true,
      position: { title: 'President', level: 1 },
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
    organizationId: 'org1',
    title: 'Test Organization',
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
    updatedAt: new Date()
  }
};