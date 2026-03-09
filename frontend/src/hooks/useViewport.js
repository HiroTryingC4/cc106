import { useState, useEffect } from 'react';

/**
 * Custom hook for viewport detection with fallback support
 * Provides viewport dimensions and orientation
 * Includes error handling for browsers without matchMedia support
 */
const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    orientation: 'portrait',
  });

  useEffect(() => {
    const getViewportInfo = () => {
      try {
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;
        const orientation = width > height ? 'landscape' : 'portrait';

        return { width, height, orientation };
      } catch (error) {
        console.warn('Error detecting viewport:', error);
        // Fallback to safe defaults
        return { width: 320, height: 568, orientation: 'portrait' };
      }
    };

    // Set initial viewport
    setViewport(getViewportInfo());

    // Debounced resize handler to minimize re-renders (Requirement 28.5)
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewport(getViewportInfo());
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
};

export default useViewport;
