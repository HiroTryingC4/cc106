/**
 * Responsive utility functions for breakpoint detection and viewport management
 * Provides fallback support for older browsers
 */

/**
 * Get current breakpoint using matchMedia API with fallback
 * @returns {'mobile' | 'tablet' | 'desktop'}
 */
export const getBreakpoint = () => {
  try {
    if (window.matchMedia) {
      if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
      if (window.matchMedia('(min-width: 768px)').matches) return 'tablet';
      return 'mobile';
    }
  } catch (error) {
    console.warn('matchMedia not supported, using fallback');
  }
  
  // Fallback to window.innerWidth
  const width = window.innerWidth || document.documentElement.clientWidth || 320;
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
};

/**
 * Check if current viewport is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return getBreakpoint() === 'mobile';
};

/**
 * Check if current viewport is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  return getBreakpoint() === 'tablet';
};

/**
 * Check if current viewport is desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  return getBreakpoint() === 'desktop';
};

/**
 * Get viewport dimensions with fallback
 * @returns {{ width: number, height: number }}
 */
export const getViewportDimensions = () => {
  try {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || 320,
      height: window.innerHeight || document.documentElement.clientHeight || 568,
    };
  } catch (error) {
    console.warn('Error getting viewport dimensions:', error);
    return { width: 320, height: 568 };
  }
};

/**
 * Check if device supports touch
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  try {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  } catch (error) {
    console.warn('Error detecting touch support:', error);
    return false;
  }
};

/**
 * Debounce function to limit function calls
 * Useful for resize event handlers (Requirement 28.5)
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
export const debounce = (func, wait = 150) => {
  let timeoutId;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeoutId);
      func(...args);
    };
    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 * Alternative to debounce for continuous events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export const throttle = (func, limit = 150) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
