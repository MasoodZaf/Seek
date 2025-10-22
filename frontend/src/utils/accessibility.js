/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

import React from 'react';

// Color contrast calculation utilities
export const getContrastRatio = (color1, color2) => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const getLuminance = (color) => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const meetsWCAGAA = (color1, color2) => {
  return getContrastRatio(color1, color2) >= 4.5;
};

export const meetsWCAGAAA = (color1, color2) => {
  return getContrastRatio(color1, color2) >= 7;
};

// Focus management utilities
export class FocusManager {
  constructor() {
    this.focusStack = [];
    this.trapStack = [];
  }

  // Save current focus and set new focus
  saveFocus() {
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  // Restore previously saved focus
  restoreFocus() {
    const element = this.focusStack.pop();
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  // Trap focus within a container
  trapFocus(container) {
    if (!container) return;

    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        this.releaseFocusTrap();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    this.trapStack.push({
      container,
      handleKeyDown,
      firstElement,
      lastElement
    });
  }

  // Release focus trap
  releaseFocusTrap() {
    const trap = this.trapStack.pop();
    if (trap) {
      trap.container.removeEventListener('keydown', trap.handleKeyDown);
      this.restoreFocus();
    }
  }

  // Get all focusable elements within a container
  getFocusableElements(container) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        return element.offsetWidth > 0 && 
               element.offsetHeight > 0 && 
               !element.hidden;
      });
  }
}

// Create singleton instance
export const focusManager = new FocusManager();

// ARIA utilities
export const generateId = (prefix = 'element') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

// Keyboard navigation utilities
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  TAB: 'Tab'
};

export const handleKeyboardNavigation = (event, handlers) => {
  const handler = handlers[event.key];
  if (handler) {
    event.preventDefault();
    handler(event);
  }
};

// Skip navigation component
export const SkipNavigation = ({ links = [] }) => {
  const defaultLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' }
  ];

  const skipLinks = links.length > 0 ? links : defaultLinks;

  return (
    <div className="skip-navigation">
      {skipLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded focus:shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector(link.href);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};

// Screen reader only text utility
export const ScreenReaderOnly = ({ children, as: Component = 'span' }) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};

// Accessible form utilities
export const getAriaDescribedBy = (fieldId, hasError, hasHelp) => {
  const describedBy = [];
  
  if (hasError) {
    describedBy.push(`${fieldId}-error`);
  }
  
  if (hasHelp) {
    describedBy.push(`${fieldId}-help`);
  }
  
  return describedBy.length > 0 ? describedBy.join(' ') : undefined;
};

// Motion preferences
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(
    respectsReducedMotion()
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
};

// Accessible modal/dialog utilities
export const useModal = (isOpen) => {
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      focusManager.saveFocus();
      focusManager.trapFocus(modalRef.current);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        focusManager.releaseFocusTrap();
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return modalRef;
};

// Accessible tooltip utilities
export const useTooltip = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const tooltipId = React.useRef(generateId('tooltip'));

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const triggerProps = {
    'aria-describedby': isVisible ? tooltipId.current : undefined,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip
  };

  const tooltipProps = {
    id: tooltipId.current,
    role: 'tooltip',
    'aria-hidden': !isVisible
  };

  return {
    isVisible,
    triggerProps,
    tooltipProps
  };
};

// Accessible dropdown/combobox utilities
export const useCombobox = (options = []) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  
  const comboboxId = React.useRef(generateId('combobox'));
  const listboxId = React.useRef(generateId('listbox'));

  const handleKeyDown = (event) => {
    handleKeyboardNavigation(event, {
      [KEYBOARD_KEYS.ARROW_DOWN]: () => {
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
      },
      [KEYBOARD_KEYS.ARROW_UP]: () => {
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(options.length - 1);
        } else {
          setActiveIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
      },
      [KEYBOARD_KEYS.ENTER]: () => {
        if (isOpen && activeIndex >= 0) {
          setSelectedIndex(activeIndex);
          setIsOpen(false);
        }
      },
      [KEYBOARD_KEYS.ESCAPE]: () => {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    });
  };

  const triggerProps = {
    id: comboboxId.current,
    role: 'combobox',
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox',
    'aria-controls': isOpen ? listboxId.current : undefined,
    onKeyDown: handleKeyDown,
    onClick: () => setIsOpen(!isOpen)
  };

  const listboxProps = {
    id: listboxId.current,
    role: 'listbox',
    'aria-labelledby': comboboxId.current
  };

  const getOptionProps = (index) => ({
    role: 'option',
    'aria-selected': index === selectedIndex,
    'aria-current': index === activeIndex ? 'true' : undefined
  });

  return {
    isOpen,
    activeIndex,
    selectedIndex,
    triggerProps,
    listboxProps,
    getOptionProps,
    setIsOpen,
    setSelectedIndex
  };
};