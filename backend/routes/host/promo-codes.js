const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const promoCodesPath = path.join(__dirname, '../../data/promo_codes.json');

// Get all promo codes for host
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const hostPromoCodes = promoCodes.filter(p => p.hostId === req.user.id);
    res.json({ success: true, promoCodes: hostPromoCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create promo code
router.post('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { code, type, value, unitIds, usageLimit, expiresAt, description } = req.body;
    
    if (!code || !type || !value) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate code format (uppercase, alphanumeric, no spaces)
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code must be uppercase letters and numbers only (no spaces)' 
      });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    
    // Check if code already exists
    const existingCode = promoCodes.find(p => p.code === code && p.active);
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    // Validate discount value
    if (type === 'percentage' && (value < 1 || value > 100)) {
      return res.status(400).json({ success: false, message: 'Percentage must be between 1 and 100' });
    }
    if (type === 'fixed' && value < 1) {
      return res.status(400).json({ success: false, message: 'Fixed amount must be greater than 0' });
    }

    const newPromoCode = {
      id: String(promoCodes.length + 1),
      hostId: req.user.id,
      code: code.toUpperCase(),
      type, // 'percentage' or 'fixed'
      value: Number(value),
      unitIds: unitIds && unitIds.length > 0 ? unitIds : null, // null means no units assigned yet, [] means all units
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usageCount: 0,
      expiresAt: expiresAt || null,
      description: description || '',
      active: true,
      isPlatformWide: false,
      createdAt: new Date().toISOString()
    };

    promoCodes.push(newPromoCode);
    fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));

    res.json({ success: true, message: 'Promo code created successfully', promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update promo code
router.put('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { active, usageLimit, expiresAt, description } = req.body;
    
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === req.params.id && p.hostId === req.user.id);
    
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

// Delete promo code
router.delete('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === req.params.id && p.hostId === req.user.id);
    
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

// Get promo code statistics
router.get('/stats', verifyToken, checkRole('host'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const hostPromoCodes = promoCodes.filter(p => p.hostId === req.user.id);

    const stats = {
      totalCodes: hostPromoCodes.length,
      activeCodes: hostPromoCodes.filter(p => p.active).length,
      totalUsage: hostPromoCodes.reduce((sum, p) => sum + p.usageCount, 0),
      expiringSoon: hostPromoCodes.filter(p => {
        if (!p.expiresAt) return false;
        const daysUntilExpiry = Math.ceil((new Date(p.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
      }).length
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get promo codes for specific unit
router.get('/for-unit/:unitId', verifyToken, checkRole('host'), (req, res) => {
  try {
    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const hostPromoCodes = promoCodes.filter(p => 
      p.hostId === req.user.id && 
      (
        (Array.isArray(p.unitIds) && p.unitIds.length === 0) || // Empty array = all units (global)
        (Array.isArray(p.unitIds) && p.unitIds.includes(req.params.unitId)) // Specific unit
      )
    );
    res.json({ success: true, promoCodes: hostPromoCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Assign promo code to unit
router.post('/assign-to-unit', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { promoCodeId, unitId } = req.body;
    
    if (!promoCodeId || !unitId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === promoCodeId && p.hostId === req.user.id);
    
    if (promoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    const promo = promoCodes[promoIndex];
    
    // If unitIds is empty array, it means all units - don't add specific unit
    if (Array.isArray(promo.unitIds) && promo.unitIds.length === 0) {
      return res.json({ success: true, message: 'Promo code already applies to all units' });
    }
    
    // Initialize unitIds if null
    if (!Array.isArray(promo.unitIds)) {
      promo.unitIds = [];
    }
    
    // Add unit if not already in list
    if (!promo.unitIds.includes(unitId)) {
      promo.unitIds.push(unitId);
      promo.updatedAt = new Date().toISOString();
      
      promoCodes[promoIndex] = promo;
      fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));
    }

    res.json({ success: true, message: 'Promo code assigned to unit', promoCode: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove promo code from unit
router.post('/remove-from-unit', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { promoCodeId, unitId } = req.body;
    
    if (!promoCodeId || !unitId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === promoCodeId && p.hostId === req.user.id);
    
    if (promoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    const promo = promoCodes[promoIndex];
    
    // Only remove if unitIds is an array
    if (Array.isArray(promo.unitIds)) {
      promo.unitIds = promo.unitIds.filter(id => id !== unitId);
      promo.updatedAt = new Date().toISOString();
      
      promoCodes[promoIndex] = promo;
      fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));
    }

    res.json({ success: true, message: 'Promo code removed from unit', promoCode: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create promo code for specific unit
router.post('/for-unit/:unitId', verifyToken, checkRole('host'), (req, res) => {
  try {
    const { code, type, value, usageLimit, expiresAt, description } = req.body;
    const unitId = req.params.unitId;
    
    if (!code || !type || !value) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate code format
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code must be uppercase letters and numbers only (no spaces)' 
      });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    
    // Check if code already exists
    const existingCode = promoCodes.find(p => p.code === code && p.active);
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    // Validate discount value
    if (type === 'percentage' && (value < 1 || value > 100)) {
      return res.status(400).json({ success: false, message: 'Percentage must be between 1 and 100' });
    }
    if (type === 'fixed' && value < 1) {
      return res.status(400).json({ success: false, message: 'Fixed amount must be greater than 0' });
    }

    const newPromoCode = {
      id: String(promoCodes.length + 1),
      hostId: req.user.id,
      code: code.toUpperCase(),
      type,
      value: Number(value),
      unitIds: [unitId], // Assign to specific unit
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usageCount: 0,
      usageByUnit: {},
      expiresAt: expiresAt || null,
      description: description || '',
      active: true,
      isPlatformWide: false,
      createdAt: new Date().toISOString()
    };

    promoCodes.push(newPromoCode);
    fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));

    res.json({ success: true, message: 'Promo code created for unit', promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
