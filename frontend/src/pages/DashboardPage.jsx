import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { Plus, Trash2, Edit2, CheckCircle, Circle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, isLoading, error, clearTasks } = useTaskStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
    } else {
      clearTasks();
    }
  }, [isAuthenticated, user, fetchTasks, clearTasks]);

  useEffect(() => {
    return () => {
      clearTasks();
    };
  }, [clearTasks]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        setEditingTask(null);
      } else {
        await createTask(formData);
      }
      setFormData({ title: '', description: '', status: 'pending' });
      setShowForm(false);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description, status: task.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task._id, { status: newStatus });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Circle className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome, {user?.name || 'User'}</p>
            <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
              user?.role === 'admin' ? 'bg-indigo-600' : 'bg-gray-600'
            }`}>
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={() => { setShowForm(!showForm); setEditingTask(null); setFormData({ title: '', description: '', status: 'pending' }); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition mb-6"
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {isLoading && tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No tasks yet. Create your first task!</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button onClick={() => handleStatusChange(task, task.status === 'completed' ? 'pending' : 'completed')}>
                      {getStatusIcon(task.status)}
                    </button>
                    <div>
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                      )}
                      <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-400 hover:text-white transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}