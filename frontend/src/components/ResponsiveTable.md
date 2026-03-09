# ResponsiveTable Component

A responsive table component that automatically adapts to different screen sizes, providing optimal viewing experience across mobile, tablet, and desktop devices.

## Features

- **Mobile Card Layout**: Converts table to card-based layout on mobile devices (< 768px)
- **Essential Columns**: Hides non-essential columns on mobile to reduce clutter
- **Horizontal Scroll**: Provides horizontal scrolling with visual indicators as fallback
- **Desktop Table**: Preserves traditional table layout on tablet and desktop (>= 768px)
- **Custom Rendering**: Supports custom cell rendering functions
- **Row Click Handlers**: Optional click handlers for interactive rows
- **Empty States**: Customizable empty state messages

## Requirements

Validates Requirements:
- 11.1: Tables convert to card-based layouts on mobile
- 11.2: Non-essential columns hidden on mobile
- 11.3: Responsive table patterns (stacked rows)
- 11.5: Full table layouts restored on desktop

## Usage

### Basic Example

```jsx
import ResponsiveTable from './components/ResponsiveTable';

const columns = [
  { header: 'Name', accessor: 'name', essential: true },
  { header: 'Email', accessor: 'email', essential: true },
  { header: 'Phone', accessor: 'phone', essential: false },
  { header: 'Status', accessor: 'status', essential: false }
];

const data = [
  { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', status: 'Inactive' }
];

function MyComponent() {
  return (
    <ResponsiveTable 
      columns={columns} 
      data={data} 
    />
  );
}
```

### With Custom Cell Rendering

```jsx
const columns = [
  { 
    header: 'Name', 
    accessor: 'name', 
    essential: true,
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <img src={row.avatar} alt="" className="w-8 h-8 rounded-full" />
        <span className="font-medium">{value}</span>
      </div>
    )
  },
  { 
    header: 'Status', 
    accessor: 'status', 
    essential: true,
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )
  }
];
```

### With Row Click Handler

```jsx
function MyComponent() {
  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    // Navigate to detail page, open modal, etc.
  };

  return (
    <ResponsiveTable 
      columns={columns} 
      data={data}
      onRowClick={handleRowClick}
    />
  );
}
```

### Custom Empty Message

```jsx
<ResponsiveTable 
  columns={columns} 
  data={[]}
  emptyMessage="No bookings found. Create your first booking to get started!"
/>
```

### Disable Mobile Card View

```jsx
<ResponsiveTable 
  columns={columns} 
  data={data}
  mobileCardView={false}  // Always use table layout
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | Array | `[]` | Column definitions (see Column Definition below) |
| `data` | Array | `[]` | Array of data objects to display |
| `mobileCardView` | Boolean | `true` | Use card layout on mobile devices |
| `allowHorizontalScroll` | Boolean | `true` | Allow horizontal scroll with indicators |
| `emptyMessage` | String | `"No data available"` | Message when no data |
| `onRowClick` | Function | `undefined` | Handler for row clicks |
| `className` | String | `''` | Additional CSS classes |

## Column Definition

Each column object supports the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `header` | String | Yes | Column header text |
| `accessor` | String | Yes | Key to access data in row object |
| `essential` | Boolean | No | Show on mobile (default: `true`) |
| `render` | Function | No | Custom render function `(value, row) => ReactNode` |

### Essential Columns

Mark columns as `essential: false` to hide them on mobile devices:

```jsx
const columns = [
  { header: 'Name', accessor: 'name', essential: true },      // Always visible
  { header: 'Email', accessor: 'email', essential: true },    // Always visible
  { header: 'Phone', accessor: 'phone', essential: false },   // Hidden on mobile
  { header: 'Address', accessor: 'address', essential: false } // Hidden on mobile
];
```

## Responsive Behavior

### Mobile (< 768px)
- Displays data as cards
- Shows only essential columns
- Stacks information vertically
- Full-width cards with shadow
- Touch-friendly spacing

### Tablet (768px - 1023px)
- Traditional table layout
- All columns visible
- Horizontal scroll if needed
- Scroll indicators shown

### Desktop (>= 1024px)
- Traditional table layout
- All columns visible
- Horizontal scroll if needed
- Scroll indicators shown

## Styling

The component uses Tailwind CSS classes and can be customized:

```jsx
<ResponsiveTable 
  columns={columns} 
  data={data}
  className="my-4 shadow-lg"  // Add custom classes
/>
```

### Mobile Card Styling

Cards on mobile have:
- White background
- Rounded corners (`rounded-lg`)
- Shadow (`shadow-md`)
- Padding (`p-4`)
- Hover effect when clickable

### Table Styling

Tables on desktop/tablet have:
- Gray header background (`bg-gray-50`)
- Dividers between rows
- Hover effect on rows when clickable
- Proper spacing (`px-6 py-4`)

## Examples

### Bookings Table

```jsx
const bookingColumns = [
  { 
    header: 'Unit', 
    accessor: 'unitName', 
    essential: true 
  },
  { 
    header: 'Guest', 
    accessor: 'guestName', 
    essential: true 
  },
  { 
    header: 'Check-in', 
    accessor: 'checkIn', 
    essential: true,
    render: (value) => new Date(value).toLocaleDateString()
  },
  { 
    header: 'Check-out', 
    accessor: 'checkOut', 
    essential: false,
    render: (value) => new Date(value).toLocaleDateString()
  },
  { 
    header: 'Total', 
    accessor: 'total', 
    essential: true,
    render: (value) => `₱${value.toLocaleString()}`
  },
  { 
    header: 'Status', 
    accessor: 'status', 
    essential: true,
    render: (value) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value === 'Confirmed' ? 'bg-green-100 text-green-800' :
        value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )
  }
];

<ResponsiveTable 
  columns={bookingColumns} 
  data={bookings}
  onRowClick={(booking) => navigate(`/bookings/${booking.id}`)}
/>
```

### Users Table

```jsx
const userColumns = [
  { 
    header: 'Name', 
    accessor: 'name', 
    essential: true,
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
          {value.charAt(0)}
        </div>
        <span>{value}</span>
      </div>
    )
  },
  { header: 'Email', accessor: 'email', essential: true },
  { header: 'Role', accessor: 'role', essential: false },
  { header: 'Joined', accessor: 'createdAt', essential: false,
    render: (value) => new Date(value).toLocaleDateString()
  }
];

<ResponsiveTable 
  columns={userColumns} 
  data={users}
/>
```

## Accessibility

- Proper table structure with `<thead>` and `<tbody>`
- Semantic HTML in card layout
- Keyboard accessible when `onRowClick` is provided
- Screen reader friendly labels

## Browser Support

- Modern browsers with CSS Grid support
- Fallback for older browsers via horizontal scroll
- Works with or without JavaScript (graceful degradation)

## Performance

- Debounced resize handlers to minimize re-renders
- Efficient viewport detection
- Minimal DOM updates on breakpoint changes

## Testing

The component includes comprehensive unit tests covering:
- Desktop table rendering
- Mobile card rendering
- Essential column filtering
- Custom cell rendering
- Row click handlers
- Empty states
- Responsive behavior
- Edge cases

Run tests:
```bash
npm test ResponsiveTable.test.js
```
