/**
 * Cache management utilities for Catholic Missal
 * Handles localStorage caching and service worker integration
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number; // Unix timestamp
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 24 hours)
  prefix?: string; // Cache key prefix (default: 'missal')
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_PREFIX = 'missal';

/**
 * Cache manager class for readings and liturgical data
 */
export class CacheManager {
  private prefix: string;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.prefix = options.prefix || DEFAULT_PREFIX;
    this.defaultTTL = options.ttl || DEFAULT_TTL;
  }

  /**
   * Generate cache key with prefix
   */
  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Store data in cache
   */
  set<T>(key: string, data: T, ttl?: number): boolean {
    if (!this.isBrowser()) return false;

    try {
      const expiry = Date.now() + (ttl || this.defaultTTL);
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry,
      };

      localStorage.setItem(this.getKey(key), JSON.stringify(cacheEntry));
      return true;
    } catch (error) {
      console.warn('Failed to cache data:', error);
      return false;
    }
  }

  /**
   * Retrieve data from cache
   */
  get<T>(key: string): T | null {
    if (!this.isBrowser()) return null;

    try {
      const cached = localStorage.getItem(this.getKey(key));
      if (!cached) return null;

      const cacheEntry: CacheEntry<T> = JSON.parse(cached);

      // Check if cache has expired
      if (Date.now() > cacheEntry.expiry) {
        this.delete(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      this.delete(key); // Clear corrupted cache entry
      return null;
    }
  }

  /**
   * Check if data exists in cache and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    if (!this.isBrowser()) return false;

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.warn('Failed to delete cache entry:', error);
      return false;
    }
  }

  /**
   * Clear all cache entries with our prefix
   */
  clear(): boolean {
    if (!this.isBrowser()) return false;

    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.prefix}:`));

      for (const key of prefixedKeys) {
        localStorage.removeItem(key);
      }

      return true;
    } catch (error) {
      console.warn('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    totalSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    if (!this.isBrowser()) {
      return {
        totalEntries: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
      };
    }

    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.prefix}:`));

      let totalSize = 0;
      let oldestEntry: number | null = null;
      let newestEntry: number | null = null;

      for (const key of prefixedKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;

          try {
            const entry: CacheEntry<unknown> = JSON.parse(value);
            if (oldestEntry === null || entry.timestamp < oldestEntry) {
              oldestEntry = entry.timestamp;
            }
            if (newestEntry === null || entry.timestamp > newestEntry) {
              newestEntry = entry.timestamp;
            }
          } catch {
            // Ignore corrupted entries
          }
        }
      }

      return {
        totalEntries: prefixedKeys.length,
        totalSize,
        oldestEntry,
        newestEntry,
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return {
        totalEntries: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
      };
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    if (!this.isBrowser()) return 0;

    let cleanedCount = 0;

    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.prefix}:`));

      for (const key of prefixedKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const entry: CacheEntry<unknown> = JSON.parse(value);
            if (Date.now() > entry.expiry) {
              localStorage.removeItem(key);
              cleanedCount++;
            }
          } catch {
            // Remove corrupted entries
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
    }

    return cleanedCount;
  }
}

// Create default cache manager instance
export const readingsCache = new CacheManager({
  prefix: 'missal-readings',
  ttl: 24 * 60 * 60 * 1000, // 24 hours
});

export const liturgicalCache = new CacheManager({
  prefix: 'missal-liturgical',
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days (liturgical info changes less frequently)
});

/**
 * Utility function to generate cache keys for readings
 */
export function getReadingsCacheKey(date: string): string {
  return `readings-${date}`;
}

/**
 * Utility function to generate cache keys for liturgical calendar data
 */
export function getLiturgicalCacheKey(year: number, month?: number): string {
  return month !== undefined ? `liturgical-${year}-${month}` : `liturgical-${year}`;
}

/**
 * Initialize cache cleanup on app start
 */
export function initializeCacheCleanup(): void {
  if (typeof window !== 'undefined') {
    // Clean up expired entries on app load
    readingsCache.cleanup();
    liturgicalCache.cleanup();

    // Set up periodic cleanup (every 30 minutes)
    setInterval(() => {
      const readingsCleanedCount = readingsCache.cleanup();
      const liturgicalCleanedCount = liturgicalCache.cleanup();

      if (readingsCleanedCount > 0 || liturgicalCleanedCount > 0) {
        console.log(`Cache cleanup: ${readingsCleanedCount + liturgicalCleanedCount} expired entries removed`);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Clean up when storage is getting full
    window.addEventListener('storage', (event) => {
      if (event.key === null) {
        // localStorage was cleared
        console.log('Storage cleared, reinitializing cache');
      }
    });
  }
}