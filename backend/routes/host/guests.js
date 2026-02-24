const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all guests who have booked with this host
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const hostBookings = bookings.filter(b => b.hostId === req.user.id);
    
    // Get unique guests
    const guestIds = [...new Set(hostBookings.map(b => b.guestId))];
    
    const guests = guestIds.map(guestId => {
      const guest = users.find(u => u.id === guestId);
      const guestBookings = hostBookings.filter(b => b.guestId === guestId);
      
      const totalBookings = guestBookings.length;
      const totalSpent = guestBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0);
      const lastBooking = guestBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      
      return {
        id: guestId,
        name: guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown',
        email: guest ? guest.email : 'N/A',
        phone: guest ? guest.phone : 'N/A',
        totalBookings,
        totalSpent,
        lastBookingDate: lastBooking ? lastBooking.createdAt : null,
        status: guestBookings.some(b => b.status === 'confirmed') ? 'active' : 'past'
      };
    });
    
    res.json({ success: true, guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single guest details with booking history
router.get('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { id } = req.params;
    const bookings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/bookings.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    
    const guest = users.find(u => u.id === id);
    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found' });
    }
    
    const guestBookings = bookings
      .filter(b => b.guestId === id && b.hostId === req.user.id)
      .map(booking => {
        const unit = units.find(u => u.id === booking.unitId);
        return {
          ...booking,
          unitName: unit ? unit.name : 'Unknown'
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const { password, ...guestInfo } = guest;
    
    res.json({
      success: true,
      guest: {
        ...guestInfo,
        bookings: guestBookings,
        totalBookings: guestBookings.length,
        totalSpent: guestBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message to guest (store in messages.json)
router.post('/:id/message', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    
    const messagesPath = path.join(__dirname, '../../data/messages.json');
    let messages = [];
    
    if (fs.existsSync(messagesPath)) {
      messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    }
    
    const newMessage = {
      id: String(messages.length + 1),
      from: req.user.id,
      fromRole: 'host',
      to: id,
      toRole: 'guest',
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
    
    res.json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages with a guest
router.get('/:id/messages', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { id } = req.params;
    const messagesPath = path.join(__dirname, '../../data/messages.json');
    
    if (!fs.existsSync(messagesPath)) {
      return res.json({ success: true, messages: [] });
    }
    
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    const conversation = messages.filter(m => 
      (m.from === req.user.id && m.to === id) || 
      (m.from === id && m.to === req.user.id)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    res.json({ success: true, messages: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
