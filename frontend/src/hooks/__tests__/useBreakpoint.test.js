/**
 * Unit tests for useBreakpoint hook
 */

import { renderHook } from '@testing-library/react';
import useBreakpoint from '../useBreakpoint';

describe('useBreakpoint', () => {
  beforeEach(() => {
    // Reset window size
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  it('should return mobile breakpoint for width < 768px', () => {
    global.innerWidth = 375;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.screenWidth).toBe(375);
  });

  it('should return tablet breakpoint for width 768px-1023px', () => {
    global.innerWidth = 800;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.screenWidth).toBe(800);
  });

  it('should return desktop breakpoint for width >= 1024px', () => {
    global.innerWidth = 1280;
    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.screenWidth).toBe(1280);
  });
});
