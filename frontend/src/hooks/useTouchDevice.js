import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the device supports touch
 * Useful for optimizing touch interactions vs mouse interactions
 */
const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const detectTouch = () => {
      try {
        return (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        );
      } catch (error) {
        console.warn('Error detecting touch support:', error);
        // Default to false (mouse) as fallback
        return false;
      }
    };

    setIsTouch(detectTouch());
  }, []);

  return isTouch;
};

export default useTouchDevice;
