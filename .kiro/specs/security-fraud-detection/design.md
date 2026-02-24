# Design Document: Security and Fraud Detection System

## Overview

The Security and Fraud Detection system is a comprehensive security monitoring and management solution built for the SmartStay platform. It provides real-time threat detection, access logging with IP tracking, security incident management, IP blocking capabilities, and transaction monitoring to prevent fraud and protect the platform from malicious activities.

The system follows a RESTful API architecture with a React-based admin interface, using JSON file storage for security data persistence. All endpoints are protected with JWT authentication and role-based authorization to ensure only administrators can access security features.

## Architecture

### System Components

1. **Backend API Layer** (`backend/routes/admin/security.js`)
   - RESTful endpoints for security operations
   - JWT authentication middleware
   - Role-based authorization (admin-only)
   - JSON file-based data persistence

2. **Data Storage Layer** (`backend/data/security_logs.json`)
   - Access logs collection
   - Security incidents collection
   - Blocked IPs collection
   - Transaction monitoring collection

3. **Frontend UI Layer** (`frontend/src/pages/Admin/Security.js`)
   - Tabbed interface for different security views
   - Real-time data fetching and display
   - Interactive management controls
   - Toast notifications for user feedback

4. **Authentication Middleware** (`backend/middleware/auth.js`)
   - Token verification
   - Role checking
   - Request authorization

### Data Flow

```
User Request → Authentication Middleware → Authorization Check → Route Handler → 
Data Storage (JSON) → Response → Frontend UI → User Display
```

### Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React with functional components and hooks
- **Authentication**: JWT (JSON Web Tokens)
- **Data Storage**: JSON files
- **HTTP Client**: Fetch API

## Components and Interfaces

### Backend API Endpoints

#### 1. Security Dashboard
```
GET /api/admin/security/dashboard
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "dashboard": {
    "failedLogins": number,
    "successfulLogins": number,
    "openIncidents": number,
    "blockedIPs": number,
    "flaggedTransactions": number,
    "recentIncidents": Incident[]
  }
}
```

#### 2. Access Logs
```
GET /api/admin/security/access-logs?limit=50&action=login_failed
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "logs": AccessLog[]
}
```

#### 3. Security Incidents
```
GET /api/admin/security/incidents?status=open
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "incidents": Incident[]
}

PUT /api/admin/security/incidents/:id
Authorization: Bearer <token>
Role: admin
Body: {
  "status": "resolved",
  "action": "Manually resolved by admin"
}

Response:
{
  "success": true,
  "message": "Incident updated",
  "incident": Incident
}
```

#### 4. IP Blocking
```
GET /api/admin/security/blocked-ips
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "blockedIPs": BlockedIP[]
}

POST /api/admin/security/block-ip
Authorization: Bearer <token>
Role: admin
Body: {
  "ip": "192.168.1.1",
  "reason": "Multiple failed login attempts",
  "permanent": false,
  "duration": 7
}

Response:
{
  "success": true,
  "message": "IP blocked successfully",
  "blockedIP": BlockedIP
}

DELETE /api/admin/security/block-ip/:ip
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "message": "IP unblocked successfully"
}
```

#### 5. Transaction Monitoring
```
GET /api/admin/security/transactions?status=flagged
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "transactions": Transaction[]
}

PUT /api/admin/security/transactions/:id/review
Authorization: Bearer <token>
Role: admin
Body: {
  "approved": true
}

Response:
{
  "success": true,
  "message": "Transaction reviewed",
  "transaction": Transaction
}
```

### Frontend Components

#### Security Page Component
- **State Management**: Uses React hooks (useState, useEffect)
- **Tab Navigation**: Dashboard, Access Logs, Incidents, Blocked IPs, Transactions
- **Data Fetching**: Automatic refresh when switching tabs
- **User Actions**: Resolve incidents, block/unblock IPs, review transactions

#### Modal Components
- **Block IP Modal**: Form for blocking new IP addresses with validation

#### UI Components
- **DashboardLayout**: Consistent admin layout wrapper
- **Card**: Content containers with styling
- **Button**: Action buttons with variants
- **Input**: Form input fields
- **Modal**: Dialog for user interactions
- **Toast**: Notification system for feedback

## Data Models

### AccessLog
```javascript
{
  "id": string,
  "userId": string | null,
  "email": string,
  "action": "login_success" | "login_failed",
  "ip": string,
  "userAgent": string,
  "timestamp": ISO8601 string,
  "location": string,
  "reason": string | undefined  // Only for failed logins
}
```

