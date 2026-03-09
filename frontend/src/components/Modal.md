# Modal Component

## Overview

The Modal component is a responsive dialog overlay that adapts to different screen sizes. It provides a full-screen experience on mobile devices and a centered, contained modal on desktop screens.

## Features

### Responsive Behavior

- **Mobile (< 768px)**: Full-screen modal with no rounded corners, no padding around modal
- **Desktop (≥ 768px)**: Centered modal with rounded corners, padding around modal, max 90vh height

### Key Features

1. **Sticky Header**: Header stays visible when scrolling long content on mobile
2. **Responsive Padding**: 
   - Mobile: `p-4` (16px)
   - Desktop: `md:p-6` (24px)
3. **Touch-Friendly Close Button**: Minimum 44px × 44px touch target
4. **Vertical Scrolling**: Handles overflow content with smooth scrolling
5. **Body Scroll Lock**: Prevents background scrolling when modal is open
6. **Backdrop Click**: Closes modal when clicking outside

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | required | Controls modal visibility |
| `onClose` | function | required | Callback when modal should close |
| `title` | string | required | Modal header title |
| `children` | ReactNode | required | Modal content |
| `size` | string | `'md'` | Modal size: `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full'` |

## Size Options

- **sm**: Small modal (max-w-sm on mobile, responsive on desktop)
- **md**: Medium modal (max-w-md on mobile, max-w-2xl on desktop) - Default
- **lg**: Large modal (max-w-2xl on mobile, max-w-4xl on desktop)
- **xl**: Extra large modal (max-w-4xl on mobile, max-w-6xl on desktop)
- **full**: Full width modal

## Usage Examples

### Basic Modal

```jsx
import Modal from './components/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
      >
        <p>This is the modal content.</p>
      </Modal>
    </>
  );
}
```

### Modal with Form

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit Profile"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  </form>
</Modal>
```

### Modal with Long Content

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Terms and Conditions"
  size="xl"
>
  <div className="prose">
    <p>Long content here...</p>
    <p>The modal will scroll vertically...</p>
    <p>The header stays sticky at the top...</p>
    {/* More content */}
  </div>
</Modal>
```

## Responsive Behavior Details

### Mobile (< 768px)

- Full-screen modal (`rounded-none`, no margin)
- No padding around modal container (`p-0`)
- Sticky header ensures close button is always accessible
- Content padding: `px-4 py-4` (16px)
- Header padding: `px-4 py-3` (16px horizontal, 12px vertical)
- Title size: `text-lg` (18px)

### Desktop (≥ 768px)

- Centered modal with rounded corners (`md:rounded-lg`)
- Padding around modal (`md:p-4`)
- Max height: 90vh (`md:max-h-[90vh]`)
- Content padding: `md:px-6 md:py-6` (24px)
- Header padding: `md:px-6 md:py-4` (24px horizontal, 16px vertical)
- Title size: `md:text-xl` (20px)

## Accessibility

- Close button has `aria-label="Close modal"` for screen readers
- Proper heading hierarchy (h3 for title)
- Keyboard accessible (close button can be focused and activated)
- Focus trap recommended for production use (not implemented in base component)

## Requirements Validated

This component validates the following requirements from the guest-mobile-responsiveness spec:

- **Requirement 12.1**: Modals sized to fit viewport with appropriate margins on mobile
- **Requirement 12.2**: Adjusted modal padding for mobile screens
- **Requirement 12.3**: All fields and buttons accessible on mobile, sticky header for scrolling
- **Requirement 12.4**: Full-screen modals on mobile when appropriate
- **Requirement 4.1, 4.2**: Touch-friendly close button (44px minimum)
- **Requirement 5.1**: Responsive typography

## Testing

The component includes comprehensive unit tests covering:

- Basic functionality (open/close, backdrop click)
- Responsive sizing at different breakpoints
- Responsive padding
- Sticky header behavior
- Touch-friendly close button
- Vertical scrolling
- Accessibility features
- Form content accessibility

Run tests with:
```bash
npm test -- Modal.test.js
```

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 5+)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Notes

- The modal uses `position: fixed` and requires a stacking context
- Body scroll is locked when modal is open
- Backdrop click closes the modal (can be disabled by removing onClick from backdrop)
- For production, consider adding:
  - Focus trap to keep keyboard navigation within modal
  - ESC key handler to close modal
  - Animation transitions for open/close
  - Portal rendering to avoid z-index issues
