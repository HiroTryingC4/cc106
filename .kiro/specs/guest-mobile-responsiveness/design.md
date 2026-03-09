# Design Document: Guest Mobile Responsiveness

## Overview

This design document specifies the technical implementation approach for making all guest-facing pages and shared components in the SmartStay application fully responsive across mobile (320px-767px), tablet (768px-1023px), and desktop (1024px+) devices. The implementation will follow Tailwind CSS mobile-first design principles, ensuring optimal user experience across all screen sizes while maintaining the existing desktop functionality.

### Scope

The responsive design implementation covers:
- 12 Guest Pages: Dashboard, Units, UnitDetails, Bookings, BookingDetails, CreateBooking, Payment, Profile, Recommendations, GuestInformation, Review, CheckoutPhoto
- 2 Shared Components: Messages, Notifications
- All interactive elements, forms, images, tables, modals, and navigation patterns

### Goals

1. Provide seamless user experience across all device sizes
2. Maintain existing desktop functionality without regression
3. Implement touch-friendly interfaces for mobile devices
4. Optimize performance for mobile networks
5. Ensure accessibility compliance across all breakpoints
6. Establish consistent responsive patterns for maintainability

### Non-Goals

- Redesigning the visual aesthetic or branding
- Implementing native mobile applications
- Modifying backend APIs or data structures
- Adding new features beyond responsive adaptations
- Changing the existing desktop user workflows

## Architecture

### Mobile-First Approach

The implementation follows Tailwind CSS mobile-first methodology where:
1. Base styles target mobile devices (320px+)
2. Responsive utilities (sm:, md:, lg:, xl:) progressively enhance for larger screens
3. Content is optimized for vertical scrolling on mobile
4. Touch targets meet minimum 44px × 44px requirements

### Breakpoint Strategy

```
Mobile:  320px - 767px  (base styles, no prefix)
Tablet:  768px - 1023px (md: prefix)
Desktop: 1024px+        (lg: and xl: prefixes)
```

Tailwind default breakpoints:
- sm: 640px (used for small mobile landscape adjustments)
- md: 768px (tablet portrait)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

### Component Hierarchy

```
DashboardLayout (responsive container)
├── Navbar (collapsible on mobile)
├── Sidebar (drawer on mobile, fixed on desktop)
├── Main Content Area (fluid width)
│   ├── Page Components (responsive layouts)
│   │   ├── Cards (stack on mobile, grid on tablet/desktop)
│   │   ├── Forms (full-width on mobile, constrained on desktop)
│   │   ├── Tables (card-based on mobile, table on desktop)
│   │   ├── Images (responsive sizing and lazy loading)
│   │   └── Modals (full-screen on mobile, centered on desktop)
│   └── Shared Components (Messages, Notifications)
└── Footer (simplified on mobile)
```

## Components and Interfaces

### 1. Layout Components

#### DashboardLayout Enhancement

**Current State:**
- Fixed sidebar and navbar
- Desktop-optimized spacing
- No mobile navigation patterns

**Responsive Design:**
```jsx
// Mobile: Hamburger menu + drawer sidebar
// Tablet: Collapsible sidebar
// Desktop: Fixed sidebar (current behavior)

<div className="flex flex-col min-h-screen">
  <Navbar /> {/* Responsive with hamburger on mobile */}
  <div className="flex flex-1">
    <Sidebar className="hidden lg:block" /> {/* Hidden on mobile */}
    <MobileSidebar /> {/* Drawer for mobile/tablet */}
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      {children}
    </main>
  </div>
  <Footer />
</div>
```

#### Navbar Component

**Responsive Behavior:**
- Mobile: Logo + hamburger menu button
- Tablet: Logo + condensed navigation
- Desktop: Full navigation (current)

**Implementation:**
```jsx
<nav className="bg-white shadow-sm">
  <div className="px-4 md:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo className="h-8 w-auto" />
      </div>
      
      {/* Mobile menu button */}
      <button className="lg:hidden p-2">
        <MenuIcon />
      </button>
      
      {/* Desktop navigation */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Navigation items */}
      </div>
    </div>
  </div>
</nav>
```

#### Sidebar Component

**Responsive Behavior:**
- Mobile: Off-canvas drawer (slide-in from left)
- Tablet: Collapsible sidebar with toggle
- Desktop: Fixed sidebar (current)

**Implementation:**
```jsx
// Mobile Drawer
<div className={`fixed inset-0 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
  <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
  <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
    {/* Sidebar content */}
  </div>
</div>

// Desktop Sidebar (existing)
<aside className="hidden lg:block w-64 bg-white shadow-sm">
  {/* Sidebar content */}
