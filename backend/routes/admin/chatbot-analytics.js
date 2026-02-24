const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get analytics summary
router.get('/analytics', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const analyticsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/chatbot_analytics.json'), 'utf8')
    );
    const logsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/chatbot_logs.json'), 'utf8')
    );

    // Get top 5 FAQs
    const topFAQs = Object.entries(analyticsData.faqUsage)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }));

    // Get recent conversations (last 10)
    const recentConversations = logsData.logs
      .slice(-10)
      .reverse()
      .map(log => ({
        id: log.conversationId,
        timestamp: log.timestamp,
        userRole: log.userRole,
        messageCount: logsData.logs.filter(l => l.conversationId === log.conversationId).length
      }))
      .filter((conv, index, self) => 
        index === self.findIndex(c => c.id === conv.id)
      );

    res.json({
      success: true,
      analytics: {
        ...analyticsData.summary,
        topFAQs,
        fallbackTriggers: analyticsData.fallbackTriggers.slice(0, 5),
        recentConversations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get conversation logs
router.get('/logs', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { startDate, endDate, limit = 50, page = 1 } = req.query;
    const logsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/chatbot_logs.json'), 'utf8')
    );

    let filteredLogs = logsData.logs;

    // Filter by date range
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(endDate)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    res.json({
      success: true,
      logs: paginatedLogs,
      total: filteredLogs.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredLogs.length / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get detailed statistics
router.get('/stats', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const analyticsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/chatbot_analytics.json'), 'utf8')
    );

    // Calculate additional stats
    const totalFAQAccess = Object.values(analyticsData.faqUsage)
      .reduce((sum, faq) => sum + faq.count, 0);
    
    const totalFallbacks = analyticsData.fallbackTriggers
      .reduce((sum, trigger) => sum + trigger.count, 0);

    const successRate = totalFAQAccess / (totalFAQAccess + totalFallbacks) * 100;

    res.json({
      success: true,
      stats: {
        faqUsage: analyticsData.faqUsage,
        fallbackTriggers: analyticsData.fallbackTriggers,
        dailyTrends: analyticsData.dailyStats,
        performance: {
          totalFAQAccess,
          totalFallbacks,
          successRate: successRate.toFixed(2),
          avgResponseTime: analyticsData.summary.avgResponseTime
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Track chatbot interaction (for future integration)
router.post('/track', verifyToken, (req, res) => {
  try {
    const { conversationId, userId, userRole, messageType, message, faqId, responseTime, isFallback } = req.body;
    
    const logsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/chatbot_logs.json'), 'utf8')
    );

    const newLog = {
      id: `log_${Date.now()}`,
      conversationId,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      messageType,
      message,
      faqId: faqId || null,
      responseTime: responseTime || 0,
      isFallback: isFallback || false
    };

    logsData.logs.push(newLog);

    // Keep only last 1000 logs
    if (logsData.logs.length > 1000) {
      logsData.logs = logsData.logs.slice(-1000);
    }

    fs.writeFileSync(
      path.join(__dirname, '../../data/chatbot_logs.json'),
      JSON.stringify(logsData, null, 2)
    );

    res.json({ success: true, message: 'Interaction tracked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
