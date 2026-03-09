import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

// Import the existing pages as components
import Expenses from './Expenses';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    profitMargin: 0
  });
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchFinancialData();
    }
  }, [activeTab]);

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch financial summary
      const summaryResponse = await fetch('http://localhost:5000/api/host/financial/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const summaryData = await summaryResponse.json();
      
      // Fetch deposits
      const depositsResponse = await fetch('http://localhost:5000/api/host/deposits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const depositsData = await depositsResponse.json();
      
      if (summaryData.success) {
        const { kinita, gastos, netProfit } = summaryData.financial;
        setFinancialData({
          revenue: kinita.total,
          expenses: gastos.total,
          netProfit: netProfit.total,
          profitMargin: netProfit.percentage
        });
      }
      
      if (depositsData.success) {
        // Filter only held deposits
        const heldDeposits = depositsData.deposits
          .filter(d => !d.depositReturned && (d.status === 'confirmed' || d.status === 'completed'))
          .slice(0, 3); // Show only first 3
        setDeposits(heldDeposits);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/financial/export?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const jsonStr = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const renderFinancialOverview = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }

    const revenuePercentage = financialData.revenue > 0 
      ? (financialData.revenue / (financialData.revenue + financialData.expenses)) * 100 
      : 0;
    const expensesPercentage = 100 - revenuePercentage;

    return (
      <div>
        {/* Export Buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => exportData('csv')}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => exportData('json')}
          >
            Export JSON
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-gray-600 text-sm mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">₱{financialData.revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total earnings</p>
          </Card>

          <Card>
            <h3 className="text-gray-600 text-sm mb-2">Expenses</h3>
            <p className="text-3xl font-bold text-red-600">₱{financialData.expenses.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Actual costs</p>
          </Card>

          <Card>
            <h3 className="text-gray-600 text-sm mb-2">Net Profit</h3>
            <p className="text-3xl font-bold text-blue-600">₱{financialData.netProfit.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{financialData.profitMargin}% Margin</p>
          </Card>
        </div>

        {/* Revenue vs Expenses Bar Chart */}
        <Card className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue vs. Expenses (Monthly)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-green-600 font-medium">Revenue ₱{financialData.revenue.toLocaleString()}</span>
              <span className="text-red-600 font-medium">Expenses ₱{financialData.expenses.toLocaleString()}</span>
            </div>
            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
              <div 
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${revenuePercentage}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${expensesPercentage}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Security Deposits Table */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Security Deposits</h3>
            <div className="text-sm text-gray-600">
              <span className="mr-4">Total: <span className="font-semibold">₱{deposits.reduce((sum, d) => sum + (d.securityDeposit || 0), 0).toLocaleString()}</span></span>
              <span className="mr-4 text-green-600">Returned: ₱0</span>
              <span className="text-yellow-600">Held: ₱{deposits.reduce((sum, d) => sum + (d.securityDeposit || 0), 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-out</th>
                </tr>
              </thead>
              <tbody>
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No security deposits held
                    </td>
                  </tr>
                ) : (
                  deposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">#{deposit.id}</td>
                      <td className="py-3 px-4 text-sm">{deposit.unit?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{deposit.guest?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{deposit.securityDeposit?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Held
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {deposit.checkOut ? new Date(deposit.checkOut).toLocaleDateString('en-US', { 
                          month: 'numeric', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : deposit.bookingDate ? new Date(deposit.bookingDate).toLocaleDateString('en-US', { 
                          month: 'numeric', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="text-gray-600 mt-2">Comprehensive financial tracking and management</p>
      </div>

      {/* Main Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-6 font-medium transition ${
              activeTab === 'overview'
                ? 'border-b-2 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'overview' ? { borderBottomColor: '#ea580c' } : {}}
          >
            Financial Overview
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-3 px-6 font-medium transition ${
              activeTab === 'expenses'
                ? 'border-b-2 text-gray-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'expenses' ? { borderBottomColor: '#4b5563' } : {}}
          >
            Expense Tracking
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderFinancialOverview()}
        {activeTab === 'expenses' && <Expenses isTab={true} />}
      </div>
    </DashboardLayout>
  );
};

export default FinancialManagement;
