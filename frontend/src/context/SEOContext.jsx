import React, { createContext, useContext, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  generateSEO,
  injectStructuredData,
  PAGE_SEO_CONFIG,
  SITE_CONFIG
} from '../utils/seo';

const SEOContext = createContext();

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};

export const SEOProvider = ({ children }) => {
  const location = useLocation();
  const [seoConfig, setSeoConfig] = React.useState(null);

  // Update SEO when location changes
  useEffect(() => {
    const path = location.pathname;
    let config = null;

    // Match path to page configuration
    if (path === '/' || path === '/home') {
      config = PAGE_SEO_CONFIG.home;
    } else if (path === '/dashboard') {
      config = PAGE_SEO_CONFIG.dashboard;
    } else if (path === '/tutorials') {
      config = PAGE_SEO_CONFIG.tutorials;
    } else if (path === '/database-tutorials') {
      config = PAGE_SEO_CONFIG.databaseTutorials;
    } else if (path === '/challenges') {
      config = PAGE_SEO_CONFIG.challenges;
    } else if (path === '/playground') {
      config = PAGE_SEO_CONFIG.playground;
    } else if (path === '/translator') {
      config = PAGE_SEO_CONFIG.codeTranslator;
    } else if (path === '/database-translator') {
      config = PAGE_SEO_CONFIG.databaseTranslator;
    } else if (path === '/games') {
      config = PAGE_SEO_CONFIG.games;
    } else if (path === '/achievements') {
      config = PAGE_SEO_CONFIG.achievements;
    } else if (path === '/profile') {
      config = PAGE_SEO_CONFIG.profile;
    } else if (path === '/settings') {
      config = PAGE_SEO_CONFIG.settings;
    }

    if (config) {
      const seo = generateSEO({
        ...config,
        url: path
      });
      setSeoConfig(seo);

      // Inject structured data
      if (seo.structuredData) {
        injectStructuredData(seo.structuredData);
      }
    }
  }, [location]);

  // Custom SEO setter for dynamic pages
  const updateSEO = (customConfig) => {
    const seo = generateSEO(customConfig);
    setSeoConfig(seo);

    if (seo.structuredData) {
      injectStructuredData(seo.structuredData);
    }
  };

  const value = {
    seoConfig,
    updateSEO
  };

  return (
    <SEOContext.Provider value={value}>
      {seoConfig && (
        <Helmet>
          <title>{seoConfig.title}</title>

          {seoConfig.meta?.map((tag, index) => {
            if (tag.name) {
              return <meta key={`meta-${index}`} name={tag.name} content={tag.content} />;
            } else if (tag.property) {
              return <meta key={`meta-${index}`} property={tag.property} content={tag.content} />;
            } else if (tag.httpEquiv) {
              return <meta key={`meta-${index}`} httpEquiv={tag.httpEquiv} content={tag.content} />;
            }
            return null;
          })}

          {seoConfig.link?.map((link, index) => (
            <link key={`link-${index}`} rel={link.rel} href={link.href} />
          ))}
        </Helmet>
      )}
      {children}
    </SEOContext.Provider>
  );
};

// Higher-order component for page-specific SEO
export const withSEO = (Component, seoConfig) => {
  return (props) => {
    const { updateSEO } = useSEO();

    useEffect(() => {
      if (typeof seoConfig === 'function') {
        updateSEO(seoConfig(props));
      } else {
        updateSEO(seoConfig);
      }
    }, [props, updateSEO]);

    return <Component {...props} />;
  };
};

// SEO wrapper component for HelmetProvider
export const SEOWrapper = ({ children }) => {
  return (
    <HelmetProvider>
      <SEOProvider>
        {children}
      </SEOProvider>
    </HelmetProvider>
  );
};

export default SEOContext;
