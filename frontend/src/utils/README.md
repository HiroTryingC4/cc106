# Responsive Utilities

Utility functions for responsive design, breakpoint detection, and viewport management.

## Available Functions

### Breakpoint Detection

#### getBreakpoint()

Returns the current breakpoint as a string.

```javascript
import { getBreakpoint } from '../utils';

const breakpoint = getBreakpoint(); // 'mobile' | 'tablet' | 'desktop'
```

**Breakpoints:**
- `'mobile'`: < 768px
- `'tablet'`: 768px - 1023px
- `'desktop'`: >= 1024px

**Features:**
- Uses `matchMedia` API with fallback to `window.innerWidth`
- Graceful error handling

#### isMobile(), isTablet(), isDesktop()

Convenience functions for checking specific breakpoints.

```javascript
import { isMobile, isTablet, isDesktop } from '../utils';

if (isMobile()) {
  // Mobile-specific logic
}
```

### Viewport Utilities

#### getViewportDimensions()

Returns current viewport dimensions.

```javascript
import { getViewportDimensions } from '../utils';

const { width, height } = getViewportDimensions();
```

**Returns:**
- `width` (number): viewport width in pixels
- `height` (number): viewport height in pixels

**Features:**
- Fallback to safe defaults (320x568) on error

#### isTouchDevice()

Detects if the device supports touch input.

```javascript
import { isTouchDevice } from '../utils';

if (isTouchDevice()) {
  // Add touch event listeners
} else {
  // Add mouse event listeners
}
```

### Performance Utilities

#### debounce(func, wait)

Creates a debounced function that delays execution until after `wait` milliseconds have elapsed since the last call.

```javascript
import { debounce } from '../utils';

const handleResize = debounce(() => {
  console.log('Window resized');
}, 150);

window.addEventListener('resize', handleResize);
```

**Parameters:**
- `func` (Function): The function to debounce
- `wait` (number): Wait time in milliseconds (default: 150)

**Use Cases:**
- Resize event handlers
- Search input handlers
- Scroll event handlers

#### throttle(func, limit)

Creates a throttled function that only executes at most once per `limit` milliseconds.

```javascript
import { throttle } from '../utils';

const handleScroll = throttle(() => {
  console.log('Scrolled');
}, 150);

window.addEventListener('scroll', handleScroll);
```

**Parameters:**
- `func` (Function): The function to throttle
- `limit` (number): Time limit in milliseconds (default: 150)

**Use Cases:**
- Continuous scroll events
- Mouse move tracking
- Animation frame updates

## Error Handling

All utility functions include comprehensive error handling:
- Console warnings for debugging
- Fallback values for safe operation
- No thrown exceptions that could break the application

## Browser Compatibility

Functions include fallbacks for:
- Browsers without `matchMedia` support
- Missing `window` or `navigator` objects
- Touch detection across different browsers (iOS, Android, Windows)

## Performance Best Practices

1. **Use debounce for resize events** to avoid excessive re-renders (Requirement 28.5)
2. **Use throttle for continuous events** like scroll or mousemove
3. **Cache breakpoint checks** when possible to avoid repeated calculations
4. **Prefer CSS media queries** for styling; use these utilities for logic only

## Example: Responsive Component

```javascript
import { useBreakpoint } from '../hooks';
import { debounce } from '../utils';

function ResponsiveComponent() {
  const { isMobile, isDesktop } = useBreakpoint();
  
  return (
    <div className={`
      p-4 md:p-6 lg:p-8
      ${isMobile ? 'flex-col' : 'flex-row'}
    `}>
      <h1 className="text-2xl md:text-3xl lg:text-4xl">
        Responsive Title
      </h1>
      {isDesktop && <DesktopOnlyFeature />}
    </div>
  );
}
```
