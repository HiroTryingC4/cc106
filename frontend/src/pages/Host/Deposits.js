import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const Deposits = () => {
  const { addToast } = useToast();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [returnModal, setReturnModal] = useState({ show: false, booking: null });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/deposits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnDeposit = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/deposits/${returnModal.booking.id}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        addToast('Deposit marked as returned', 'success');
        fetchDeposits();
      } else {
        addToast(data.message || 'Failed to return deposit', 'error');
      }
    } catch (error) {
      addToast('Error returning deposit', 'error');
    } finally {
      setProcessing(false);
      setReturnModal({ show: false, booking: null });
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    if (filter === 'held') return !deposit.depositReturned && deposit.status === 'completed';
    if (filter === 'pending') return !deposit.depositReturned && deposit.status === 'confirmed';
    if (filter === 'returned') return deposit.depositReturned;
    return true;
  });

  const totalHeld = deposits
    .filter(d => !d.depositReturned && (d.status === 'confirmed' || d.status === 'completed'))
    .reduce((sum, d) => sum + d.securityDeposit, 0);

  const totalPending = deposits
    .filter(d => !d.depositReturned && d.status === 'confirmed')
    .reduce((sum, d) => sum + d.securityDeposit, 0);

  const totalToReturn = deposits
    .filter(d => !d.depositReturned && d.status === 'completed')
    .reduce((sum, d) => sum + d.securityDeposit, 0);

  const totalReturned = deposits
    .filter(d => d.depositReturned)
    .reduce((sum, d) => sum + d.securityDeposit, 0);

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
        <h1 className="text-3xl font-bold text-gray-900">Security Deposits</h1>
        <p className="text-gray-600 mt-2">Track and manage guest security deposits</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Total Held</h3>
          <p className="text-3xl font-bold text-blue-600">₱{totalHeld}</p>
          <p className="text-xs text-gray-500 mt-1">All deposits in custody</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-green-600">₱{totalPending}</p>
          <p className="text-xs text-gray-500 mt-1">Ongoing stays</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">To Return</h3>
          <p className="text-3xl font-bold text-orange-600">₱{totalToReturn}</p>
          <p className="text-xs text-gray-500 mt-1">Completed bookings</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm mb-2">Returned</h3>
          <p className="text-3xl font-bold text-gray-700">₱{totalReturned}</p>
          <p className="text-xs text-gray-500 mt-1">Already refunded</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All Deposits
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'secondary'}
          onClick={() => setFilter('pending')}
        >
          Active Bookings
        </Button>
        <Button
          variant={filter === 'held' ? 'primary' : 'secondary'}
          onClick={() => setFilter('held')}
        >
          To Return
        </Button>
        <Button
          variant={filter === 'returned' ? 'primary' : 'secondary'}
          onClick={() => setFilter('returned')}
        >
          Returned
        </Button>
      </div>

      {/* Deposits List */}
      {filteredDeposits.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No deposits found</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDeposits.map(deposit => (
            <Card key={deposit.id}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">Booking #{deposit.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      deposit.depositReturned 
                        ? 'bg-gray-100 text-gray-800'
                        : deposit.status === 'completed'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {deposit.depositReturned ? 'Returned' : deposit.status === 'completed' ? 'To Return' : 'Held'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Unit</p>
                      <p className="font-medium">{deposit.unit?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Guest</p>
                      <p className="font-medium">{deposit.guest?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deposit Amount</p>
                      <p className="font-medium text-blue-600 text-lg">₱{deposit.securityDeposit}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Booking Status</p>
                      <p className="font-medium capitalize">{deposit.status}</p>
                    </div>
                    {deposit.pricingType === 'standard' ? (
                      <>
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-medium">{new Date(deposit.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Check-out</p>
                          <p className="font-medium">{new Date(deposit.checkOut).toLocaleDateString()}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-gray-600">Booking Date</p>
                          <p className="font-medium">{deposit.bookingDate ? new Date(deposit.bookingDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium">{deposit.hourlyOption?.hours} hours</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-gray-600">Guest Contact</p>
                      <p className="font-medium text-xs">{deposit.guest?.email || 'N/A'}</p>
                    </div>
                    {deposit.depositReturned && (
                      <div>
                        <p className="text-gray-600">Returned On</p>
                        <p className="font-medium text-xs">
                          {deposit.depositReturnedAt ? new Date(deposit.depositReturnedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Instructions */}
                  {!deposit.depositReturned && deposit.status === 'completed' && (
                    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-2">💰 Return Instructions</h4>
                      <div className="text-sm text-orange-800 space-y-1">
                        <p><strong>Amount to return:</strong> ₱{deposit.securityDeposit}</p>
                        <p><strong>Guest name:</strong> {deposit.guest?.name}</p>
                        <p><strong>Contact:</strong> {deposit.guest?.email}</p>
                        {deposit.guest?.phone && <p><strong>Phone:</strong> {deposit.guest?.phone}</p>}
                        <p className="mt-2 text-xs">
                          Please coordinate with the guest for the preferred refund method (bank transfer, cash, etc.)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2">
                  {!deposit.depositReturned && deposit.status === 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => setReturnModal({ show: true, booking: deposit })}
                    >
                      Mark as Returned
                    </Button>
                  )}
                  {deposit.depositReturned && (
                    <div className="text-center text-sm text-gray-500">
                      <svg className="w-12 h-12 mx-auto text-green-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Returned
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Return Confirmation Modal */}
      <Modal
        isOpen={returnModal.show}
        onClose={() => setReturnModal({ show: false, booking: null })}
        title="Confirm Deposit Return"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to mark the security deposit as returned for Booking #{returnModal.booking?.id}?
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Deposit Details</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Amount:</strong> ₱{returnModal.booking?.securityDeposit}</p>
              <p><strong>Guest:</strong> {returnModal.booking?.guest?.name}</p>
              <p><strong>Unit:</strong> {returnModal.booking?.unit?.name}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Make sure you have already transferred the deposit back to the guest before marking it as returned.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setReturnModal({ show: false, booking: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReturnDeposit}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Confirm Return'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Deposits;
