const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const notificationsPath = path.join(__dirname, '../data/notifications.json');

// Get notifications for current user
router.get('/', verifyToken, (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    const userNotifications = notifications.filter(n => n.userId === req.user.id);
    
    // Sort by date, newest first
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, notifications: userNotifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', verifyToken, (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    notifications[notificationIndex].read = true;
    notifications[notificationIndex].readAt = new Date().toISOString();
    
    fs.writeFileSync(notificationsPath, JSON.stringify(notifications, null, 2));
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', verifyToken, (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    
    notifications.forEach(n => {
      if (n.userId === req.user.id && !n.read) {
        n.read = true;
        n.readAt = new Date().toISOString();
      }
    });
    
    fs.writeFileSync(notificationsPath, JSON.stringify(notifications, null, 2));
    
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete notification
router.delete('/:id', verifyToken, (req, res) => {
  try {
    let notifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    notifications.splice(notificationIndex, 1);
    fs.writeFileSync(notificationsPath, JSON.stringify(notifications, null, 2));
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to create notification (used by other routes)
const createNotification = (userId, type, title, message, link = null) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf8'));
    
    const newNotification = {
      id: String(notifications.length + 1),
      userId,
      type, // 'info', 'success', 'warning', 'error'
      title,
      message,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.push(newNotification);
    fs.writeFileSync(notificationsPath, JSON.stringify(notifications, null, 2));
    
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = router;
module.exports.createNotification = createNotification;
