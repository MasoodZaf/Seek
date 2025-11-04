import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './AdminFeedback.css';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback');
      setFeedback(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/feedback/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/feedback/${id}`, { status: newStatus });
      fetchFeedback();
      fetchStats();
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePriorityUpdate = async (id, newPriority) => {
    try {
      await api.put(`/feedback/${id}`, { priority: newPriority });
      fetchFeedback();
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, priority: newPriority });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const handleNotesUpdate = async (id, adminNotes) => {
    try {
      await api.put(`/feedback/${id}`, { adminNotes });
      fetchFeedback();
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, adminNotes });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update notes');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedback();
      fetchStats();
      setSelectedFeedback(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete feedback');
    }
  };

  const filteredFeedback = feedback.filter(item => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.subject?.toLowerCase().includes(searchLower) ||
        item.message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      new: 'status-badge status-new',
      reviewed: 'status-badge status-reviewed',
      in_progress: 'status-badge status-in-progress',
      completed: 'status-badge status-completed',
      rejected: 'status-badge status-rejected'
    };
    return badges[status] || 'status-badge';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'priority-badge priority-low',
      medium: 'priority-badge priority-medium',
      high: 'priority-badge priority-high',
      urgent: 'priority-badge priority-urgent'
    };
    return badges[priority] || 'priority-badge';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading feedback...</div>;
  }

  return (
    <div className="admin-feedback-container">
      <div className="admin-header">
        <h1>Feedback Management</h1>
        <button className="btn-refresh" onClick={fetchFeedback}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Feedback</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>New</h3>
            <p className="stat-number">{stats.byStatus?.new || 0}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.byStatus?.in_progress || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">{stats.byStatus?.completed || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Rating</h3>
            <p className="stat-number">{stats.averageRating || 'N/A'}</p>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name, email, or subject..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="filter-search"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="feature_request">Feature Request</option>
          <option value="improvement">Improvement</option>
          <option value="general">General</option>
          <option value="praise">Praise</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="content-layout">
        <div className="feedback-list">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No feedback found
                  </td>
                </tr>
              ) : (
                filteredFeedback.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedFeedback(item)}
                    className={selectedFeedback?.id === item.id ? 'selected' : ''}
                  >
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.name}</td>
                    <td>{item.subject}</td>
                    <td>{item.type?.replace('_', ' ')}</td>
                    <td>
                      <span className="rating-display">
                        {'★'.repeat(item.rating || 0)}
                        {'☆'.repeat(5 - (item.rating || 0))}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(item.status)}>
                        {item.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={getPriorityBadge(item.priority)}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedback(item);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedFeedback && (
          <div className="feedback-detail">
            <div className="detail-header">
              <h2>Feedback Details</h2>
              <button
                className="btn-close"
                onClick={() => setSelectedFeedback(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-section">
              <h3>Contact Information</h3>
              <p><strong>Name:</strong> {selectedFeedback.name}</p>
              <p><strong>Email:</strong> {selectedFeedback.email}</p>
              <p><strong>Page:</strong> {selectedFeedback.page}</p>
              <p><strong>Date:</strong> {formatDate(selectedFeedback.createdAt)}</p>
            </div>

            <div className="detail-section">
              <h3>Feedback Content</h3>
              <p><strong>Type:</strong> {selectedFeedback.type?.replace('_', ' ')}</p>
              {selectedFeedback.category && (
                <p><strong>Category:</strong> {selectedFeedback.category}</p>
              )}
              <p><strong>Subject:</strong> {selectedFeedback.subject}</p>
              <p><strong>Message:</strong></p>
              <div className="message-box">{selectedFeedback.message}</div>
              <p>
                <strong>Rating:</strong>{' '}
                <span className="rating-display">
                  {'★'.repeat(selectedFeedback.rating || 0)}
                  {'☆'.repeat(5 - (selectedFeedback.rating || 0))}
                </span>
              </p>
            </div>

            <div className="detail-section">
              <h3>Status & Priority</h3>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedFeedback.status}
                  onChange={(e) => handleStatusUpdate(selectedFeedback.id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={selectedFeedback.priority}
                  onChange={(e) => handlePriorityUpdate(selectedFeedback.id, e.target.value)}
                  className="priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="detail-section">
              <h3>Admin Notes</h3>
              <textarea
                value={selectedFeedback.adminNotes || ''}
                onChange={(e) => {
                  setSelectedFeedback({ ...selectedFeedback, adminNotes: e.target.value });
                }}
                onBlur={(e) => handleNotesUpdate(selectedFeedback.id, e.target.value)}
                placeholder="Add internal notes here..."
                rows="4"
                className="admin-notes-textarea"
              />
            </div>

            <div className="detail-actions">
              <button
                className="btn-delete"
                onClick={() => handleDelete(selectedFeedback.id)}
              >
                Delete Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
