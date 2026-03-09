/**
 * Unit tests for useTouchDevice hook
 */

import { renderHook } from '@testing-library/react';
import useTouchDevice from '../useTouchDevice';

describe('useTouchDevice', () => {
  afterEach(() => {
    // Clean up
    delete window.ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 0,
    });
  });

  it('should detect touch support via ontouchstart', () => {
    window.ontouchstart = {};
    
    const { result } = renderHook(() => useTouchDevice());

    expect(result.current).toBe(true);
  });

  it('should detect touch support via maxTouchPoints', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 5,
    });
    
    const { result } = renderHook(() => useTouchDevice());

    expect(result.current).toBe(true);
  });

  it('should return false for non-touch devices', () => {
    delete window.ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 0,
    });
    Object.defineProperty(navigator, 'msMaxTouchPoints', {
      writable: true,
      value: 0,
    });
    
    const { result } = renderHook(() => useTouchDevice());

    expect(result.current).toBe(false);
  });
});
