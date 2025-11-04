import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './AdminBugReports.css';

const AdminBugReports = () => {
  const [bugReports, setBugReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBug, setSelectedBug] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    bugType: '',
    search: ''
  });

  useEffect(() => {
    fetchBugReports();
    fetchStats();
  }, []);

  const fetchBugReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bug-reports');
      setBugReports(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bug reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/bug-reports/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/bug-reports/${id}`, { status: newStatus });
      fetchBugReports();
      fetchStats();
      if (selectedBug?.id === id) {
        setSelectedBug({ ...selectedBug, status: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePriorityUpdate = async (id, newPriority) => {
    try {
      await api.put(`/bug-reports/${id}`, { priority: newPriority });
      fetchBugReports();
      if (selectedBug?.id === id) {
        setSelectedBug({ ...selectedBug, priority: newPriority });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const handleNotesUpdate = async (id, adminNotes) => {
    try {
      await api.put(`/bug-reports/${id}`, { adminNotes });
      fetchBugReports();
      if (selectedBug?.id === id) {
        setSelectedBug({ ...selectedBug, adminNotes });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update notes');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bug report?')) {
      return;
    }
    try {
      await api.delete(`/bug-reports/${id}`);
      fetchBugReports();
      fetchStats();
      setSelectedBug(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete bug report');
    }
  };

  const filteredBugReports = bugReports.filter(item => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.severity && item.severity !== filters.severity) return false;
    if (filters.bugType && item.bugType !== filters.bugType) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      new: 'status-badge status-new',
      confirmed: 'status-badge status-confirmed',
      in_progress: 'status-badge status-in-progress',
      fixed: 'status-badge status-fixed',
      wont_fix: 'status-badge status-wont-fix',
      duplicate: 'status-badge status-duplicate',
      cannot_reproduce: 'status-badge status-cannot-reproduce'
    };
    return badges[status] || 'status-badge';
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'severity-badge severity-low',
      medium: 'severity-badge severity-medium',
      high: 'severity-badge severity-high',
      critical: 'severity-badge severity-critical'
    };
    return badges[severity] || 'severity-badge';
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
    return <div className="admin-loading">Loading bug reports...</div>;
  }

  return (
    <div className="admin-bug-reports-container">
      <div className="admin-header">
        <h1>Bug Reports Management</h1>
        <button className="btn-refresh" onClick={fetchBugReports}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Reports</h3>
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
            <h3>Fixed</h3>
            <p className="stat-number">{stats.byStatus?.fixed || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Critical</h3>
            <p className="stat-number critical">{stats.bySeverity?.critical || 0}</p>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name, email, or title..."
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
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="fixed">Fixed</option>
          <option value="wont_fix">Won't Fix</option>
          <option value="duplicate">Duplicate</option>
          <option value="cannot_reproduce">Cannot Reproduce</option>
        </select>
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="filter-select"
        >
          <option value="">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={filters.bugType}
          onChange={(e) => setFilters({ ...filters, bugType: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="functionality">Functionality</option>
          <option value="ui">UI/Visual</option>
          <option value="performance">Performance</option>
          <option value="security">Security</option>
          <option value="compatibility">Compatibility</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="content-layout">
        <div className="bug-reports-list">
          <table className="bug-reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Reporter</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Page</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBugReports.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No bug reports found
                  </td>
                </tr>
              ) : (
                filteredBugReports.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedBug(item)}
                    className={selectedBug?.id === item.id ? 'selected' : ''}
                  >
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.title}</td>
                    <td>{item.name}</td>
                    <td>{item.bugType}</td>
                    <td>
                      <span className={getSeverityBadge(item.severity)}>
                        {item.severity}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadge(item.status)}>
                        {item.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{item.page}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBug(item);
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

        {selectedBug && (
          <div className="bug-detail">
            <div className="detail-header">
              <h2>Bug Report Details</h2>
              <button
                className="btn-close"
                onClick={() => setSelectedBug(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-section">
              <h3>Reporter Information</h3>
              <p><strong>Name:</strong> {selectedBug.name}</p>
              <p><strong>Email:</strong> {selectedBug.email}</p>
              <p><strong>Date:</strong> {formatDate(selectedBug.createdAt)}</p>
              <p><strong>Page:</strong> {selectedBug.page}</p>
            </div>

            <div className="detail-section">
              <h3>Bug Details</h3>
              <p><strong>Title:</strong> {selectedBug.title}</p>
              <p>
                <strong>Type:</strong> {selectedBug.bugType}
                <span style={{ marginLeft: '1rem' }}>
                  <strong>Severity:</strong>{' '}
                  <span className={getSeverityBadge(selectedBug.severity)}>
                    {selectedBug.severity}
                  </span>
                </span>
              </p>
              <p><strong>Description:</strong></p>
              <div className="message-box">{selectedBug.description}</div>

              {selectedBug.stepsToReproduce && (
                <>
                  <p><strong>Steps to Reproduce:</strong></p>
                  <div className="message-box">{selectedBug.stepsToReproduce}</div>
                </>
              )}

              {selectedBug.expectedBehavior && (
                <>
                  <p><strong>Expected Behavior:</strong></p>
                  <div className="message-box">{selectedBug.expectedBehavior}</div>
                </>
              )}

              {selectedBug.actualBehavior && (
                <>
                  <p><strong>Actual Behavior:</strong></p>
                  <div className="message-box">{selectedBug.actualBehavior}</div>
                </>
              )}
            </div>

            <div className="detail-section">
              <h3>System Information</h3>
              <div className="system-info-grid">
                <div className="info-item">
                  <strong>Browser:</strong> {selectedBug.browser} {selectedBug.browserVersion}
                </div>
                <div className="info-item">
                  <strong>OS:</strong> {selectedBug.os}
                </div>
                <div className="info-item">
                  <strong>Device:</strong> {selectedBug.device}
                </div>
                <div className="info-item">
                  <strong>Resolution:</strong> {selectedBug.screenResolution}
                </div>
              </div>

              {selectedBug.consoleErrors && (
                <>
                  <p><strong>Console Errors:</strong></p>
                  <div className="console-box">{selectedBug.consoleErrors}</div>
                </>
              )}
            </div>

            <div className="detail-section">
              <h3>Status & Priority</h3>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedBug.status}
                  onChange={(e) => handleStatusUpdate(selectedBug.id, e.target.value)}
                  className="status-select"
                >
                  <option value="new">New</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="fixed">Fixed</option>
                  <option value="wont_fix">Won't Fix</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="cannot_reproduce">Cannot Reproduce</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={selectedBug.priority}
                  onChange={(e) => handlePriorityUpdate(selectedBug.id, e.target.value)}
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
                value={selectedBug.adminNotes || ''}
                onChange={(e) => {
                  setSelectedBug({ ...selectedBug, adminNotes: e.target.value });
                }}
                onBlur={(e) => handleNotesUpdate(selectedBug.id, e.target.value)}
                placeholder="Add internal notes here..."
                rows="4"
                className="admin-notes-textarea"
              />
            </div>

            <div className="detail-actions">
              <button
                className="btn-delete"
                onClick={() => handleDelete(selectedBug.id)}
              >
                Delete Bug Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBugReports;
