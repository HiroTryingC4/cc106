const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const expensesFile = path.join(__dirname, '../../data/expenses.json');

// Get all expenses for host
router.get('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    const hostExpenses = expenses.filter(e => e.hostId === req.user.id);
    res.json({ success: true, expenses: hostExpenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get expense summary by category
router.get('/summary', verifyToken, checkRole('host'), (req, res) => {
  try {
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    const hostExpenses = expenses.filter(e => e.hostId === req.user.id);
    
    const summary = {
      maintenance: 0,
      utilities: 0,
      cleaning: 0,
      supplies: 0,
      improvements: 0,
      insurance: 0,
      marketing: 0,
      other: 0,
      total: 0
    };
    
    hostExpenses.forEach(expense => {
      summary[expense.category] = (summary[expense.category] || 0) + expense.amount;
      summary.total += expense.amount;
    });
    
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new expense
router.post('/', verifyToken, checkRole('host'), (req, res) => {
  try {
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    const { category, amount, description, date, unitId } = req.body;
    
    const newExpense = {
      id: Date.now().toString(),
      hostId: req.user.id,
      unitId: unitId || null,
      category,
      amount: parseFloat(amount),
      description,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
    
    res.json({ success: true, expense: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update expense
router.put('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    const index = expenses.findIndex(e => e.id === req.params.id && e.hostId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    
    const { category, amount, description, date, unitId } = req.body;
    expenses[index] = {
      ...expenses[index],
      category: category || expenses[index].category,
      amount: amount ? parseFloat(amount) : expenses[index].amount,
      description: description || expenses[index].description,
      date: date || expenses[index].date,
      unitId: unitId !== undefined ? unitId : expenses[index].unitId,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
    res.json({ success: true, expense: expenses[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete expense
router.delete('/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const expenses = JSON.parse(fs.readFileSync(expensesFile, 'utf8'));
    const filtered = expenses.filter(e => !(e.id === req.params.id && e.hostId === req.user.id));
    
    if (filtered.length === expenses.length) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    
    fs.writeFileSync(expensesFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
