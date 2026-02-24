const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get system-wide financial data
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    // Total revenue
    const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Revenue by host
    const hosts = users.filter(u => u.role === 'host');
    const revenueByHost = hosts.map(host => {
      const hostBookings = bookings.filter(b => b.hostId === host.id && b.paymentStatus === 'paid');
      const revenue = hostBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      return {
        hostId: host.id,
        hostName: `${host.firstName} ${host.lastName}`,
        revenue,
        bookings: hostBookings.length
      };
    });
    
    // Monthly revenue
    const monthlyRevenue = {};
    bookings.filter(b => b.paymentStatus === 'paid').forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + booking.totalPrice;
    });
    
    // Security deposits
    const totalDeposits = bookings.reduce((sum, b) => sum + (b.securityDeposit || 0), 0);
    const depositsReturned = bookings.filter(b => b.depositReturned).reduce((sum, b) => sum + (b.securityDeposit || 0), 0);
    const depositsHeld = totalDeposits - depositsReturned;
    
    // Transactions
    const transactions = bookings.filter(b => b.paymentStatus === 'paid').map(booking => {
      const unit = units.find(u => u.id === booking.unitId);
      const host = users.find(u => u.id === booking.hostId);
      const guest = users.find(u => u.id === booking.guestId);
      
      return {
        bookingId: booking.id,
        date: booking.createdAt,
        amount: booking.totalPrice,
        hostName: host ? `${host.firstName} ${host.lastName}` : 'Unknown',
        guestName: guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown',
        unitName: unit ? unit.name : 'Unknown'
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      success: true,
      financial: {
        totalRevenue,
        revenueByHost,
        monthlyRevenue,
        deposits: {
          total: totalDeposits,
          returned: depositsReturned,
          held: depositsHeld
        },
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
