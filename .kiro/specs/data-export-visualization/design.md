# Design Document: Data Export and Visualization

## Overview

The Data Export and Visualization feature provides administrators with comprehensive reporting capabilities through a multi-layered architecture. The system consists of a backend export service that generates reports and converts data to multiple formats (CSV, JSON), and a frontend visualization layer that renders interactive charts using pure CSS and SVG without external dependencies.

The implementation follows a RESTful API design pattern with JWT-based authentication, role-based access control, and a reusable React component architecture for charts. The system supports four primary report types (bookings, revenue, users, units) with optional date range filtering and three chart types (bar, pie, line) for visual analytics.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard UI                       │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Reports Page   │  │ Chart        │  │ Export         │  │
│  │ Component      │──│ Component    │  │ Controls       │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Layer                         │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Auth           │  │ Report       │  │ Export         │  │
│  │ Middleware     │──│ Generator    │──│ Service        │  │
│  └────────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ File I/O
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Storage                            │
│  ┌────────────┐  ┌────────────┐  ┌────────┐  ┌──────────┐  │
│  │ bookings   │  │ users      │  │ units  │  │ reviews  │  │
│  │ .json      │  │ .json      │  │ .json  │  │ .json    │  │
│  └────────────┘  └────────────┘  └────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Report Generation Flow:**
   - Admin selects report type and optional date range
   - Frontend sends POST request to `/api/admin/reports/generate`
   - Backend validates authentication and authorization
   - Report Generator reads relevant JSON data files
   - Data is filtered by date range if specified
   - Aggregated report data is returned to frontend
   - Frontend displays summary statistics and charts

2. **Export Flow:**
   - Admin clicks export button (CSV or JSON)
   - Frontend sends POST request to `/api/admin/reports/export`
   - Backend validates authentication and authorization
   - Export Service reads and filters data
   - Data is transformed to requested format
   - File is streamed to client with appropriate headers
   - Browser triggers automatic download
   - Frontend displays success notification

3. **Visualization Flow:**
   - Report data is passed to Chart Component
   - Component calculates dimensions and proportions
   - SVG/CSS elements are rendered based on chart type
   - Animations are applied for smooth transitions
   - Interactive elements respond to user actions

## Components and Interfaces

### Backend Components

#### 1. Authentication Middleware

**Purpose:** Validates user identity and authorization

**Interface:**
```javascript
verifyToken(req, res, next)
checkRole(role)(req, res, next)
```

**Responsibilities:**
- Verify JWT token from Authorization header
- Extract user information from token
- Validate user has required role (admin)
- Reject unauthorized requests with 401/403 status

#### 2. Report Generator Service

**Purpose:** Aggregates and filters system data for reports

**Interface:**
```javascript
POST /api/admin/reports/generate
Request Body: {
  reportType: 'bookings' | 'revenue' | 'users' | 'units',
  startDate?: string,
  endDate?: string
}
Response: {
  success: boolean,
  report: {
    id: string,
    type: string,
    startDate?: string,
    endDate?: string,
    generatedAt: string,
    data: object
  }
}
```

**Responsibilities:**
- Read data from JSON files (bookings, users, units, reviews)
- Filter bookings by date range if provided
- Calculate aggregated statistics based on report type
- Return structured report object

**Report Type Calculations:**

- **Bookings Report:**
  - Total bookings count
  - Count by status (pending, confirmed, completed, cancelled)
  - Total revenue from paid bookings

- **Revenue Report:**
  - Total revenue from paid bookings
  - Pending revenue from unpaid bookings
  - Average booking value

- **Users Report:**
  - Total users count
  - Active users count
  - Count by role (admin, host, guest)

- **Units Report:**
  - Total units count
  - Available units count
  - Average rating from reviews

#### 3. Export Service

**Purpose:** Converts report data to downloadable file formats

**Interface:**
```javascript
POST /api/admin/reports/export
Request Body: {
  reportType: 'bookings' | 'revenue' | 'users' | 'units',
  format: 'csv' | 'json',
  startDate?: string,
  endDate?: string
}
Response: File download (CSV or JSON)
```

**Responsibilities:**
- Read and filter data based on report type and date range
- Transform data to export format structure
- Generate CSV with proper quoting and delimiters
- Generate JSON with proper formatting
- Set appropriate HTTP headers for file download
- Stream file content to client