### SecurityIncident
```javascript
{
  "id": string,
  "type": "multiple_failed_logins" | "suspicious_transaction" | "unusual_access_pattern",
  "severity": "high" | "medium" | "low",
  "description": string,
  "ip": string | undefined,
  "targetEmail": string | undefined,
  "userId": string | undefined,
  "transactionId": string | undefined,
  "amount": number | undefined,
  "attempts": number | undefined,
  "timestamp": ISO8601 string,
  "status": "open" | "resolved",
  "actions": Action[]
}
```

### Action
```javascript
{
  "action": string,
  "timestamp": ISO8601 string,
  "adminId": string
}
```

### BlockedIP
```javascript
{
  "ip": string,
  "reason": string,
  "blockedAt": ISO8601 string,
  "blockedBy": string,  // Admin user ID
  "expiresAt": ISO8601 string | null,  // null for permanent blocks
  "permanent": boolean
}
```

### Transaction
```javascript
{
  "id": string,
  "transactionId": string,
  "userId": string,
  "type": "booking_payment" | string,
  "amount": number,
  "status": "normal" | "flagged" | "approved" | "rejected",
  "reason": string | null,
  "timestamp": ISO8601 string,
  "reviewed": boolean,
  "reviewedBy": string | undefined,
  "reviewedAt": ISO8601 string | undefined
}
```

