const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const promoCodesPath = path.join(__dirname, '../data/promo_codes.json');
const unitsPath = path.join(__dirname, '../data/units.json');

// Validate promo code (public endpoint for booking flow)
router.post('/validate', (req, res) => {
  try {
    const { code, unitId, bookingAmount } = req.body;
    
    if (!code || !unitId || !bookingAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const units = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    
    const unit = units.find(u => u.id === unitId);
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    // Find promo code (case-insensitive)
    const promo = promoCodes.find(p => 
      p.code.toUpperCase() === code.toUpperCase() && 
      p.active
    );

    if (!promo) {
      return res.json({ 
        success: false, 
        valid: false,
        message: 'Invalid promo code' 
      });
    }

    // Check if expired
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.json({ 
        success: false, 
        valid: false,
        message: 'This promo code has expired' 
      });
    }

    // Check usage limit
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return res.json({ 
        success: false, 
        valid: false,
        message: 'This promo code has reached its usage limit' 
      });
    }

    // Check if promo applies to this unit
    if (!promo.isPlatformWide) {
      // Host-specific promo
      if (promo.hostId !== unit.hostId) {
        return res.json({ 
          success: false, 
          valid: false,
          message: 'This promo code is not valid for this property' 
        });
      }

      // Check unit-specific restrictions
      if (promo.unitIds.length > 0 && !promo.unitIds.includes(unitId)) {
        return res.json({ 
          success: false, 
          valid: false,
          message: 'This promo code is not valid for this property' 
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.type === 'percentage') {
      discountAmount = (bookingAmount * promo.value) / 100;
    } else if (promo.type === 'fixed') {
      discountAmount = Math.min(promo.value, bookingAmount); // Can't discount more than total
    }

    const finalAmount = Math.max(0, bookingAmount - discountAmount);

    res.json({ 
      success: true, 
      valid: true,
      promoCode: {
        id: promo.id,
        code: promo.code,
        type: promo.type,
        value: promo.value,
        description: promo.description
      },
      discount: {
        amount: Math.round(discountAmount * 100) / 100,
        originalAmount: bookingAmount,
        finalAmount: Math.round(finalAmount * 100) / 100
      },
      message: `Promo code applied! You saved $${Math.round(discountAmount * 100) / 100}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply promo code (increment usage count)
router.post('/apply', (req, res) => {
  try {
    const { promoId } = req.body;
    
    if (!promoId) {
      return res.status(400).json({ success: false, message: 'Promo ID required' });
    }

    const promoCodes = JSON.parse(fs.readFileSync(promoCodesPath, 'utf8'));
    const promoIndex = promoCodes.findIndex(p => p.id === promoId);
    
    if (promoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    promoCodes[promoIndex].usageCount += 1;
    promoCodes[promoIndex].lastUsedAt = new Date().toISOString();
    
    fs.writeFileSync(promoCodesPath, JSON.stringify(promoCodes, null, 2));

    res.json({ success: true, message: 'Promo code applied successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
