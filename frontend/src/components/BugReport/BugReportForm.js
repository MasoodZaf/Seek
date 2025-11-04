import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './BugReportForm.css';

const BugReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    severity: 'medium',
    bugType: 'functionality',
    page: window.location.pathname,
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    browser: '',
    browserVersion: '',
    os: '',
    device: '',
    screenResolution: '',
    consoleErrors: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-detect browser info
    const detectBrowserInfo = () => {
      const userAgent = navigator.userAgent;
      let browser = 'Unknown';
      let browserVersion = '';

      if (userAgent.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
      } else if (userAgent.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
      } else if (userAgent.indexOf('Safari') > -1) {
        browser = 'Safari';
        browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
      } else if (userAgent.indexOf('Edge') > -1) {
        browser = 'Edge';
        browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || '';
      }

      // Detect OS
      let os = 'Unknown';
      if (userAgent.indexOf('Win') > -1) os = 'Windows';
      else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
      else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
      else if (userAgent.indexOf('Android') > -1) os = 'Android';
      else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

      // Detect device type
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
      const device = isMobile ? 'Mobile' : 'Desktop';

      // Get screen resolution
      const screenResolution = `${window.screen.width}x${window.screen.height}`;

      setFormData(prev => ({
        ...prev,
        browser,
        browserVersion,
        os,
        device,
        screenResolution
      }));
    };

    detectBrowserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/bug-reports', formData);
      setSuccess(true);

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit bug report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bug-report-success">
        <div className="success-icon">✓</div>
        <h2>Bug Report Submitted!</h2>
        <p>Thank you for helping us improve Seek.</p>
        <p>We will investigate this issue and keep you updated.</p>
      </div>
    );
  }

  return (
    <div className="bug-report-container">
      <div className="bug-report-header">
        <h1>🐛 Report a Bug</h1>
        <p>Help us fix issues by providing detailed information about the problem</p>
      </div>

      <form onSubmit={handleSubmit} className="bug-report-form">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Bug Classification */}
        <div className="form-section">
          <h3>Bug Classification</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severity">
                Severity <span className="required">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                required
              >
                <option value="low">Low - Minor inconvenience</option>
                <option value="medium">Medium - Affects functionality</option>
                <option value="high">High - Major feature broken</option>
                <option value="critical">Critical - System unusable</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bugType">
                Bug Type <span className="required">*</span>
              </label>
              <select
                id="bugType"
                name="bugType"
                value={formData.bugType}
                onChange={handleChange}
                required
              >
                <option value="functionality">Functionality</option>
                <option value="ui">UI/Visual</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="compatibility">Compatibility</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="page">
              Page/URL where bug occurred <span className="required">*</span>
            </label>
            <input
              type="text"
              id="page"
              name="page"
              value={formData.page}
              onChange={handleChange}
              required
              placeholder="/tutorials/python-basics"
            />
          </div>
        </div>

        {/* Bug Description */}
        <div className="form-section">
          <h3>Bug Description</h3>
          <div className="form-group">
            <label htmlFor="title">
              Bug Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief summary of the bug"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Detailed Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the bug in detail..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="stepsToReproduce">
              Steps to Reproduce
            </label>
            <textarea
              id="stepsToReproduce"
              name="stepsToReproduce"
              value={formData.stepsToReproduce}
              onChange={handleChange}
              rows="4"
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedBehavior">
                Expected Behavior
              </label>
              <textarea
                id="expectedBehavior"
                name="expectedBehavior"
                value={formData.expectedBehavior}
                onChange={handleChange}
                rows="3"
                placeholder="What should happen?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="actualBehavior">
                Actual Behavior
              </label>
              <textarea
                id="actualBehavior"
                name="actualBehavior"
                value={formData.actualBehavior}
                onChange={handleChange}
                rows="3"
                placeholder="What actually happened?"
              />
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="form-section">
          <h3>System Information</h3>
          <div className="system-info-display">
            <div className="info-item">
              <strong>Browser:</strong> {formData.browser} {formData.browserVersion}
            </div>
            <div className="info-item">
              <strong>OS:</strong> {formData.os}
            </div>
            <div className="info-item">
              <strong>Device:</strong> {formData.device}
            </div>
            <div className="info-item">
              <strong>Screen Resolution:</strong> {formData.screenResolution}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="consoleErrors">
              Console Errors (if any)
            </label>
            <textarea
              id="consoleErrors"
              name="consoleErrors"
              value={formData.consoleErrors}
              onChange={handleChange}
              rows="4"
              placeholder="Paste any console errors here..."
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
            <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              Press F12 to open developer tools and check the Console tab
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Bug Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugReportForm;
