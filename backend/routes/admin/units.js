const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

// Get all units
router.get('/', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8'));
    
    const enrichedUnits = units.map(unit => {
      const host = users.find(u => u.id === unit.hostId);
      return {
        ...unit,
        host: host ? { id: host.id, name: `${host.firstName} ${host.lastName}`, email: host.email } : null
      };
    });
    
    res.json({ success: true, units: enrichedUnits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single unit
router.get('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unit = units.find(u => u.id === req.params.id);
    
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    res.json({ success: true, unit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update unit status
router.put('/:id/status', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['available', 'unavailable', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    units[unitIndex].status = status;
    units[unitIndex].available = status === 'available';
    
    fs.writeFileSync(path.join(__dirname, '../../data/units.json'), JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Unit status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete unit
router.delete('/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const filteredUnits = units.filter(u => u.id !== req.params.id);
    
    if (units.length === filteredUnits.length) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    fs.writeFileSync(path.join(__dirname, '../../data/units.json'), JSON.stringify(filteredUnits, null, 2));
    
    res.json({ success: true, message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve listing
router.put('/:id/approve', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    units[unitIndex].moderationStatus = 'approved';
    units[unitIndex].approvedAt = new Date().toISOString();
    units[unitIndex].approvedBy = req.user.id;
    units[unitIndex].status = 'available';
    
    fs.writeFileSync(path.join(__dirname, '../../data/units.json'), JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Listing approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject listing
router.put('/:id/reject', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }
    
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    units[unitIndex].moderationStatus = 'rejected';
    units[unitIndex].rejectedAt = new Date().toISOString();
    units[unitIndex].rejectedBy = req.user.id;
    units[unitIndex].rejectionReason = reason;
    units[unitIndex].status = 'unavailable';
    
    fs.writeFileSync(path.join(__dirname, '../../data/units.json'), JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Listing rejected successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Flag listing as suspicious
router.put('/:id/flag', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { reason } = req.body;
    
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    units[unitIndex].flagged = !units[unitIndex].flagged;
    units[unitIndex].flagReason = units[unitIndex].flagged ? reason : null;
    units[unitIndex].flaggedAt = units[unitIndex].flagged ? new Date().toISOString() : null;
    units[unitIndex].flaggedBy = units[unitIndex].flagged ? req.user.id : null;
    
    fs.writeFileSync(path.join(__dirname, '../../data/units.json'), JSON.stringify(units, null, 2));
    
    res.json({ 
      success: true, 
      message: units[unitIndex].flagged ? 'Listing flagged successfully' : 'Flag removed successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update unit content (photos/description moderation)
router.put('/:id/content', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { description, images, name } = req.body;
    
    const units = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/units.json'), 'utf8'));
    const unitIndex = units.findIndex(u => u.id === req.params.id);
    
    if (unitIndex === -1) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }
    
    if (description) units[unitIndex].description = description;
    if (images) units[unitIndex].images = images;
    if (name) units[unitIndex].name = name;
    
    units[unitIndex].contentModeratedAt = new Date().toISOString();
    units[unitIndex].contentModeratedBy = req.user.id;
    
    fs.writeFileSync(path.join(__dirname, '../../data/units.json'), JSON.stringify(units, null, 2));
    
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
