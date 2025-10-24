import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiX, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';

export default function BookingModal({ resource, onClose, onBooked }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  if (!resource) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/bookings', {
        resourceId: resource._id || resource.id,
        date,
        startTime,
        endTime,
        purpose,
      });
      toast.success('Booking requested successfully!');
      onBooked && onBooked();
      onClose();
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-[100] p-6 animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-3xl p-10 w-full max-w-2xl shadow-2xl border border-white/30 dark:border-slate-600/50 animate-scale-in transition-all duration-500">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-black hero-text-gradient mb-2">Book Resource</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Reserve your preferred time slot</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl transition-all duration-300 hover:scale-110"
          >
            <FiX className="w-7 h-7 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Resource Info Card */}
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xl mb-2">{resource.name}</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{resource.type} • {resource.location}</p>
              {resource.description && (
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-2 leading-relaxed">{resource.description}</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 ml-4">
              <FiCalendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Date Field */}
          <div className="group">
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              <FiCalendar className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
              Select Date
            </label>
            <input
              required
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-700 outline-none transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <FiClock className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                Start Time
              </label>
              <input
                required
                type="time"
                value={startTime}
                onChange={(e)=>setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-700 outline-none transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="group">
              <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                <FiClock className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                End Time
              </label>
              <input
                required
                type="time"
                value={endTime}
                onChange={(e)=>setEndTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-700 outline-none transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Purpose Field */}
          <div className="group">
            <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              <FiFileText className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
              Booking Purpose
            </label>
            <textarea
              required
              placeholder="Please describe your purpose for booking this resource..."
              value={purpose}
              onChange={(e)=>setPurpose(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-700 outline-none transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 font-bold text-slate-700 dark:text-slate-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-8 py-4 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Your booking request will be reviewed and confirmed shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
