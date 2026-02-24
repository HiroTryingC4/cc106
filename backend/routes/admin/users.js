const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all users
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ success: true, users: usersWithoutPasswords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single user
router.get('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create user
router.post('/', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body;
    
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      phone: phone || '',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(path.join(__dirname, '../../data/users.json'), JSON.stringify(users, null, 2));
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, message: 'User created successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user
router.put('/:id', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const { email, role, firstName, lastName, phone, status } = req.body;
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      email: email || users[userIndex].email,
      role: role || users[userIndex].role,
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      phone: phone !== undefined ? phone : users[userIndex].phone,
      status: status || users[userIndex].status
    };
    
    fs.writeFileSync(path.join(__dirname, '../../data/users.json'), JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({ success: true, message: 'User updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete/Deactivate user
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users[userIndex].status = 'inactive';
    fs.writeFileSync(path.join(__dirname, '../../data/users.json'), JSON.stringify(users, null, 2));
    
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user role
router.put('/:id/role', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'host', 'guest'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    users[userIndex].role = role;
    fs.writeFileSync(path.join(__dirname, '../../data/users.json'), JSON.stringify(users, null, 2));
    
    res.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify host account
router.put('/:id/verify', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (users[userIndex].role !== 'host') {
      return res.status(400).json({ success: false, message: 'Only hosts can be verified' });
    }
    
    users[userIndex].verified = true;
    users[userIndex].verifiedAt = new Date().toISOString();
    fs.writeFileSync(path.join(__dirname, '../../data/users.json'), JSON.stringify(users, null, 2));
    
    res.json({ success: true, message: 'Host verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get disputes
router.get('/disputes/all', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const disputesPath = path.join(__dirname, '../../data/disputes.json');
    let disputes = [];
    
    if (fs.existsSync(disputesPath)) {
      disputes = JSON.parse(fs.readFileSync(disputesPath, 'utf8'));
    }
    
    res.json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create dispute
router.post('/disputes', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { userId, bookingId, description, type } = req.body;
    
    const disputesPath = path.join(__dirname, '../../data/disputes.json');
    let disputes = [];
    
    if (fs.existsSync(disputesPath)) {
      disputes = JSON.parse(fs.readFileSync(disputesPath, 'utf8'));
    }
    
    const newDispute = {
      id: String(disputes.length + 1),
      userId,
      bookingId,
      description,
      type,
      status: 'open',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolution: null
    };
    
    disputes.push(newDispute);
    fs.writeFileSync(disputesPath, JSON.stringify(disputes, null, 2));
    
    res.json({ success: true, message: 'Dispute created successfully', dispute: newDispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Resolve dispute
router.put('/disputes/:id/resolve', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { resolution } = req.body;
    
    const disputesPath = path.join(__dirname, '../../data/disputes.json');
    let disputes = [];
    
    if (fs.existsSync(disputesPath)) {
      disputes = JSON.parse(fs.readFileSync(disputesPath, 'utf8'));
    }
    
    const disputeIndex = disputes.findIndex(d => d.id === req.params.id);
    
    if (disputeIndex === -1) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }
    
    disputes[disputeIndex].status = 'resolved';
    disputes[disputeIndex].resolution = resolution;
    disputes[disputeIndex].resolvedAt = new Date().toISOString();
    
    fs.writeFileSync(disputesPath, JSON.stringify(disputes, null, 2));
    
    res.json({ success: true, message: 'Dispute resolved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
