const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get verification status
router.get('/status', verifyToken, checkRole('host'), (req, res) => {
  try {
    const verificationsPath = path.join(__dirname, '../../data/host_verifications.json');
    let verifications = [];
    
    if (fs.existsSync(verificationsPath)) {
      verifications = JSON.parse(fs.readFileSync(verificationsPath, 'utf8'));
    }
    
    const verification = verifications.find(v => v.hostId === req.user.id);
    
    res.json({ success: true, verification: verification || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit verification documents
router.post('/submit', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { documents } = req.body;
    
    if (!documents) {
      return res.status(400).json({ success: false, message: 'Documents are required' });
    }
    
    // Fetch full user data from users.json
    const usersPath = path.join(__dirname, '../../data/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const verificationsPath = path.join(__dirname, '../../data/host_verifications.json');
    let verifications = [];
    
    if (fs.existsSync(verificationsPath)) {
      verifications = JSON.parse(fs.readFileSync(verificationsPath, 'utf8'));
    }
    
    // Check if already exists
    const existingIndex = verifications.findIndex(v => v.hostId === req.user.id);
    
    const verification = {
      id: existingIndex >= 0 ? verifications[existingIndex].id : String(verifications.length + 1),
      hostId: req.user.id,
      hostName: `${user.firstName} ${user.lastName}`,
      hostEmail: user.email,
      documents,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null
    };
    
    if (existingIndex >= 0) {
      verifications[existingIndex] = verification;
    } else {
      verifications.push(verification);
    }
    
    fs.writeFileSync(verificationsPath, JSON.stringify(verifications, null, 2));
    
    res.json({ success: true, message: 'Verification submitted successfully', verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
