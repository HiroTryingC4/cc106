import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../components/Toast';

const System = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [statsRes, settingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/system/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/admin/system/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [statsData, settingsData] = await Promise.all([
        statsRes.json(),
        settingsRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (settingsData.success) setSettings(settingsData.settings);
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/system/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (data.success) {
        addToast('Settings saved successfully', 'success');
      } else {
        addToast(data.message || 'Failed to save settings', 'error');
      }
    } catch (error) {
      addToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/system/backup', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast('Backup downloaded successfully', 'success');
      }
    } catch (error) {
      addToast('Error creating backup', 'error');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
        <p className="text-gray-600 mt-2">System statistics and settings</p>
      </div>

      {/* System Statistics */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Users</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold">{stats?.users.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-semibold text-green-600">{stats?.users.active}</span>
              </div>
              <div className="flex justify-between">
                <span>Admins:</span>
                <span className="font-semibold">{stats?.users.byRole.admin}</span>
              </div>
              <div className="flex justify-between">
                <span>Hosts:</span>
                <span className="font-semibold">{stats?.users.byRole.host}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span className="font-semibold">{stats?.users.byRole.guest}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Bookings</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold">{stats?.bookings.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold text-yellow-600">{stats?.bookings.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmed:</span>
                <span className="font-semibold text-green-600">{stats?.bookings.confirmed}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-semibold text-blue-600">{stats?.bookings.completed}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold text-green-600">₱{stats?.revenue.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold text-yellow-600">₱{stats?.revenue.pending}</span>
              </div>
              <div className="mt-3">
                <span>Units:</span>
                <span className="font-semibold ml-2">{stats?.units.total}</span>
              </div>
              <div>
                <span>Reviews:</span>
                <span className="font-semibold ml-2">{stats?.reviews.total}</span>
              </div>
              <div>
                <span>Avg Rating:</span>
                <span className="font-semibold ml-2">{stats?.reviews.averageRating} ⭐</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* System Settings */}
      {settings && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">EST</option>
                  <option value="America/Los_Angeles">PST</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Maintenance Mode</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Allow New Registrations</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Require Email Verification</span>
              </label>
            </div>

            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </Card>
      )}

      {/* Backup & Restore */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Backup & Restore</h2>
        <p className="text-sm text-gray-600 mb-4">
          Create a backup of all system data including users, bookings, units, and reviews.
        </p>
        <Button onClick={handleBackup}>
          Download Backup
        </Button>
      </Card>
    </DashboardLayout>
  );
};

export default System;
