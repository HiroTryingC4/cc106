const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, checkRole } = require('../../middleware/auth');

const employeesFile = path.join(__dirname, '../../data/employees.json');
const payrollFile = path.join(__dirname, '../../data/payroll.json');

// ========== EMPLOYEE MANAGEMENT ==========

// Get all employees
router.get('/employees', verifyToken, checkRole('host'), (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    const hostEmployees = employees.filter(e => e.hostId === req.user.id);
    res.json({ success: true, employees: hostEmployees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new employee
router.post('/employees', verifyToken, checkRole('host'), (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    const { name, position, salary, paymentFrequency, startDate, email, phone } = req.body;
    
    const newEmployee = {
      id: Date.now().toString(),
      hostId: req.user.id,
      name,
      position,
      salary: parseFloat(salary),
      paymentFrequency, // weekly, bi-weekly, monthly
      startDate,
      email: email || '',
      phone: phone || '',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 2));
    
    res.json({ success: true, employee: newEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update employee
router.put('/employees/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    const index = employees.findIndex(e => e.id === req.params.id && e.hostId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    const { name, position, salary, paymentFrequency, email, phone, status } = req.body;
    employees[index] = {
      ...employees[index],
      name: name || employees[index].name,
      position: position || employees[index].position,
      salary: salary ? parseFloat(salary) : employees[index].salary,
      paymentFrequency: paymentFrequency || employees[index].paymentFrequency,
      email: email !== undefined ? email : employees[index].email,
      phone: phone !== undefined ? phone : employees[index].phone,
      status: status || employees[index].status,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 2));
    res.json({ success: true, employee: employees[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete employee
router.delete('/employees/:id', verifyToken, checkRole('host'), (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    const filtered = employees.filter(e => !(e.id === req.params.id && e.hostId === req.user.id));
    
    if (filtered.length === employees.length) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    fs.writeFileSync(employeesFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== PAYROLL MANAGEMENT ==========

// Get all payroll records
router.get('/records', verifyToken, checkRole('host'), (req, res) => {
  try {
    const payroll = JSON.parse(fs.readFileSync(payrollFile, 'utf8'));
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    
    const hostPayroll = payroll.filter(p => p.hostId === req.user.id);
    
    // Enrich with employee names
    const enrichedPayroll = hostPayroll.map(record => {
      const employee = employees.find(e => e.id === record.employeeId);
      return {
        ...record,
        employeeName: employee ? employee.name : 'Unknown',
        employeePosition: employee ? employee.position : 'Unknown'
      };
    });
    
    res.json({ success: true, payroll: enrichedPayroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add payroll record
router.post('/records', verifyToken, checkRole('host'), (req, res) => {
  try {
    const payroll = JSON.parse(fs.readFileSync(payrollFile, 'utf8'));
    const { employeeId, amount, paymentDate, paymentMethod, deductions, bonuses, notes } = req.body;
    
    const grossPay = parseFloat(amount);
    const totalDeductions = parseFloat(deductions || 0);
    const totalBonuses = parseFloat(bonuses || 0);
    const netPay = grossPay - totalDeductions + totalBonuses;
    
    const newRecord = {
      id: Date.now().toString(),
      hostId: req.user.id,
      employeeId,
      grossPay,
      deductions: totalDeductions,
      bonuses: totalBonuses,
      netPay,
      paymentDate,
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      status: 'paid',
      createdAt: new Date().toISOString()
    };
    
    payroll.push(newRecord);
    fs.writeFileSync(payrollFile, JSON.stringify(payroll, null, 2));
    
    res.json({ success: true, record: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payroll summary
router.get('/summary', verifyToken, checkRole('host'), (req, res) => {
  try {
    const payroll = JSON.parse(fs.readFileSync(payrollFile, 'utf8'));
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    
    const hostPayroll = payroll.filter(p => p.hostId === req.user.id);
    const hostEmployees = employees.filter(e => e.hostId === req.user.id);
    
    const totalPaid = hostPayroll.reduce((sum, p) => sum + p.netPay, 0);
    const activeEmployees = hostEmployees.filter(e => e.status === 'active').length;
    const monthlyPayroll = hostEmployees
      .filter(e => e.status === 'active' && e.paymentFrequency === 'monthly')
      .reduce((sum, e) => sum + e.salary, 0);
    
    // Current month payroll
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthPayroll = hostPayroll.filter(p => {
      const date = new Date(p.paymentDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, p) => sum + p.netPay, 0);
    
    res.json({
      success: true,
      summary: {
        totalPaid,
        activeEmployees,
        monthlyPayroll,
        currentMonthPayroll,
        totalEmployees: hostEmployees.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get employee salary history
router.get('/history/:employeeId', verifyToken, checkRole('host'), (req, res) => {
  try {
    const payroll = JSON.parse(fs.readFileSync(payrollFile, 'utf8'));
    const history = payroll.filter(p => 
      p.employeeId === req.params.employeeId && p.hostId === req.user.id
    );
    
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate payroll for employee
router.post('/calculate', verifyToken, checkRole('host'), (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
    const { employeeId, workDays, overtimeHours, deductions, bonuses } = req.body;
    
    const employee = employees.find(e => e.id === employeeId && e.hostId === req.user.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    let grossPay = employee.salary;
    
    // Adjust based on payment frequency and work days
    if (employee.paymentFrequency === 'weekly') {
      grossPay = (employee.salary / 4) * (workDays || 1);
    } else if (employee.paymentFrequency === 'bi-weekly') {
      grossPay = (employee.salary / 2) * (workDays || 1);
    }
    
    // Add overtime (assuming 1.5x rate)
    if (overtimeHours) {
      const hourlyRate = employee.salary / 160; // Assuming 160 hours/month
      grossPay += (hourlyRate * 1.5 * overtimeHours);
    }
    
    const totalDeductions = parseFloat(deductions || 0);
    const totalBonuses = parseFloat(bonuses || 0);
    
    // Tax calculation (simplified - 10% for demo)
    const tax = grossPay * 0.10;
    
    const netPay = grossPay - totalDeductions - tax + totalBonuses;
    
    res.json({
      success: true,
      calculation: {
        employeeName: employee.name,
        grossPay: grossPay.toFixed(2),
        deductions: totalDeductions.toFixed(2),
        tax: tax.toFixed(2),
        bonuses: totalBonuses.toFixed(2),
        netPay: netPay.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
