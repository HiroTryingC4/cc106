const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Store MFA codes temporarily (in production, use Redis or similar)
const mfaCodes = new Map();

const getUsersData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8');
  return JSON.parse(data);
};

const saveUsersData = (users) => {
  fs.writeFileSync(
    path.join(__dirname, '../data/users.json'),
    JSON.stringify(users, null, 2)
  );
};

// Generate 6-digit MFA code
const generateMFACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'guest' } = req.body;
    const users = getUsersData();
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      phone,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersData(users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        verified: false,
        verifiedAt: null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Login with MFA
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsersData();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin credentials required.' });
    }

    // For demo: accept "password123" for all users
    const isValid = password === 'password123' || await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate MFA code
    const mfaCode = generateMFACode();
    const tempToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, mfa: true },
      process.env.JWT_SECRET,
      { expiresIn: '5m' } // Short expiry for MFA token
    );

    // Store MFA code (in production, send via email/SMS)
    mfaCodes.set(tempToken, {
      code: mfaCode,
      userId: user.id,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Clean up expired codes
    setTimeout(() => {
      mfaCodes.delete(tempToken);
    }, 5 * 60 * 1000);

    res.json({
      success: true,
      requireMFA: true,
      tempToken,
      mfaCode, // In production, don't send this - send via email/SMS
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify MFA Code
router.post('/verify-mfa', async (req, res) => {
  try {
    const { tempToken, mfaCode } = req.body;

    if (!tempToken || !mfaCode) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Check MFA code
    const storedMFA = mfaCodes.get(tempToken);
    if (!storedMFA) {
      return res.status(401).json({ success: false, message: 'MFA code expired or invalid' });
    }

    if (storedMFA.code !== mfaCode) {
      return res.status(401).json({ success: false, message: 'Invalid verification code' });
    }

    // MFA verified - issue real token
    const token = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Clean up MFA code
    mfaCodes.delete(tempToken);

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Regular Login (for non-admin users)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsersData();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // For demo: accept "password123" for all users
    const isValid = password === 'password123' || await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified || false,
        verifiedAt: user.verifiedAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = getUsersData();
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified || false,
        verifiedAt: user.verifiedAt || null
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
