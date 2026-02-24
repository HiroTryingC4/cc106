const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get guest analytics
router.get('/guests', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    
    const uniqueGuests = [...new Set(hostBookings.map(b => b.guestId))];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyBookings = hostBookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    });
    
    const monthlyGuests = [...new Set(monthlyBookings.map(b => b.guestId))];
    
    // Calculate new vs returning guests
    const guestBookingCounts = {};
    hostBookings.forEach(b => {
      guestBookingCounts[b.guestId] = (guestBookingCounts[b.guestId] || 0) + 1;
    });
    
    const newGuests = Object.values(guestBookingCounts).filter(count => count === 1).length;
    const returningGuests = Object.values(guestBookingCounts).filter(count => count > 1).length;
    
    res.json({
      success: true,
      analytics: {
        totalGuests: uniqueGuests.length,
        monthlyGuests: monthlyGuests.length,
        newGuests,
        returningGuests,
        guestRetentionRate: uniqueGuests.length > 0 ? ((returningGuests / uniqueGuests.length) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get booking analytics
router.get('/bookings', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    
    // Bookings per unit
    const bookingsPerUnit = {};
    hostUnits.forEach(unit => {
      bookingsPerUnit[unit.name] = hostBookings.filter(b => b.unitId === unit.id).length;
    });
    
    // Monthly booking trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const monthNum = date.getMonth();
      
      const count = hostBookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === monthNum && bookingDate.getFullYear() === year;
      }).length;
      
      monthlyTrends.push({ month: `${month} ${year}`, bookings: count });
    }
    
    // Occupancy rate
    const confirmedBookings = hostBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const totalDays = hostUnits.length * 30; // Simplified: units * 30 days
    const bookedDays = confirmedBookings.reduce((sum, b) => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    
    const occupancyRate = totalDays > 0 ? ((bookedDays / totalDays) * 100).toFixed(1) : 0;
    
    res.json({
      success: true,
      analytics: {
        totalBookings: hostBookings.length,
        confirmedBookings: confirmedBookings.length,
        pendingBookings: hostBookings.filter(b => b.status === 'pending').length,
        completedBookings: hostBookings.filter(b => b.status === 'completed').length,
        bookingsPerUnit,
        monthlyTrends,
        occupancyRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const hostBookings = bookings.filter(b => b.hostId === req.user.id && b.paymentStatus === 'paid');
    
    const totalRevenue = hostBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Monthly revenue (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const monthNum = date.getMonth();
      
      const revenue = hostBookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate.getMonth() === monthNum && bookingDate.getFullYear() === year;
        })
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      monthlyRevenue.push({ month: `${month} ${year}`, revenue });
    }
    
    // Current month revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthRevenue = hostBookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Security deposits
    const totalDeposits = hostBookings.reduce((sum, b) => sum + (b.securityDeposit || 0), 0);
    const depositsReturned = hostBookings.filter(b => b.depositReturned).reduce((sum, b) => sum + (b.securityDeposit || 0), 0);
    const depositsHeld = totalDeposits - depositsReturned;
    
    // Simplified expenses (you can expand this)
    const estimatedExpenses = totalRevenue * 0.2; // 20% of revenue as expenses
    const netProfit = totalRevenue - estimatedExpenses;
    
    res.json({
      success: true,
      analytics: {
        totalRevenue,
        currentMonthRevenue,
        monthlyRevenue,
        estimatedExpenses,
        netProfit,
        securityDeposits: {
          total: totalDeposits,
          returned: depositsReturned,
          held: depositsHeld
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get occupancy analytics
router.get('/occupancy', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const hostBookings = bookings.filter(b => b.hostId === req.user.id && (b.status === 'confirmed' || b.status === 'completed'));
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    
    // Occupancy per unit
    const occupancyPerUnit = hostUnits.map(unit => {
      const unitBookings = hostBookings.filter(b => b.unitId === unit.id);
      const bookedDays = unitBookings.reduce((sum, b) => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return sum + nights;
      }, 0);
      
      const totalDays = 30; // Last 30 days
      const occupancyRate = ((bookedDays / totalDays) * 100).toFixed(1);
      
      return {
        unitName: unit.name,
        occupancyRate: parseFloat(occupancyRate),
        bookedDays,
        totalDays
      };
    });
    
    res.json({
      success: true,
      analytics: {
        occupancyPerUnit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
