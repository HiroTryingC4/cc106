import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import { useToast } from '../../components/Toast';

const ChatbotAnalytics = () => {
  const { addToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchStats();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/chatbot/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      addToast('Error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/chatbot/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const formatTime = (ms) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chatbot Analytics & Monitoring</h1>
        <p className="text-gray-600 mt-2">Track chatbot performance and user interactions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-blue-600">{analytics?.totalConversations || 0}</div>
          <div className="text-sm text-gray-600 mt-2">Total Conversations</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-green-600">{analytics?.totalMessages || 0}</div>
          <div className="text-sm text-gray-600 mt-2">Total Messages</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-purple-600">{analytics?.totalUsers || 0}</div>
          <div className="text-sm text-gray-600 mt-2">Active Users</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-orange-600">
            {formatTime(analytics?.avgResponseTime || 0)}
          </div>
          <div className="text-sm text-gray-600 mt-2">Avg Response Time</div>
        </Card>
      </div>

      {/* Performance Overview */}
      {stats?.performance && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{stats.performance.totalFAQAccess}</div>
              <div className="text-sm text-gray-600">Successful Responses</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{stats.performance.totalFallbacks}</div>
              <div className="text-sm text-gray-600">Fallback Triggers</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{stats.performance.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </Card>
      )}

      {/* Top FAQs */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Top 5 Most Asked Questions</h2>
        <div className="space-y-3">
          {analytics?.topFAQs?.map((faq, index) => (
            <div key={faq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{faq.question}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{faq.count}</div>
                <div className="text-xs text-gray-500">times asked</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Unanswered Questions */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Unanswered Questions (Fallback Triggers)
          <span className="ml-2 text-sm font-normal text-gray-500">
            - Add these to FAQs to improve chatbot
          </span>
        </h2>
        <div className="space-y-2">
          {analytics?.fallbackTriggers?.length > 0 ? (
            analytics.fallbackTriggers.map((trigger, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <span className="text-gray-900">"{trigger.query}"</span>
                </div>
                <span className="text-sm font-medium text-yellow-700">{trigger.count} times</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No unanswered questions - Great job! 🎉
            </div>
          )}
        </div>
      </Card>

      {/* Activity Trends */}
      {stats?.dailyTrends && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Activity Trends (Last 7 Days)</h2>
          <div className="space-y-2">
            {stats.dailyTrends.map((day, index) => {
              const maxConversations = Math.max(...stats.dailyTrends.map(d => d.conversations));
              const barWidth = (day.conversations / maxConversations) * 100;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600">{formatDate(day.date)}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className="text-white text-sm font-medium">{day.conversations}</span>
                    </div>
                  </div>
                  <div className="w-24 text-sm text-gray-600">{day.messages} msgs</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Conversations */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics?.recentConversations?.map((conv, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(conv.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      conv.userRole === 'guest' ? 'bg-blue-100 text-blue-800' :
                      conv.userRole === 'host' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conv.userRole}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{conv.messageCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{conv.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ChatbotAnalytics;