**CSV Generation Algorithm:**
```
1. Extract headers from first data object
2. Create header row with comma-separated values
3. For each data row:
   a. Extract values in header order
   b. Wrap each value in double quotes
   c. Join values with commas
4. Join all rows with newlines
5. Return as text/csv
```

**JSON Generation Algorithm:**
```
1. Transform data to export structure
2. Use JSON.stringify with 2-space indentation
3. Return as application/json
```

### Frontend Components

#### 1. Reports Page Component

**Purpose:** Main UI for report generation and export

**File:** `frontend/src/pages/Admin/Reports.js`

**State:**
```javascript
{
  reportType: string,      // Selected report type
  startDate: string,       // Filter start date
  endDate: string,         // Filter end date
  report: object | null,   // Generated report data
  generating: boolean      // Loading state
}
```

**Key Functions:**

- `handleGenerateReport()`: Calls backend to generate report
- `handleExportReport(format)`: Triggers file download for specified format

**Responsibilities:**
- Render report type selector and date range inputs
- Display export buttons (CSV, JSON)
- Show loading states during operations
- Display generated report with statistics and charts
- Handle toast notifications for success/error

#### 2. Chart Component

**Purpose:** Reusable visualization component for multiple chart types

**File:** `frontend/src/components/Chart.js`

**Props:**
```javascript
{
  data: Array<{label: string, value: number}>,
  type: 'bar' | 'pie' | 'line',
  title?: string,
  height?: number  // Default: 300
}
```

**Responsibilities:**
- Validate data availability
- Calculate maximum value for scaling
- Render appropriate chart type
- Apply animations and transitions
- Handle responsive layout

**Chart Type Implementations:**

##### Bar Chart
- Horizontal bars with gradient colors (blue-500 to blue-600)
- Width calculated as percentage of max value
- Value labels positioned inside bar if width > 15%, outside otherwise
- Category labels on left (truncated with ellipsis)
- Smooth 500ms transitions on width changes
- Scrollable container for many items

##### Pie Chart
- SVG-based circular segments
- Segments calculated using circle stroke-dasharray technique
- Radius: 15.915 units, stroke-width: 31.83 units (creates full circle)
- Each segment offset by sum of previous percentages
- 8-color palette (blue, green, yellow, purple, red, indigo, pink, orange)
- Legend with color indicators, labels, values, and percentages
- Responsive: stacked on mobile, side-by-side on desktop

##### Line Chart
- SVG path connecting data points
- Grid lines at 0%, 25%, 50%, 75%, 100% of max value
- Circular markers (radius 5) at each data point
- Y-axis labels showing scaled values
- X-axis labels below each point
- Blue line (stroke-width 3) with rounded caps and joins
- ViewBox-based responsive scaling

## Data Models

### Report Object

```javascript
{
  id: string,              // Timestamp-based unique ID
  type: string,            // 'bookings' | 'revenue' | 'users' | 'units'
  startDate?: string,      // ISO date string
  endDate?: string,        // ISO date string
  generatedAt: string,     // ISO timestamp
  data: object             // Type-specific aggregated data
}
```

### Bookings Report Data

```javascript
{
  totalBookings: number,
  byStatus: {
    pending: number,
    confirmed: number,
    completed: number,
    cancelled: number
  },
  revenue: number
}
```

### Revenue Report Data

```javascript
{
  totalRevenue: number,
  pendingRevenue: number,
  averageBookingValue: string  // Formatted to 2 decimals
}
```

### Users Report Data

```javascript
{
  totalUsers: number,
  activeUsers: number,
  byRole: {
    admin: number,
    host: number,
    guest: number
  }
}
```

### Units Report Data

```javascript
{
  totalUnits: number,
  availableUnits: number,
  averageRating: string  // Formatted to 1 decimal
}
```

### Export Data Structures

#### Bookings Export

```javascript
{
  'Booking ID': string,
  'Guest ID': string,
  'Unit ID': string,
  'Check In': string,
  'Check Out': string,
  'Status': string,
  'Total Price': number,
  'Payment Status': string,
  'Created At': string
}
```

#### Revenue Export

```javascript
{
  'Booking ID': string,
  'Amount': number,
  'Payment Status': string,
  'Date': string
}
```

#### Users Export

```javascript
{
  'User ID': string,
  'Name': string,
  'Email': string,
  'Role': string,
  'Status': string,
  'Phone': string,
  'Created At': string
}
```

#### Units Export

