const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get guest profile
router.get('/', verifyToken, checkRole('guest'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update guest profile
router.put('/', verifyToken, checkRole('guest'), async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;
    const usersPath = path.join(__dirname, '../../data/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[userIndex];

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password required' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    users[userIndex] = user;
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
