/**
 * Unit tests for useViewport hook
 */

import { renderHook } from '@testing-library/react';
import useViewport from '../useViewport';

describe('useViewport', () => {
  beforeEach(() => {
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  it('should return viewport dimensions and orientation', () => {
    global.innerWidth = 1024;
    global.innerHeight = 768;
    
    const { result } = renderHook(() => useViewport());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
    expect(result.current.orientation).toBe('landscape');
  });

  it('should detect portrait orientation', () => {
    global.innerWidth = 375;
    global.innerHeight = 667;
    
    const { result } = renderHook(() => useViewport());

    expect(result.current.orientation).toBe('portrait');
  });

  it('should detect landscape orientation', () => {
    global.innerWidth = 667;
    global.innerHeight = 375;
    
    const { result } = renderHook(() => useViewport());

    expect(result.current.orientation).toBe('landscape');
  });
});
