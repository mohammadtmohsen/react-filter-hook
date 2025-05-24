/**
 * Comprehensive test suite for the useFilters hook.
 * This file contains detailed test cases covering all functionality,
 * edge cases, and complex scenarios of the hook.
 */

import { renderHook, act } from '@testing-library/react-hooks';
import useFilters from '../src/useFilters';

describe('useFilters', () => {
  // Mock window.location and history
  let oldWindowLocation: Location;
  let oldHistoryPushState: History['pushState'];

  beforeEach(() => {
    // Save original values
    oldWindowLocation = window.location;
    oldHistoryPushState = window.history.pushState;

    // Mock URL and history
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '',
        href: 'https://example.com',
      },
    });

    window.history.pushState = jest.fn();
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'location', {
      writable: true,
      value: oldWindowLocation,
    });
    window.history.pushState = oldHistoryPushState;
  });

  test('filters returns initialFilters when URL has no parameters', () => {
    // Setup
    const initialFilters = {
      search: '',
      category: 'all',
      page: 1,
    };

    const { result } = renderHook(() =>
      useFilters({
        initialFilters,
      })
    );

    // Assert
    expect(result.current.filters).toEqual(initialFilters);
  });

  test('filters retrieves values from URL parameters', () => {
    // Setup - set URL with parameters
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?search=test&category=books&page=2',
        href: 'https://example.com?search=test&category=books&page=2',
      },
    });

    const initialFilters = {
      search: '',
      category: 'all',
      page: 1,
    };

    const { result } = renderHook(() =>
      useFilters({
        initialFilters,
      })
    );

    // Assert
    expect(result.current.filters).toEqual({
      search: 'test',
      category: 'books',
      page: 2,
    });
  });

  test('onChangeFilter updates URL parameters', () => {
    // Setup
    const initialFilters = {
      search: '',
      category: 'all',
      page: 1,
    };

    const { result } = renderHook(() =>
      useFilters({
        initialFilters,
      })
    );

    // Act
    act(() => {
      result.current.onChangeFilter('search', 'test query');
    });

    // Assert
    expect(window.history.pushState).toHaveBeenCalled();
    const pushStateCall = (window.history.pushState as jest.Mock).mock.calls[0];
    expect(pushStateCall[2]).toContain('search=test+query');
  });

  test('onChangeFilter with namespace prefixes parameters', () => {
    const { result } = renderHook(() =>
      useFilters({
        namespace: 'myfilters',
        initialFilters: {
          search: '',
          category: 'all',
        },
      })
    );

    act(() => {
      result.current.onChangeFilter('search', 'test');
    });

    expect(window.history.pushState).toHaveBeenCalled();
    const pushStateCall = (window.history.pushState as jest.Mock).mock.calls[0];
    expect(pushStateCall[2]).toContain('myfilters-search=test');
  });

  test('onChangeFilter handles arrays', () => {
    const { result } = renderHook(() =>
      useFilters({
        initialFilters: {
          categories: [] as string[],
        },
      })
    );

    act(() => {
      result.current.onChangeFilter('categories', ['books', 'movies']);
    });

    expect(window.history.pushState).toHaveBeenCalled();
    const pushStateCall = (window.history.pushState as jest.Mock).mock.calls[0];
    expect(pushStateCall[2]).toContain('categories=books%2Cmovies');
  });

  test('onChangeFilter removes parameter when value is empty', () => {
    // Set up initial window location with a search parameter
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://example.com/?search=test',
        search: '?search=test',
      },
    });

    const { result } = renderHook(() =>
      useFilters({
        initialFilters: {
          search: '',
        },
      })
    );

    act(() => {
      result.current.onChangeFilter('search', '');
    });

    // Verify that the correct URL is being pushed
    expect(window.history.pushState).toHaveBeenCalled();
    const pushStateCall = (window.history.pushState as jest.Mock).mock.calls[0];
    expect(pushStateCall[2]).toBe('https://example.com/');
  });
});
