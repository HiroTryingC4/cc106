# Smart Stay - API Documentation

Complete API reference for the Smart Stay Property Management System.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Get Token

Login to receive a JWT token that expires in 24 hours.

---

## Authentication Endpoints

### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "guest",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "4",
    "email": "user@example.com",
    "role": "guest",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "4",
    "email": "user@example.com",
    "role": "guest",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

## Guest Endpoints

### Get Guest Bookings

```http
GET /guest/bookings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "1",
      "unitId": "1",
      "checkIn": "2024-06-15",
      "checkOut": "2024-06-20",
      "guests": 2,
      "totalPrice": 750,
      "status": "confirmed",
      "paymentStatus": "paid"
    }
  ]
}
```

### Create Booking

```http
POST /guest/bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "unitId": "1",
  "checkIn": "2024-07-01",
  "checkOut": "2024-07-05",
  "guests": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": "4",
    "unitId": "1",
    "guestId": "3",
    "checkIn": "2024-07-01",
    "checkOut": "2024-07-05",
    "guests": 2,
    "totalPrice": 600,
    "status": "pending"
  }
}
```

### Get Booking Details

```http
GET /guest/bookings/:id
Authorization: Bearer <token>
```

### Update Booking

```http
PUT /guest/bookings/:id
Authorization: Bearer <token>
```

### Cancel Booking

```http
DELETE /guest/bookings/:id
Authorization: Bearer <token>
```

### Create Payment

```http
POST /guest/payments/create
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bookingId": "1",
  "amount": 750
}
```

### Get Payment QR Code

```http
GET /guest/payments/:id/qr
Authorization: Bearer <token>
```

### Confirm Payment

```http
POST /guest/payments/:id/confirm
Authorization: Bearer <token>
```

### Get Profile

```http
GET /guest/profile
Authorization: Bearer <token>
```

### Update Profile

```http
PUT /guest/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "email": "newemail@example.com"
}
```

### Upload Checkout Photos

```http
POST /guest/checkout/:bookingId/photos
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `photos`: File(s)

### Submit Review

```http
POST /guest/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bookingId": "1",
  "unitId": "1",
  "rating": 5,
  "comment": "Great place!",
  "photos": []
}
```

---

## Host Endpoints

### Get Host Units

```http
GET /host/units
Authorization: Bearer <token>
```

### Create Unit

```http
POST /host/units
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name`: String
- `description`: String
- `type`: String
- `price`: Number
- `guests`: Number
- `bedrooms`: Number
- `bathrooms`: Number
- `amenities`: JSON String
- `images`: File(s)

### Update Unit

```http
PUT /host/units/:id
Authorization: Bearer <token>
```

### Delete Unit

```http
DELETE /host/units/:id
Authorization: Bearer <token>
```

### Get Host Bookings

```http
GET /host/bookings
Authorization: Bearer <token>
```

### Approve Booking

```http
PUT /host/bookings/:id/approve
Authorization: Bearer <token>
```

### Reject Booking

```http
PUT /host/bookings/:id/reject
Authorization: Bearer <token>
```

### Get Guest Analytics

```http
GET /host/analytics/guests
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalGuests": 10,
    "newGuests": 3,
    "returningGuests": 7,
    "monthlyGuests": [5, 8, 10, 12]
  }
}
```

### Get Booking Analytics

```http
GET /host/analytics/bookings
Authorization: Bearer <token>
```

### Get Revenue Analytics

```http
GET /host/analytics/revenue
Authorization: Bearer <token>
```

### Get Financial Summary

```http
GET /host/financial/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "financial": {
    "kinita": {
      "total": 5000,
      "monthly": {
        "2024-06": 1500,
        "2024-07": 2000
      }
    },
    "gastos": {
      "total": 1000,
      "monthly": {
        "2024-06": 300,
        "2024-07": 400
      }
    },
    "netProfit": {
      "total": 4000,
      "percentage": "80.0"
    }
  }
}
```

### Get Security Deposits

```http
GET /host/financial/deposits
Authorization: Bearer <token>
```

### Export Financial Data

```http
GET /host/financial/export?format=csv
Authorization: Bearer <token>
```

**Query Parameters:**
- `format`: `csv` or `json`

### Get Guest List

```http
GET /host/guests
Authorization: Bearer <token>
```

### Get Guest Details

```http
GET /host/guests/:id
Authorization: Bearer <token>
```

### Send Message to Guest

```http
POST /host/guests/:id/message
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "Hello, your booking is confirmed!"
}
```

### Get Chatbot Config

```http
GET /host/chatbot/config
Authorization: Bearer <token>
```

### Update Chatbot Responses

```http
PUT /host/chatbot/responses
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "faqs": [
    {
      "id": "1",
      "question": "How do I check in?",
      "answer": "Check-in instructions will be sent 24 hours before arrival.",
      "keywords": ["check in", "arrival", "access"]
    }
  ]
}
```

### Get Chatbot Conversations

```http
GET /host/chatbot/conversations
Authorization: Bearer <token>
```

---

## Admin Endpoints

### Get All Users

```http
GET /admin/users
Authorization: Bearer <token>
```

### Get Single User

```http
GET /admin/users/:id
Authorization: Bearer <token>
```

### Create User

```http
POST /admin/users
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "host",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

