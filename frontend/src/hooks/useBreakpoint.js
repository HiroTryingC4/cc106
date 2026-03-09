import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting current breakpoint
 * Returns breakpoint information based on Tailwind CSS breakpoints
 * 
 * Breakpoints:
 * - mobile: < 768px
 * - tablet: 768px - 1023px
 * - desktop: >= 1024px
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
  });

  useEffect(() => {
    const getBreakpoint = () => {
      const width = window.innerWidth;
      
      return {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
      };
    };

    // Set initial breakpoint
    setBreakpoint(getBreakpoint());

    // Debounced resize handler to avoid excessive re-renders (Requirement 28.5)
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setBreakpoint(getBreakpoint());
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
};

export default useBreakpoint;
