const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get chatbot config
router.get('/config', verifyToken, checkRole('host'), (req, res) => {
  try {
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));
    res.json({ success: true, config: chatbotData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update chatbot responses
router.put('/responses', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { faqs } = req.body;
    const chatbotPath = path.join(__dirname, '../../data/chatbot.json');
    const chatbotData = JSON.parse(fs.readFileSync(chatbotPath, 'utf8'));
    
    chatbotData.faqs = faqs;
    fs.writeFileSync(chatbotPath, JSON.stringify(chatbotData, null, 2));
    
    res.json({ success: true, message: 'Responses updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get conversations
router.get('/conversations', verifyToken, checkRole('host'), (req, res) => {
  try {
    const conversationsPath = path.join(__dirname, '../../data/conversations.json');
    
    if (!fs.existsSync(conversationsPath)) {
      return res.json({ success: true, conversations: [] });
    }
    
    const conversations = JSON.parse(fs.readFileSync(conversationsPath, 'utf8'));
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
