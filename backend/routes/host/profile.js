const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const getUsersData = () => {
  const data = fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8');
  return JSON.parse(data);
};

const saveUsersData = (users) => {
  fs.writeFileSync(
    path.join(__dirname, '../../data/users.json'),
    JSON.stringify(users, null, 2)
  );
};

// Get host profile
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const users = getUsersData();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'host') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        companyName: user.companyName || '',
        bio: user.bio || '',
        facebook: user.facebook || '',
        instagram: user.instagram || '',
        tiktok: user.tiktok || '',
        website: user.website || '',
        verified: user.verified || false,
        verifiedAt: user.verifiedAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update host profile
router.put('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { firstName, lastName, phone, companyName, bio, facebook, instagram, tiktok, website } = req.body;
    const users = getUsersData();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (users[userIndex].role !== 'host') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      phone: phone || users[userIndex].phone,
      companyName: companyName || '',
      bio: bio || '',
      facebook: facebook || '',
      instagram: instagram || '',
      tiktok: tiktok || '',
      website: website || '',
      updatedAt: new Date().toISOString()
    };

    saveUsersData(users);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        firstName: users[userIndex].firstName,
        lastName: users[userIndex].lastName,
        phone: users[userIndex].phone,
        companyName: users[userIndex].companyName,
        bio: users[userIndex].bio,
        facebook: users[userIndex].facebook,
        instagram: users[userIndex].instagram,
        tiktok: users[userIndex].tiktok,
        website: users[userIndex].website
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
