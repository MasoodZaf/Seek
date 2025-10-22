/**
 * Performance Monitor Component
 * Real-time performance monitoring dashboard for development
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import performanceOptimizer from '../../utils/performanceOptimization';
import Card from './Card';
import Button from './Button';

const PerformanceMonitor = ({ 
  isVisible = false, 
  onClose,
  position = 'bottom-right' 
}) => {
  const [metrics, setMetrics] = useState({});
  const [violations, setViolations] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isVisible && !isRecording) {
      startMonitoring();
    } else if (!isVisible && isRecording) {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [isVisible]);

  const startMonitoring = () => {
    setIsRecording(true);
    
    // Update metrics every second
    intervalRef.current = setInterval(() => {
      const report = performanceOptimizer.getPerformanceReport();
      setMetrics(report.coreWebVitals);
      setViolations(report.budgetViolations);
      setMemoryUsage(report.memoryUsage);
    }, 1000);
  };

  const stopMonitoring = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getMetricStatus = (metric, value) => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold || value === null) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const formatMetricValue = (metric, value) => {
    if (value === null) return 'N/A';
    
    if (metric === 'CLS') {
      return value.toFixed(3);
    }
    
    return `${Math.round(value)}ms`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircleIcon className="w-4 h-4" />;
      case 'needs-improvement': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'poor': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatMemorySize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50'
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`${positionClasses[position]} w-96 max-w-[calc(100vw-2rem)]`}
      >
        <Card className="bg-white shadow-xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
              {isRecording && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600">Recording</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Core Web Vitals */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Core Web Vitals</h4>
            <div className="space-y-2">
              {Object.entries(metrics).map(([metric, value]) => {
                const status = getMetricStatus(metric, value);
                const statusColor = getStatusColor(status);
                
                return (
                  <div key={metric} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">{metric}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusColor}`}>
                        {getStatusIcon(status)}
                        <span className="capitalize">{status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <span className="text-sm font-mono text-gray-900">
                      {formatMetricValue(metric, value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Memory Usage */}
          {memoryUsage && (
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Memory Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Used Heap</span>
                  <span className="text-sm font-mono text-gray-900">
                    {formatMemorySize(memoryUsage.usedJSHeapSize)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Heap</span>
                  <span className="text-sm font-mono text-gray-900">
                    {formatMemorySize(memoryUsage.totalJSHeapSize)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Heap Limit</span>
                  <span className="text-sm font-mono text-gray-900">
                    {formatMemorySize(memoryUsage.jsHeapSizeLimit)}
                  </span>
                </div>
                
                {/* Memory Usage Bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit) * 100).toFixed(1)}% used
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Violations */}
          {violations.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Budget Violations ({violations.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {violations.slice(-5).map((violation, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                      <span className="text-gray-600">{violation.metric}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-mono">
                        {formatMetricValue(violation.metric, violation.value)}
                      </div>
                      <div className="text-gray-500">
                        Budget: {formatMetricValue(violation.metric, violation.budget)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={isRecording ? "secondary" : "primary"}
                onClick={isRecording ? stopMonitoring : startMonitoring}
                className="flex-1"
              >
                {isRecording ? 'Stop' : 'Start'} Monitoring
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setMetrics({});
                  setViolations([]);
                  setMemoryUsage(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Performance Monitor Toggle Button
 */
export const PerformanceMonitorToggle = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 right-4 z-40 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Toggle performance monitor"
      >
        <ChartBarIcon className="w-5 h-5" />
      </motion.button>

      <PerformanceMonitor
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
};

export default PerformanceMonitor;