import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const Security = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [accessLogs, setAccessLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlockIPModal, setShowBlockIPModal] = useState(false);
  const [blockIPForm, setBlockIPForm] = useState({ ip: '', reason: '', permanent: false, duration: 7 });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (activeTab === 'dashboard') {
        const response = await fetch('http://localhost:5000/api/admin/security/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setDashboard(data.dashboard);
      } else if (activeTab === 'access-logs') {
        const response = await fetch('http://localhost:5000/api/admin/security/access-logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setAccessLogs(data.logs);
      } else if (activeTab === 'incidents') {
        const response = await fetch('http://localhost:5000/api/admin/security/incidents', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setIncidents(data.incidents);
      } else if (activeTab === 'blocked-ips') {
        const response = await fetch('http://localhost:5000/api/admin/security/blocked-ips', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setBlockedIPs(data.blockedIPs);
      } else if (activeTab === 'transactions') {
        const response = await fetch('http://localhost:5000/api/admin/security/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setTransactions(data.transactions);
      }
    } catch (error) {
      addToast('Error loading security data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveIncident = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/security/incidents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'resolved', action: 'Manually resolved by admin' })
      });
      
      const data = await response.json();
      if (data.success) {
        addToast('Incident resolved', 'success');
        fetchData();
      }
    } catch (error) {
      addToast('Error resolving incident', 'error');
    }
  };

  const handleBlockIP = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/security/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blockIPForm)
      });
      
      const data = await response.json();
      if (data.success) {
        addToast('IP blocked successfully', 'success');
        setShowBlockIPModal(false);
        setBlockIPForm({ ip: '', reason: '', permanent: false, duration: 7 });
        fetchData();
      } else {
        addToast(data.message, 'error');
      }
    } catch (error) {
      addToast('Error blocking IP', 'error');
    }
  };

  const handleUnblockIP = async (ip) => {
    if (!window.confirm(`Unblock IP ${ip}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/security/block-ip/${ip}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        addToast('IP unblocked', 'success');
        fetchData();
      }
    } catch (error) {
      addToast('Error unblocking IP', 'error');
    }
  };

  const handleReviewTransaction = async (id, approved) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/security/transactions/${id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approved })
      });
      
      const data = await response.json();
      if (data.success) {
        addToast(`Transaction ${approved ? 'approved' : 'rejected'}`, 'success');
        fetchData();
      }
    } catch (error) {
      addToast('Error reviewing transaction', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Security & Fraud Detection</h1>
        <p className="text-gray-600 mt-2">Monitor security threats and suspicious activities</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap border-b border-gray-200">
        {['dashboard', 'access-logs', 'incidents', 'blocked-ips', 'transactions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      ) : (
        <>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && dashboard && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card className="text-center">
                  <div className="text-4xl font-bold text-red-600">{dashboard.failedLogins}</div>
                  <div className="text-sm text-gray-600 mt-2">Failed Logins (24h)</div>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-bold text-green-600">{dashboard.successfulLogins}</div>
                  <div className="text-sm text-gray-600 mt-2">Successful Logins (24h)</div>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-bold text-orange-600">{dashboard.openIncidents}</div>
                  <div className="text-sm text-gray-600 mt-2">Open Incidents</div>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-bold text-purple-600">{dashboard.blockedIPs}</div>
                  <div className="text-sm text-gray-600 mt-2">Blocked IPs</div>
                </Card>
              </div>

              <Card>
                <h2 className="text-xl font-semibold mb-4">Recent Security Incidents</h2>
                <div className="space-y-3">
                  {dashboard.recentIncidents.map(incident => (
                    <div key={incident.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                              incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {incident.severity.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              incident.status === 'open' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {incident.status}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{incident.description}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(incident.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Access Logs Tab */}
          {activeTab === 'access-logs' && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Access Logs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accessLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            log.action === 'login_success' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{log.ip}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{log.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Incidents Tab */}
          {activeTab === 'incidents' && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Security Incidents</h2>
              <div className="space-y-3">
                {incidents.map(incident => (
                  <div key={incident.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                            incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {incident.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            incident.status === 'open' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">{incident.description}</p>
                        {incident.ip && (
                          <p className="text-sm text-gray-600 mt-1">IP: {incident.ip}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {new Date(incident.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {incident.status === 'open' && (
                        <Button size="sm" onClick={() => handleResolveIncident(incident.id)}>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Blocked IPs Tab */}
          {activeTab === 'blocked-ips' && (
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Blocked IP Addresses</h2>
                <Button onClick={() => setShowBlockIPModal(true)}>Block New IP</Button>
              </div>
              <div className="space-y-3">
                {blockedIPs.map(blocked => (
                  <div key={blocked.ip} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-mono font-semibold text-gray-900">{blocked.ip}</p>
                      <p className="text-sm text-gray-600 mt-1">{blocked.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Blocked: {new Date(blocked.blockedAt).toLocaleString()}
                      </p>
                      {!blocked.permanent && (
                        <p className="text-xs text-gray-500">
                          Expires: {new Date(blocked.expiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleUnblockIP(blocked.ip)}>
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Transaction Monitoring</h2>
              <div className="space-y-3">
                {transactions.map(txn => (
                  <div key={txn.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            txn.status === 'flagged' ? 'bg-red-100 text-red-800' :
                            txn.status === 'approved' ? 'bg-green-100 text-green-800' :
                            txn.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {txn.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">
                          Transaction #{txn.transactionId} - ₱{txn.amount}
                        </p>
                        {txn.reason && (
                          <p className="text-sm text-gray-600 mt-1">Reason: {txn.reason}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {new Date(txn.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {txn.status === 'flagged' && !txn.reviewed && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleReviewTransaction(txn.id, true)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleReviewTransaction(txn.id, false)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Block IP Modal */}
      <Modal isOpen={showBlockIPModal} onClose={() => setShowBlockIPModal(false)} title="Block IP Address">
        <div className="space-y-4">
          <Input
            label="IP Address"
            value={blockIPForm.ip}
            onChange={(e) => setBlockIPForm({ ...blockIPForm, ip: e.target.value })}
            placeholder="192.168.1.1"
            required
          />
          <Input
            label="Reason"
            value={blockIPForm.reason}
            onChange={(e) => setBlockIPForm({ ...blockIPForm, reason: e.target.value })}
            placeholder="Multiple failed login attempts"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input
              type="number"
              value={blockIPForm.duration}
              onChange={(e) => setBlockIPForm({ ...blockIPForm, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={blockIPForm.permanent}
            />
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={blockIPForm.permanent}
              onChange={(e) => setBlockIPForm({ ...blockIPForm, permanent: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">Permanent block</span>
          </label>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowBlockIPModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleBlockIP}>
              Block IP
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Security;
