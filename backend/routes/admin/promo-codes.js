const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const promoCodesPath = path.join(__dirname, '../../data/promo_codes.json');

// Get all promo codes (admin view)
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    res.json({ success: true, promoCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create platform-wide promo code
router.post('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { code, type, value, usageLimit, expiresAt, description } = req.body;
    
    if (!code || !type || !value) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code must be uppercase letters and numbers only (no spaces)' 
      });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    
    const existingCode = promoCodes.find(p => p.code === code && p.active);
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    if (type === 'percentage' && (value < 1 || value > 100)) {
      return res.status(400).json({ success: false, message: 'Percentage must be between 1 and 100' });
    }
    if (type === 'fixed' && value < 1) {
      return res.status(400).json({ success: false, message: 'Fixed amount must be greater than 0' });
    }

    const newPromoCode = {
      id: String(promoCodes.length + 1),
      hostId: null, // Platform-wide codes have no host
      code: code.toUpperCase(),
      type,
      value: Number(value),
      unitIds: [], // Empty means all units
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usageCount: 0,
      expiresAt: expiresAt || null,
      description: description || '',
      active: true,
      isPlatformWide: true,
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    promoCodes.push(newPromoCode);
    fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));

    res.json({ success: true, message: 'Platform-wide promo code created successfully', promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update any promo code (admin)
router.put('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { active, usageLimit, expiresAt, description } = req.body;
    
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === req.params.id);
    
    if (promoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    const promo = promoCodes[promoIndex];
    
    if (active !== undefined) promo.active = active;
    if (usageLimit !== undefined) promo.usageLimit = usageLimit ? Number(usageLimit) : null;
    if (expiresAt !== undefined) promo.expiresAt = expiresAt;
    if (description !== undefined) promo.description = description;
    promo.updatedAt = new Date().toISOString();

    promoCodes[promoIndex] = promo;
    fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));

    res.json({ success: true, message: 'Promo code updated successfully', promoCode: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete any promo code (admin)
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === req.params.id);
    
    if (promoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    promoCodes.splice(promoIndex, 1);
    fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));

    res.json({ success: true, message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get promo code statistics (admin)
router.get('/stats', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));

    const stats = {
      totalCodes: promoCodes.length,
      platformWideCodes: promoCodes.filter(p => p.isPlatformWide).length,
      hostCodes: promoCodes.filter(p => !p.isPlatformWide).length,
      activeCodes: promoCodes.filter(p => p.active).length,
      totalUsage: promoCodes.reduce((sum, p) => sum + p.usageCount, 0),
      topCodes: promoCodes
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5)
        .map(p => ({ code: p.code, usage: p.usageCount, type: p.type, value: p.value }))
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
