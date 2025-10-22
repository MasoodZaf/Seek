/**
 * Keyboard navigation utilities and focus management
 */

import React from 'react';
import { KEYBOARD_KEYS, focusManager } from './accessibility';

// Keyboard shortcuts registry
class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.isEnabled = true;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    
    // Initialize default shortcuts
    this.initializeDefaultShortcuts();
    
    // Add global event listener
    document.addEventListener('keydown', this.handleKeyDown);
  }

  initializeDefaultShortcuts() {
    // Navigation shortcuts
    this.register('/', () => {
      const searchInput = document.querySelector('[data-search-input]');
      if (searchInput) {
        searchInput.focus();
      }
    }, { description: 'Focus search' });

    this.register('Escape', () => {
      // Close modals, dropdowns, etc.
      const activeModal = document.querySelector('[data-modal][aria-hidden="false"]');
      if (activeModal) {
        const closeButton = activeModal.querySelector('[data-modal-close]');
        if (closeButton) {
          closeButton.click();
        }
      }
      
      // Clear focus from search
      const searchInput = document.querySelector('[data-search-input]:focus');
      if (searchInput) {
        searchInput.blur();
      }
    }, { description: 'Close modal or clear focus' });

    // Quick navigation
    this.register('g h', () => {
      this.navigateTo('/dashboard');
    }, { description: 'Go to dashboard' });

    this.register('g p', () => {
      this.navigateTo('/playground');
    }, { description: 'Go to playground' });

    this.register('g t', () => {
      this.navigateTo('/tutorials');
    }, { description: 'Go to tutorials' });

    this.register('g s', () => {
      this.navigateTo('/settings');
    }, { description: 'Go to settings' });

    // Accessibility shortcuts
    this.register('Alt+1', () => {
      const mainContent = document.querySelector('#main-content, main, [role="main"]');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }, { description: 'Skip to main content' });

    this.register('Alt+2', () => {
      const navigation = document.querySelector('#navigation, nav, [role="navigation"]');
      if (navigation) {
        const firstLink = navigation.querySelector('a, button');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }, { description: 'Skip to navigation' });

    this.register('Alt+3', () => {
      const sidebar = document.querySelector('#sidebar, [role="complementary"]');
      if (sidebar) {
        const firstFocusable = sidebar.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    }, { description: 'Skip to sidebar' });
  }

  register(keys, handler, options = {}) {
    const keySequence = this.normalizeKeys(keys);
    this.shortcuts.set(keySequence, {
      handler,
      description: options.description || '',
      preventDefault: options.preventDefault !== false,
      stopPropagation: options.stopPropagation !== false
    });
  }

  unregister(keys) {
    const keySequence = this.normalizeKeys(keys);
    this.shortcuts.delete(keySequence);
  }

  normalizeKeys(keys) {
    return keys.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  handleKeyDown(event) {
    if (!this.isEnabled) return;

    // Don't handle shortcuts when typing in inputs (except for specific cases)
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );

    // Build key sequence
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    const key = event.key.toLowerCase();
    const keySequence = [...modifiers, key].join('+');

    // Check for registered shortcut
    const shortcut = this.shortcuts.get(keySequence) || this.shortcuts.get(key);
    
    if (shortcut) {
      // Allow certain shortcuts even when typing
      const allowedWhenTyping = ['escape', 'alt+1', 'alt+2', 'alt+3'];
      
      if (isTyping && !allowedWhenTyping.includes(keySequence)) {
        return;
      }

      if (shortcut.preventDefault) {
        event.preventDefault();
      }
      
      if (shortcut.stopPropagation) {
        event.stopPropagation();
      }

      shortcut.handler(event);
    }
  }

  navigateTo(path) {
    // Use React Router navigation if available
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.href = path;
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([keys, shortcut]) => ({
      keys,
      description: shortcut.description
    }));
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.shortcuts.clear();
  }
}

// Focus management for complex components
export class FocusableElementManager {
  constructor(container) {
    this.container = container;
    this.focusableElements = [];
    this.currentIndex = -1;
    this.updateFocusableElements();
  }

  updateFocusableElements() {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ');

    this.focusableElements = Array.from(
      this.container.querySelectorAll(focusableSelectors)
    ).filter(element => {
      return element.offsetWidth > 0 && 
             element.offsetHeight > 0 && 
             !element.hidden &&
             window.getComputedStyle(element).visibility !== 'hidden';
    });
  }

  focusFirst() {
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.currentIndex = 0;
      this.focusableElements[0].focus();
      return true;
    }
    return false;
  }

  focusLast() {
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.currentIndex = this.focusableElements.length - 1;
      this.focusableElements[this.currentIndex].focus();
      return true;
    }
    return false;
  }

  focusNext() {
    this.updateFocusableElements();
    if (this.focusableElements.length === 0) return false;

    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentIndex].focus();
    return true;
  }

  focusPrevious() {
    this.updateFocusableElements();
    if (this.focusableElements.length === 0) return false;

    this.currentIndex = this.currentIndex <= 0 
      ? this.focusableElements.length - 1 
      : this.currentIndex - 1;
    this.focusableElements[this.currentIndex].focus();
    return true;
  }

  getCurrentIndex() {
    const activeElement = document.activeElement;
    return this.focusableElements.indexOf(activeElement);
  }

  updateCurrentIndex() {
    this.currentIndex = this.getCurrentIndex();
  }
}

