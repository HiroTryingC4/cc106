import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

// Import the three existing pages as components
import Financial from './Financial';
import Expenses from './Expenses';
import Payroll from './Payroll';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, expenses, payroll

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <p className="text-gray-600 mt-2">Comprehensive financial tracking and management</p>
      </div>

      {/* Main Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-6 font-medium transition ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💰 Financial Overview
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-3 px-6 font-medium transition ${
              activeTab === 'expenses'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💸 Expense Tracking
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`pb-3 px-6 font-medium transition ${
              activeTab === 'payroll'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💵 Payroll Management
          </button>
        </div>
      </div>

      {/* Tab Content - Render components without DashboardLayout wrapper */}
      <div>
        {activeTab === 'overview' && <Financial isTab={true} />}
        {activeTab === 'expenses' && <Expenses isTab={true} />}
        {activeTab === 'payroll' && <Payroll isTab={true} />}
      </div>
    </DashboardLayout>
  );
};

export default FinancialManagement;
