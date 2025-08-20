import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button, Card } from './ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Force reload if it's the persistent object rendering error
    if (error?.message?.includes('Objects are not valid') && error?.message?.includes('$$typeof')) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-error-100 rounded-full mx-auto mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-error-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-secondary-600 mb-6">
              We're sorry, but something unexpected happened. This error has been logged and we'll work to fix it.
            </p>

            <div className="space-y-3 mb-6">
              <Button 
                variant="primary" 
                onClick={this.handleReload}
                icon={ArrowPathIcon}
                className="w-full"
              >
                Reload Page
              </Button>
              <Button 
                variant="secondary" 
                onClick={this.handleReset}
                className="w-full"
              >
                Try Again
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left">
                <summary className="text-sm font-medium text-secondary-700 cursor-pointer mb-2">
                  Error Details (Development Mode)
                </summary>
                <div className="bg-secondary-100 p-3 rounded text-xs text-secondary-800 overflow-auto">
                  <strong>Error:</strong> {this.state.error.toString()}
                  <br />
                  <strong>Stack Trace:</strong>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;