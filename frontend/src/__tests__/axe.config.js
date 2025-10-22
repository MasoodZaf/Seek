/**
 * Axe-core configuration for accessibility testing
 * Configures rules and standards for WCAG 2.1 AA compliance
 */

export const axeConfig = {
  // Test against WCAG 2.1 AA standards
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  
  // Rules configuration
  rules: {
    // Color contrast rules
    'color-contrast': {
      enabled: true,
      options: {
        // Require AA level contrast (4.5:1 for normal text, 3:1 for large text)
        contrastRatio: {
          normal: 4.5,
          large: 3.0
        }
      }
    },
    
    // Focus management rules
    'focus-order-semantics': { enabled: true },
    'focusable-content': { enabled: true },
    'focus-trap': { enabled: true },
    
    // Keyboard navigation rules
    'keyboard': { enabled: true },
    'no-keyboard-trap': { enabled: true },
    'tabindex': { enabled: true },
    
    // ARIA rules
    'aria-allowed-attr': { enabled: true },
    'aria-allowed-role': { enabled: true },
    'aria-describedby': { enabled: true },
    'aria-labelledby': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    
    // Form rules
    'label': { enabled: true },
    'label-title-only': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    
    // Heading rules
    'heading-order': { enabled: true },
    'empty-heading': { enabled: true },
    
    // Image rules
    'image-alt': { enabled: true },
    'image-redundant-alt': { enabled: true },
    
    // Link rules
    'link-name': { enabled: true },
    'link-in-text-block': { enabled: true },
    
    // List rules
    'list': { enabled: true },
    'listitem': { enabled: true },
    'definition-list': { enabled: true },
    
    // Table rules (if used)
    'table-duplicate-name': { enabled: true },
    'table-fake-caption': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    
    // Language rules
    'html-has-lang': { enabled: true },
    'html-lang-valid': { enabled: true },
    'valid-lang': { enabled: true },
    
    // Page structure rules
    'bypass': { enabled: true }, // Skip links
    'document-title': { enabled: true },
    'duplicate-id': { enabled: true },
    'duplicate-id-active': { enabled: true },
    'duplicate-id-aria': { enabled: true },
    'landmark-banner-is-top-level': { enabled: true },
    'landmark-complementary-is-top-level': { enabled: true },
    'landmark-contentinfo-is-top-level': { enabled: true },
    'landmark-main-is-top-level': { enabled: true },
    'landmark-no-duplicate-banner': { enabled: true },
    'landmark-no-duplicate-contentinfo': { enabled: true },
    'landmark-no-duplicate-main': { enabled: true },
    'landmark-one-main': { enabled: true },
    'landmark-unique': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    
    // Motion and animation rules
    'motion-reduce': { enabled: true },
    
    // Custom rules for our application
    'button-name': { enabled: true },
    'input-button-name': { enabled: true },
    'select-name': { enabled: true },
    'textarea-name': { enabled: true },
    
    // Disable rules that may not apply to our SPA
    'meta-refresh': { enabled: false }, // Not applicable for SPA
    'meta-viewport': { enabled: true }, // Important for responsive design
    
    // Rules that might need adjustment for Monaco Editor
    'nested-interactive': { 
      enabled: true,
      options: {
        // Allow nested interactives in code editor context
        allowedRoles: ['textbox', 'button', 'tab', 'tabpanel']
      }
    }
  },
  
  // Exclude certain elements that might cause false positives
  exclude: [
    // Monaco Editor internal elements that might not follow standard patterns
    '.monaco-editor .monaco-mouse-cursor-text',
    '.monaco-editor .monaco-editor-background',
    
    // Third-party components that we can't control
    '[data-testid="third-party-widget"]',
    
    // Loading states that are temporary
    '[data-testid="loading-skeleton"]'
  ],
  
  // Include specific elements for testing
  include: [
    // Main application content
    'main',
    '[role="main"]',
    
    // Navigation elements
    'nav',
    '[role="navigation"]',
    
    // Form elements
    'form',
    '[role="form"]',
    
    // Interactive elements
    'button',
    '[role="button"]',
    'input',
    'select',
    'textarea',
    
    // Content sections
    'section',
    'article',
    '[role="article"]',
    
    // Dialogs and modals
    '[role="dialog"]',
    '[role="alertdialog"]'
  ]
};

// Specific configurations for different test scenarios
export const axeConfigStrict = {
  ...axeConfig,
  // Stricter rules for production testing
  rules: {
    ...axeConfig.rules,
    'color-contrast-enhanced': { enabled: true }, // AAA level contrast
    'focus-order-semantics': { enabled: true },
    'landmark-unique': { enabled: true }
  }
};

export const axeConfigDevelopment = {
  ...axeConfig,
  // More lenient rules for development
  rules: {
    ...axeConfig.rules,
    // Allow some flexibility during development
    'color-contrast': {
      enabled: true,
      options: {
        contrastRatio: {
          normal: 4.0, // Slightly more lenient
          large: 2.8
        }
      }
    }
  }
};

// Configuration for testing specific component types
export const axeConfigComponents = {
  forms: {
    ...axeConfig,
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    rules: {
      'label': { enabled: true },
      'form-field-multiple-labels': { enabled: true },
      'aria-required-attr': { enabled: true },
      'aria-invalid-value': { enabled: true },
      'required-attr': { enabled: true }
    }
  },
  
  navigation: {
    ...axeConfig,
    rules: {
      'link-name': { enabled: true },
      'bypass': { enabled: true },
      'landmark-unique': { enabled: true },
      'landmark-one-main': { enabled: true },
      'focus-order-semantics': { enabled: true }
    }
  },
  
  interactive: {
    ...axeConfig,
    rules: {
      'button-name': { enabled: true },
      'keyboard': { enabled: true },
      'no-keyboard-trap': { enabled: true },
      'focusable-content': { enabled: true },
      'tabindex': { enabled: true }
    }
  }
};