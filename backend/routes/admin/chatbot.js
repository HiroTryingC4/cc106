const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get chatbot configuration and FAQs
router.get('/config', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));
    
    const config = {
      enabled: true,
      welcomeMessage: chatbotData.greetings[0],
      fallbackMessage: chatbotData.fallback[0],
      responseDelay: 1000
    };

    res.json({ 
      success: true, 
      config,
      faqs: chatbotData.faqs || [],
      responses: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update chatbot configuration
router.put('/config', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { enabled, welcomeMessage, fallbackMessage, responseDelay } = req.body;
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));

    // Update greetings and fallback
    if (welcomeMessage) {
      chatbotData.greetings[0] = welcomeMessage;
    }
    if (fallbackMessage) {
      chatbotData.fallback[0] = fallbackMessage;
    }

    fs.writeFileSync(
      path.join(__dirname, '../../data/chatbot.json'),
      JSON.stringify(chatbotData, null, 2)
    );

    res.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all FAQs
router.get('/faqs', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));
    res.json({ success: true, faqs: chatbotData.faqs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new FAQ
router.post('/faqs', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));

    const newFaq = {
      id: String(chatbotData.faqs.length + 1),
      question,
      answer,
      keywords: [category, question.toLowerCase()]
    };

    chatbotData.faqs.push(newFaq);

    fs.writeFileSync(
      path.join(__dirname, '../../data/chatbot.json'),
      JSON.stringify(chatbotData, null, 2)
    );

    res.json({ success: true, message: 'FAQ added successfully', faq: newFaq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update FAQ
router.put('/faqs/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));

    const faqIndex = chatbotData.faqs.findIndex(f => f.id === id);
    if (faqIndex === -1) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    chatbotData.faqs[faqIndex] = {
      ...chatbotData.faqs[faqIndex],
      question,
      answer,
      keywords: [category, question.toLowerCase()]
    };

    fs.writeFileSync(
      path.join(__dirname, '../../data/chatbot.json'),
      JSON.stringify(chatbotData, null, 2)
    );

    res.json({ success: true, message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete FAQ
router.delete('/faqs/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const chatbotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/chatbot.json'), 'utf8'));

    chatbotData.faqs = chatbotData.faqs.filter(f => f.id !== id);

    fs.writeFileSync(
      path.join(__dirname, '../../data/chatbot.json'),
      JSON.stringify(chatbotData, null, 2)
    );

    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