</aside>
```

### 2. Page-Specific Components

#### Dashboard Page

**Responsive Grid System:**
```jsx
// Stats cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  <StatCard /> {/* 1 col mobile, 2 cols tablet, 4 cols desktop */}
</div>

// Recent bookings
<Card className="p-4 md:p-6">
  <div className="space-y-3">
    {bookings.map(booking => (
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        {/* Stacked on mobile, row on tablet+ */}
      </div>
    ))}
  </div>
</Card>
```

**Typography Scaling:**
```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Guest Dashboard
</h1>
<p className="text-sm md:text-base text-gray-600">
  Welcome back! Here's your booking overview
</p>
```

#### Units Browsing Page

**Filter System:**
```jsx
// Mobile: Drawer with filters
<button className="lg:hidden fixed bottom-4 right-4 z-30 px-6 py-3 bg-primary">
  <FilterIcon /> Filters
</button>

<div className="lg:block hidden">
  {/* Desktop filters - always visible */}
</div>

// Filter inputs
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
  <input className="w-full px-3 py-2 md:px-4 md:py-2.5" />
</div>
```

**Unit Cards Grid:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {units.map(unit => (
    <UnitCard 
      className="flex flex-col"
      imageClassName="h-48 md:h-56 lg:h-64"
    />
  ))}
</div>
```

#### Unit Details Page

**Image Gallery:**
```jsx
// Mobile: Full-width carousel with swipe
<div className="relative h-64 md:h-96 lg:h-[500px]">
  <Carousel 
    images={unit.images}
    className="w-full h-full"
    showThumbnails={false} // Hide on mobile
    showThumbnailsFrom="md" // Show on tablet+
  />
</div>

// Amenities grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
  {amenities.map(amenity => (
    <div className="flex items-center gap-2 text-sm md:text-base">
      <Icon /> {amenity}
    </div>
  ))}
</div>
```

**Booking Widget:**
```jsx
// Mobile: Sticky bottom bar
<div className="lg:sticky lg:top-4">
  <Card className="p-4 md:p-6">
    <div className="space-y-4">
      {/* Booking form */}
    </div>
  </Card>
</div>

// Mobile sticky CTA
<div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t p-4 shadow-lg">
  <Button fullWidth size="lg">Book Now - ₱{price}</Button>
</div>
```

#### Create Booking Page

