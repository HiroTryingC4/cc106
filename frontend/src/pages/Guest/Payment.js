import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchBookingAndQR();
  }, [bookingId]);

  const fetchBookingAndQR = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const bookingResponse = await fetch(`http://localhost:5000/api/guest/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookingData = await bookingResponse.json();
      
      if (bookingData.success) {
        setBooking(bookingData.booking);
        
        const qrResponse = await fetch(`http://localhost:5000/api/guest/payments/${bookingId}/qr`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const qrData = await qrResponse.json();
        
        if (qrData.success) {
          setQrData(qrData.qrData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/guest/payments/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        addToast('Payment confirmed successfully!', 'success');
        navigate(`/guest/bookings/${bookingId}`);
      } else {
        addToast(data.message || 'Failed to confirm payment', 'error');
      }
    } catch (error) {
      addToast('Error confirming payment', 'error');
    } finally {
      setConfirming(false);
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

  if (!booking) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Booking not found</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
        <p className="text-gray-600 mt-2">Complete your booking payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-semibold">#{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Price</span>
              <span className="font-semibold">₱{booking.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Deposit</span>
              <span className="font-semibold">₱{booking.securityDeposit}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-2xl text-blue-600">
                ₱{booking.totalPrice + booking.securityDeposit}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Scan the QR code with your mobile banking app</li>
              <li>Enter the exact amount shown above</li>
              <li>Complete the payment in your banking app</li>
              <li>Click "Confirm Payment" below after completing the transfer</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your booking will be confirmed once the payment is verified. 
              The security deposit will be refunded after checkout if there are no damages.
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4 text-center">Scan to Pay</h3>
          
          {qrData && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4">
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-sm text-gray-600">QR Code</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Amount: ₱{qrData.amount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="text-center text-sm text-gray-600">
                  <p>Account: {qrData.accountName}</p>
                  <p>Reference: {qrData.reference}</p>
                </div>

                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirming || booking.paymentStatus === 'paid'}
                  className="w-full"
                >
                  {confirming ? 'Confirming...' : booking.paymentStatus === 'paid' ? 'Payment Confirmed' : 'Confirm Payment'}
                </Button>

                {booking.paymentStatus === 'paid' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-semibold">✓ Payment Confirmed</p>
                    <p className="text-sm text-green-600 mt-1">Your booking is now confirmed!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
