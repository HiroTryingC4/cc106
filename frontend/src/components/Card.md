# Card Component

A responsive card component with mobile-first padding and touch-friendly hover effects.

## Features

- **Responsive Padding**: Automatically adjusts padding based on viewport width
- **Touch & Mouse Support**: Hover effects work on both touch devices (active state) and mouse devices (hover state)
- **Flexible Styling**: Customizable padding levels and additional className support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to display inside the card |
| `className` | string | `''` | Additional CSS classes to apply |
| `padding` | string | `'default'` | Padding size: `'none'`, `'sm'`, `'default'`, or `'lg'` |
| `hover` | boolean | `false` | Enable hover/active shadow effects |

## Padding Options

| Option | Mobile (< 768px) | Tablet (768px-1023px) | Desktop (≥ 1024px) |
|--------|------------------|----------------------|-------------------|
| `none` | No padding | No padding | No padding |
| `sm` | 12px (p-3) | 16px (p-4) | 16px (p-4) |
| `default` | 16px (p-4) | 24px (p-6) | 32px (p-8) |
| `lg` | 24px (p-6) | 32px (p-8) | 40px (p-10) |

## Usage Examples

### Basic Card (Default Padding)

```jsx
import Card from './components/Card';

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

### Card with No Padding

```jsx
<Card padding="none">
  <img src="image.jpg" alt="Full width image" />
</Card>
```

### Card with Small Padding

```jsx
<Card padding="sm">
  <p>Compact card content</p>
</Card>
```

### Card with Large Padding

```jsx
<Card padding="lg">
  <h1>Spacious Card</h1>
  <p>More breathing room for content</p>
</Card>
```

### Interactive Card with Hover Effects

```jsx
<Card hover={true}>
  <h3>Clickable Card</h3>
  <p>This card has hover and touch effects</p>
</Card>
```

### Card with Custom Classes

```jsx
<Card className="border-2 border-blue-500" padding="sm">
  <p>Card with custom border</p>
</Card>
```

## Responsive Behavior

The Card component follows a mobile-first approach:

1. **Mobile (< 768px)**: Uses base padding values for optimal space usage on small screens
2. **Tablet (768px-1023px)**: Increases padding using `md:` prefix for better spacing
3. **Desktop (≥ 1024px)**: Further increases padding using `lg:` prefix for comfortable reading

## Touch-Friendly Hover Effects

When `hover={true}` is set, the card applies shadow effects for both:

- **Mouse devices**: `hover:shadow-lg` - Shadow appears on mouse hover
- **Touch devices**: `active:shadow-lg` - Shadow appears when tapped/pressed

This ensures a consistent interactive experience across all device types.

## Accessibility

- The card maintains semantic HTML structure
- All content inside the card remains keyboard accessible
- Focus indicators are preserved for interactive elements within the card

## Migration Guide

### Existing Usage (No Changes Required)

All existing Card components will continue to work without any changes:

```jsx
// This still works exactly as before
<Card>Content</Card>
```

The default padding (`p-4 md:p-6 lg:p-8`) provides the same responsive behavior as the original implementation.

### Adopting New Features

To take advantage of the new responsive padding options:

```jsx
// Use smaller padding for compact layouts
<Card padding="sm">Compact content</Card>

// Use larger padding for spacious layouts
<Card padding="lg">Spacious content</Card>

// Remove padding for full-width content
<Card padding="none">
  <img src="banner.jpg" className="w-full" />
</Card>
```

## Requirements Validated

This implementation validates:
- **Requirement 6.1**: Uses Tailwind responsive spacing utilities (p-4, md:p-6, lg:p-8)
- **Requirement 6.4**: Adjusts internal spacing based on viewport width