// Roving tabindex manager for complex widgets
export class RovingTabindexManager {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      selector: options.selector || '[role="option"], [role="tab"], [role="menuitem"]',
      orientation: options.orientation || 'horizontal', // 'horizontal', 'vertical', 'both'
      wrap: options.wrap !== false,
      ...options
    };
    
    this.items = [];
    this.activeIndex = 0;
    
    this.init();
  }

  init() {
    this.updateItems();
    this.setupEventListeners();
    this.setActiveItem(0);
  }

  updateItems() {
    this.items = Array.from(this.container.querySelectorAll(this.options.selector));
    
    // Set all items to tabindex="-1" except the active one
    this.items.forEach((item, index) => {
      item.setAttribute('tabindex', index === this.activeIndex ? '0' : '-1');
    });
  }

  setupEventListeners() {
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.container.addEventListener('click', this.handleClick.bind(this));
  }

  handleKeyDown(event) {
    const { orientation, wrap } = this.options;
    let handled = false;

    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (orientation === 'horizontal' || orientation === 'both') {
          this.moveNext(wrap);
          handled = true;
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (orientation === 'horizontal' || orientation === 'both') {
          this.movePrevious(wrap);
          handled = true;
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_DOWN:
        if (orientation === 'vertical' || orientation === 'both') {
          this.moveNext(wrap);
          handled = true;
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_UP:
        if (orientation === 'vertical' || orientation === 'both') {
          this.movePrevious(wrap);
          handled = true;
        }
        break;
        
      case KEYBOARD_KEYS.HOME:
        this.setActiveItem(0);
        handled = true;
        break;
        
      case KEYBOARD_KEYS.END:
        this.setActiveItem(this.items.length - 1);
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  handleClick(event) {
    const clickedItem = event.target.closest(this.options.selector);
    if (clickedItem) {
      const index = this.items.indexOf(clickedItem);
      if (index !== -1) {
        this.setActiveItem(index);
      }
    }
  }

  moveNext(wrap = true) {
    let nextIndex = this.activeIndex + 1;
    
    if (nextIndex >= this.items.length) {
      nextIndex = wrap ? 0 : this.items.length - 1;
    }
    
    this.setActiveItem(nextIndex);
  }

  movePrevious(wrap = true) {
    let prevIndex = this.activeIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = wrap ? this.items.length - 1 : 0;
    }
    
    this.setActiveItem(prevIndex);
  }

  setActiveItem(index) {
    if (index < 0 || index >= this.items.length) return;

    // Update tabindex
    this.items.forEach((item, i) => {
      item.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    // Update active index
    this.activeIndex = index;

    // Focus the active item
    this.items[index].focus();

    // Update aria-selected if applicable
    if (this.items[index].hasAttribute('aria-selected')) {
      this.items.forEach((item, i) => {
        item.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }
  }

  getActiveItem() {
    return this.items[this.activeIndex];
  }

  getActiveIndex() {
    return this.activeIndex;
  }

  destroy() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.container.removeEventListener('click', this.handleClick);
  }
}

// Create singleton instances
export const keyboardShortcutManager = new KeyboardShortcutManager();

// React hooks for keyboard navigation
export const useKeyboardShortcuts = (shortcuts) => {
  React.useEffect(() => {
    const registeredShortcuts = [];

    Object.entries(shortcuts).forEach(([keys, handler]) => {
      keyboardShortcutManager.register(keys, handler);
      registeredShortcuts.push(keys);
    });

    return () => {
      registeredShortcuts.forEach(keys => {
        keyboardShortcutManager.unregister(keys);
      });
    };
  }, [shortcuts]);
};

export const useFocusableElements = (containerRef) => {
  const [manager, setManager] = React.useState(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const focusManager = new FocusableElementManager(containerRef.current);
      setManager(focusManager);

      return () => {
        // Cleanup if needed
      };
    }
  }, [containerRef]);

  return manager;
};

export const useRovingTabindex = (containerRef, options = {}) => {
  const [manager, setManager] = React.useState(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const rovingManager = new RovingTabindexManager(containerRef.current, options);
      setManager(rovingManager);

      return () => {
        rovingManager.destroy();
      };
    }
  }, [containerRef, options]);

  return manager;
};

// Focus visible utility for better focus indicators
export const addFocusVisiblePolyfill = () => {
  if (typeof window === 'undefined') return;

  let hadKeyboardEvent = true;
  let keyboardThrottleTimeout = 0;

  const inputTypesWhitelist = {
    INPUT: true,
    SELECT: true,
    TEXTAREA: true
  };

  function onKeyDown(e) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }

    hadKeyboardEvent = true;
  }

  function onPointerDown() {
    hadKeyboardEvent = false;
  }

  function onFocus(e) {
    if (hadKeyboardEvent || focusTriggeredByKeyboard(e.target)) {
      e.target.setAttribute('data-focus-visible', '');
    }
  }

  function onBlur(e) {
    e.target.removeAttribute('data-focus-visible');
  }

  function focusTriggeredByKeyboard(el) {
    const type = el.type;
    const tagName = el.tagName;

    if (tagName === 'INPUT' && inputTypesWhitelist[type] && !el.readOnly) {
      return false;
    }

    if (tagName === 'TEXTAREA' && !el.readOnly) {
      return false;
    }

    if (el.contentEditable === 'true') {
      return false;
    }

    return true;
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);

  // Add CSS for focus-visible
  const style = document.createElement('style');
  style.textContent = `
    [data-focus-visible] {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
    
    /* Hide default focus for elements that will use focus-visible */
    button:focus:not([data-focus-visible]),
    [role="button"]:focus:not([data-focus-visible]),
    input:focus:not([data-focus-visible]),
    textarea:focus:not([data-focus-visible]),
    select:focus:not([data-focus-visible]) {
      outline: none;
    }
  `;
  document.head.appendChild(style);
};

// Initialize focus-visible polyfill
if (typeof window !== 'undefined') {
  addFocusVisiblePolyfill();
}