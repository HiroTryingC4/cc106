const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Generate report
router.post('/generate', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.body;
    
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    
    let reportData = {};
    
    // Filter by date range if provided
    let filteredBookings = bookings;
    if (startDate && endDate) {
      filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
      });
    }
    
    switch (reportType) {
      case 'bookings':
        reportData = {
          totalBookings: filteredBookings.length,
          byStatus: {
            pending: filteredBookings.filter(b => b.status === 'pending').length,
            confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
            completed: filteredBookings.filter(b => b.status === 'completed').length,
            cancelled: filteredBookings.filter(b => b.status === 'cancelled').length
          },
          revenue: filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0)
        };
        break;
        
      case 'revenue':
        reportData = {
          totalRevenue: filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0),
          pendingRevenue: filteredBookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.totalPrice, 0),
          averageBookingValue: filteredBookings.length > 0 
            ? (filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0) / filteredBookings.length).toFixed(2)
            : 0
        };
        break;
        
      case 'users':
        reportData = {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'active').length,
          byRole: {
            admin: users.filter(u => u.role === 'admin').length,
            host: users.filter(u => u.role === 'host').length,
            guest: users.filter(u => u.role === 'guest').length
          }
        };
        break;
        
      case 'units':
        reportData = {
          totalUnits: units.length,
          availableUnits: units.filter(u => u.available).length,
          averageRating: reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0
        };
        break;
        
      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }
    
    const report = {
      id: String(Date.now()),
      type: reportType,
      startDate,
      endDate,
      generatedAt: new Date().toISOString(),
      data: reportData
    };
    
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get activity logs
router.get('/logs', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const logsPath = path.join(__dirname, '../../data/logs.json');
    let logs = [];
    
    if (fs.existsSync(logsPath)) {
      logs = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
    } else {
      // Create sample logs with more variety
      const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
      const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
      const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
      
      logs = [
        {
          id: '1',
          userId: '3',
          action: 'booking_created',
          details: 'Created booking #1 for Luxury Beachfront Condo',
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          id: '2',
          userId: '2',
          action: 'unit_created',
          details: 'Created unit "Luxury Beachfront Condo"',
          timestamp: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
          id: '3',
          userId: '3',
          action: 'payment_completed',
          details: 'Payment completed for booking #1 - ₱750',
          timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
          id: '4',
          userId: '1',
          action: 'user_created',
          details: 'New user registered: guest@example.com',
          timestamp: new Date(Date.now() - 86400000 * 15).toISOString()
        },
        {
          id: '5',
          userId: '3',
          action: 'review_created',
          details: 'Review submitted for Luxury Beachfront Condo - 5 stars',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: '6',
          userId: '2',
          action: 'unit_updated',
          details: 'Updated unit "Modern Downtown Studio" pricing',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: '7',
          userId: '3',
          action: 'booking_completed',
          details: 'Booking #3 marked as completed',
          timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
          id: '8',
          userId: '1',
          action: 'user_updated',
          details: 'User profile updated',
          timestamp: new Date(Date.now() - 86400000 * 7).toISOString()
        },
        {
          id: '9',
          userId: '2',
          action: 'login',
          details: 'User logged in successfully',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '10',
          userId: '3',
          action: 'booking_created',
          details: 'Created booking #2 for Family-Friendly Villa',
          timestamp: new Date(Date.now() - 86400000 * 8).toISOString()
        }
      ];
      
      // Sort by timestamp descending
      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
    }
    
    res.json({ success: true, logs: logs.slice(0, 100) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export report data
router.post('/export', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { reportType, format, startDate, endDate } = req.body;
    
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/reviews.json'), 'utf8'));
    
    // Filter by date range if provided
    let filteredBookings = bookings;
    if (startDate && endDate) {
      filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
      });
    }
    
    let exportData = [];
    let filename = '';
    
    switch (reportType) {
      case 'bookings':
        exportData = filteredBookings.map(b => ({
          'Booking ID': b.id,
          'Guest ID': b.guestId,
          'Unit ID': b.unitId,
          'Check In': b.checkIn,
          'Check Out': b.checkOut,
          'Status': b.status,
          'Total Price': b.totalPrice,
          'Payment Status': b.paymentStatus,
          'Created At': b.createdAt
        }));
        filename = `bookings_report_${Date.now()}`;
        break;
        
      case 'revenue':
        exportData = filteredBookings.filter(b => b.paymentStatus === 'paid').map(b => ({
          'Booking ID': b.id,
          'Amount': b.totalPrice,
          'Payment Status': b.paymentStatus,
          'Date': b.createdAt
        }));
        filename = `revenue_report_${Date.now()}`;
        break;
        
      case 'users':
        exportData = users.map(u => ({
          'User ID': u.id,
          'Name': `${u.firstName} ${u.lastName}`,
          'Email': u.email,
          'Role': u.role,
          'Status': u.status,
          'Phone': u.phone || 'N/A',
          'Created At': u.createdAt || 'N/A'
        }));
        filename = `users_report_${Date.now()}`;
        break;
        
      case 'units':
        exportData = units.map(u => ({
          'Unit ID': u.id,
          'Name': u.name,
          'Host ID': u.hostId,
          'Price': u.price,
          'Location': u.location,
          'Available': u.available ? 'Yes' : 'No',
          'Rating': u.rating || 'N/A'
        }));
        filename = `units_report_${Date.now()}`;
        break;
        
      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }
    
    if (format === 'csv') {
      // Generate CSV
      if (exportData.length === 0) {
        return res.status(400).json({ success: false, message: 'No data to export' });
      }
      
      const headers = Object.keys(exportData[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of exportData) {
        const values = headers.map(header => {
          const value = row[header];
          return `"${value}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csvContent = csvRows.join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);
    } else if (format === 'json') {
      // Generate JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json(exportData);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid format. Use csv or json' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
