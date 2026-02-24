import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

const Reports = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('property'); // property, bookings, financial, performance
  const [propertyReports, setPropertyReports] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [financialPeriod, setFinancialPeriod] = useState('monthly');

  useEffect(() => {
    fetchData();
  }, [financialPeriod]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [propertyRes, financialRes, performanceRes] = await Promise.all([
        fetch('http://localhost:5000/api/host/reports/property-report', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/host/reports/financial-summary?period=${financialPeriod}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/reports/performance-metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [propertyData, financialData, performanceData] = await Promise.all([
        propertyRes.json(),
        financialRes.json(),
        performanceRes.json()
      ]);

      if (propertyData.success) setPropertyReports(propertyData.propertyReports);
      if (financialData.success) setFinancialSummary(financialData);
      if (performanceData.success) setPerformanceMetrics(performanceData.metrics);
    } catch (error) {
      console.error('Error fetching reports:', error);
      addToast('Error loading reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBookings = async (format) => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/reports/export-bookings?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (format === 'csv' || format === 'excel') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-export.${format === 'excel' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast('Bookings exported successfully', 'success');
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings-export.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast('Bookings exported successfully', 'success');
      }
    } catch (error) {
      addToast('Error exporting bookings', 'error');
    } finally {
      setExporting(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Host Reports</h1>
        <p className="text-gray-600 mt-2">Generate and export comprehensive reports</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('property')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'property'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Property Reports
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'bookings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Export Bookings
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'financial'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Financial Summaries
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'performance'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Performance Metrics
          </button>
        </div>
      </div>

      {/* Property Reports Tab */}
      {activeTab === 'property' && (
        <div className="space-y-6">
          {propertyReports.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">No properties to report on</p>
            </Card>
          ) : (
            propertyReports.map(report => (
              <Card key={report.unitId}>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{report.unitName}</h2>
                  <p className="text-gray-600">{report.unitType} • {report.location}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-1">
                    ₱{report.pricePerNight}/night
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">{report.bookings.total}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₱{report.revenue.total.toFixed(0)}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-yellow-600">{report.occupancy.rate}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {report.rating.average} ⭐
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Booking Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confirmed:</span>
                        <span className="font-semibold">{report.bookings.confirmed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-semibold">{report.bookings.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cancelled:</span>
                        <span className="font-semibold text-red-600">{report.bookings.cancelled}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Revenue/Booking:</span>
                        <span className="font-semibold">₱{report.revenue.average.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booked Days:</span>
                        <span className="font-semibold">{report.occupancy.bookedDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Reviews:</span>
                        <span className="font-semibold">{report.rating.totalReviews}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Export Bookings Tab */}
      {activeTab === 'bookings' && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Export Booking Data</h2>
          <p className="text-gray-600 mb-6">
            Download your booking data in various formats for analysis or record keeping.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleExportBookings('csv')}
              disabled={exporting}
              className="w-full"
            >
              📄 Export as CSV
            </Button>
            <Button
              onClick={() => handleExportBookings('excel')}
              disabled={exporting}
              variant="secondary"
              className="w-full"
            >
              📊 Export as Excel
            </Button>
            <Button
              onClick={() => handleExportBookings('json')}
              disabled={exporting}
              variant="secondary"
              className="w-full"
            >
              📋 Export as JSON
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Export includes:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Booking ID and dates</li>
              <li>Unit and guest information</li>
              <li>Pricing and payment status</li>
              <li>Booking status and timestamps</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Financial Summaries Tab */}
      {activeTab === 'financial' && financialSummary && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={financialPeriod === 'monthly' ? 'primary' : 'secondary'}
                onClick={() => setFinancialPeriod('monthly')}
              >
                Monthly
              </Button>
              <Button
                size="sm"
                variant={financialPeriod === 'quarterly' ? 'primary' : 'secondary'}
                onClick={() => setFinancialPeriod('quarterly')}
              >
                Quarterly
              </Button>
              <Button
                size="sm"
                variant={financialPeriod === 'yearly' ? 'primary' : 'secondary'}
                onClick={() => setFinancialPeriod('yearly')}
              >
                Yearly
              </Button>
            </div>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-4">
              Financial Summary ({financialSummary.period})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Period</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Expenses</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Salaries</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {financialSummary.data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{item.period}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        ₱{item.revenue.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        ₱{item.expenses.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-orange-600">
                        ₱{item.salaries.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-semibold ${
                        item.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        ₱{item.netProfit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Performance Metrics Tab */}
      {activeTab === 'performance' && performanceMetrics && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">
                ₱{performanceMetrics.revenue.total.toFixed(0)}
              </p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-1">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-600">
                {performanceMetrics.bookings.total}
              </p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-1">Avg Occupancy</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {performanceMetrics.occupancy.averageRate}%
              </p>
            </Card>
            <Card>
              <h3 className="text-sm text-gray-600 mb-1">Avg Rating</h3>
              <p className="text-2xl font-bold text-purple-600">
                {performanceMetrics.rating.average} ⭐
              </p>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Booking Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings:</span>
                  <span className="font-semibold">{performanceMetrics.bookings.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed:</span>
                  <span className="font-semibold text-green-600">
                    {performanceMetrics.bookings.confirmed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-blue-600">
                    {performanceMetrics.bookings.completed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled:</span>
                  <span className="font-semibold text-red-600">
                    {performanceMetrics.bookings.cancelled}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-bold text-blue-600">
                    {performanceMetrics.bookings.conversionRate}%
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Financial Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-green-600">
                    ₱{performanceMetrics.financial.revenue.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expenses:</span>
                  <span className="font-semibold text-red-600">
                    ₱{performanceMetrics.financial.expenses.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salaries:</span>
                  <span className="font-semibold text-orange-600">
                    ₱{performanceMetrics.financial.salaries.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Net Profit:</span>
                  <span className={`font-bold ${
                    performanceMetrics.financial.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    ₱{performanceMetrics.financial.netProfit.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit Margin:</span>
                  <span className="font-bold text-purple-600">
                    {performanceMetrics.financial.profitMargin}%
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Occupancy Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rate:</span>
                  <span className="font-semibold">{performanceMetrics.occupancy.averageRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booked Days:</span>
                  <span className="font-semibold">{performanceMetrics.occupancy.bookedDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Days:</span>
                  <span className="font-semibold">{performanceMetrics.occupancy.availableDays}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Other Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Properties:</span>
                  <span className="font-semibold">{performanceMetrics.totalProperties}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-semibold">{performanceMetrics.rating.average} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reviews:</span>
                  <span className="font-semibold">{performanceMetrics.rating.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time:</span>
                  <span className="font-semibold">{performanceMetrics.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Revenue/Booking:</span>
                  <span className="font-semibold text-green-600">
                    ₱{performanceMetrics.revenue.averagePerBooking.toFixed(0)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
