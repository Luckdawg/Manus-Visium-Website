/**
 * Caching Layer for Performance Optimization
 * Implements in-memory caching with TTL support for frequently accessed data
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Get or compute value (cache-aside pattern)
   */
  async getOrCompute<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    // Try to get from cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Compute and cache
    const value = await computeFn();
    this.set(key, value, ttlMs);
    return value;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete multiple keys matching a pattern
   */
  deletePattern(pattern: string): number {
    let deleted = 0;
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
      deleted++;
    });

    return deleted;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
  } {
    const keys: string[] = [];
    this.cache.forEach((_, key) => {
      keys.push(key);
    });

    return {
      size: this.cache.size,
      keys,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
      cleaned++;
    });

    return cleaned;
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// Cache key generators
export const cacheKeys = {
  // Course catalog
  courses: (limit?: number, offset?: number) =>
    `courses:${limit || 'all'}:${offset || 0}`,
  courseDetails: (courseId: number) => `course:${courseId}`,
  learningPaths: () => 'learning_paths:all',
  certifications: () => 'certifications:all',

  // Deal pipeline
  dealPipeline: (partnerId?: number) =>
    partnerId ? `deals:pipeline:${partnerId}` : 'deals:pipeline:all',
  dealMetrics: (partnerId?: number) =>
    partnerId ? `deals:metrics:${partnerId}` : 'deals:metrics:all',
  dealStages: () => 'deals:stages',

  // Partner data
  partnerCompanies: (limit?: number) => `partners:companies:${limit || 'all'}`,
  partnerDetails: (partnerId: number) => `partner:${partnerId}`,
  partnerTiers: () => 'partners:tiers',

  // Training data
  userCourses: (userId: number) => `user:${userId}:courses`,
  userCertifications: (userId: number) => `user:${userId}:certifications`,
  enrollmentProgress: (enrollmentId: number) => `enrollment:${enrollmentId}`,

  // Admin data
  workflowMetrics: () => 'admin:workflows:metrics',
  conflictPolicies: () => 'admin:policies:conflicts',
  scoringRules: () => 'admin:rules:scoring',
  auditLog: (limit?: number) => `admin:audit:${limit || 50}`,

  // Dashboard data
  partnerDashboard: (partnerId: number) => `dashboard:partner:${partnerId}`,
  adminDashboard: () => 'dashboard:admin',
};

// Cache TTL constants (in milliseconds)
export const cacheTTL = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
};

/**
 * Cache invalidation helper
 * Clears related cache entries when data changes
 */
export const invalidateCache = {
  /**
   * Invalidate all course-related caches
   */
  courses: () => {
    cacheManager.deletePattern('^courses:');
    cacheManager.deletePattern('^course:');
    cacheManager.deletePattern('learning_paths');
  },

  /**
   * Invalidate course-specific cache
   */
  courseById: (courseId: number) => {
    cacheManager.delete(cacheKeys.courseDetails(courseId));
    cacheManager.deletePattern('^courses:');
    cacheManager.deletePattern('learning_paths');
  },

  /**
   * Invalidate all deal-related caches
   */
  deals: () => {
    cacheManager.deletePattern('^deals:');
    cacheManager.deletePattern('^dashboard:');
  },

  /**
   * Invalidate partner-specific deal cache
   */
  dealsByPartner: (partnerId: number) => {
    cacheManager.delete(cacheKeys.dealPipeline(partnerId));
    cacheManager.delete(cacheKeys.dealMetrics(partnerId));
    cacheManager.delete(cacheKeys.partnerDashboard(partnerId));
  },

  /**
   * Invalidate all partner-related caches
   */
  partners: () => {
    cacheManager.deletePattern('^partners:');
    cacheManager.deletePattern('^partner:');
    cacheManager.deletePattern('^dashboard:');
  },

  /**
   * Invalidate partner-specific cache
   */
  partnerById: (partnerId: number) => {
    cacheManager.delete(cacheKeys.partnerDetails(partnerId));
    cacheManager.delete(cacheKeys.partnerDashboard(partnerId));
    cacheManager.deletePattern('^partners:companies');
  },

  /**
   * Invalidate user training cache
   */
  userTraining: (userId: number) => {
    cacheManager.delete(cacheKeys.userCourses(userId));
    cacheManager.delete(cacheKeys.userCertifications(userId));
    cacheManager.deletePattern(`^enrollment:.*`);
  },

  /**
   * Invalidate admin configuration caches
   */
  adminConfig: () => {
    cacheManager.delete(cacheKeys.workflowMetrics());
    cacheManager.delete(cacheKeys.conflictPolicies());
    cacheManager.delete(cacheKeys.scoringRules());
    cacheManager.delete(cacheKeys.adminDashboard());
  },

  /**
   * Clear all caches
   */
  all: () => {
    cacheManager.clear();
  },
};

/**
 * Periodic cache cleanup (run every 10 minutes)
 */
export function startCacheCleanup(): NodeJS.Timer {
  return setInterval(() => {
    const cleaned = cacheManager.cleanup();
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
    }
  }, 10 * 60 * 1000);
}

export default cacheManager;
