import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [resourcesCount, setResourcesCount] = useState(0);

  const fetch = async () => {
    const b = await axios.get('/api/bookings');
    setBookings(b.data || []);
    const r = await axios.get('/api/resources');
    setResourcesCount((r.data || []).length);
  };

  useEffect(() => {
    fetch();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      fetch();
    } catch (err) {}
  };

  const pending = bookings.filter(b => b.status === 'pending').length;
  const active = bookings.filter(b => b.status === 'approved').length;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-xl card-3d bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30 border-l-4 border-blue-500 animate-slide-up" style={{ animationDelay: '0ms' }}>
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

      <div className="space-y-4">
        {bookings.map((b, idx) => (
          <div key={b._id || b.id} className="glass p-6 rounded-xl card-3d animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">{b.resourceName || b.resource?.name} — {b.userName || b.user?.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{b.date} • {b.startTime} - {b.endTime}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">{b.purpose}</div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  b.status === 'approved' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : b.status === 'rejected' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}>{b.status}</span>
                {b.status === 'pending' && (
                  <>
                    <button onClick={()=>updateStatus(b._id || b.id, 'approved')} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition font-medium shadow-lg shadow-green-500/30">
                      Approve
                    </button>
                    <button onClick={()=>updateStatus(b._id || b.id, 'rejected')} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition font-medium shadow-lg shadow-red-500/30">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