**Form Layout:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Form section - 2 cols on desktop */}
  <div className="lg:col-span-2">
    <Card className="p-4 md:p-6">
      {/* Full-width inputs on mobile */}
      <Input className="w-full mb-4" />
      
      {/* Date picker - mobile optimized */}
      <DatePicker 
        className="w-full"
        mobileFullScreen={true}
      />
      
      {/* Guest details forms */}
      <div className="space-y-4">
        {guestDetails.map((guest, index) => (
          <div className="border rounded-lg p-4">
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Guest {index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Input label="Full Name" />
              <Input label="Email" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
  
  {/* Summary section - 1 col on desktop */}
  <div className="lg:col-span-1">
    <Card className="p-4 md:p-6 lg:sticky lg:top-4">
      {/* Booking summary */}
    </Card>
  </div>
</div>
```

#### Payment Page

**Payment Form:**
```jsx
<div className="max-w-4xl mx-auto px-4 md:px-6">
  <Card className="p-4 md:p-6">
    {/* Payment method selection */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
      <button className="border-2 rounded-lg p-4 min-h-[80px]">
        {/* Touch-friendly payment option */}
      </button>
    </div>
    
    {/* Card details */}
    <div className="space-y-4">
      <Input label="Card Number" className="w-full" />
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Input label="Expiry" />
        <Input label="CVV" />
      </div>
    </div>
    
    {/* Order summary - collapsible on mobile */}
    <details className="md:hidden mt-6">
      <summary className="font-semibold cursor-pointer">
        Order Summary (₱{total})
      </summary>
      <div className="mt-3">
        {/* Summary details */}
      </div>
    </details>
    
    {/* Always visible on desktop */}
    <div className="hidden md:block mt-6">
      {/* Summary details */}
    </div>
  </Card>
</div>
```

#### Messages Component

**Conversation Layout:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Conversation list */}
  <div className={`lg:col-span-1 ${selectedConversation ? 'hidden lg:block' : 'block'}`}>
    <Card className="p-0">
      {/* List of conversations */}
    </Card>
  </div>
  
  {/* Message thread */}
  <div className={`lg:col-span-2 ${selectedConversation ? 'block' : 'hidden lg:block'}`}>
    <Card className="p-0 flex flex-col h-[500px] md:h-[600px]">
      {/* Back button on mobile */}
      <button 
        className="lg:hidden p-4 border-b"
        onClick={() => setSelectedConversation(null)}
      >
        ← Back to conversations
      </button>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <div className={`mb-3 ${msg.isMine ? 'text-right' : 'text-left'}`}>
            <div className="inline-block max-w-[85%] md:max-w-xs px-4 py-2 rounded-lg">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="p-3 md:p-4 border-t">
        <div className="flex gap-2">
          <input className="flex-1 px-3 py-2 text-sm md:text-base" />
          <button className="px-4 py-2 md:px-6">Send</button>
        </div>
      </div>
    </Card>
  </div>
</div>
```

### 3. Reusable Component Patterns

#### Card Component Enhancement

```jsx
const Card = ({ 
  children, 
  className = '', 
  padding = 'default', // 'none', 'sm', 'default', 'lg'
  hover = false 
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 md:p-4',
    default: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };
  
  return (
    <div className={`
      bg-white rounded-lg shadow-md
      ${paddingClasses[padding]}
      ${hover ? 'hover:shadow-lg transition-shadow' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
```

#### Button Component Enhancement

```jsx
const Button = ({ 
  children, 
  size = 'md',
  fullWidth = false,
  touchOptimized = false, // Ensures 44px min height on mobile
  ...props 
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[40px] md:min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[44px] md:min-h-[48px]',
  };
  
  const touchClass = touchOptimized ? 'min-h-[44px] min-w-[44px]' : '';
  
  return (
    <button
      className={`
        ${sizes[size]}
        ${touchClass}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-md transition
      `}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Input Component Enhancement

```jsx
const Input = ({ 
  label, 
  error, 
  className = '',
  inputClassName = '',
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm md:text-base font-medium mb-1.5 md:mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 md:px-4 md:py-2.5
          text-sm md:text-base
          border rounded-lg
          focus:ring-2 focus:ring-primary
          min-h-[44px]
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${inputClassName}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs md:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

#### Modal Component Enhancement

```jsx
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };
  
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-0 md:p-4">
          <div className={`
            relative w-full
            ${sizes[size]}
            bg-white
            rounded-none md:rounded-lg
            shadow-xl
            m-0 md:m-4
            max-h-screen md:max-h-[90vh]
            overflow-y-auto
          `}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-4 py-3 md:px-6 md:py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full min-h-[44px] min-w-[44px]"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-4 py-4 md:px-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### Table Component Enhancement

```jsx
const ResponsiveTable = ({ columns, data, mobileCardView = true }) => {
  return (
    <>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile card view */}
      {mobileCardView && (
        <div className="md:hidden space-y-3">
          {data.map((row, idx) => (
            <Card key={idx} padding="sm">
              {columns.map(col => (
                <div key={col.key} className="flex justify-between py-2 border-b last:border-b-0">
                  <span className="font-medium text-sm text-gray-600">
                    {col.label}:
                  </span>
                  <span className="text-sm text-gray-900">
                    {row[col.key]}
                  </span>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
```

## Data Models

### Responsive State Management

```typescript
interface ResponsiveState {
  isMobile: boolean;      // < 768px
  isTablet: boolean;      // 768px - 1023px
  isDesktop: boolean;     // >= 1024px
  screenWidth: number;
  orientation: 'portrait' | 'landscape';
}

interface TouchState {
  isTouch: boolean;
  touchPoints: number;
}

interface ViewportState {
  width: number;
  height: number;
  scrollY: number;
  isScrolling: boolean;
}
```

### Component Props Extensions

```typescript
interface ResponsiveComponentProps {
  // Responsive visibility
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  
  // Responsive sizing
  mobileSize?: 'sm' | 'md' | 'lg';
  tabletSize?: 'sm' | 'md' | 'lg';
  desktopSize?: 'sm' | 'md' | 'lg';
  
  // Touch optimization
  touchOptimized?: boolean;
  minTouchTarget?: number; // Default 44px
  
  // Layout behavior
  stackOnMobile?: boolean;
  fullWidthOnMobile?: boolean;
}
```

### Breakpoint Configuration

```javascript
// tailwind.config.js extension
module.exports = {
  theme: {
    screens: {
      'xs': '320px',   // Extra small mobile
      'sm': '640px',   // Small mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      }
    }
  }
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Layout Stacking Properties**: Many requirements test that content stacks vertically on mobile (1.2, 1.4, 10.5, 13.1, 15.3, 17.1, etc.). These can be consolidated into a single comprehensive property about single-column layouts on mobile.

2. **Touch Target Properties**: Requirements 4.1, 4.2, 4.4, 13.4, 16.4, 17.4, 18.4, 19.2, 20.4, 23.2, 24.3, 26.2 all test the same thing - minimum 44px touch targets. One property covers all.

3. **Full-Width Form Properties**: Requirements 8.1, 18.1, 19.1, 20.1, 22.1, 23.1 all test that form fields are full-width on mobile. One property suffices.

4. **Grid Column Properties**: Requirements 10.1, 10.2, 10.3, 13.2, 14.1, 16.1, 21.1 test grid columns at different breakpoints. These can be combined into properties about responsive grid behavior.

5. **No Horizontal Scroll Properties**: Requirements 1.1, 1.5, 9.5 all test the same thing - no horizontal overflow. One property covers all pages and components.

6. **Responsive Spacing Properties**: Requirements 6.2, 6.3, 6.4, 13.5, 22.3 all test that spacing adapts to viewport width. These can be consolidated.

The following properties represent the unique, non-redundant validation requirements:

### Property 1: No Horizontal Overflow on Mobile

*For any* guest page or shared component, when rendered at mobile viewport widths (320px-767px), the page scrollWidth should equal the clientWidth (no horizontal scrolling required).

**Validates: Requirements 1.1, 1.5, 9.5**

### Property 2: Single-Column Layout on Mobile

*For any* guest page with multi-column desktop layouts, when rendered at mobile viewport widths (320px-767px), all content containers should use single-column layouts (grid-template-columns: 1 or flex-direction: column).

**Validates: Requirements 1.2, 1.4, 10.5, 13.1, 15.3, 17.1, 18.3, 19.3, 20.2, 22.2, 23.3**

### Property 3: Tablet Two-Column Layouts

*For any* guest page with grid layouts, when rendered at tablet viewport widths (768px-1023px), appropriate sections should display 2-column grid layouts.

**Validates: Requirements 2.2, 10.2**

### Property 4: Desktop Layout Preservation

*For any* guest page, when rendered at desktop viewport widths (1024px+), the layout should match the pre-responsive-implementation desktop layout (no regression).

**Validates: Requirements 3.1, 3.3, 3.4**

### Property 5: Minimum Touch Target Size

*For any* interactive element (buttons, links, form inputs, controls) on guest pages and shared components, the computed height and width should be at least 44px on mobile viewports.

**Validates: Requirements 4.1, 4.2, 4.4, 4.5, 13.4, 16.4, 17.4, 18.4, 19.2, 20.4, 23.2, 24.3, 26.2**

### Property 6: Responsive Typography Scaling

*For any* heading element on guest pages, when comparing mobile (320px) to desktop (1024px+) viewports, the desktop font-size should be larger than or equal to the mobile font-size.

**Validates: Requirements 5.2**

### Property 7: Minimum Body Text Size on Mobile

*For any* body text element on guest pages, when rendered at mobile viewport widths (320px-767px), the computed font-size should be at least 16px to prevent automatic zoom on iOS.

**Validates: Requirements 5.4**

### Property 8: Progressive Spacing Increase

*For any* container element on guest pages, when comparing padding/margin across breakpoints (mobile < tablet < desktop), the spacing values should increase or remain constant as viewport width increases.

**Validates: Requirements 6.2, 6.3, 6.4, 13.5, 22.3**

### Property 9: Mobile Navigation Collapse

*For any* navigation menu on guest pages, when rendered at mobile viewport widths (320px-767px), navigation items should be hidden behind a toggle (hamburger menu) or stacked vertically.

**Validates: Requirements 7.1**

### Property 10: Full-Width Form Fields on Mobile

*For any* form input field on guest pages, when rendered at mobile viewport widths (320px-767px), the computed width should be 100% of its container (full-width).

**Validates: Requirements 8.1, 8.2, 18.1, 19.1, 20.1, 22.1, 23.1**

### Property 11: Form Validation Message Visibility

*For any* form field with validation errors on guest pages, when rendered at mobile viewport widths (320px-767px), the error message should be visible within the viewport (not hidden by overflow).

**Validates: Requirements 8.5**

### Property 12: Responsive Image Grid Columns

*For any* image gallery on guest pages, when rendered at different viewport widths, the grid-template-columns should be: 1 column on mobile (< 768px), 2-3 columns on tablet (768px-1023px), and 3-4 columns on desktop (1024px+).

**Validates: Requirements 9.2, 9.4**

### Property 13: Image Aspect Ratio Preservation

*For any* image element on guest pages, when rendered at any viewport width, the aspect ratio should remain constant (no distortion).

**Validates: Requirements 9.3**

### Property 14: Responsive Card Grid Columns

*For any* card grid (units, bookings, recommendations) on guest pages, the grid-template-columns should be: 1 column on mobile (< 768px), 2 columns on tablet (768px-1023px), and 3-4 columns on desktop (1024px+).

**Validates: Requirements 10.1, 10.2, 10.3, 14.1, 16.1, 21.1**

### Property 15: Mobile Table Transformation

*For any* table element on guest pages, when rendered at mobile viewport widths (320px-767px), the table should either be converted to a card-based layout or be horizontally scrollable with visible scroll indicators.

**Validates: Requirements 11.1, 11.4**

### Property 16: Desktop Table Column Restoration

*For any* table element on guest pages, when rendered at desktop viewport widths (1024px+), all table columns should be visible (no hidden columns).

**Validates: Requirements 11.2, 11.5**

### Property 17: Mobile Modal Sizing

*For any* modal component on guest pages and shared components, when rendered at mobile viewport widths (320px-767px), the modal width should be at least 90% of viewport width or full-screen.

**Validates: Requirements 12.1, 12.4, 12.5**

### Property 18: Responsive Modal Padding

*For any* modal component on guest pages, when comparing mobile to desktop viewports, the mobile padding should be smaller than or equal to desktop padding.

**Validates: Requirements 12.2**

### Property 19: Dashboard Stats Grid Responsiveness

*For the* guest dashboard stats section, the grid-template-columns should be: 1 column on mobile (< 640px), 2 columns on small tablet (640px-1023px), and 4 columns on desktop (1024px+).

**Validates: Requirements 13.2**

### Property 20: Responsive Chart Sizing

*For any* chart or graph on the guest dashboard, when rendered at mobile viewport widths (320px-767px), the chart dimensions should be smaller than desktop dimensions to fit the viewport.

**Validates: Requirements 13.3**

### Property 21: Mobile Filter Drawer

*For the* units browsing page filters, when rendered at mobile viewport widths (320px-767px), filters should be hidden by default and accessible via a drawer/modal toggle button.

**Validates: Requirements 14.2**

### Property 22: Sticky Filter Button on Mobile

*For the* units browsing page, when rendered at mobile viewport widths (320px-767px), the filter toggle button should have position: fixed or sticky.

**Validates: Requirements 14.3**

### Property 23: Mobile Map Sizing

*For any* map component on guest pages, when rendered at mobile viewport widths (320px-767px), the map height should be reduced compared to desktop to preserve vertical space for other content.

**Validates: Requirements 14.5, 15.5**

### Property 24: Full-Width Image Carousel on Mobile

*For the* unit details page image carousel, when rendered at mobile viewport widths (320px-767px), the carousel width should be 100% of viewport width.

**Validates: Requirements 15.1**

### Property 25: Responsive Amenities Grid

*For the* unit details page amenities section, the grid-template-columns should be: 2 columns on mobile (< 768px), 3 columns on tablet (768px-1023px), and 4 columns on desktop (1024px+).

**Validates: Requirements 15.2**

### Property 26: Sticky Booking Widget on Mobile

*For the* unit details page booking widget, when rendered at mobile viewport widths (320px-767px), the widget should have position: sticky or fixed at the bottom of the viewport.

**Validates: Requirements 15.4**

### Property 27: Responsive Date Display Formatting

*For any* date range display on the bookings page, when rendered at mobile viewport widths (320px-767px), dates should be formatted in a compact or abbreviated format compared to desktop.

**Validates: Requirements 16.5**

### Property 28: Responsive Pricing Breakdown

*For the* booking details page pricing section, when rendered at mobile viewport widths (320px-767px), the pricing breakdown should be formatted as a vertical list rather than a table.

**Validates: Requirements 17.3**

### Property 29: Responsive Timeline Display

*For the* booking details page status timeline, when rendered at mobile viewport widths (320px-767px), the timeline should be displayed vertically with compact spacing.

**Validates: Requirements 17.5**

### Property 30: Responsive Pricing Summary

*For the* create booking and payment pages, when rendered at mobile viewport widths (320px-767px), the pricing summary should be collapsible or positioned below the form (not side-by-side).

**Validates: Requirements 18.5, 19.5**

### Property 31: Mobile-Optimized File Upload

*For any* file upload control on guest pages, when rendered at mobile viewport widths (320px-767px), the upload button should meet minimum touch target size (44px) and support native mobile file/camera access.

**Validates: Requirements 20.3, 22.4, 23.4**

### Property 32: Responsive Progress Indicators

*For any* multi-step form progress indicator on guest pages, when rendered at mobile viewport widths (320px-767px), the indicator should be compact (dots or numbers) rather than full step labels.

**Validates: Requirements 22.5**

### Property 33: Responsive Character Counter

*For the* review page text area, when rendered at mobile viewport widths (320px-767px), the character counter should be visible and positioned below the text area.

**Validates: Requirements 23.5**

### Property 34: Responsive Photo Grid

*For the* checkout photo page, the photo thumbnail grid should be: 2 columns on mobile (< 768px), 3 columns on tablet (768px-1023px), and 4 columns on desktop (1024px+).

**Validates: Requirements 24.2, 24.5**

### Property 35: Mobile Photo Preview Sizing

*For the* checkout photo page photo preview, when rendered at mobile viewport widths (320px-767px), the preview should fit within the viewport without requiring horizontal scroll.

**Validates: Requirements 24.4**

### Property 36: Messages Single-View Pattern

*For the* messages component, when rendered at mobile viewport widths (320px-767px), only the conversation list OR the message thread should be visible at once (not both simultaneously).

**Validates: Requirements 25.1**

### Property 37: Message Bubble Max-Width

*For any* message bubble in the messages component, when rendered at mobile viewport widths (320px-767px), the max-width should be approximately 85% of viewport width to ensure readability.

**Validates: Requirements 25.2**

### Property 38: Mobile Message Input Sizing

*For the* messages component input area, when rendered at mobile viewport widths (320px-767px), the input should be sized to accommodate mobile keyboards without obscuring recent messages.

**Validates: Requirements 25.3**

### Property 39: Full-Width Notifications on Mobile

*For any* notification card in the notifications component, when rendered at mobile viewport widths (320px-767px), the card width should be 100% of its container.

**Validates: Requirements 26.1**

### Property 40: Responsive Notification Grouping

*For the* notifications component, when rendered at mobile viewport widths (320px-767px), notifications should be grouped by date or category with collapsible sections to reduce vertical scroll.

**Validates: Requirements 26.5**

### Property 41: Minimal Layout Shift

*For any* guest page, the Cumulative Layout Shift (CLS) score should be less than 0.1 during initial page load and responsive rendering at any viewport width.

**Validates: Requirements 28.1**

### Property 42: Critical Content Priority Loading

*For any* guest page, when rendered at mobile viewport widths (320px-767px), above-the-fold content should be fully loaded and rendered before below-the-fold content begins loading.

**Validates: Requirements 28.2**

### Property 43: Image Lazy Loading

*For any* image element on guest pages that is initially below the fold, the image should have loading="lazy" attribute or use Intersection Observer for lazy loading on mobile viewports.

**Validates: Requirements 28.3**

### Property 44: Minimal Resize Re-renders

*For any* guest page component, when the viewport is resized, the component should not re-render more than once per resize event (debounced or throttled).

**Validates: Requirements 28.5**

### Property 45: Keyboard Navigation Preservation

*For any* guest page, when rendered at any viewport width, all interactive elements should be reachable via keyboard navigation (Tab key) in a logical order.

**Validates: Requirements 29.1**

### Property 46: Focus Indicator Visibility

*For any* interactive element on guest pages, when focused via keyboard at any viewport width, a visible focus indicator should be present.

**Validates: Requirements 29.2**

### Property 47: Hidden Content ARIA Attributes

*For any* content that is visually hidden on mobile viewports (via display: none or visibility: hidden), the element should have aria-hidden="true" or be completely removed from the DOM.

**Validates: Requirements 29.3**

### Property 48: Semantic HTML Preservation

*For any* guest page, when rendered at any viewport width, the HTML structure should maintain proper semantic hierarchy (h1 > h2 > h3, proper landmark roles, etc.).

**Validates: Requirements 29.4**

### Property 49: Screen Reader Announcement Functionality

*For any* dynamic content update on guest pages (form validation, notifications, loading states), when rendered at any viewport width, appropriate ARIA live regions should announce changes to screen readers.

**Validates: Requirements 29.5**

## Error Handling

### Viewport Detection Errors

**Scenario**: Browser doesn't support matchMedia API
**Handling**: 
- Fallback to window.innerWidth for breakpoint detection
- Log warning to console
- Default to mobile-first styles (safest fallback)

```javascript
const getBreakpoint = () => {
  try {
    if (window.matchMedia) {
      if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
      if (window.matchMedia('(min-width: 768px)').matches) return 'tablet';
      return 'mobile';
    }
  } catch (error) {
    console.warn('matchMedia not supported, using fallback');
  }
  
  // Fallback
  const width = window.innerWidth;
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
};
```

### Image Loading Errors

**Scenario**: Responsive images fail to load
**Handling**:
- Display placeholder image
- Retry loading once after 2-second delay
- Show error state if retry fails
- Log error for monitoring

```javascript
const handleImageError = (event, retryCount = 0) => {
  if (retryCount < 1) {
    setTimeout(() => {
      event.target.src = event.target.dataset.src;
      event.target.dataset.retryCount = retryCount + 1;
    }, 2000);
  } else {
    event.target.src = '/placeholder-error.jpg';
    console.error('Image failed to load:', event.target.dataset.src);
  }
};
```

### Touch Event Errors

**Scenario**: Touch events not supported or fail
**Handling**:
- Gracefully degrade to mouse events
- Ensure all touch interactions have mouse equivalents
- Test for touch support before adding touch listeners

```javascript
const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

// Add appropriate event listeners
if (isTouchDevice()) {
  element.addEventListener('touchstart', handleTouch);
} else {
  element.addEventListener('mousedown', handleMouse);
}
```

### Responsive Component Rendering Errors

**Scenario**: Component fails to render at specific breakpoint
**Handling**:
- Wrap responsive components in error boundaries
- Display fallback UI on error
- Log error with breakpoint information
- Allow user to retry or continue with degraded experience

```javascript
class ResponsiveErrorBoundary extends React.Component {
  state = { hasError: false, breakpoint: null };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const breakpoint = getBreakpoint();
    console.error('Responsive component error:', {
      error,
      errorInfo,
      breakpoint,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    this.setState({ breakpoint });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">
            Something went wrong displaying this content.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Modal Overflow Errors

**Scenario**: Modal content exceeds viewport height on mobile
**Handling**:
- Enable vertical scrolling within modal
- Ensure close button remains accessible (sticky header)
- Add visual indicator for scrollable content

```javascript
const Modal = ({ children, isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-0 md:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-none md:rounded-lg max-h-screen overflow-y-auto">
            {/* Sticky header with close button */}
            <div className="sticky top-0 bg-white border-b px-4 py-3 z-10">
              <button onClick={onClose} className="float-right">×</button>
            </div>
            {/* Scrollable content */}
            <div className="px-4 py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Form Validation on Mobile

**Scenario**: Validation errors not visible due to keyboard covering input
**Handling**:
- Scroll error message into view
- Position validation messages above input when keyboard is visible
- Use toast notifications for critical errors

```javascript
const handleValidationError = (inputElement, errorMessage) => {
  // Show error message
  const errorElement = document.createElement('div');
  errorElement.className = 'text-red-600 text-sm mt-1';
  errorElement.textContent = errorMessage;
  inputElement.parentNode.appendChild(errorElement);
  
  // Scroll error into view (above keyboard)
  setTimeout(() => {
    const rect = inputElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - 100; // 100px above input
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, 100);
};
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Test specific breakpoint transitions (767px → 768px, 1023px → 1024px)
- Test touch event handlers
- Test error boundary behavior
- Test modal open/close on mobile
- Test filter drawer toggle
- Test message view switching

**Property-Based Tests**: Verify universal properties across all inputs
- Test responsive properties across random viewport widths
- Test touch target sizes across all interactive elements
- Test layout properties across all pages
- Test accessibility properties across all breakpoints

### Property-Based Testing Configuration

**Library**: Use `@fast-check` for JavaScript/React property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `Feature: guest-mobile-responsiveness, Property {number}: {property_text}`

**Example Property Test**:

```javascript
import fc from 'fast-check';
import { render } from '@testing-library/react';

describe('Feature: guest-mobile-responsiveness, Property 1: No Horizontal Overflow on Mobile', () => {
  it('should not have horizontal overflow on any mobile viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }), // Random mobile width
        fc.constantFrom('Dashboard', 'Units', 'UnitDetails', 'Bookings', 'BookingDetails', 
                       'CreateBooking', 'Payment', 'Profile', 'Recommendations', 
                       'GuestInformation', 'Review', 'CheckoutPhoto', 'Messages', 'Notifications'),
        (viewportWidth, pageName) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          window.dispatchEvent(new Event('resize'));
          
          // Render page component
          const PageComponent = require(`../pages/Guest/${pageName}`).default;
          const { container } = render(<PageComponent />);
          
          // Check no horizontal overflow
          const scrollWidth = container.firstChild.scrollWidth;
          const clientWidth = container.firstChild.clientWidth;
          
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

**Component-Level Tests**:
```javascript
describe('Card Component Responsive Behavior', () => {
  it('should apply mobile padding on small screens', () => {
    global.innerWidth = 375;
    const { container } = render(<Card padding="default">Content</Card>);
    const card = container.firstChild;
    const padding = window.getComputedStyle(card).padding;
    expect(padding).toBe('16px'); // p-4 = 16px
  });
  
  it('should apply desktop padding on large screens', () => {
    global.innerWidth = 1280;
    const { container } = render(<Card padding="default">Content</Card>);
    const card = container.firstChild;
    const padding = window.getComputedStyle(card).padding;
    expect(padding).toBe('24px'); // md:p-6 = 24px
  });
});
```

**Page-Level Tests**:
```javascript
describe('Dashboard Page Responsive Layout', () => {
  it('should display stats in single column on mobile', () => {
    global.innerWidth = 375;
    const { container } = render(<Dashboard />);
    const statsGrid = container.querySelector('.stats-grid');
    const gridColumns = window.getComputedStyle(statsGrid).gridTemplateColumns;
    expect(gridColumns).toBe('1fr'); // Single column
  });
  
  it('should display stats in 4 columns on desktop', () => {
    global.innerWidth = 1280;
    const { container } = render(<Dashboard />);
    const statsGrid = container.querySelector('.stats-grid');
    const gridColumns = window.getComputedStyle(statsGrid).gridTemplateColumns;
    expect(gridColumns).toContain('1fr 1fr 1fr 1fr'); // 4 columns
  });
});
```

**Touch Target Tests**:
```javascript
describe('Touch Target Sizes', () => {
  it('should ensure all buttons meet minimum 44px height', () => {
    const { container } = render(<CreateBooking />);
    const buttons = container.querySelectorAll('button');
    
    buttons.forEach(button => {
      const height = button.getBoundingClientRect().height;
      expect(height).toBeGreaterThanOrEqual(44);
    });
  });
});
```

**Accessibility Tests**:
```javascript
import { axe } from 'jest-axe';

describe('Responsive Accessibility', () => {
  it('should have no accessibility violations on mobile', async () => {
    global.innerWidth = 375;
    const { container } = render(<Units />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should maintain keyboard navigation on all breakpoints', () => {
    const breakpoints = [375, 768, 1024, 1280];
    
    breakpoints.forEach(width => {
      global.innerWidth = width;
      const { container } = render(<Dashboard />);
      const focusableElements = container.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
      focusableElements.forEach(el => {
        expect(el.tabIndex).not.toBe(-1);
      });
    });
  });
});
```

### Visual Regression Testing

Use tools like Percy or Chromatic to capture screenshots at different breakpoints:

```javascript
describe('Visual Regression Tests', () => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 }
  ];
  
  breakpoints.forEach(({ name, width, height }) => {
    it(`should match ${name} snapshot`, () => {
      cy.viewport(width, height);
      cy.visit('/guest/dashboard');
      cy.percySnapshot(`Dashboard - ${name}`);
    });
  });
});
```

### Performance Testing

Test performance metrics on mobile:

```javascript
describe('Mobile Performance', () => {
  it('should have acceptable CLS score', async () => {
    const cls = await measureCLS();
    expect(cls).toBeLessThan(0.1);
  });
  
  it('should load critical content first', async () => {
    const metrics = await measureLoadingMetrics();
    expect(metrics.aboveFoldLoadTime).toBeLessThan(metrics.belowFoldLoadTime);
  });
  
  it('should lazy load images', () => {
    const { container } = render(<Units />);
    const images = container.querySelectorAll('img');
    const belowFoldImages = Array.from(images).filter(img => {
      const rect = img.getBoundingClientRect();
      return rect.top > window.innerHeight;
    });
    
    belowFoldImages.forEach(img => {
      expect(img.loading).toBe('lazy');
    });
  });
});
```

### Integration Testing

Test responsive behavior in real user workflows:

```javascript
describe('Booking Flow on Mobile', () => {
  it('should complete booking on mobile device', () => {
    cy.viewport('iphone-x');
    cy.visit('/guest/units');
    
    // Browse units
    cy.get('[data-testid="unit-card"]').first().click();
    
    // View unit details
    cy.get('[data-testid="book-now-button"]').should('be.visible').click();
    
    // Fill booking form
    cy.get('input[name="checkIn"]').type('2024-03-01');
    cy.get('input[name="checkOut"]').type('2024-03-05');
    cy.get('input[name="guests"]').type('2');
    
    // Submit booking
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.url().should('include', '/guest/payment');
  });
});
```

### Test Coverage Goals

- Unit test coverage: 80%+ for responsive components
- Property-based tests: All 49 correctness properties
- Visual regression: All 14 pages × 3 breakpoints = 42 snapshots
- Accessibility: 100% of pages pass axe tests at all breakpoints
- Performance: All pages meet Core Web Vitals on mobile

### Continuous Testing

- Run unit tests on every commit
- Run property-based tests nightly (due to longer execution time)
- Run visual regression tests on PR creation
- Run full integration tests before deployment
- Monitor real user metrics (CLS, LCP, FID) in production

