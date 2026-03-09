# MobileSidebar Component

## Overview

The `MobileSidebar` component is a responsive off-canvas drawer navigation menu designed for mobile and tablet viewports (< 1024px). It slides in from the left with a backdrop overlay and provides the same navigation functionality as the desktop Sidebar component.

## Features

- **Off-canvas drawer pattern**: Slides in from left when open, hidden off-screen when closed
- **Backdrop overlay**: Semi-transparent backdrop that closes drawer when clicked
- **Smooth transitions**: 300ms ease-in-out animations for open/close
- **Touch-optimized**: All interactive elements meet 44px minimum touch target size
- **Keyboard accessible**: Closes on Escape key press
- **Body scroll prevention**: Prevents background scrolling when drawer is open
- **Auto-close on navigation**: Automatically closes when user navigates to a new page
- **Role-based menus**: Displays appropriate navigation items based on user role (guest, host, admin)
- **Responsive theming**: Applies role-specific color schemes

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls whether the drawer is visible |
| `onClose` | function | Yes | Callback function called when drawer should close |

## Usage

```jsx
import React, { useState } from 'react';
import MobileSidebar from './components/MobileSidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      {/* Hamburger menu button */}
      <button onClick={() => setIsSidebarOpen(true)}>
        Open Menu
      </button>

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <main>
        {/* Your page content */}
      </main>
    </div>
  );
}
```

## Behavior

### Opening and Closing

The drawer can be closed by:
1. Clicking the close button (X icon) in the header
2. Clicking the backdrop overlay
3. Pressing the Escape key
4. Navigating to a different page (automatic)

### Body Scroll Prevention

When the drawer is open, the component automatically:
- Sets `document.body.style.overflow = 'hidden'` to prevent background scrolling
- Restores `document.body.style.overflow = 'unset'` when closed or unmounted

### Navigation

The component displays different navigation items based on the authenticated user's role:

**Guest Users:**
- Dashboard
- Units
- Recommendations
- My Bookings
- Messages

**Host Users:**
- Dashboard
- Verification
- My Units
- Booking
- Promo Codes
- Payments
- Financial
- Messages
- Reports
- Settings

**Admin Users:**
- Dashboard
- Users
- Host Verifications
- Units
- Reviews
- Promo Codes
- Financial
- Reports
- Activity Logs
- Security
- Chatbot
- Chatbot Analytics
- Messages
- Notifications
- System

## Styling

### Dimensions
- **Width**: 256px (w-64 in Tailwind)
- **Height**: Full viewport height (inset-y-0)
- **Position**: Fixed, left edge of screen

### Colors
- **Guest/Host**: Green theme (`bg-[#4E7B22]`)
- **Admin**: White theme (`bg-white`)
- **Backdrop**: Black with 50% opacity

### Transitions
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Property**: transform (translateX)

## Accessibility

### ARIA Attributes
- `role="dialog"` - Identifies the drawer as a dialog
- `aria-modal="true"` - Indicates modal behavior
- `aria-label="Mobile navigation menu"` - Provides accessible name
- `aria-hidden="true"` on backdrop - Hides decorative backdrop from screen readers
- `aria-label` on close and logout buttons

### Keyboard Navigation
- **Escape key**: Closes the drawer
- **Tab key**: Navigates through interactive elements
- All navigation links and buttons are keyboard accessible

### Touch Targets
All interactive elements meet WCAG 2.1 Level AAA minimum touch target size:
- **Minimum height**: 44px
- **Minimum width**: 44px
- Applied to: navigation links, close button, logout button

## Responsive Behavior

### Visibility
- **Mobile/Tablet (< 1024px)**: Visible when `isOpen` is true
- **Desktop (≥ 1024px)**: Hidden (lg:hidden class)

### Integration with Desktop Sidebar
The MobileSidebar is designed to work alongside the desktop Sidebar component:
- Desktop Sidebar: Always visible on screens ≥ 1024px
- Mobile Sidebar: Only visible on screens < 1024px when opened

## User Profile Section

The drawer includes a user profile section at the bottom with:
- **Avatar**: Circular badge with user initials
- **Name**: Full name of the authenticated user
- **Email**: User's email address
- **Logout button**: Touch-optimized logout action with confirmation

## Testing

The component includes comprehensive unit tests covering:
- Visibility and rendering
- Drawer dimensions and positioning
- Smooth transitions
- Backdrop overlay functionality
- Close button behavior
- User role-based content
- User profile section
- Logout functionality
- Navigation links
- Keyboard interactions
- Body scroll prevention
- Responsive behavior
- Styling and theming
- Scrollable content
- Edge cases
- Accessibility

Run tests with:
```bash
npm test -- MobileSidebar.test.js
```

## Requirements Validation

This component satisfies the following requirements from the guest-mobile-responsiveness spec:

- **Requirement 7.1**: Mobile navigation collapse - Navigation items are hidden behind a drawer
- **Requirement 7.4**: Mobile-friendly navigation patterns - Implements off-canvas drawer pattern
- **Requirement 4.1, 4.2**: Touch target sizes - All interactive elements meet 44px minimum
- **Requirement 12.1**: Responsive modal sizing - Drawer is 256px wide on mobile
- **Requirement 12.2**: Responsive padding - Appropriate padding for mobile viewports
- **Requirement 29.1**: Keyboard navigation - All elements keyboard accessible
- **Requirement 29.2**: Focus indicators - Visible focus states on interactive elements
- **Requirement 29.3**: ARIA attributes - Proper ARIA labels and roles

## Browser Support

The component uses standard React and CSS features supported by all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- **Smooth animations**: Uses CSS transforms for hardware-accelerated animations
- **Conditional rendering**: Only renders when `isOpen` is true
- **Event cleanup**: Properly removes event listeners on unmount
- **Minimal re-renders**: Uses React.useRef to prevent unnecessary re-renders

## Future Enhancements

Potential improvements for future iterations:
- Swipe gesture support for closing drawer
- Customizable drawer width
- Animation direction options (left, right, top, bottom)
- Nested menu support with expandable sections
- Search functionality within navigation
- Recent pages or favorites section
