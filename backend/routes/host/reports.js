const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Generate own property reports
router.get('/property-report', verifyToken, checkRole('host'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    
    const propertyReports = hostUnits.map(unit => {
      const unitBookings = bookings.filter(b => b.unitId === unit.id);
      const unitReviews = reviews.filter(r => r.unitId === unit.id);
      
      const totalBookings = unitBookings.length;
      const confirmedBookings = unitBookings.filter(b => b.status === 'confirmed').length;
      const completedBookings = unitBookings.filter(b => b.status === 'completed').length;
      const cancelledBookings = unitBookings.filter(b => b.status === 'cancelled').length;
      
      const totalRevenue = unitBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const avgRating = unitReviews.length > 0
        ? unitReviews.reduce((sum, r) => sum + r.rating, 0) / unitReviews.length
        : 0;
      
      // Calculate occupancy rate
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const bookedDays = unitBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => {
          const checkIn = new Date(b.checkIn);
          const checkOut = new Date(b.checkOut);
          const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
      const occupancyRate = ((bookedDays / daysInMonth) * 100).toFixed(2);
      
      return {
        unitId: unit.id,
        unitName: unit.name,
        unitType: unit.type,
        location: unit.location,
        pricePerNight: unit.pricePerNight,
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        revenue: {
          total: totalRevenue,
          average: totalBookings > 0 ? totalRevenue / totalBookings : 0
        },
        rating: {
          average: avgRating.toFixed(2),
          totalReviews: unitReviews.length
        },
        occupancy: {
          rate: parseFloat(occupancyRate),
          bookedDays: bookedDays,
          availableDays: daysInMonth
        }
      };
    });
    
    res.json({ success: true, propertyReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export booking data
router.get('/export-bookings', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    let hostBookings = bookings.filter(b => b.hostId === req.user.id);
    
    // Filter by date range if provided
    if (startDate) {
      hostBookings = hostBookings.filter(b => new Date(b.checkIn) >= new Date(startDate));
    }
    if (endDate) {
      hostBookings = hostBookings.filter(b => new Date(b.checkOut) <= new Date(endDate));
    }
    
    const exportData = hostBookings.map(booking => {
      const unit = units.find(u => u.id === booking.unitId);
      const guest = users.find(u => u.id === booking.guestId);
      
      return {
        'Booking ID': booking.id,
        'Unit Name': unit ? unit.name : 'Unknown',
        'Unit Type': unit ? unit.type : 'Unknown',
        'Guest Name': guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown',
        'Guest Email': guest ? guest.email : 'Unknown',
        'Check-in Date': booking.checkIn,
        'Check-out Date': booking.checkOut,
        'Number of Guests': booking.guests,
        'Total Price': booking.totalPrice,
        'Security Deposit': booking.securityDeposit,
        'Payment Status': booking.paymentStatus,
        'Booking Status': booking.status,
        'Created At': booking.createdAt
      };
    });
    
    if (format === 'csv') {
      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ];
      const csv = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings-export.csv');
      res.send(csv);
    } else if (format === 'excel') {
      // For Excel, we'll use CSV format with .xlsx extension
      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ];
      const csv = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings-export.xlsx');
      res.send(csv);
    } else {
      res.json({ success: true, data: exportData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Financial summaries
router.get('/financial-summary', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { period = 'monthly' } = req.query; // monthly, quarterly, yearly
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const expenses = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/expenses.json'), 'utf8'));
    const payroll = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/payroll.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id && b.paymentStatus === 'paid');
    const hostExpenses = expenses.filter(e => e.hostId === req.user.id);
    const hostPayroll = payroll.filter(p => p.hostId === req.user.id);
    
    const now = new Date();
    let periodData = [];
    
    if (period === 'monthly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const monthRevenue = hostBookings
          .filter(b => {
            const bookingDate = new Date(b.createdAt);
            return bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, b) => sum + b.totalPrice, 0);
        
        const monthExpenses = hostExpenses
          .filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, e) => sum + e.amount, 0);
        
        const monthSalaries = hostPayroll
          .filter(p => {
            const paymentDate = new Date(p.paymentDate);
            return paymentDate.getMonth() === date.getMonth() && paymentDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, p) => sum + p.netPay, 0);
        
        periodData.push({
          period: monthKey,
          revenue: monthRevenue,
          expenses: monthExpenses,
          salaries: monthSalaries,
          netProfit: monthRevenue - monthExpenses - monthSalaries
        });
      }
    } else if (period === 'quarterly') {
      // Last 4 quarters
      for (let i = 3; i >= 0; i--) {
        const quarterStart = new Date(now.getFullYear(), now.getMonth() - (i * 3), 1);
        const quarterEnd = new Date(now.getFullYear(), now.getMonth() - (i * 3) + 3, 0);
        const quarterKey = `Q${Math.floor(quarterStart.getMonth() / 3) + 1} ${quarterStart.getFullYear()}`;
        
        const quarterRevenue = hostBookings
          .filter(b => {
            const bookingDate = new Date(b.createdAt);
            return bookingDate >= quarterStart && bookingDate <= quarterEnd;
          })
          .reduce((sum, b) => sum + b.totalPrice, 0);
        
        const quarterExpenses = hostExpenses
          .filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= quarterStart && expenseDate <= quarterEnd;
          })
          .reduce((sum, e) => sum + e.amount, 0);
        
        const quarterSalaries = hostPayroll
          .filter(p => {
            const paymentDate = new Date(p.paymentDate);
            return paymentDate >= quarterStart && paymentDate <= quarterEnd;
          })
          .reduce((sum, p) => sum + p.netPay, 0);
        
        periodData.push({
          period: quarterKey,
          revenue: quarterRevenue,
          expenses: quarterExpenses,
          salaries: quarterSalaries,
          netProfit: quarterRevenue - quarterExpenses - quarterSalaries
        });
      }
    } else if (period === 'yearly') {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i;
        
        const yearRevenue = hostBookings
          .filter(b => new Date(b.createdAt).getFullYear() === year)
          .reduce((sum, b) => sum + b.totalPrice, 0);
        
        const yearExpenses = hostExpenses
          .filter(e => new Date(e.date).getFullYear() === year)
          .reduce((sum, e) => sum + e.amount, 0);
        
        const yearSalaries = hostPayroll
          .filter(p => new Date(p.paymentDate).getFullYear() === year)
          .reduce((sum, p) => sum + p.netPay, 0);
        
        periodData.push({
          period: year.toString(),
          revenue: yearRevenue,
          expenses: yearExpenses,
          salaries: yearSalaries,
          netProfit: yearRevenue - yearExpenses - yearSalaries
        });
      }
    }
    
    res.json({ success: true, period, data: periodData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Performance metrics
router.get('/performance-metrics', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    const expenses = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/expenses.json'), 'utf8'));
    const payroll = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/payroll.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    const hostReviews = reviews.filter(r => {
      const unit = units.find(u => u.id === r.unitId);
      return unit && unit.hostId === req.user.id;
    });
    const hostExpenses = expenses.filter(e => e.hostId === req.user.id);
    const hostPayroll = payroll.filter(p => p.hostId === req.user.id);
    
    // Revenue metrics
    const totalRevenue = hostBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    const avgRevenuePerBooking = hostBookings.length > 0 ? totalRevenue / hostBookings.length : 0;
    
    // Booking metrics
    const totalBookings = hostBookings.length;
    const confirmedBookings = hostBookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = hostBookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = hostBookings.filter(b => b.status === 'cancelled').length;
    const conversionRate = totalBookings > 0 ? ((confirmedBookings + completedBookings) / totalBookings * 100).toFixed(2) : 0;
    
    // Occupancy metrics
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const totalAvailableDays = hostUnits.length * daysInMonth;
    const bookedDays = hostBookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
    const avgOccupancyRate = totalAvailableDays > 0 ? ((bookedDays / totalAvailableDays) * 100).toFixed(2) : 0;
    
    // Rating metrics
    const avgRating = hostReviews.length > 0
      ? (hostReviews.reduce((sum, r) => sum + r.rating, 0) / hostReviews.length).toFixed(2)
      : 0;
    const totalReviews = hostReviews.length;
    
    // Financial metrics
    const totalExpenses = hostExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSalaries = hostPayroll.reduce((sum, p) => sum + p.netPay, 0);
    const netProfit = totalRevenue - totalExpenses - totalSalaries;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;
    
    // Response time (mock data - would need actual message data)
    const avgResponseTime = '2 hours'; // Placeholder
    
    res.json({
      success: true,
      metrics: {
        revenue: {
          total: totalRevenue,
          averagePerBooking: avgRevenuePerBooking,
          growth: 0 // Would need historical data
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          conversionRate: parseFloat(conversionRate)
        },
        occupancy: {
          averageRate: parseFloat(avgOccupancyRate),
          bookedDays: bookedDays,
          availableDays: totalAvailableDays
        },
        rating: {
          average: parseFloat(avgRating),
          totalReviews: totalReviews
        },
        financial: {
          revenue: totalRevenue,
          expenses: totalExpenses,
          salaries: totalSalaries,
          netProfit: netProfit,
          profitMargin: parseFloat(profitMargin)
        },
        responseTime: avgResponseTime,
        totalProperties: hostUnits.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
