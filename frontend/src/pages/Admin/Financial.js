import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';

const Financial = () => {
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/financial', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFinancial(data.financial);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-600 mt-2">System-wide financial data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₱{financial?.totalRevenue || 0}</p>
          <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Security Deposits Held</h3>
          <p className="text-3xl font-bold text-yellow-600">₱{financial?.deposits.held || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Currently held</p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-600 mb-2">Deposits Returned</h3>
          <p className="text-3xl font-bold text-blue-600">₱{financial?.deposits.returned || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Total returned</p>
        </Card>
      </div>

      {/* Revenue by Host */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Revenue by Host</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Host</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Bookings</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {financial?.revenueByHost.map(host => (
                <tr key={host.hostId}>
                  <td className="px-4 py-3 text-sm">{host.hostName}</td>
                  <td className="px-4 py-3 text-sm">{host.bookings}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">₱{host.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Revenue */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <div className="space-y-3">
          {financial?.monthlyRevenue && Object.keys(financial.monthlyRevenue).reverse().slice(0, 6).map(month => (
            <div key={month}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{month}</span>
                <span className="text-green-600 font-medium">₱{financial.monthlyRevenue[month]}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${Math.min((financial.monthlyRevenue[month] / 3000) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Booking ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Host</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Guest</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {financial?.transactions.slice(0, 10).map(transaction => (
                <tr key={transaction.bookingId}>
                  <td className="px-4 py-3 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">#{transaction.bookingId}</td>
                  <td className="px-4 py-3 text-sm">{transaction.hostName}</td>
                  <td className="px-4 py-3 text-sm">{transaction.guestName}</td>
                  <td className="px-4 py-3 text-sm">{transaction.unitName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">₱{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Financial;
