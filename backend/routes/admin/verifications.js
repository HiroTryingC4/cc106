const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all verification requests
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const verificationsPath = path.join(__dirname, '../../data/host_verifications.json');
    let verifications = [];
    
    if (fs.existsSync(verificationsPath)) {
      verifications = JSON.parse(fs.readFileSync(verificationsPath, 'utf8'));
    }
    
    res.json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single verification
router.get('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const verificationsPath = path.join(__dirname, '../../data/host_verifications.json');
    let verifications = [];
    
    if (fs.existsSync(verificationsPath)) {
      verifications = JSON.parse(fs.readFileSync(verificationsPath, 'utf8'));
    }
    
    const verification = verifications.find(v => v.id === req.params.id);
    
    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }
    
    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve verification
router.put('/:id/approve', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const verificationsPath = path.join(__dirname, '../../data/host_verifications.json');
    const usersPath = path.join(__dirname, '../../data/users.json');
    
    let verifications = JSON.parse(fs.readFileSync(verificationsPath, 'utf8'));
    let users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    
    const verificationIndex = verifications.findIndex(v => v.id === req.params.id);
    
    if (verificationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }
    
    // Update verification
    verifications[verificationIndex].status = 'approved';
    verifications[verificationIndex].reviewedAt = new Date().toISOString();
    verifications[verificationIndex].reviewedBy = req.user.id;
    
    // Update user verified status
    const userIndex = users.findIndex(u => u.id === verifications[verificationIndex].hostId);
    if (userIndex >= 0) {
      users[userIndex].verified = true;
      users[userIndex].verifiedAt = new Date().toISOString();
    }
    
    fs.writeFileSync(verificationsPath, JSON.stringify(verifications, null, 2));
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    
    res.json({ success: true, message: 'Host verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject verification
router.put('/:id/reject', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }
    
    const verificationsPath = path.join(__dirname, '../../data/host_verifications.json');
    let verifications = JSON.parse(fs.readFileSync(verificationsPath, 'utf8'));
    
    const verificationIndex = verifications.findIndex(v => v.id === req.params.id);
    
    if (verificationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Verification not found' });
    }
    
    verifications[verificationIndex].status = 'rejected';
    verifications[verificationIndex].reviewedAt = new Date().toISOString();
    verifications[verificationIndex].reviewedBy = req.user.id;
    verifications[verificationIndex].rejectionReason = reason;
    
    fs.writeFileSync(verificationsPath, JSON.stringify(verifications, null, 2));
    
    res.json({ success: true, message: 'Verification rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
