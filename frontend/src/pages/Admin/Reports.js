import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Chart from '../../components/Chart';
import { useToast } from '../../components/Toast';

const Reports = () => {
  const { addToast } = useToast();
  const [reportType, setReportType] = useState('bookings');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportType, startDate, endDate })
      });

      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
        addToast('Report generated successfully', 'success');
      } else {
        addToast(data.message || 'Failed to generate report', 'error');
      }
    } catch (error) {
      addToast('Error generating report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportType, format, startDate, endDate })
      });

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast('Report exported as CSV', 'success');
      } else if (format === 'json') {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast('Report exported as JSON', 'success');
      }
    } catch (error) {
      addToast('Error exporting report', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate custom reports</p>
      </div>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="bookings">Bookings Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="users">Users Report</option>
              <option value="units">Units Report</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleGenerateReport} disabled={generating}>
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button variant="secondary" onClick={() => handleExportReport('csv')}>
            📥 Export CSV
          </Button>
          <Button variant="secondary" onClick={() => handleExportReport('json')}>
            📥 Export JSON
          </Button>
        </div>
      </Card>

      {report && (
        <Card>
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Report Results</h2>
              <p className="text-sm text-gray-600">
                Generated on {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportReport('csv')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                📥 CSV
              </button>
              <button
                onClick={() => handleExportReport('json')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                📥 JSON
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {report.type === 'bookings' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">{report.data.totalBookings}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{report.data.byStatus.pending}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-green-600">{report.data.byStatus.confirmed}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">₱{report.data.revenue}</p>
                  </div>
                </div>
                <Chart
                  type="pie"
                  title="Bookings by Status"
                  data={[
                    { label: 'Pending', value: report.data.byStatus.pending },
                    { label: 'Confirmed', value: report.data.byStatus.confirmed },
                    { label: 'Completed', value: report.data.byStatus.completed },
                    { label: 'Cancelled', value: report.data.byStatus.cancelled }
                  ]}
                />
              </>
            )}

            {report.type === 'revenue' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₱{report.data.totalRevenue}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Revenue</p>
                  <p className="text-2xl font-bold text-yellow-600">₱{report.data.pendingRevenue}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Booking Value</p>
                  <p className="text-2xl font-bold text-blue-600">₱{report.data.averageBookingValue}</p>
                </div>
              </div>
            )}

            {report.type === 'users' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{report.data.totalUsers}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">{report.data.activeUsers}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Hosts</p>
                    <p className="text-2xl font-bold text-purple-600">{report.data.byRole.host}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="text-2xl font-bold text-yellow-600">{report.data.byRole.guest}</p>
                  </div>
                </div>
                <Chart
                  type="bar"
                  title="Users by Role"
                  data={[
                    { label: 'Admin', value: report.data.byRole.admin },
                    { label: 'Host', value: report.data.byRole.host },
                    { label: 'Guest', value: report.data.byRole.guest }
                  ]}
                />
              </>
            )}

            {report.type === 'units' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="text-2xl font-bold text-blue-600">{report.data.totalUnits}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Available Units</p>
                  <p className="text-2xl font-bold text-green-600">{report.data.availableUnits}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{report.data.averageRating} ⭐</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Reports;
