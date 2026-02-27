import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchHistory } from './useSearchHistory';

describe('useSearchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should load history from localStorage', () => {
    const mockHistory = ['react', 'typescript', 'vue'];
    localStorage.setItem('github-search-history', JSON.stringify(mockHistory));

    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual(mockHistory);
  });

  it('should add query to history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toBe('react');
  });

  it('should not add empty query to history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('');
      result.current.addToHistory('   ');
    });

    expect(result.current.history).toHaveLength(0);
  });

  it('should move existing query to top', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react');
      result.current.addToHistory('vue');
      result.current.addToHistory('react'); // Should move to top
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0]).toBe('react');
    expect(result.current.history[1]).toBe('vue');
  });

  it('should limit history to 10 items', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.addToHistory(`query-${i}`);
      }
    });

    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0]).toBe('query-14');
  });

  it('should remove query from history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react');
      result.current.addToHistory('vue');
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.removeFromHistory('react');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toBe('vue');
  });

  it('should clear all history', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react');
      result.current.addToHistory('vue');
      result.current.addToHistory('angular');
    });

    expect(result.current.history).toHaveLength(3);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
    expect(localStorage.getItem('github-search-history')).toBeNull();
  });

  it('should persist history to localStorage', () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('react');
      result.current.addToHistory('vue');
    });

    const stored = localStorage.getItem('github-search-history');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(['vue', 'react']);
  });

  it('should handle invalid localStorage data', () => {
    localStorage.setItem('github-search-history', 'invalid-json');

    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it('should handle non-array localStorage data', () => {
    localStorage.setItem('github-search-history', JSON.stringify({ not: 'array' }));

    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });
});
