import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const Payroll = ({ isTab = false }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('employees'); // employees, payroll, history
  const [employees, setEmployees] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    salary: '',
    paymentFrequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    email: '',
    phone: ''
  });
  
  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    deductions: '0',
    bonuses: '0',
    notes: ''
  });
  
  const [calculatorForm, setCalculatorForm] = useState({
    employeeId: '',
    workDays: '1',
    overtimeHours: '0',
    deductions: '0',
    bonuses: '0'
  });
  
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [employeesRes, payrollRes, summaryRes] = await Promise.all([
        fetch('http://localhost:5000/api/host/payroll/employees', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/payroll/records', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/payroll/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [employeesData, payrollData, summaryData] = await Promise.all([
        employeesRes.json(),
        payrollRes.json(),
        summaryRes.json()
      ]);

      if (employeesData.success) setEmployees(employeesData.employees);
      if (payrollData.success) setPayrollRecords(payrollData.payroll);
      if (summaryData.success) setSummary(summaryData.summary);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('Error loading payroll data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Employee Management
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingEmployee 
        ? `http://localhost:5000/api/host/payroll/employees/${editingEmployee.id}`
        : 'http://localhost:5000/api/host/payroll/employees';
      
      const response = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeForm)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(`Employee ${editingEmployee ? 'updated' : 'added'} successfully`, 'success');
        setShowEmployeeModal(false);
        setEditingEmployee(null);
        resetEmployeeForm();
        fetchData();
      } else {
        addToast(data.message || 'Error saving employee', 'error');
      }
    } catch (error) {
      addToast('Error saving employee', 'error');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/payroll/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Employee deleted successfully', 'success');
        fetchData();
      }
    } catch (error) {
      addToast('Error deleting employee', 'error');
    }
  };

  // Payroll Management
  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/payroll/records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payrollForm)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Payroll record added successfully', 'success');
        setShowPayrollModal(false);
        resetPayrollForm();
        fetchData();
      } else {
        addToast(data.message || 'Error adding payroll record', 'error');
      }
    } catch (error) {
      addToast('Error adding payroll record', 'error');
    }
  };

  // Payroll Calculator
  const handleCalculate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/payroll/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calculatorForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setCalculation(data.calculation);
      } else {
        addToast(data.message || 'Error calculating payroll', 'error');
      }
    } catch (error) {
      addToast('Error calculating payroll', 'error');
    }
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({
      name: '',
      position: '',
      salary: '',
      paymentFrequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      email: '',
      phone: ''
    });
  };

  const resetPayrollForm = () => {
    setPayrollForm({
      employeeId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      deductions: '0',
      bonuses: '0',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const content = (
    <>
      {!isTab && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payroll & Salary Management</h1>
          <p className="text-gray-600 mt-2">Manage staff salaries and payroll</p>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <h3 className="text-sm text-gray-600 mb-1">Active Employees</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.activeEmployees}</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600 mb-1">Monthly Payroll</h3>
            <p className="text-3xl font-bold text-green-600">₱{summary.monthlyPayroll.toFixed(0)}</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600 mb-1">This Month Paid</h3>
            <p className="text-3xl font-bold text-purple-600">₱{summary.currentMonthPayroll.toFixed(0)}</p>
          </Card>
          <Card>
            <h3 className="text-sm text-gray-600 mb-1">Total Paid</h3>
            <p className="text-3xl font-bold text-gray-700">₱{summary.totalPaid.toFixed(0)}</p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('employees')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'employees'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Employee Management
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'payroll'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Payroll Records
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-3 px-4 font-medium ${
              activeTab === 'calculator'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Payroll Calculator
          </button>
        </div>
      </div>

      {/* Employee Management Tab */}
      {activeTab === 'employees' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Staff Members</h2>
            <Button onClick={() => {
              setEditingEmployee(null);
              resetEmployeeForm();
              setShowEmployeeModal(true);
            }}>
              Add Employee
            </Button>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No employees added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Frequency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{emp.name}</td>
                      <td className="px-4 py-3 text-sm">{emp.position}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₱{emp.salary.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm capitalize">{emp.paymentFrequency}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          emp.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button
                          onClick={() => {
                            setEditingEmployee(emp);
                            setEmployeeForm({
                              name: emp.name,
                              position: emp.position,
                              salary: emp.salary,
                              paymentFrequency: emp.paymentFrequency,
                              startDate: emp.startDate.split('T')[0],
                              email: emp.email || '',
                              phone: emp.phone || ''
                            });
                            setShowEmployeeModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Payroll Records Tab */}
      {activeTab === 'payroll' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Payment History</h2>
            <Button onClick={() => {
              resetPayrollForm();
              setShowPayrollModal(true);
            }}>
              Add Payment
            </Button>
          </div>

          {payrollRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No payroll records yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Position</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Gross Pay</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Deductions</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Bonuses</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Net Pay</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payrollRecords.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)).map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {new Date(record.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{record.employeeName}</td>
                      <td className="px-4 py-3 text-sm">{record.employeePosition}</td>
                      <td className="px-4 py-3 text-sm text-right">₱{record.grossPay.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-₱{record.deductions.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">+₱{record.bonuses.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">₱{record.netPay.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm capitalize">{record.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Payroll Calculator Tab */}
      {activeTab === 'calculator' && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Payroll Calculator</h2>
          
          <form onSubmit={handleCalculate} className="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Employee
                </label>
                <select
                  value={calculatorForm.employeeId}
                  onChange={(e) => setCalculatorForm({ ...calculatorForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Choose employee...</option>
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Days/Periods
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={calculatorForm.workDays}
                  onChange={(e) => setCalculatorForm({ ...calculatorForm, workDays: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overtime Hours
                </label>
                <Input
                  type="number"
                  step="0.5"
                  value={calculatorForm.overtimeHours}
                  onChange={(e) => setCalculatorForm({ ...calculatorForm, overtimeHours: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deductions (₱)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={calculatorForm.deductions}
                  onChange={(e) => setCalculatorForm({ ...calculatorForm, deductions: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonuses (₱)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={calculatorForm.bonuses}
                  onChange={(e) => setCalculatorForm({ ...calculatorForm, bonuses: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="mt-6">
              Calculate Payroll
            </Button>
          </form>

          {calculation && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Calculation Result for {calculation.employeeName}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <span className="font-semibold">₱{calculation.grossPay}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Deductions:</span>
                  <span className="font-semibold">-₱{calculation.deductions}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Tax (10%):</span>
                  <span className="font-semibold">-₱{calculation.tax}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Bonuses:</span>
                  <span className="font-semibold">+₱{calculation.bonuses}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 mt-2 flex justify-between text-lg">
                  <span className="font-bold">Net Pay:</span>
                  <span className="font-bold text-blue-600">₱{calculation.netPay}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Employee Modal */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setEditingEmployee(null);
        }}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      >
        <form onSubmit={handleEmployeeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              value={employeeForm.name}
              onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              required
              placeholder="Employee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <Input
              value={employeeForm.position}
              onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
              required
              placeholder="e.g., Cleaner, Maintenance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₱)</label>
            <Input
              type="number"
              step="0.01"
              value={employeeForm.salary}
              onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
            <select
              value={employeeForm.paymentFrequency}
              onChange={(e) => setEmployeeForm({ ...employeeForm, paymentFrequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Input
              type="date"
              value={employeeForm.startDate}
              onChange={(e) => setEmployeeForm({ ...employeeForm, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
            <Input
              type="email"
              value={employeeForm.email}
              onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
              placeholder="employee@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <Input
              type="tel"
              value={employeeForm.phone}
              onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
              placeholder="+63 XXX XXX XXXX"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingEmployee ? 'Update' : 'Add'} Employee
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowEmployeeModal(false);
                setEditingEmployee(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payroll Modal */}
      <Modal
        isOpen={showPayrollModal}
        onClose={() => setShowPayrollModal(false)}
        title="Add Payroll Record"
      >
        <form onSubmit={handlePayrollSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              value={payrollForm.employeeId}
              onChange={(e) => setPayrollForm({ ...payrollForm, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select employee...</option>
              {employees.filter(e => e.status === 'active').map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Amount (₱)</label>
            <Input
              type="number"
              step="0.01"
              value={payrollForm.amount}
              onChange={(e) => setPayrollForm({ ...payrollForm, amount: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <Input
              type="date"
              value={payrollForm.paymentDate}
              onChange={(e) => setPayrollForm({ ...payrollForm, paymentDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={payrollForm.paymentMethod}
              onChange={(e) => setPayrollForm({ ...payrollForm, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
              <option value="gcash">GCash</option>
              <option value="check">Check</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (₱)</label>
            <Input
              type="number"
              step="0.01"
              value={payrollForm.deductions}
              onChange={(e) => setPayrollForm({ ...payrollForm, deductions: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bonuses (₱)</label>
            <Input
              type="number"
              step="0.01"
              value={payrollForm.bonuses}
              onChange={(e) => setPayrollForm({ ...payrollForm, bonuses: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={payrollForm.notes}
              onChange={(e) => setPayrollForm({ ...payrollForm, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="2"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Payment
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPayrollModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );

  return isTab ? content : <DashboardLayout>{content}</DashboardLayout>;
};

export default Payroll;
