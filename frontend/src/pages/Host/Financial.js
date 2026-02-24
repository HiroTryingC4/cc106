import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

const Financial = ({ isTab = false }) => {
  const { addToast } = useToast();
  const [financial, setFinancial] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [profitAnalysis, setProfitAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // summary, profit-analysis

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [summaryRes, depositsRes, profitRes] = await Promise.all([
        fetch('http://localhost:5000/api/host/financial/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/financial/deposits', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/financial/profit-analysis', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [summaryData, depositsData, profitData] = await Promise.all([
        summaryRes.json(),
        depositsRes.json(),
        profitRes.json()
      ]);

      if (summaryData.success) setFinancial(summaryData.financial);
      if (depositsData.success) setDeposits(depositsData.deposits);
      if (profitData.success) setProfitAnalysis(profitData.profitAnalysis);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
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
        addToast('Report exported successfully', 'success');
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast('Report exported successfully', 'success');
      }
    } catch (error) {
      addToast('Error exporting report', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const content = (
    <>
      {!isTab && (
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600 mt-2">Track your revenue, expenses, and profits</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExport('csv')}
              disabled={exporting}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExport('json')}
              disabled={exporting}
            >
              Export JSON
            </Button>
          </div>
        </div>
      )}

      {isTab && (
        <div className="mb-4 flex justify-end">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExport('csv')}
              disabled={exporting}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExport('json')}
              disabled={exporting}
            >
              Export JSON
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'summary'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Financial Summary
          </button>
          <button
            onClick={() => setActiveTab('profit-analysis')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'profit-analysis'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Profit Analysis
          </button>
        </div>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Kinita (Revenue)</h3>
              <p className="text-3xl font-bold text-green-600">₱{financial?.kinita.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Total earnings</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Gastos (Expenses)</h3>
              <p className="text-3xl font-bold text-red-600">₱{financial?.gastos.total.toFixed(0) || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Actual costs</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Salaries</h3>
              <p className="text-3xl font-bold text-orange-600">₱{financial?.salaries?.total.toFixed(0) || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Staff payments</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Net Profit</h3>
              <p className="text-3xl font-bold text-blue-600">₱{financial?.netProfit.total.toFixed(0) || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{financial?.netProfit.percentage}% margin</p>
            </Card>
          </div>

      {/* Revenue vs Expenses Chart */}
      {financial?.kinita.monthly && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses (Monthly)</h2>
          <div className="space-y-3">
            {Object.keys(financial.kinita.monthly).reverse().slice(0, 6).map(month => (
              <div key={month}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{month}</span>
                  <div className="flex gap-4">
                    <span className="text-green-600">Revenue: ₱{financial.kinita.monthly[month]}</span>
                    <span className="text-red-600">Expenses: ₱{financial.gastos.monthly[month]?.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-green-500 h-6 rounded-full"
                      style={{ width: `${Math.min((financial.kinita.monthly[month] / 2000) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-red-500 h-6 rounded-full"
                      style={{ width: `${Math.min((financial.gastos.monthly[month] / 2000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security Deposits */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Security Deposits</h2>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">Total: ${financial?.deposits.total || 0}</span>
            <span className="text-green-600">Returned: ${financial?.deposits.returned || 0}</span>
            <span className="text-yellow-600">Held: ${financial?.deposits.held || 0}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Booking ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Guest</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Check-out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deposits.map(deposit => (
                <tr key={deposit.bookingId}>
                  <td className="px-4 py-3 text-sm">#{deposit.bookingId}</td>
                  <td className="px-4 py-3 text-sm">{deposit.unitName}</td>
                  <td className="px-4 py-3 text-sm">{deposit.guestName}</td>
                  <td className="px-4 py-3 text-sm font-medium">${deposit.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deposit.status === 'returned' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(deposit.checkOut).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
        </>
      )}

      {/* Profit Analysis Tab */}
      {activeTab === 'profit-analysis' && profitAnalysis && (
        <>
          {/* Net Profit Breakdown */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Net Profit Computation</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Revenue (Income)</span>
                <span className="text-2xl font-bold text-green-600">
                  ₱{profitAnalysis.netProfit.breakdown.revenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t">
                <span className="text-gray-700">Less: Expenses</span>
                <span className="text-2xl font-bold text-red-600">
                  -₱{profitAnalysis.netProfit.breakdown.expenses.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Less: Salaries</span>
                <span className="text-2xl font-bold text-orange-600">
                  -₱{profitAnalysis.netProfit.breakdown.salaries.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                <span className="text-lg font-semibold">Net Profit</span>
                <span className={`text-3xl font-bold ${
                  profitAnalysis.netProfit.total >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  ₱{profitAnalysis.netProfit.total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Profit Margins */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Gross Profit Margin</h3>
              <p className="text-3xl font-bold text-green-600">{profitAnalysis.profitMargins.gross}%</p>
              <p className="text-xs text-gray-500 mt-1">Before salaries</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Operating Profit Margin</h3>
              <p className="text-3xl font-bold text-blue-600">{profitAnalysis.profitMargins.operating}%</p>
              <p className="text-xs text-gray-500 mt-1">After all costs</p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-2">Net Profit Margin</h3>
              <p className="text-3xl font-bold text-purple-600">{profitAnalysis.profitMargins.net}%</p>
              <p className="text-xs text-gray-500 mt-1">Final margin</p>
            </Card>
          </div>

          {/* ROI Analysis */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">ROI (Return on Investment)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-gray-700">
                  ₱{profitAnalysis.roi.investment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current ROI</p>
                <p className={`text-2xl font-bold ${
                  profitAnalysis.roi.total >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {profitAnalysis.roi.total}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Annual ROI (Projected)</p>
                <p className={`text-2xl font-bold ${
                  profitAnalysis.roi.annual >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {profitAnalysis.roi.annual}%
                </p>
              </div>
            </div>
          </Card>

          {/* Break-even Analysis */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Break-even Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Break-even Point</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {profitAnalysis.breakEven.units} bookings
                  </p>
                  <p className="text-sm text-gray-500">
                    ₱{profitAnalysis.breakEven.revenue.toFixed(2)} revenue needed
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Bookings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {profitAnalysis.breakEven.currentBookings} bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className={`text-center p-6 rounded-lg ${
                  profitAnalysis.breakEven.isAboveBreakEven 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <p className={`text-3xl font-bold ${
                    profitAnalysis.breakEven.isAboveBreakEven 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {profitAnalysis.breakEven.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {profitAnalysis.breakEven.isAboveBreakEven 
                      ? '✓ Above break-even point' 
                      : '✗ Below break-even point'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profitability Trends */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Profitability Trends (Last 6 Months)</h2>
            <div className="space-y-4">
              {profitAnalysis.trends.map(trend => (
                <div key={trend.month}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{trend.month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600">Revenue: ₱{trend.revenue.toFixed(0)}</span>
                      <span className="text-red-600">Expenses: ₱{trend.expenses.toFixed(0)}</span>
                      <span className="text-orange-600">Salaries: ₱{trend.salaries.toFixed(0)}</span>
                      <span className={`font-semibold ${
                        trend.profit >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        Profit: ₱{trend.profit.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-green-500"
                      style={{ width: `${Math.min((trend.revenue / 10000) * 100, 100)}%` }}
                    />
                    <div
                      className="absolute h-full bg-red-500 opacity-50"
                      style={{ width: `${Math.min((trend.expenses / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Monthly/Yearly Comparisons */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Comparative Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Month-over-Month</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Month:</span>
                    <span className="font-semibold">
                      ₱{profitAnalysis.comparisons.monthOverMonth.current.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous Month:</span>
                    <span className="font-semibold">
                      ₱{profitAnalysis.comparisons.monthOverMonth.previous.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Change:</span>
                    <span className={`font-bold ${
                      profitAnalysis.comparisons.monthOverMonth.change >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {profitAnalysis.comparisons.monthOverMonth.change >= 0 ? '+' : ''}
                      {profitAnalysis.comparisons.monthOverMonth.change}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Year-over-Year</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Year:</span>
                    <span className="font-semibold">
                      ₱{profitAnalysis.comparisons.yearOverYear.current.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth:</span>
                    <span className={`font-bold ${
                      profitAnalysis.comparisons.yearOverYear.change >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {profitAnalysis.comparisons.yearOverYear.change >= 0 ? '+' : ''}
                      {profitAnalysis.comparisons.yearOverYear.change}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );

  return isTab ? content : <DashboardLayout>{content}</DashboardLayout>;
};

export default Financial;
