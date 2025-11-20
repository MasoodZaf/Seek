import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../utils/analytics';

/**
 * Page View Tracker Component
 * Automatically tracks page views when route changes
 */
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null; // This component doesn't render anything
};

export default PageViewTracker;