```javascript
{
  'Unit ID': string,
  'Name': string,
  'Host ID': string,
  'Price': number,
  'Location': string,
  'Available': string,
  'Rating': string
}
```

### Chart Data Model

```javascript
{
  label: string,   // Category or X-axis label
  value: number    // Numeric value for visualization
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CSV Format Validity

*For any* exported CSV file, parsing the file should produce a data structure where the first row contains headers and subsequent rows contain quoted values separated by commas.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 2: JSON Format Validity

*For any* exported JSON file, parsing the file with JSON.parse should succeed and produce an array of objects with consistent field names.

**Validates: Requirements 12.1, 12.3**

### Property 3: Date Range Filtering Consistency

*For any* report generated with a start date and end date, all bookings in the filtered result should have creation timestamps within the specified range (inclusive).

**Validates: Requirements 3.1, 3.3, 3.5**

### Property 4: Export Data Completeness

*For any* report type, the exported data should include all required fields specified for that report type, with no fields missing or null unless explicitly allowed.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 5: Bar Chart Width Calculation

*For any* bar chart data, each bar's width percentage should equal (value / maxValue) * 100, where maxValue is the maximum value in the dataset.

**Validates: Requirements 4.2**

### Property 6: Pie Chart Segment Proportions

*For any* pie chart data, the sum of all segment percentages should equal 100%, and each segment percentage should equal (value / total) * 100.

**Validates: Requirements 5.2, 5.5**

### Property 7: Chart Component No-Data Handling

*For any* chart component rendered with empty or null data, the component should display "No data available" message instead of attempting to render a chart.

**Validates: Requirements 7.5**

### Property 8: Authentication Rejection

*For any* export request without a valid JWT token or with a non-admin role, the system should reject the request and return an appropriate error status (401 or 403).

**Validates: Requirements 14.1, 14.2, 14.3, 14.4**

### Property 9: Filename Generation Consistency

*For any* successful export, the generated filename should follow the pattern {reportType}_report_{timestamp}.{extension}, where extension matches the requested format.

**Validates: Requirements 9.3**

### Property 10: Report Aggregation Accuracy

*For any* bookings report, the sum of byStatus counts (pending + confirmed + completed + cancelled) should equal totalBookings.

**Validates: Requirements 2.1**

### Property 11: Export Format Consistency

*For any* report type and date range, exporting as CSV and then as JSON should produce datasets with the same number of records and matching data values.

**Validates: Requirements 1.1, 1.2, 3.5**

### Property 12: Chart Type Rendering

*For any* valid chart type ('bar', 'pie', 'line'), the Chart Component should render the appropriate visualization without errors or null returns.

**Validates: Requirements 7.1**

### Property 13: Color Palette Cycling

*For any* pie chart with more than 8 segments, colors should cycle through the palette using modulo operation, ensuring every segment has a color.

**Validates: Requirements 5.3**

### Property 14: Revenue Calculation Accuracy

*For any* revenue report, totalRevenue should equal the sum of totalPrice for all bookings where paymentStatus equals 'paid'.

**Validates: Requirements 2.2**

### Property 15: Chart Responsiveness

*For any* chart rendered on different viewport widths, the chart should maintain proper proportions and readability without overflow or truncation.

**Validates: Requirements 13.3, 13.4, 13.5**

## Error Handling

### Backend Error Scenarios

1. **Invalid Report Type**
   - Status: 400 Bad Request
   - Response: `{ success: false, message: 'Invalid report type' }`
   - Trigger: reportType not in ['bookings', 'revenue', 'users', 'units']

2. **Invalid Export Format**
   - Status: 400 Bad Request
   - Response: `{ success: false, message: 'Invalid format. Use csv or json' }`
   - Trigger: format not in ['csv', 'json']

3. **No Data to Export**
   - Status: 400 Bad Request
   - Response: `{ success: false, message: 'No data to export' }`
   - Trigger: Filtered dataset is empty

4. **Authentication Failure**
   - Status: 401 Unauthorized
   - Response: `{ success: false, message: 'Authentication required' }`
   - Trigger: Missing or invalid JWT token

5. **Authorization Failure**
   - Status: 403 Forbidden
   - Response: `{ success: false, message: 'Admin access required' }`
   - Trigger: User role is not 'admin'

6. **Server Error**
   - Status: 500 Internal Server Error
   - Response: `{ success: false, message: error.message }`
   - Trigger: File read errors, JSON parse errors, unexpected exceptions

### Frontend Error Handling

1. **Network Errors**
   - Display toast: "Error generating report" or "Error exporting report"
   - Reset loading states
   - Log error to console

2. **API Error Responses**
   - Display toast with server-provided error message
   - Reset loading states
   - Maintain current UI state

3. **Chart Rendering Errors**
   - Display "No data available" message
   - Prevent component crash
   - Return early from render function

### Error Recovery Strategies

- **Retry Logic:** User can manually retry failed operations
- **State Preservation:** Form inputs remain populated after errors
- **Clear Feedback:** Toast notifications provide actionable error messages
- **Graceful Degradation:** Charts fail safely without breaking page layout

## Testing Strategy

### Unit Testing

**Backend Tests:**
- Test CSV generation with various data structures
- Test JSON generation and formatting
- Test date range filtering logic
- Test report aggregation calculations
- Test authentication middleware with valid/invalid tokens
- Test authorization middleware with different roles
- Test error handling for invalid inputs

**Frontend Tests:**
- Test Chart Component with different data sets
- Test Chart Component with empty/null data
- Test bar chart width calculations
- Test pie chart percentage calculations
- Test line chart path generation
- Test export button click handlers
- Test report generation form submission

**Example Unit Tests:**
```javascript
// Backend: CSV generation
test('CSV export includes headers', () => {
  const data = [{ 'Booking ID': '1', 'Status': 'confirmed' }];
  const csv = generateCSV(data);
  expect(csv.split('\n')[0]).toBe('Booking ID,Status');
});

