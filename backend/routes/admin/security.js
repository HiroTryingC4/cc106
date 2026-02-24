const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const securityLogsPath = path.join(__dirname, '../../data/security_logs.json');

// Get security dashboard overview
router.get('/dashboard', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAccessLogs = securityData.accessLogs.filter(log => 
      new Date(log.timestamp) > last24Hours
    );
    
    const failedLogins = recentAccessLogs.filter(log => log.action === 'login_failed').length;
    const successfulLogins = recentAccessLogs.filter(log => log.action === 'login_success').length;
    
    const openIncidents = securityData.securityIncidents.filter(i => i.status === 'open').length;
    const flaggedTransactions = securityData.transactionMonitoring.filter(t => t.status === 'flagged' && !t.reviewed).length;
    
    res.json({
      success: true,
      dashboard: {
        failedLogins,
        successfulLogins,
        openIncidents,
        blockedIPs: securityData.blockedIPs.length,
        flaggedTransactions,
        recentIncidents: securityData.securityIncidents.slice(-5).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get access logs
router.get('/access-logs', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { limit = 50, action } = req.query;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    let logs = securityData.accessLogs;
    
    if (action) {
      logs = logs.filter(log => log.action === action);
    }
    
    logs = logs.slice(-limit).reverse();
    
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get security incidents
router.get('/incidents', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { status } = req.query;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    let incidents = securityData.securityIncidents;
    
    if (status) {
      incidents = incidents.filter(i => i.status === status);
    }
    
    incidents = incidents.reverse();
    
    res.json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update incident status
router.put('/incidents/:id', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const { status, action } = req.body;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    const incident = securityData.securityIncidents.find(i => i.id === id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    incident.status = status;
    if (action) {
      incident.actions.push({
        action,
        timestamp: new Date().toISOString(),
        adminId: req.user.id
      });
    }
    
    fs.writeFileSync(securityLogsPath, JSON.stringify(securityData, null, 2));
    
    res.json({ success: true, message: 'Incident updated', incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get blocked IPs
router.get('/blocked-ips', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    res.json({ success: true, blockedIPs: securityData.blockedIPs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Block IP
router.post('/block-ip', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { ip, reason, permanent = false, duration = 7 } = req.body;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    // Check if already blocked
    const existing = securityData.blockedIPs.find(b => b.ip === ip);
    if (existing) {
      return res.status(400).json({ success: false, message: 'IP already blocked' });
    }
    
    const blockedIP = {
      ip,
      reason,
      blockedAt: new Date().toISOString(),
      blockedBy: req.user.id,
      expiresAt: permanent ? null : new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      permanent
    };
    
    securityData.blockedIPs.push(blockedIP);
    fs.writeFileSync(securityLogsPath, JSON.stringify(securityData, null, 2));
    
    res.json({ success: true, message: 'IP blocked successfully', blockedIP });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unblock IP
router.delete('/block-ip/:ip', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { ip } = req.params;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    securityData.blockedIPs = securityData.blockedIPs.filter(b => b.ip !== ip);
    fs.writeFileSync(securityLogsPath, JSON.stringify(securityData, null, 2));
    
    res.json({ success: true, message: 'IP unblocked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get transaction monitoring
router.get('/transactions', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { status } = req.query;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    let transactions = securityData.transactionMonitoring;
    
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }
    
    transactions = transactions.reverse();
    
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Review transaction
router.put('/transactions/:id/review', verifyToken, checkRole('admin'), (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const securityData = JSON.parse(fs.readFileSync(securityLogsPath, 'utf8'));
    
    const transaction = securityData.transactionMonitoring.find(t => t.id === id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    
    transaction.reviewed = true;
    transaction.reviewedBy = req.user.id;
    transaction.reviewedAt = new Date().toISOString();
    transaction.status = approved ? 'approved' : 'rejected';
    
    fs.writeFileSync(securityLogsPath, JSON.stringify(securityData, null, 2));
    
    res.json({ success: true, message: 'Transaction reviewed', transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
