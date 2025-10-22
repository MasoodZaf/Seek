import React from 'react';
import clsx from 'clsx';

/**
 * Skip Navigation component for keyboard accessibility
 * Provides quick navigation links for keyboard users
 */
const SkipNavigation = ({ 
  links = [],
  className = ''
}) => {
  const defaultLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#sidebar', text: 'Skip to sidebar' }
  ];

  const skipLinks = links.length > 0 ? links : defaultLinks;

  const handleSkipClick = (e, href) => {
    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      // Make the target focusable if it's not already
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      
      // Focus the target
      target.focus();
      
      // Scroll to the target
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Remove tabindex after focus to restore natural tab order
      setTimeout(() => {
        if (target.getAttribute('tabindex') === '-1') {
          target.removeAttribute('tabindex');
        }
      }, 100);
    }
  };

  return (
    <div className={clsx('skip-navigation', className)}>
      {skipLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className={clsx(
            // Hidden by default
            'sr-only',
            // Visible when focused
            'focus:not-sr-only',
            'focus:absolute',
            'focus:top-4',
            'focus:left-4',
            'focus:z-50',
            // Styling
            'px-4 py-2',
            'bg-primary-600 text-white',
            'rounded-lg shadow-lg',
            'text-sm font-medium',
            'transition-all duration-200',
            // Focus styles
            'focus:outline-none',
            'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            // Hover styles (when visible)
            'hover:bg-primary-700'
          )}
          onClick={(e) => handleSkipClick(e, link.href)}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};

export default SkipNavigation;