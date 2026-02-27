import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should initialize with dark theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('should load theme from localStorage', () => {
    localStorage.setItem('github-search-theme', 'light');

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('should add dark class to html element', () => {
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class for light theme', () => {
    localStorage.setItem('github-search-theme', 'light');

    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should toggle theme from dark to light', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should toggle theme from light to dark', () => {
    localStorage.setItem('github-search-theme', 'light');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('github-search-theme')).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('github-search-theme')).toBe('dark');
  });

  it('should handle multiple toggles correctly', () => {
    const { result } = renderHook(() => useTheme());

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(initialTheme);
  });
});