### Update User

```http
PUT /admin/users/:id
Authorization: Bearer <token>
```

### Deactivate User

```http
DELETE /admin/users/:id
Authorization: Bearer <token>
```

### Update User Role

```http
PUT /admin/users/:id/role
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "host"
}
```

### Get System Statistics

```http
GET /admin/system/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 50,
      "active": 45,
      "byRole": {
        "admin": 2,
        "host": 15,
        "guest": 33
      }
    },
    "bookings": {
      "total": 100,
      "pending": 10,
      "confirmed": 50,
      "completed": 35
    },
    "revenue": {
      "total": 50000,
      "pending": 5000
    }
  }
}
```

### Get System Settings

```http
GET /admin/system/settings
Authorization: Bearer <token>
```

### Update System Settings

```http
PUT /admin/system/settings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "siteName": "Smart Stay",
  "currency": "USD",
  "timezone": "UTC",
  "maintenanceMode": false,
  "allowRegistration": true
}
```

### Download System Backup

```http
GET /admin/system/backup
Authorization: Bearer <token>
```

### Get Financial Overview

```http
GET /admin/financial
Authorization: Bearer <token>
```

### Generate Report

```http
POST /admin/reports/generate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reportType": "bookings",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**Report Types:**
- `bookings`
- `revenue`
- `users`
- `units`

### Get Activity Logs

```http
GET /admin/reports/logs
Authorization: Bearer <token>
```

---

## Public Endpoints

### Get All Units

```http
GET /units
```

**Query Parameters:**
- `search`: Search term
- `type`: Unit type filter
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `guests`: Number of guests

### Get Unit Details

```http
GET /units/:id
```

---

## Chatbot Endpoints

### Send Message

```http
POST /chatbot/message
```

**Request Body:**
```json
{
  "message": "How do I book a unit?",
  "userId": "3"
}
```

**Response:**
```json
{
  "success": true,
  "response": "To book a unit, browse available properties...",
  "suggestions": ["More questions", "Book now", "Contact support"]
}
```

### Get FAQs

```http
GET /chatbot/faqs
```

### Save Conversation

```http
POST /chatbot/conversation
Authorization: Bearer <token>
```

### Get User Conversations

```http
GET /chatbot/conversations/:userId
Authorization: Bearer <token>
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production.

---

## File Uploads

File upload endpoints accept `multipart/form-data` with the following limits:
- Max file size: 10MB
- Accepted formats: Images (jpg, png, gif, webp)

---

## Pagination

Endpoints that return lists support pagination (where implemented):

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

---

## Notes

- All dates are in ISO 8601 format
- All prices are in USD
- Tokens expire after 24 hours
- File uploads are stored in `backend/uploads/`
- Data is currently stored in JSON files

---

For more information, see the main README.md file.
