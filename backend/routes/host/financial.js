const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get financial summary
router.get('/summary', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const expenses = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/expenses.json'), 'utf8'));
    const payroll = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/payroll.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id && b.paymentStatus === 'paid');
    const hostExpenses = expenses.filter(e => e.hostId === req.user.id);
    const hostPayroll = payroll.filter(p => p.hostId === req.user.id);
    
    // Calculate Kinita (Revenue)
    const totalRevenue = hostBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Calculate by month
    const monthlyRevenue = {};
    hostBookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + booking.totalPrice;
    });
    
    // Calculate Gastos (Actual Expenses)
    const totalExpenses = hostExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyExpenses = {};
    hostExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + expense.amount;
    });
    
    // Calculate Salaries (Actual Payroll)
    const totalSalaries = hostPayroll.reduce((sum, p) => sum + p.netPay, 0);
    const monthlySalaries = {};
    hostPayroll.forEach(payment => {
      const date = new Date(payment.paymentDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlySalaries[monthKey] = (monthlySalaries[monthKey] || 0) + payment.netPay;
    });
    
    // Calculate Net Profit (Revenue - Expenses - Salaries)
    const netProfit = totalRevenue - totalExpenses - totalSalaries;
    const netProfitPercentage = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
    
    // Security deposits
    const totalDeposits = hostBookings.reduce((sum, b) => sum + (b.securityDeposit || 0), 0);
    const depositsReturned = hostBookings.filter(b => b.depositReturned).reduce((sum, b) => sum + (b.securityDeposit || 0), 0);
    const depositsHeld = totalDeposits - depositsReturned;
    
    res.json({
      success: true,
      financial: {
        kinita: {
          total: totalRevenue,
          monthly: monthlyRevenue
        },
        gastos: {
          total: totalExpenses,
          monthly: monthlyExpenses
        },
        salaries: {
          total: totalSalaries,
          monthly: monthlySalaries
        },
        netProfit: {
          total: netProfit,
          percentage: netProfitPercentage
        },
        deposits: {
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

// Get security deposits details
router.get('/deposits', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    
    const deposits = hostBookings.map(booking => {
      const unit = units.find(u => u.id === booking.unitId);
      const guest = users.find(u => u.id === booking.guestId);
      
      return {
        bookingId: booking.id,
        unitName: unit ? unit.name : 'Unknown',
        guestName: guest ? guest.name : 'Unknown',
        amount: booking.securityDeposit,
        status: booking.depositReturned ? 'returned' : 'held',
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        bookingStatus: booking.status
      };
    });
    
    res.json({ success: true, deposits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export financial data
router.get('/export', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    
    const exportData = hostBookings.map(booking => {
      const unit = units.find(u => u.id === booking.unitId);
      return {
        'Booking ID': booking.id,
        'Unit': unit ? unit.name : 'Unknown',
        'Check-in': booking.checkIn,
        'Check-out': booking.checkOut,
        'Guests': booking.guests,
        'Total Price': booking.totalPrice,
        'Security Deposit': booking.securityDeposit,
        'Payment Status': booking.paymentStatus,
        'Booking Status': booking.status,
        'Created At': booking.createdAt
      };
    });
    
    if (format === 'csv') {
      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvRows = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ];
      const csv = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=financial-report.csv');
      res.send(csv);
    } else {
      // Return JSON
      res.json({ success: true, data: exportData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get profit analysis
router.get('/profit-analysis', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const expenses = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/expenses.json'), 'utf8'));
    const payroll = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/payroll.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id && b.paymentStatus === 'paid');
    const hostExpenses = expenses.filter(e => e.hostId === req.user.id);
    const hostPayroll = payroll.filter(p => p.hostId === req.user.id);
    const hostUnits = units.filter(u => u.hostId === req.user.id);
    
    // Revenue
    const totalRevenue = hostBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // Expenses
    const totalExpenses = hostExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Salaries
    const totalSalaries = hostPayroll.reduce((sum, p) => sum + p.netPay, 0);
    
    // Net Profit = Revenue - Expenses - Salaries
    const netProfit = totalRevenue - totalExpenses - totalSalaries;
    
    // Profit Margins
    const grossProfit = totalRevenue - totalExpenses; // Before salaries
    const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : 0;
    const netMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;
    const operatingMargin = totalRevenue > 0 ? (((totalRevenue - totalExpenses - totalSalaries) / totalRevenue) * 100).toFixed(2) : 0;
    
    // ROI Calculation (assuming investment is stored in units)
    const totalInvestment = hostUnits.reduce((sum, u) => sum + (u.investment || 0), 0);
    const roi = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100).toFixed(2) : 0;
    const annualROI = totalInvestment > 0 ? ((netProfit * 12 / totalInvestment) * 100).toFixed(2) : 0;
    
    // Break-even Analysis
    const fixedCosts = totalSalaries; // Monthly fixed costs
    const variableCosts = totalExpenses; // Variable costs
    const avgBookingPrice = hostBookings.length > 0 ? totalRevenue / hostBookings.length : 0;
    const avgVariableCostPerBooking = hostBookings.length > 0 ? variableCosts / hostBookings.length : 0;
    const breakEvenUnits = avgBookingPrice > avgVariableCostPerBooking 
      ? Math.ceil(fixedCosts / (avgBookingPrice - avgVariableCostPerBooking))
      : 0;
    const breakEvenRevenue = breakEvenUnits * avgBookingPrice;
    const currentBookings = hostBookings.length;
    const isAboveBreakEven = currentBookings >= breakEvenUnits;
    
    // Profitability Trends (last 6 months)
    const trends = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
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
      
      const monthProfit = monthRevenue - monthExpenses - monthSalaries;
      
      trends.push({
        month: monthKey,
        revenue: monthRevenue,
        expenses: monthExpenses,
        salaries: monthSalaries,
        profit: monthProfit
      });
    }
    
    // Monthly/Yearly Comparisons
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastYear = currentYear - 1;
    
    const currentMonthProfit = trends[trends.length - 1]?.profit || 0;
    const lastMonthProfit = trends[trends.length - 2]?.profit || 0;
    const monthOverMonthChange = lastMonthProfit !== 0 
      ? (((currentMonthProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100).toFixed(2)
      : 0;
    
    // Year-over-year (simplified - comparing current month to same month last year)
    const currentYearProfit = netProfit;
    const yearOverYearChange = 0; // Would need historical data
    
    res.json({
      success: true,
      profitAnalysis: {
        netProfit: {
          total: netProfit,
          breakdown: {
            revenue: totalRevenue,
            expenses: totalExpenses,
            salaries: totalSalaries
          }
        },
        profitMargins: {
          gross: parseFloat(grossMargin),
          net: parseFloat(netMargin),
          operating: parseFloat(operatingMargin)
        },
        roi: {
          total: parseFloat(roi),
          annual: parseFloat(annualROI),
          investment: totalInvestment
        },
        breakEven: {
          units: breakEvenUnits,
          revenue: breakEvenRevenue,
          currentBookings: currentBookings,
          isAboveBreakEven: isAboveBreakEven,
          status: isAboveBreakEven ? 'Profitable' : 'Below Break-even'
        },
        trends: trends,
        comparisons: {
          monthOverMonth: {
            current: currentMonthProfit,
            previous: lastMonthProfit,
            change: parseFloat(monthOverMonthChange)
          },
          yearOverYear: {
            current: currentYearProfit,
            change: parseFloat(yearOverYearChange)
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
