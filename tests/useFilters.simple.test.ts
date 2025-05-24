/**
 * @jest-environment jsdom
 *
 * Simple test suite for useFilters hook.
 * This file contains basic test cases that serve as examples
 * for users to understand the core functionality of the hook.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import useFilters from '../src/useFilters';

describe('useFilters', () => {
  // Setup window.location mock
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock URL and location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?test=value&category=books',
        href: 'https://example.com?test=value&category=books',
      },
    });

    // Mock pushState
    window.history.pushState = jest.fn();
  });

  afterEach(() => {
    // Reset location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });

    jest.clearAllMocks();
  });

  it('should get filters from URL', () => {
    const { result } = renderHook(() =>
      useFilters({
        initialFilters: {
          test: '',
          category: '',
          other: 'default',
        },
      })
    );

    expect(result.current.filters.test).toBe('value');
    expect(result.current.filters.category).toBe('books');
    expect(result.current.filters.other).toBe('default'); // Default value when not in URL
  });

  it('should update URL when changing filter', () => {
    const { result } = renderHook(() =>
      useFilters({
        initialFilters: {
          test: '',
          category: '',
          other: 'default',
        },
      })
    );

    act(() => {
      result.current.onChangeFilter('test', 'new value');
    });

    expect(window.history.pushState).toHaveBeenCalled();
  });

  it('should handle namespaces correctly', () => {
    // Update location for this test
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?prefix-test=value',
        href: 'https://example.com?prefix-test=value',
      },
    });

    const { result } = renderHook(() =>
      useFilters({
        namespace: 'prefix',
        initialFilters: {
          test: '',
          category: '',
        },
      })
    );

    expect(result.current.filters.test).toBe('value');
    expect(result.current.filters.category).toBe('');
  });
});
