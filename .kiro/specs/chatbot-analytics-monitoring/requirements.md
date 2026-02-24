# Chatbot Analytics & Monitoring - Requirements

## Feature Overview
Implement analytics and monitoring for the existing Smart Stay chatbot system to track usage, performance, and effectiveness.

## User Stories

### As an Admin, I want to:
1. View chatbot usage statistics (total conversations, messages sent/received)
2. See which FAQs are most frequently accessed
3. Monitor chatbot response times and performance
4. Track user satisfaction with chatbot interactions
5. Identify common questions that aren't answered (fallback triggers)
6. View conversation history and logs
7. See chatbot activity trends over time (daily, weekly, monthly)
8. Monitor error rates and system health

## Acceptance Criteria

### 1. Chatbot Analytics Dashboard
- [ ] Display key metrics: total conversations, total messages, active users
- [ ] Show FAQ usage statistics (most/least accessed FAQs)
- [ ] Display fallback message triggers (unanswered questions)
- [ ] Show average response time
- [ ] Display user satisfaction ratings (if available)
- [ ] Show activity trends with charts (conversations over time)

### 2. Conversation Logs
- [ ] List all chatbot conversations with timestamps
- [ ] Show conversation details (user messages, bot responses)
- [ ] Filter by date range
- [ ] Search conversations by keywords
- [ ] Display user information (guest/host/anonymous)

### 3. Performance Metrics
- [ ] Track response times (average, min, max)
- [ ] Monitor system uptime/availability
- [ ] Count successful vs fallback responses
- [ ] Track FAQ hit rate vs miss rate

### 4. Analytics Reports
- [ ] Generate daily/weekly/monthly reports
- [ ] Export analytics data (CSV/JSON)
- [ ] Show top 10 most asked questions
- [ ] Identify improvement opportunities

## Technical Requirements

### Backend
- Create analytics tracking system for chatbot interactions
- Store conversation logs in `backend/data/chatbot_logs.json`
- Store analytics metrics in `backend/data/chatbot_analytics.json`
- Create API endpoints:
  - `GET /api/admin/chatbot/analytics` - Get analytics summary
  - `GET /api/admin/chatbot/logs` - Get conversation logs
  - `GET /api/admin/chatbot/stats` - Get detailed statistics
  - `POST /api/admin/chatbot/track` - Track chatbot interaction

### Frontend
- Create new page: `frontend/src/pages/Admin/ChatbotAnalytics.js`
- Add route to App.js: `/admin/chatbot-analytics`
- Add menu item to admin sidebar
- Display charts using simple CSS/HTML (no external chart libraries needed)
- Show metrics in cards with visual indicators

### Data Structure
```json
{
  "conversations": [
    {
      "id": "conv_1",
      "userId": "user_123",
      "userRole": "guest",
      "startTime": "2024-02-20T10:00:00Z",
      "endTime": "2024-02-20T10:05:00Z",
      "messageCount": 5,
      "faqsAccessed": ["1", "3"],
      "fallbackCount": 1,
      "resolved": true
    }
  ],
  "analytics": {
    "totalConversations": 150,
    "totalMessages": 750,
    "avgResponseTime": 1200,
    "faqUsage": {
      "1": 45,
      "2": 30,
      "3": 25
    },
    "fallbackTriggers": [
      "how to contact support",
      "refund status"
    ]
  }
}
```

## Out of Scope
- Real-time chat monitoring (live view)
- AI/ML recommendation engine
- Sentiment analysis
- Multi-language support
- Integration with external analytics platforms

## Success Metrics
- Admin can view chatbot usage statistics
- Admin can identify most/least used FAQs
- Admin can see unanswered questions to improve chatbot
- Admin can track chatbot performance over time
- System tracks all chatbot interactions without performance impact

## Dependencies
- Existing chatbot system (`frontend/src/components/ChatbotWidget.js`)
- Existing chatbot management (`frontend/src/pages/Admin/Chatbot.js`)
- Admin authentication and authorization

## Timeline Estimate
- Backend API: 2-3 hours
- Frontend Dashboard: 2-3 hours
- Testing & Integration: 1 hour
- Total: 5-7 hours
