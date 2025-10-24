import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { 
  FiGrid, 
  FiCalendar, 
  FiUsers, 
  FiSettings,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiCheck,
  FiXCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard state
  const [bookings, setBookings] = useState([]);
  const [resourcesCount, setResourcesCount] = useState(0);
  
  // Resources state
  const [resources, setResources] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', type: '', location: '' });
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboard();
    } else if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [bookingsRes, resourcesRes] = await Promise.all([
        axios.get('/api/bookings'),
        axios.get('/api/resources')
      ]);
      setBookings(bookingsRes.data || []);
      const resData = resourcesRes?.data;
      const resList = Array.isArray(resData) ? resData : Array.isArray(resData?.resources) ? resData.resources : [];
      setResourcesCount(resList.length);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resources');
      const data = res?.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.resources) ? data.resources : [];
      setResources(list);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      fetchDashboard();
    } catch (err) {}
  };

  const startEdit = (r) => {
    setEditing(r._id || r.id);
    setForm({ name: r.name, description: r.description, type: r.type, location: r.location });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '', type: '', location: '' });
  };

  const submitResource = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editing) {
        await axios.put(`/api/resources/${editing}`, form);
        toast.success('Resource updated successfully');
      } else {
        await axios.post('/api/resources', form);
        toast.success('Resource created successfully');
      }
      setForm({ name: '', description: '', type: '', location: '' });
      setEditing(null);
      fetchResources();
    } catch (err) {
    } finally {
      setFormLoading(false);
    }
  };

  const removeResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await axios.delete(`/api/resources/${id}`);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (err) {}
  };

  const pending = bookings.filter(b => b.status === 'pending').length;
  const active = bookings.filter(b => b.status === 'approved').length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'resources', label: 'Resources', icon: FiCalendar },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="glass rounded-2xl p-6 mb-6 animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/50 animate-pulse-glow">
              <HiSparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Panel</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your resources and bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="glass rounded-2xl p-2 mb-6 animate-slide-up">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-xl card-3d bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30 border-l-4 border-blue-500 animate-slide-up">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 opacity-90">Total Resources</div>
                <div className="text-4xl font-bold mt-2 text-blue-900 dark:text-blue-100">{resourcesCount}</div>
                <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl card-3d bg-gradient-to-br from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/30 dark:to-orange-500/30 border-l-4 border-yellow-500 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300 opacity-90">Pending Approvals</div>
                <div className="text-4xl font-bold mt-2 text-yellow-900 dark:text-yellow-100">{pending}</div>
                <div className="mt-2 h-2 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 dark:bg-yellow-400 rounded-full animate-pulse" style={{ width: `${(pending / (bookings.length || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl card-3d bg-gradient-to-br from-green-500/20 to-teal-500/20 dark:from-green-500/30 dark:to-teal-500/30 border-l-4 border-green-500 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="text-sm font-medium text-green-700 dark:text-green-300 opacity-90">Active Bookings</div>
                <div className="text-4xl font-bold mt-2 text-green-900 dark:text-green-100">{active}</div>
                <div className="mt-2 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 dark:bg-green-400 rounded-full animate-pulse" style={{ width: `${(active / (bookings.length || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Bookings</h3>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 glass rounded-2xl">
                  <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b, idx) => (
                    <div key={b._id || b.id} className="glass p-6 rounded-xl card-3d animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            {b.resourceName || b.resource?.name} — {b.userName || b.user?.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {b.date} • {b.startTime} - {b.endTime}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">{b.purpose}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            b.status === 'approved' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                              : b.status === 'rejected' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {b.status}
                          </span>
                          {b.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateStatus(b._id || b.id, 'approved')} 
                                className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl transition shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105"
                                title="Approve"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateStatus(b._id || b.id, 'rejected')} 
                                className="p-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl transition shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
                                title="Reject"
                              >
                                <FiXCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6 animate-fade-in">
            {/* Add/Edit Form */}
            <div className="glass p-6 rounded-2xl shadow-2xl border-t-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
                  {editing ? (
                    <>
                      <FiEdit2 className="w-5 h-5 text-yellow-500" />
                      <span>Edit Resource</span>
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5 text-blue-500" />
                      <span>Add New Resource</span>
                    </>
                  )}
                </h3>
                {editing && (
                  <button onClick={cancelEdit} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                    <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
              </div>

              <form onSubmit={submitResource} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Resource Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Computer Lab 1"
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Type *
                    </label>
                    <input
                      required
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      placeholder="e.g., Lab, Room, Equipment"
                      className="input-modern"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g., Building A, Floor 2"
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Optional description..."
                    rows="3"
                    className="input-modern resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  {editing && (
                    <button type="button" onClick={cancelEdit} className="px-5 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <FiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                  <button disabled={formLoading} type="submit" className="btn-primary disabled:opacity-50 flex items-center space-x-2">
                    <FiSave className="w-4 h-4" />
                    <span>{formLoading ? 'Saving...' : editing ? 'Update' : 'Add Resource'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Resources List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-16 glass rounded-2xl">
                <FiGrid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No resources yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Add your first resource using the form above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((r, idx) => (
                  <div key={r._id || r.id} className="glass p-6 rounded-2xl card-3d animate-slide-up border-l-4 border-indigo-500" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 flex-shrink-0">
                            <FiGrid className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{r.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                {r.type}
                              </span>
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                                {r.location}
                              </span>
                            </div>
                            {r.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.description}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button onClick={() => startEdit(r)} className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition shadow-lg shadow-yellow-500/30 hover:scale-105" title="Edit">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeResource(r._id || r.id)} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-lg shadow-red-500/30 hover:scale-105" title="Delete">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab (Placeholder) */}
        {activeTab === 'users' && (
          <div className="glass rounded-2xl p-12 text-center animate-fade-in">
            <FiUsers className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">User Management</h3>
            <p className="text-gray-600 dark:text-gray-400">User management features coming soon...</p>
          </div>
        )}

        {/* Settings Tab (Placeholder) */}
        {activeTab === 'settings' && (
          <div className="glass rounded-2xl p-12 text-center animate-fade-in">
            <FiSettings className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Settings</h3>
            <p className="text-gray-600 dark:text-gray-400">Application settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
