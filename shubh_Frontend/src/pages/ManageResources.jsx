import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiGrid } from 'react-icons/fi';

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', type: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resources');
      const data = res?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.resources)
        ? data.resources
        : data?.items && Array.isArray(data.items)
        ? data.items
        : [];
      setResources(list);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const startEdit = (r) => {
    setEditing(r._id || r.id);
    setForm({ name: r.name, description: r.description, type: r.type, location: r.location });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '', type: '', location: '' });
  };

  const submit = async (e) => {
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
      fetch();
    } catch (err) {
      // handled by interceptor
    } finally {
      setFormLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await axios.delete(`/api/resources/${id}`);
      toast.success('Resource deleted successfully');
      fetch();
    } catch (err) {
      // handled by interceptor
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Resources</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Add, edit, or remove bookable resources</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <FiGrid className="w-5 h-5" />
          <span>{resources.length} Resources</span>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="glass p-6 rounded-2xl shadow-2xl mb-8 animate-slide-up border-t-4 border-blue-500">
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
            <button
              onClick={cancelEdit}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        <form onSubmit={submit} className="space-y-4">
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
              placeholder="Optional description about the resource..."
              rows="3"
              className="input-modern resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}
            <button
              disabled={formLoading}
              type="submit"
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FiSave className="w-4 h-4" />
              <span>{formLoading ? 'Saving...' : editing ? 'Update Resource' : 'Add Resource'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Resources List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <FiGrid className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No resources yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Add your first resource using the form above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((r, idx) => (
            <div
              key={r._id || r.id}
              className="glass p-6 rounded-2xl card-3d animate-slide-up border-l-4 border-indigo-500"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/50 flex-shrink-0">
                      <FiGrid className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                        {r.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                          {r.type}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                          {r.location}
                        </span>
                      </div>
                      {r.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {r.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(r)}
                    className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-200"
                    title="Edit resource"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(r._id || r.id)}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 duration-200"
                    title="Delete resource"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
