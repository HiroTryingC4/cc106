/**
 * Unit tests for responsive utility functions
 */

import {
  getBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  getViewportDimensions,
  isTouchDevice,
  debounce,
  throttle,
} from '../responsive';

describe('Responsive Utilities', () => {
  describe('getBreakpoint', () => {
    it('should return mobile for width < 768px', () => {
      global.innerWidth = 375;
      expect(getBreakpoint()).toBe('mobile');
    });

    it('should return tablet for width 768px-1023px', () => {
      global.innerWidth = 800;
      expect(getBreakpoint()).toBe('tablet');
    });

    it('should return desktop for width >= 1024px', () => {
      global.innerWidth = 1280;
      expect(getBreakpoint()).toBe('desktop');
    });

    it('should handle edge case at 768px boundary', () => {
      global.innerWidth = 768;
      expect(getBreakpoint()).toBe('tablet');
    });

    it('should handle edge case at 1024px boundary', () => {
      global.innerWidth = 1024;
      expect(getBreakpoint()).toBe('desktop');
    });
  });

  describe('isMobile', () => {
    it('should return true for mobile viewport', () => {
      global.innerWidth = 375;
      expect(isMobile()).toBe(true);
    });

    it('should return false for tablet viewport', () => {
      global.innerWidth = 800;
      expect(isMobile()).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet viewport', () => {
      global.innerWidth = 800;
      expect(isTablet()).toBe(true);
    });

    it('should return false for mobile viewport', () => {
      global.innerWidth = 375;
      expect(isTablet()).toBe(false);
    });
  });

  describe('isDesktop', () => {
    it('should return true for desktop viewport', () => {
      global.innerWidth = 1280;
      expect(isDesktop()).toBe(true);
    });

    it('should return false for mobile viewport', () => {
      global.innerWidth = 375;
      expect(isDesktop()).toBe(false);
    });
  });

  describe('getViewportDimensions', () => {
    it('should return current viewport dimensions', () => {
      global.innerWidth = 1024;
      global.innerHeight = 768;
      
      const dimensions = getViewportDimensions();
      expect(dimensions.width).toBe(1024);
      expect(dimensions.height).toBe(768);
    });

    it('should return fallback dimensions on error', () => {
      // Simulate error by making window undefined
      const originalWindow = global.window;
      delete global.window;
      
      const dimensions = getViewportDimensions();
      expect(dimensions.width).toBe(320);
      expect(dimensions.height).toBe(568);
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('isTouchDevice', () => {
    it('should detect touch support via ontouchstart', () => {
      global.window.ontouchstart = {};
      expect(isTouchDevice()).toBe(true);
      delete global.window.ontouchstart;
    });

    it('should detect touch support via maxTouchPoints', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 5,
      });
      expect(isTouchDevice()).toBe(true);
    });

    it('should return false for non-touch devices', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 0,
      });
      expect(isTouchDevice()).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
