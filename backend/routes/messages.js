const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const messagesPath = path.join(__dirname, '../data/messages.json');
const usersPath = path.join(__dirname, '../data/users.json');

// Helper function to read messages
const readMessages = () => {
  if (!fs.existsSync(messagesPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
};

// Helper function to write messages
const writeMessages = (messages) => {
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
};

// Helper function to read users
const readUsers = () => {
  return JSON.parse(fs.readFileSync(usersPath, 'utf8'));
};

// Get all conversations for the current user
router.get('/conversations', verifyToken, (req, res) => {
  try {
    const messages = readMessages();
    const users = readUsers();
    const userId = req.user.id;
    
    // Get unique conversation partners
    const conversationMap = new Map();
    
    messages.forEach(msg => {
      let partnerId, partnerRole;
      
      if (msg.from === userId) {
        partnerId = msg.to;
        partnerRole = msg.toRole;
      } else if (msg.to === userId) {
        partnerId = msg.from;
        partnerRole = msg.fromRole;
      } else {
        return; // Message doesn't involve current user
      }
      
      // Get or create conversation entry
      if (!conversationMap.has(partnerId)) {
        const partner = users.find(u => u.id === partnerId);
        conversationMap.set(partnerId, {
          id: partnerId,
          withUser: {
            id: partnerId,
            name: partner ? `${partner.firstName} ${partner.lastName}` : 'Unknown User',
            role: partnerRole
          },
          lastMessage: msg.message,
          timestamp: msg.createdAt,
          unread: 0
        });
      } else {
        // Update with latest message
        const conv = conversationMap.get(partnerId);
        if (new Date(msg.createdAt) > new Date(conv.timestamp)) {
          conv.lastMessage = msg.message;
          conv.timestamp = msg.createdAt;
        }
      }
      
      // Count unread messages
      if (msg.to === userId && !msg.read) {
        conversationMap.get(partnerId).unread++;
      }
    });
    
    // Convert map to array and sort by timestamp
    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages with a specific user
router.get('/conversation/:userId', verifyToken, (req, res) => {
  try {
    const messages = readMessages();
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const users = readUsers();
    
    // Get conversation messages
    const conversation = messages.filter(m => 
      (m.from === currentUserId && m.to === otherUserId) || 
      (m.from === otherUserId && m.to === currentUserId)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Mark messages as read
    let updated = false;
    messages.forEach(msg => {
      if (msg.to === currentUserId && msg.from === otherUserId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });
    
    if (updated) {
      writeMessages(messages);
    }
    
    // Add sender names to messages
    const messagesWithNames = conversation.map(msg => {
      const sender = users.find(u => u.id === msg.from);
      return {
        ...msg,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown'
      };
    });
    
    res.json({ success: true, messages: messagesWithNames });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a message
router.post('/send', verifyToken, (req, res) => {
  try {
    const { to, toRole, message } = req.body;
    
    if (!to || !toRole || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: to, toRole, message' 
      });
    }
    
    const messages = readMessages();
    
    const newMessage = {
      id: String(messages.length + 1),
      from: req.user.id,
      fromRole: req.user.role,
      to,
      toRole,
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    writeMessages(messages);
    
    res.json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get list of users to start a conversation with
router.get('/users', verifyToken, (req, res) => {
  try {
    const users = readUsers();
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    
    // Filter users based on role
    let availableUsers = [];
    
    if (currentUserRole === 'guest') {
      // Guests can message hosts and admins
      availableUsers = users.filter(u => 
        u.id !== currentUserId && (u.role === 'host' || u.role === 'admin')
      );
    } else if (currentUserRole === 'host') {
      // Hosts can message guests and admins
      availableUsers = users.filter(u => 
        u.id !== currentUserId && (u.role === 'guest' || u.role === 'admin')
      );
    } else if (currentUserRole === 'admin') {
      // Admins can message everyone
      availableUsers = users.filter(u => u.id !== currentUserId);
    }
    
    // Return simplified user info
    const userList = availableUsers.map(u => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role
    }));
    
    res.json({ success: true, users: userList });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark conversation as read
router.put('/mark-read/:userId', verifyToken, (req, res) => {
  try {
    const messages = readMessages();
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    
    let updated = false;
    messages.forEach(msg => {
      if (msg.to === currentUserId && msg.from === otherUserId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });
    
    if (updated) {
      writeMessages(messages);
    }
    
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread message count
router.get('/unread-count', verifyToken, (req, res) => {
  try {
    const messages = readMessages();
    const userId = req.user.id;
    
    const unreadCount = messages.filter(m => m.to === userId && !m.read).length;
    
    res.json({ success: true, unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
