import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { FiCalendar } from 'react-icons/fi';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetch = async () => {
    const res = await axios.get('/api/bookings');
    setBookings(res.data || []);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">My Bookings</h2>
      <div className="space-y-4">
        {bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <FiCalendar className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No bookings yet.</p>
          </div>
        )}
        {bookings.map((b, idx) => (
          <div
            key={b._id || b.id}
            className="glass p-6 rounded-xl card-3d animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {b.resourceName || b.resource?.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {b.date} • {b.startTime} - {b.endTime}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {b.purpose}
                </div>
              </div>
              <div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  b.status === 'approved'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : b.status === 'rejected'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {b.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
