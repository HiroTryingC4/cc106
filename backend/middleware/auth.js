const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    next();
  };
};

const checkAdminType = (...adminTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // Fetch user from database to check admin type
    const usersPath = path.join(__dirname, '../data/users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(usersData);
    const user = users.find(u => u.id === req.user.id);
    
    if (!user || !user.adminType) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin type not configured' 
      });
    }

    // Super admin has access to everything
    if (user.adminType === 'super') {
      req.user.adminType = 'super';
      return next();
    }

    // Check if user's admin type is in allowed types
    if (!adminTypes.includes(user.adminType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient admin privileges' 
      });
    }

    req.user.adminType = user.adminType;
    next();
  };
};

const checkVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.user.role === 'host') {
    // Fetch user from database to check verified status
    const usersPath = path.join(__dirname, '../data/users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(usersData);
    const user = users.find(u => u.id === req.user.id);
    
    console.log('CheckVerified - User ID:', req.user.id);
    console.log('CheckVerified - User found:', user ? 'Yes' : 'No');
    console.log('CheckVerified - User verified:', user?.verified);
    
    if (!user || !user.verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Host verification required. Please complete your verification to access this feature.',
        requiresVerification: true
      });
    }
  }

  next();
};

module.exports = { verifyToken, checkRole, checkVerified, checkAdminType };
