import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [bugStats, setBugStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const [feedbackStatsRes, bugStatsRes, feedbackListRes, bugListRes] = await Promise.all([
        api.get('/feedback/stats'),
        api.get('/bug-reports/stats'),
        api.get('/feedback'),
        api.get('/bug-reports')
      ]);

      setFeedbackStats(feedbackStatsRes.data.data);
      setBugStats(bugStatsRes.data.data);

      // Get 5 most recent items
      const feedbackData = feedbackListRes.data.data || [];
      const bugData = bugListRes.data.data || [];

      setRecentFeedback(feedbackData.slice(0, 5));
      setRecentBugs(bugData.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'status-badge status-new',
      reviewed: 'status-badge status-reviewed',
      confirmed: 'status-badge status-confirmed',
      in_progress: 'status-badge status-in-progress',
      completed: 'status-badge status-completed',
      fixed: 'status-badge status-fixed',
      rejected: 'status-badge status-rejected',
      wont_fix: 'status-badge status-wont-fix'
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

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-refresh" onClick={fetchAllData}>
          Refresh
        </button>
      </div>

      <div className="dashboard-overview">
        <div className="overview-section">
          <h2>Feedback Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Feedback</h3>
              <p className="stat-number">{feedbackStats?.total || 0}</p>
            </div>
            <div className="stat-card">
              <h3>New</h3>
              <p className="stat-number">{feedbackStats?.byStatus?.new || 0}</p>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-number">{feedbackStats?.byStatus?.in_progress || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-number">{feedbackStats?.byStatus?.completed || 0}</p>
            </div>
          </div>

          <div className="type-breakdown">
            <h3>By Type</h3>
            <div className="breakdown-grid">
              {feedbackStats?.byType && Object.entries(feedbackStats.byType).map(([type, count]) => (
                <div key={type} className="breakdown-item">
                  <span className="breakdown-label">{type.replace('_', ' ')}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rating-display">
            <h3>Average Rating</h3>
            <p className="rating-number">{feedbackStats?.averageRating || 'N/A'} / 5</p>
          </div>

          <Link to="/admin/feedback" className="btn-view-all">
            View All Feedback →
          </Link>
        </div>

        <div className="overview-section">
          <h2>Bug Reports Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Reports</h3>
              <p className="stat-number">{bugStats?.total || 0}</p>
            </div>
            <div className="stat-card">
              <h3>New</h3>
              <p className="stat-number">{bugStats?.byStatus?.new || 0}</p>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-number">{bugStats?.byStatus?.in_progress || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Fixed</h3>
              <p className="stat-number">{bugStats?.byStatus?.fixed || 0}</p>
            </div>
          </div>

          <div className="severity-breakdown">
            <h3>By Severity</h3>
            <div className="breakdown-grid">
              {bugStats?.bySeverity && Object.entries(bugStats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="breakdown-item severity">
                  <span className={getSeverityBadge(severity)}>{severity}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="type-breakdown">
            <h3>By Type</h3>
            <div className="breakdown-grid">
              {bugStats?.byType && Object.entries(bugStats.byType).map(([type, count]) => (
                <div key={type} className="breakdown-item">
                  <span className="breakdown-label">{type}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/admin/bug-reports" className="btn-view-all">
            View All Bug Reports →
          </Link>
        </div>
      </div>

      <div className="recent-items">
        <div className="recent-section">
          <h2>Recent Feedback</h2>
          {recentFeedback.length === 0 ? (
            <p className="no-items">No feedback yet</p>
          ) : (
            <div className="items-list">
              {recentFeedback.map((item) => (
                <div key={item.id} className="recent-item">
                  <div className="item-header">
                    <h4>{item.subject}</h4>
                    <span className={getStatusBadge(item.status)}>
                      {item.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="item-meta">
                    {item.name} • {item.type?.replace('_', ' ')} • {formatDate(item.createdAt)}
                  </p>
                  <p className="item-preview">{item.message?.substring(0, 100)}...</p>
                  {item.rating > 0 && (
                    <div className="rating-stars">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recent-section">
          <h2>Recent Bug Reports</h2>
          {recentBugs.length === 0 ? (
            <p className="no-items">No bug reports yet</p>
          ) : (
            <div className="items-list">
              {recentBugs.map((item) => (
                <div key={item.id} className="recent-item">
                  <div className="item-header">
                    <h4>{item.title}</h4>
                    <div className="badges">
                      <span className={getSeverityBadge(item.severity)}>
                        {item.severity}
                      </span>
                      <span className={getStatusBadge(item.status)}>
                        {item.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="item-meta">
                    {item.name} • {item.bugType} • {formatDate(item.createdAt)}
                  </p>
                  <p className="item-preview">{item.description?.substring(0, 100)}...</p>
                  <p className="item-system">
                    {item.browser} on {item.os} • {item.page}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/feedback" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Manage Feedback</h3>
            <p>View and respond to user feedback</p>
          </Link>
          <Link to="/admin/bug-reports" className="action-card">
            <div className="action-icon">🐛</div>
            <h3>Manage Bug Reports</h3>
            <p>Track and fix reported issues</p>
          </Link>
          <Link to="/feedback" className="action-card">
            <div className="action-icon">✍️</div>
            <h3>Submit Feedback</h3>
            <p>Provide your own feedback</p>
          </Link>
          <Link to="/report-bug" className="action-card">
            <div className="action-icon">⚠️</div>
            <h3>Report a Bug</h3>
            <p>Report technical issues</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
