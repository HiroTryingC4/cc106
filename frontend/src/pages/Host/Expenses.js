import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const Expenses = ({ isTab = false }) => {
  const { addToast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: 'maintenance',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    unitId: ''
  });

  const categories = [
    { value: 'maintenance', label: 'Maintenance costs' },
    { value: 'utilities', label: 'Utilities expenses' },
    { value: 'cleaning', label: 'Cleaning service costs' },
    { value: 'supplies', label: 'Supplies and inventory' },
    { value: 'improvements', label: 'Property improvements' },
    { value: 'insurance', label: 'Insurance and taxes' },
    { value: 'marketing', label: 'Marketing expenses' },
    { value: 'other', label: 'Other operational costs' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [expensesRes, summaryRes, unitsRes] = await Promise.all([
        fetch('http://localhost:5000/api/host/expenses', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/expenses/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/host/units', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [expensesData, summaryData, unitsData] = await Promise.all([
        expensesRes.json(),
        summaryRes.json(),
        unitsRes.json()
      ]);

      if (expensesData.success) setExpenses(expensesData.expenses);
      if (summaryData.success) setSummary(summaryData.summary);
      if (unitsData.success) setUnits(unitsData.units);
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('Error loading expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingExpense 
        ? `http://localhost:5000/api/host/expenses/${editingExpense.id}`
        : 'http://localhost:5000/api/host/expenses';
      
      const response = await fetch(url, {
        method: editingExpense ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast(`Expense ${editingExpense ? 'updated' : 'added'} successfully`, 'success');
        setShowModal(false);
        setEditingExpense(null);
        setFormData({
          category: 'maintenance',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          unitId: ''
        });
        fetchData();
      } else {
        addToast(data.message || 'Error saving expense', 'error');
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      addToast('Error saving expense. Please restart the backend server.', 'error');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      date: expense.date.split('T')[0],
      unitId: expense.unitId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Expense deleted successfully', 'success');
        fetchData();
      } else {
        addToast(data.message || 'Error deleting expense', 'error');
      }
    } catch (error) {
      addToast('Error deleting expense', 'error');
    }
  };

  const getCategoryLabel = (value) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  const getUnitName = (unitId) => {
    if (!unitId) return 'All Properties';
    return units.find(u => u.id === unitId)?.name || 'Unknown';
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
            <p className="text-gray-600 mt-2">Track and manage your property expenses</p>
          </div>
          <Button onClick={() => {
            setEditingExpense(null);
            setFormData({
              category: 'maintenance',
              amount: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              unitId: ''
            });
            setShowModal(true);
          }}>
            Add Expense
          </Button>
        </div>
      )}

      {isTab && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => {
            setEditingExpense(null);
            setFormData({
              category: 'maintenance',
              amount: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              unitId: ''
            });
            setShowModal(true);
          }}>
            Add Expense
          </Button>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {categories.map(cat => (
            <Card key={cat.value}>
              <h3 className="text-sm text-gray-600 mb-1">{cat.label}</h3>
              <p className="text-2xl font-bold text-gray-900">
                ₱{summary[cat.value]?.toFixed(2) || '0.00'}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Total Expenses */}
      <Card className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg text-gray-600">Total Expenses</h3>
            <p className="text-4xl font-bold text-red-600 mt-2">
              ₱{summary?.total?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Entries</p>
            <p className="text-2xl font-semibold text-gray-700">{expenses.length}</p>
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Expense History</h2>
        
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No expenses recorded yet</p>
            <Button className="mt-4" onClick={() => setShowModal(true)}>
              Add Your First Expense
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Property</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getCategoryLabel(expense.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{expense.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {getUnitName(expense.unitId)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      ₱{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₱)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
              placeholder="Describe the expense..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property (Optional)
            </label>
            <select
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Properties</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingExpense ? 'Update' : 'Add'} Expense
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingExpense(null);
              }}
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

export default Expenses;
