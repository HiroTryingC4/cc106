import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

const Payments = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedTransactions: 0,
    pendingDeposits: 0,
    avgTransactionPerBooking: 0
  });
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setPendingDeposits(data.pendingDeposits);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      addToast('Failed to load payments data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/bookings/${bookingId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        addToast('Booking approved successfully', 'success');
        fetchPaymentsData();
      } else {
        addToast(data.message || 'Failed to approve booking', 'error');
      }
    } catch (error) {
      addToast('Error approving booking', 'error');
    }
  };

  const handleDeclineDeposit = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        addToast('Booking declined', 'success');
        fetchPaymentsData();
      } else {
        addToast(data.message || 'Failed to decline booking', 'error');
      }
    } catch (error) {
      addToast('Error declining booking', 'error');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'paid') return t.paymentStatus === 'paid';
    if (filter === 'pending') return t.paymentStatus === 'pending';
    if (filter === 'booking') return t.type === 'booking';
    if (filter === 'deposit') return t.type === 'deposit';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'booking': return 'border-gray-300 text-gray-700';
      case 'deposit': return 'border-blue-300 text-blue-700';
      case 'refund': return 'border-red-300 text-red-700';
      default: return 'border-gray-300 text-gray-700';
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
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">Manage your payments and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">₱{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Completed Transactions</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.completedTransactions}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Pending</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingDeposits}</p>
              <p className="text-xs text-gray-500">Requires Action</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Avg Transaction</h3>
              <p className="text-2xl font-bold text-purple-600">₱{stats.avgTransactionPerBooking.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Per Booking</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Deposits Section */}
      {pendingDeposits.length > 0 && (
        <div className="mb-8">
          <div className="bg-orange-50 border-2 border-blue-400 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⏳</span>
              <h2 className="text-lg font-bold text-gray-900">Pending Deposits ({pendingDeposits.length})</h2>
            </div>
            <div className="space-y-3">
              {pendingDeposits.map(deposit => (
                <div key={deposit.bookingId} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base">{deposit.guestName}</p>
                      <p className="text-sm text-gray-600 mt-1">{deposit.unitName} • ${deposit.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeclineDeposit(deposit.bookingId)}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleApproveDeposit(deposit.bookingId)}
                        className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
                        style={{ backgroundColor: '#4E7B22' }}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Transactions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
              style={filter === 'all' ? { backgroundColor: '#4E7B22', color: 'white' } : {}}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === 'paid' ? 'primary' : 'secondary'}
              onClick={() => setFilter('paid')}
              style={filter === 'paid' ? { backgroundColor: '#4E7B22', color: 'white' } : {}}
            >
              Paid
            </Button>
            <Button
              size="sm"
              variant={filter === 'pending' ? 'primary' : 'secondary'}
              onClick={() => setFilter('pending')}
              style={filter === 'pending' ? { backgroundColor: '#4E7B22', color: 'white' } : {}}
            >
              Pending
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Booking</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{transaction.paymentId}</td>
                      <td className="py-3 px-4 text-sm">#{transaction.bookingId}</td>
                      <td className="py-3 px-4 text-sm">{transaction.guestName}</td>
                      <td className="py-3 px-4 text-sm">{transaction.unitName}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.type)} bg-white`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        ₱{transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
