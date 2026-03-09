# Responsive Hooks

Custom React hooks for responsive design and viewport detection.

## Available Hooks

### useBreakpoint

Detects the current breakpoint based on Tailwind CSS breakpoints.

**Usage:**
```javascript
import { useBreakpoint } from '../hooks';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, screenWidth } = useBreakpoint();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

**Returns:**
- `isMobile` (boolean): true if viewport < 768px
- `isTablet` (boolean): true if viewport 768px-1023px
- `isDesktop` (boolean): true if viewport >= 1024px
- `screenWidth` (number): current viewport width in pixels

**Features:**
- Debounced resize handling (150ms) to minimize re-renders
- Automatic cleanup on unmount

### useViewport

Provides viewport dimensions and orientation information.

**Usage:**
```javascript
import { useViewport } from '../hooks';

function MyComponent() {
  const { width, height, orientation } = useViewport();
  
  return (
    <div>
      Viewport: {width}x{height} ({orientation})
    </div>
  );
}
```

**Returns:**
- `width` (number): viewport width in pixels
- `height` (number): viewport height in pixels
- `orientation` ('portrait' | 'landscape'): current orientation

**Features:**
- Debounced resize handling (150ms)
- Handles orientationchange events
- Fallback to safe defaults (320x568) on error

### useTouchDevice

Detects if the device supports touch input.

**Usage:**
```javascript
import { useTouchDevice } from '../hooks';

function MyComponent() {
  const isTouch = useTouchDevice();
  
  return (
    <button className={isTouch ? 'touch-optimized' : 'mouse-optimized'}>
      Click me
    </button>
  );
}
```

**Returns:**
- `isTouch` (boolean): true if device supports touch

**Features:**
- Checks multiple touch detection methods
- Graceful fallback to false on error

## Performance Considerations

All hooks implement debouncing to minimize re-renders during resize events. The default debounce time is 150ms, which provides a good balance between responsiveness and performance (Requirement 28.5).

## Browser Compatibility

All hooks include fallback mechanisms for older browsers that may not support modern APIs like `matchMedia` or `maxTouchPoints`.
