# Button Component - Touch-Optimized & Responsive

## Overview

The Button component has been updated with touch-optimized sizing and responsive variants to ensure optimal usability across mobile, tablet, and desktop devices. All buttons now meet the minimum 44px × 44px touch target requirements for mobile accessibility.

## Features

### Touch-Optimized Sizing
- **Minimum 44px height and width** on all devices for touch accessibility
- Meets WCAG 2.1 Level AAA touch target size guidelines
- Ensures comfortable tapping on mobile devices

### Responsive Size Variants

#### Small (`size="sm"`)
- Mobile: `min-h-[44px]` and `min-w-[44px]`
- Padding: `px-3 py-2`
- Text: `text-sm`
- Use for: Secondary actions, compact layouts

#### Medium (`size="md"`) - Default
- Mobile: `min-h-[44px]`
- Tablet+: `md:min-h-[48px]`
- Padding: `px-4 py-2`
- Text: `text-base`
- Use for: Primary actions, standard buttons

#### Large (`size="lg"`)
- Mobile: `min-h-[44px]`
- Tablet+: `md:min-h-[52px]`
- Padding: `px-6 py-3`
- Text: `text-lg`
- Use for: Call-to-action buttons, prominent actions

### Full Width Support

The `fullWidth` prop makes buttons span the full width of their container, ideal for mobile layouts:

```jsx
<Button fullWidth={true}>Book Now</Button>
```

## Usage Examples

### Basic Button
```jsx
<Button onClick={handleClick}>
  Click Me
</Button>
```

### Mobile-Optimized Full Width Button
```jsx
<Button 
  size="lg" 
  variant="primary" 
  fullWidth={true}
  onClick={handleBooking}
>
  Book Now - ₱2,500
</Button>
```

### Touch-Friendly Small Button
```jsx
<Button 
  size="sm" 
  variant="secondary"
  onClick={handleCancel}
>
  Cancel
</Button>
```

### Responsive Button with Custom Styling
```jsx
<Button 
  size="md"
  variant="success"
  className="mt-4"
  onClick={handleSubmit}
>
  Submit
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Button content (required) |
| `onClick` | function | - | Click handler |
| `type` | string | `'button'` | Button type (`'button'`, `'submit'`, `'reset'`) |
| `variant` | string | `'primary'` | Visual style (`'primary'`, `'secondary'`, `'danger'`, `'success'`, `'outline'`) |
| `size` | string | `'md'` | Size variant (`'sm'`, `'md'`, `'lg'`) |
| `disabled` | boolean | `false` | Disabled state |
| `className` | string | `''` | Additional CSS classes |
| `fullWidth` | boolean | `false` | Makes button full width of container |

## Variants

### Primary (default)
- Blue background with white text
- Use for: Main actions, primary CTAs

### Secondary
- Gray background with dark text
- Use for: Secondary actions, cancel buttons

### Danger
- Red background with white text
- Use for: Destructive actions, delete buttons

### Success
- Green background with white text
- Use for: Confirmation actions, success states

### Outline
- Transparent background with primary border
- Use for: Tertiary actions, ghost buttons

## Accessibility

- All buttons meet minimum 44px × 44px touch target size
- Focus ring indicators for keyboard navigation
- Proper disabled state handling
- Semantic button element with correct type attribute
- Cursor changes appropriately (pointer/not-allowed)

## Mobile Considerations

### Spacing Between Buttons
When placing multiple buttons on mobile, ensure adequate spacing (minimum 8px) between touch targets:

```jsx
<div className="space-y-3">
  <Button fullWidth={true}>Primary Action</Button>
  <Button fullWidth={true} variant="secondary">Secondary Action</Button>
</div>
```

### Sticky Mobile CTAs
For important actions on mobile, consider using sticky positioning:

```jsx
<div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t p-4 shadow-lg">
  <Button fullWidth={true} size="lg">
    Book Now - ₱2,500
  </Button>
</div>
```

## Testing

The Button component includes comprehensive tests covering:
- Touch-optimized sizing (44px minimum)
- Responsive size variants
- Full width functionality
- All button variants
- Click handling and disabled states
- Accessibility features

Run tests:
```bash
npm test -- Button.test.js
```

## Requirements Validated

This implementation validates the following requirements from the guest-mobile-responsiveness spec:

- **Requirement 4.1**: Touch targets with minimum 44px height ✓
- **Requirement 4.2**: Touch targets with minimum 44px width ✓
- **Requirement 4.3**: Adequate spacing between touch targets ✓

## Migration Guide

The Button component is backward compatible. Existing buttons will automatically benefit from touch-optimized sizing. To take full advantage of the new features:

1. **For mobile-first layouts**, use `fullWidth={true}`:
   ```jsx
   // Before
   <Button>Submit</Button>
   
   // After (mobile-optimized)
   <Button fullWidth={true}>Submit</Button>
   ```

2. **For prominent CTAs**, use size="lg":
   ```jsx
   // Before
   <Button>Book Now</Button>
   
   // After (more prominent)
   <Button size="lg" fullWidth={true}>Book Now</Button>
   ```

3. **No changes needed** for existing buttons - they already meet touch target requirements!
