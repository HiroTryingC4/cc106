# Chatbot Analytics & Monitoring - Design Document

## Architecture Overview

### System Components
1. **ChatbotWidget** - Track user interactions
2. **Analytics API** - Collect and aggregate data
3. **Analytics Dashboard** - Display metrics and insights
4. **Data Storage** - Store logs and metrics

## Data Flow

```
User Interaction → ChatbotWidget → Track Event → Backend API → Store in JSON
                                                                      ↓
Admin Dashboard ← Fetch Analytics ← Backend API ← Aggregate Data ← JSON Files
```

## Database Schema

### chatbot_logs.json
```json
{
  "logs": [
    {
      "id": "log_1",
      "conversationId": "conv_1",
      "timestamp": "2024-02-20T10:00:00Z",
      "userId": "user_123",
      "userRole": "guest",
      "messageType": "user|bot",
      "message": "How do I book a unit?",
      "faqId": "1",
      "responseTime": 1200,
      "isFallback": false
    }
  ]
}
```

### chatbot_analytics.json
```json
{
  "summary": {
    "totalConversations": 150,
    "totalMessages": 750,
    "totalUsers": 85,
    "avgResponseTime": 1200,
    "lastUpdated": "2024-02-20T10:00:00Z"
  },
  "faqUsage": {
    "1": { "count": 45, "question": "How do I book a unit?" },
    "2": { "count": 30, "question": "What payment methods?" }
  },
  "fallbackTriggers": [
    { "query": "how to contact support", "count": 5 },
    { "query": "refund status", "count": 3 }
  ],
  "dailyStats": [
    {
      "date": "2024-02-20",
      "conversations": 25,
      "messages": 120,
      "avgResponseTime": 1150
    }
  ]
}
```

## API Endpoints

### GET /api/admin/chatbot/analytics
**Purpose**: Get analytics summary
**Response**:
```json
{
  "success": true,
  "analytics": {
    "totalConversations": 150,
    "totalMessages": 750,
    "avgResponseTime": 1200,
    "topFAQs": [...],
    "recentActivity": [...]
  }
}
```

### GET /api/admin/chatbot/logs
**Purpose**: Get conversation logs
**Query Params**: `?startDate=2024-02-01&endDate=2024-02-20&limit=50`
**Response**:
```json
{
  "success": true,
  "logs": [...],
  "total": 150
}
```

### GET /api/admin/chatbot/stats
**Purpose**: Get detailed statistics
**Response**:
```json
{
  "success": true,
  "stats": {
    "faqUsage": {...},
    "fallbackTriggers": [...],
    "dailyTrends": [...]
  }
}
```

### POST /api/admin/chatbot/track
**Purpose**: Track chatbot interaction (called by ChatbotWidget)
**Body**:
```json
{
  "conversationId": "conv_1",
  "userId": "user_123",
  "userRole": "guest",
  "messageType": "user",
  "message": "How do I book?",
  "faqId": "1",
  "responseTime": 1200,
  "isFallback": false
}
```

## UI Design

### Analytics Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Chatbot Analytics & Monitoring                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │   150    │  │   750    │  │   85     │  │  1.2s   ││
│  │Conversa- │  │ Messages │  │  Users   │  │Avg Time ││
│  │  tions   │  │          │  │          │  │         ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│                                                          │
│  Top 5 Most Asked Questions                             │
│  ┌────────────────────────────────────────────────────┐│
│  │ 1. How do I book a unit?              45 times    │││
│  │ 2. What payment methods?              30 times    │││
│  │ 3. Cancellation policy?               25 times    │││
│  │ 4. How to check in?                   20 times    │││
│  │ 5. Security deposit info?             15 times    │││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  Unanswered Questions (Fallback Triggers)               │
│  ┌────────────────────────────────────────────────────┐│
│  │ • "how to contact support" - 5 times              │││
│  │ • "refund status" - 3 times                       │││
│  │ • "change booking date" - 2 times                 │││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  Activity Trends (Last 7 Days)                          │
│  ┌────────────────────────────────────────────────────┐│
│  │  [Simple bar chart showing daily conversations]   │││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  Recent Conversations                                    │
│  ┌────────────────────────────────────────────────────┐│
│  │ Feb 20, 10:30 AM | Guest User | 5 messages        │││
│  │ Feb 20, 09:15 AM | Host User  | 3 messages        │││
│  │ Feb 20, 08:45 AM | Guest User | 7 messages        │││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Backend Setup
1. Create `backend/data/chatbot_logs.json` with sample data
2. Create `backend/data/chatbot_analytics.json` with sample data
3. Create `backend/routes/admin/chatbot-analytics.js`
4. Add routes to `backend/routes/admin.js`
5. Implement analytics aggregation functions

### Phase 2: Frontend Dashboard
1. Create `frontend/src/pages/Admin/ChatbotAnalytics.js`
2. Add route to `frontend/src/App.js`
3. Add menu item to `frontend/src/components/Sidebar.js`
4. Implement metric cards
5. Implement FAQ usage display
6. Implement fallback triggers display
7. Implement activity trends (simple bar chart with CSS)
8. Implement conversation logs table

### Phase 3: Integration
1. Update ChatbotWidget to track interactions (optional for MVP)
2. Test all endpoints
3. Verify data display
4. Update documentation

## Visual Design

### Color Scheme
- Primary metrics: Blue (#3B82F6)
- Success indicators: Green (#10B981)
- Warning indicators: Yellow (#F59E0B)
- Error indicators: Red (#EF4444)

### Components
- Metric Cards: White background, shadow, rounded corners
- Charts: Simple CSS bars with gradient
- Tables: Striped rows, hover effects
- Badges: Colored pills for status indicators

## Performance Considerations
- Limit logs to last 1000 entries
- Aggregate analytics daily to reduce computation
- Use pagination for conversation logs (50 per page)
- Cache analytics summary for 5 minutes

## Security
- Admin authentication required for all endpoints
- No sensitive user data in logs (only user IDs)
- Rate limiting on tracking endpoint

## Testing Checklist
- [ ] Analytics summary displays correctly
- [ ] FAQ usage shows accurate counts
- [ ] Fallback triggers are tracked
- [ ] Conversation logs are paginated
- [ ] Date filtering works
- [ ] Export functionality works
- [ ] Mobile responsive design
- [ ] Admin-only access enforced

## Future Enhancements
- Real-time updates with WebSocket
- Advanced filtering and search
- Custom date range selection
- Email reports
- Integration with notification system
- User satisfaction ratings
