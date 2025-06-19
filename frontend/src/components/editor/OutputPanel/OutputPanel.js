import React from 'react';
import { Loader2 } from 'lucide-react';
import './OutputPanel.css';

const OutputPanel = ({
  output,
  error,
  isLoading = false,
  height = '150px',
  maxHeight = '300px',
  title = 'Output'
}) => {
  const hasContent = output || error;
  const statusClass = error ? 'error' : 'success';

  return (
    <div className="output-panel" style={{ height, maxHeight }}>
      <div className="output-header">
        <span className="output-title">{title}</span>
        {isLoading && (
          <span className="output-loading">
            <Loader2 className="loading-spinner" />
            Running...
          </span>
        )}
        {hasContent && !isLoading && (
          <span className={`output-status ${statusClass}`}>
            {error ? 'Error' : 'Success'}
          </span>
        )}
      </div>
      <div className="output-content">
        {isLoading ? (
          <div className="output-loading-content">
            <div className="loading-spinner"></div>
            <span>Executing code...</span>
          </div>
        ) : error ? (
          <div className="error-content">
            <pre>{error}</pre>
          </div>
        ) : output ? (
          <pre className="output-text">{output}</pre>
        ) : (
          <div className="empty-output">
            <span>No output to display</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