// Frontend: Chart no-data handling
test('Chart displays no-data message when data is empty', () => {
  const { getByText } = render(<Chart data={[]} type="bar" />);
  expect(getByText('No data available')).toBeInTheDocument();
});
```

### Property-Based Testing

All property-based tests should run a minimum of 100 iterations and reference their corresponding design property.

**Property Test 1: CSV Format Validity**
```javascript
// Feature: data-export-visualization, Property 1: CSV Format Validity
test('CSV exports are valid and parseable', () => {
  forAll(arbitraryReportData, (data) => {
    const csv = generateCSV(data);
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    // First line should be headers
    expect(headers.length).toBeGreaterThan(0);
    
    // All subsequent lines should have same number of fields
    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(',');
      expect(fields.length).toBe(headers.length);
      
      // All fields should be quoted
      fields.forEach(field => {
        expect(field.startsWith('"')).toBe(true);
        expect(field.endsWith('"')).toBe(true);
      });
    }
  });
});
```

**Property Test 2: JSON Format Validity**
```javascript
// Feature: data-export-visualization, Property 2: JSON Format Validity
test('JSON exports are valid and parseable', () => {
  forAll(arbitraryReportData, (data) => {
    const json = generateJSON(data);
    
    // Should parse without errors
    const parsed = JSON.parse(json);
    
    // Should be an array
    expect(Array.isArray(parsed)).toBe(true);
    
    // All objects should have consistent keys
    if (parsed.length > 0) {
      const keys = Object.keys(parsed[0]);
      parsed.forEach(obj => {
        expect(Object.keys(obj).sort()).toEqual(keys.sort());
      });
    }
  });
});
```

**Property Test 3: Date Range Filtering**
```javascript
// Feature: data-export-visualization, Property 3: Date Range Filtering Consistency
test('Date filtering includes only bookings within range', () => {
  forAll(arbitraryBookings, arbitraryDateRange, (bookings, { start, end }) => {
    const filtered = filterByDateRange(bookings, start, end);
    
    filtered.forEach(booking => {
      const date = new Date(booking.createdAt);
      expect(date >= new Date(start)).toBe(true);
      expect(date <= new Date(end)).toBe(true);
    });
  });
});
```

**Property Test 4: Export Data Completeness**
```javascript
// Feature: data-export-visualization, Property 4: Export Data Completeness
test('Exported data includes all required fields', () => {
  forAll(arbitraryReportType, (reportType) => {
    const requiredFields = getRequiredFields(reportType);
    const exported = exportReport(reportType);
    
    exported.forEach(record => {
      requiredFields.forEach(field => {
        expect(record).toHaveProperty(field);
        expect(record[field]).not.toBeNull();
      });
    });
  });
});
```

**Property Test 5: Bar Chart Width Calculation**
```javascript
// Feature: data-export-visualization, Property 5: Bar Chart Width Calculation
test('Bar widths are proportional to values', () => {
  forAll(arbitraryChartData, (data) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    data.forEach(item => {
      const expectedPercentage = (item.value / maxValue) * 100;
      const calculatedPercentage = calculateBarWidth(item.value, maxValue);
      expect(calculatedPercentage).toBeCloseTo(expectedPercentage, 2);
    });
  });
});
```

**Property Test 6: Pie Chart Segment Proportions**
```javascript
// Feature: data-export-visualization, Property 6: Pie Chart Segment Proportions
test('Pie chart segments sum to 100%', () => {
  forAll(arbitraryChartData, (data) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const percentages = data.map(d => (d.value / total) * 100);
    const sum = percentages.reduce((a, b) => a + b, 0);
    
    expect(sum).toBeCloseTo(100, 1);
    
    percentages.forEach((pct, i) => {
      const expected = (data[i].value / total) * 100;
      expect(pct).toBeCloseTo(expected, 2);
    });
  });
});
```

**Property Test 7: Chart No-Data Handling**
```javascript
// Feature: data-export-visualization, Property 7: Chart Component No-Data Handling
test('Chart handles empty data gracefully', () => {
  forAll(arbitraryChartType, (type) => {
    const { container } = render(<Chart data={[]} type={type} />);
    expect(container.textContent).toContain('No data available');
    expect(container.querySelector('svg')).toBeNull();
  });
});
```

**Property Test 8: Authentication Rejection**
```javascript
// Feature: data-export-visualization, Property 8: Authentication Rejection
test('Unauthorized requests are rejected', () => {
  forAll(arbitraryInvalidToken, arbitraryReportType, async (token, reportType) => {
    const response = await fetch('/api/admin/reports/export', {
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reportType, format: 'csv' })
    });
    
    expect([401, 403]).toContain(response.status);
  });
});
```

**Property Test 9: Filename Generation**
```javascript
// Feature: data-export-visualization, Property 9: Filename Generation Consistency
test('Export filenames follow consistent pattern', () => {
  forAll(arbitraryReportType, arbitraryFormat, (reportType, format) => {
    const filename = generateFilename(reportType, format);
    const pattern = new RegExp(`^${reportType}_report_\\d+\\.${format}$`);
    expect(filename).toMatch(pattern);
  });
});
```

**Property Test 10: Report Aggregation Accuracy**
```javascript
// Feature: data-export-visualization, Property 10: Report Aggregation Accuracy
test('Booking status counts sum to total', () => {
  forAll(arbitraryBookings, (bookings) => {
    const report = generateBookingsReport(bookings);
    const sum = Object.values(report.data.byStatus).reduce((a, b) => a + b, 0);
    expect(sum).toBe(report.data.totalBookings);
  });
});
```

### Integration Testing

- Test complete report generation flow from UI to backend
- Test complete export flow with file download
- Test chart rendering with real report data
- Test authentication flow with valid/invalid credentials
- Test date range filtering end-to-end

### Test Data Generators

```javascript
// Arbitrary report data
const arbitraryReportData = fc.array(
  fc.record({
    'Booking ID': fc.string(),
    'Status': fc.constantFrom('pending', 'confirmed', 'completed', 'cancelled'),
    'Total Price': fc.integer({ min: 0, max: 10000 })
  }),
  { minLength: 1, maxLength: 100 }
);

// Arbitrary chart data
const arbitraryChartData = fc.array(
  fc.record({
    label: fc.string(),
    value: fc.integer({ min: 1, max: 1000 })
  }),
  { minLength: 1, maxLength: 20 }
);

// Arbitrary date range
const arbitraryDateRange = fc.record({
  start: fc.date(),
  end: fc.date()
}).filter(({ start, end }) => start <= end);

// Arbitrary bookings
const arbitraryBookings = fc.array(
  fc.record({
    id: fc.string(),
    createdAt: fc.date().map(d => d.toISOString()),
    status: fc.constantFrom('pending', 'confirmed', 'completed', 'cancelled'),
    totalPrice: fc.integer({ min: 0, max: 10000 }),
    paymentStatus: fc.constantFrom('paid', 'pending')
  })
);
```

### Testing Tools

- **Unit Testing:** Jest, React Testing Library
- **Property-Based Testing:** fast-check (JavaScript)
- **API Testing:** Supertest
- **Coverage:** Jest coverage reports (target: >80%)

### Test Execution

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run property tests only
npm test -- --testNamePattern="Property"

# Run specific test file
npm test Chart.test.js
```
