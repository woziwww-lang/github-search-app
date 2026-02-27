import { describe, it, expect } from 'vitest';
import { formatNumber, formatDate, calculateTotalPages } from './format';

describe('formatNumber', () => {
  it('should format numbers with locale-specific separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(42)).toBe('42');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
  });
});

describe('formatDate', () => {
  it('should format date strings correctly', () => {
    const dateString = '2024-01-15T10:30:00Z';
    const formatted = formatDate(dateString);
    expect(formatted).toMatch(/Jan 15, 2024/);
  });

  it('should handle different date formats', () => {
    const dateString = '2023-12-25T00:00:00Z';
    const formatted = formatDate(dateString);
    expect(formatted).toMatch(/Dec 2[45], 2023/); // Account for timezone differences
  });
});

describe('calculateTotalPages', () => {
  it('should calculate total pages correctly', () => {
    expect(calculateTotalPages(100, 10)).toBe(10);
    expect(calculateTotalPages(95, 10)).toBe(10);
    expect(calculateTotalPages(101, 10)).toBe(11);
  });

  it('should respect maxPages limit', () => {
    expect(calculateTotalPages(10000, 10, 100)).toBe(100);
    expect(calculateTotalPages(5000, 10, 50)).toBe(50);
  });

  it('should handle edge cases', () => {
    expect(calculateTotalPages(0, 10)).toBe(0);
    expect(calculateTotalPages(5, 10)).toBe(1);
  });

  it('should use default maxPages of 100', () => {
    expect(calculateTotalPages(2000, 10)).toBe(100);
  });
});