### SecurityData (Root Storage Structure)
```javascript
{
  "accessLogs": AccessLog[],
  "securityIncidents": SecurityIncident[],
  "blockedIPs": BlockedIP[],
  "transactionMonitoring": Transaction[]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Dashboard Metrics Accuracy

*For any* security data state, the dashboard metrics should accurately reflect the counts from the underlying data collections filtered by the specified time windows and status conditions.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: Access Log Completeness

*For any* authentication attempt, an access log entry should be created with all required fields (timestamp, email, action, IP, user agent, location) populated.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Access Log Filtering Consistency

*For any* action type filter applied to access logs, all returned logs should match the specified action type, and no logs of that type should be excluded.

**Validates: Requirements 2.5**

### Property 4: Incident Status Transition Validity

*For any* security incident, when the status is updated from "open" to "resolved", the incident should have an action entry recorded with the resolution details, timestamp, and admin ID.

**Validates: Requirements 3.7**

### Property 5: Incident Filtering Consistency

*For any* status filter applied to incidents, all returned incidents should match the specified status, and no incidents of that status should be excluded.

**Validates: Requirements 3.9**

### Property 6: Automated Threat Detection Threshold

*For any* sequence of failed login attempts from the same IP address, when the count reaches 3 or more, a high-severity security incident should be created.

**Validates: Requirements 4.1**

### Property 7: Transaction Flagging Threshold

*For any* transaction with an amount exceeding ₱50,000, the transaction should be flagged with status "flagged" and a reason recorded.

**Validates: Requirements 4.2**

### Property 8: IP Block Uniqueness

*For any* IP address, attempting to block an already blocked IP should result in an error, and the blocked IPs collection should contain at most one entry per IP address.

**Validates: Requirements 5.4**

### Property 9: IP Block Expiration Calculation

*For any* non-permanent IP block with a specified duration in days, the expiration date should be exactly duration × 24 hours after the blocked timestamp.

**Validates: Requirements 5.2**

### Property 10: IP Unblock Completeness

*For any* blocked IP address, after unblocking, the IP should not appear in the blocked IPs collection.

**Validates: Requirements 5.6**

### Property 11: Transaction Review State Transition

*For any* flagged transaction that is reviewed, the transaction should have reviewed set to true, reviewedBy set to the admin ID, reviewedAt set to the current timestamp, and status set to either "approved" or "rejected" based on the review decision.

**Validates: Requirements 6.4, 6.5, 6.6**

### Property 12: Transaction Filtering Consistency

*For any* status filter applied to transactions, all returned transactions should match the specified status, and no transactions of that status should be excluded.

**Validates: Requirements 6.8**

### Property 13: Data Persistence Consistency

*For any* security data modification (incident update, IP block/unblock, transaction review), the changes should be immediately written to persistent storage and be retrievable in subsequent read operations.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 14: Authentication Requirement

*For any* security API endpoint request without a valid authentication token, the request should be rejected with an authentication error.

**Validates: Requirements 8.1, 8.3**

### Property 15: Authorization Requirement

*For any* security API endpoint request with a valid token but non-admin role, the request should be rejected with an authorization error.

**Validates: Requirements 8.2, 8.4**

## Error Handling

### Backend Error Handling

1. **Authentication Errors**
   - Missing or invalid JWT token → 401 Unauthorized
   - Expired token → 401 Unauthorized

2. **Authorization Errors**
   - Non-admin user attempting access → 403 Forbidden

3. **Validation Errors**
   - Missing required fields → 400 Bad Request
   - Invalid data format → 400 Bad Request
   - Duplicate IP block → 400 Bad Request

4. **Resource Not Found**
   - Incident ID not found → 404 Not Found
   - Transaction ID not found → 404 Not Found

5. **File System Errors**
   - Unable to read security_logs.json → 500 Internal Server Error
   - Unable to write security_logs.json → 500 Internal Server Error

6. **General Errors**
   - Unexpected exceptions → 500 Internal Server Error with error message

### Frontend Error Handling

1. **Network Errors**
   - Failed API requests → Toast notification with error message
   - Timeout → Toast notification "Request timed out"

2. **Data Loading Errors**
   - Failed to fetch data → Toast notification "Error loading security data"
   - Display loading state during fetch operations

3. **User Action Errors**
   - Failed to resolve incident → Toast notification "Error resolving incident"
   - Failed to block IP → Toast notification with server error message
   - Failed to review transaction → Toast notification "Error reviewing transaction"

4. **Validation Errors**
   - Empty required fields → Prevent form submission
   - Invalid IP format → Client-side validation feedback

### Error Response Format

All API errors follow a consistent format:
```javascript
{
  "success": false,
  "message": "Error description"
}
```

## Testing Strategy

### Unit Testing

Unit tests should focus on:

1. **API Endpoint Logic**
   - Test each endpoint with valid inputs
   - Test authentication and authorization checks
   - Test error conditions (missing data, invalid IDs)
   - Test data filtering and sorting logic

2. **Data Transformation**
   - Test dashboard metric calculations
   - Test date filtering for 24-hour windows
   - Test expiration date calculations for IP blocks

3. **Frontend Component Behavior**
   - Test tab switching and data fetching
   - Test form submission and validation
   - Test user action handlers (resolve, block, review)
   - Test modal open/close behavior

4. **Edge Cases**
   - Empty data collections
   - Boundary values for thresholds
   - Expired IP blocks
   - Already resolved incidents

### Property-Based Testing

Property tests should verify universal properties across all inputs with a minimum of 100 iterations per test. Each test must reference its design document property using the tag format: **Feature: security-fraud-detection, Property {number}: {property_text}**

1. **Dashboard Metrics** (Property 1)
   - Generate random security data states
   - Verify dashboard counts match filtered data

2. **Access Log Filtering** (Property 3)
   - Generate random access logs with various action types
   - Verify filtering returns only matching logs

3. **Incident Filtering** (Property 5)
   - Generate random incidents with various statuses
   - Verify filtering returns only matching incidents

4. **Threat Detection** (Property 6)
   - Generate sequences of failed login attempts
   - Verify incident creation at threshold

5. **Transaction Flagging** (Property 7)
   - Generate transactions with various amounts
   - Verify flagging occurs above threshold

6. **IP Block Uniqueness** (Property 8)
   - Generate random IP addresses
   - Verify duplicate blocking is prevented

7. **IP Block Expiration** (Property 9)
   - Generate random durations
   - Verify expiration date calculation accuracy

8. **Transaction Filtering** (Property 12)
   - Generate random transactions with various statuses
   - Verify filtering returns only matching transactions

9. **Data Persistence** (Property 13)
   - Generate random security data modifications
   - Verify write-then-read consistency

10. **Authentication** (Property 14)
    - Generate requests with missing/invalid tokens
    - Verify rejection with authentication error

11. **Authorization** (Property 15)
    - Generate requests with non-admin tokens
    - Verify rejection with authorization error

### Integration Testing

Integration tests should verify:

1. **End-to-End Workflows**
   - Complete incident resolution workflow
   - Complete IP blocking workflow
   - Complete transaction review workflow

2. **Data Persistence**
   - Verify data survives server restarts
   - Verify concurrent access handling

3. **Authentication Flow**
   - Verify token validation across all endpoints
   - Verify role-based access control

### Manual Testing Checklist

- [ ] Dashboard displays correct metrics
- [ ] Access logs load and filter correctly
- [ ] Incidents can be created and resolved
- [ ] IP addresses can be blocked and unblocked
- [ ] Transactions can be flagged and reviewed
- [ ] All tabs switch correctly
- [ ] Modals open and close properly
- [ ] Toast notifications appear for all actions
- [ ] Loading states display during data fetching
- [ ] Error messages display for failed operations
- [ ] UI is responsive on mobile devices
- [ ] Authentication prevents unauthorized access
