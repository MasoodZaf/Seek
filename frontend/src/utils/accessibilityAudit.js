/**
 * Accessibility audit utilities for WCAG 2.1 AA compliance checking
 */

import { getContrastRatio, meetsWCAGAA } from './accessibility';

export class AccessibilityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  // Run comprehensive accessibility audit
  audit() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];

    this.checkColorContrast();
    this.checkImages();
    this.checkForms();
    this.checkHeadings();
    this.checkLinks();
    this.checkButtons();
    this.checkLandmarks();
    this.checkFocusManagement();
    this.checkKeyboardNavigation();
    this.checkAriaLabels();

    return {
      issues: this.issues,
      warnings: this.warnings,
      passed: this.passed,
      score: this.calculateScore()
    };
  }

  // Check color contrast ratios
  checkColorContrast() {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, input, textarea, label');
    
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Skip if transparent or no background
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
        return;
      }

      try {
        const contrast = getContrastRatio(color, backgroundColor);
        
        if (contrast < 4.5) {
          this.issues.push({
            type: 'color-contrast',
            element: element.tagName.toLowerCase(),
            message: `Insufficient color contrast ratio: ${contrast.toFixed(2)} (minimum: 4.5)`,
            severity: 'error',
            wcag: '1.4.3'
          });
        } else if (contrast < 7) {
          this.warnings.push({
            type: 'color-contrast',
            element: element.tagName.toLowerCase(),
            message: `Color contrast could be improved: ${contrast.toFixed(2)} (AAA standard: 7)`,
            severity: 'warning',
            wcag: '1.4.6'
          });
        } else {
          this.passed.push({
            type: 'color-contrast',
            element: element.tagName.toLowerCase(),
            message: `Good color contrast: ${contrast.toFixed(2)}`,
            wcag: '1.4.3'
          });
        }
      } catch (error) {
        // Skip elements where contrast can't be calculated
      }
    });
  }

  // Check images for alt text
  checkImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      
      if (role === 'presentation' || role === 'none') {
        this.passed.push({
          type: 'image-alt',
          element: 'img',
          message: 'Decorative image properly marked with role',
          wcag: '1.1.1'
        });
      } else if (!alt && alt !== '') {
        this.issues.push({
          type: 'image-alt',
          element: 'img',
          message: 'Image missing alt attribute',
          severity: 'error',
          wcag: '1.1.1'
        });
      } else if (alt === '') {
        this.warnings.push({
          type: 'image-alt',
          element: 'img',
          message: 'Image has empty alt text - ensure this is decorative',
          severity: 'warning',
          wcag: '1.1.1'
        });
      } else {
        this.passed.push({
          type: 'image-alt',
          element: 'img',
          message: 'Image has alt text',
          wcag: '1.1.1'
        });
      }
    });
  }

  // Check form accessibility
  checkForms() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input) => {
      const label = this.findLabel(input);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.issues.push({
          type: 'form-label',
          element: input.tagName.toLowerCase(),
          message: 'Form control missing accessible label',
          severity: 'error',
          wcag: '1.3.1'
        });
      } else {
        this.passed.push({
          type: 'form-label',
          element: input.tagName.toLowerCase(),
          message: 'Form control has accessible label',
          wcag: '1.3.1'
        });
      }

      // Check for required field indication
      if (input.hasAttribute('required')) {
        const hasRequiredIndicator = this.hasRequiredIndicator(input);
        if (!hasRequiredIndicator) {
          this.warnings.push({
            type: 'form-required',
            element: input.tagName.toLowerCase(),
            message: 'Required field should have visual and programmatic indication',
            severity: 'warning',
            wcag: '3.3.2'
          });
        }
      }
    });
  }

  // Check heading hierarchy
  checkHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level - previousLevel > 1) {
        this.issues.push({
          type: 'heading-hierarchy',
          element: heading.tagName.toLowerCase(),
          message: `Heading level skipped from h${previousLevel} to h${level}`,
          severity: 'error',
          wcag: '1.3.1'
        });
      }
      
      previousLevel = level;
    });

    // Check for h1
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) {
      this.warnings.push({
        type: 'heading-h1',
        element: 'h1',
        message: 'Page should have at least one h1 heading',
        severity: 'warning',
        wcag: '1.3.1'
      });
    } else if (h1Count > 1) {
      this.warnings.push({
        type: 'heading-h1',
        element: 'h1',
        message: 'Page has multiple h1 headings - consider using only one',
        severity: 'warning',
        wcag: '1.3.1'
      });
    }
  }

  // Check links
  checkLinks() {
    const links = document.querySelectorAll('a');
    
    links.forEach((link) => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      const ariaLabel = link.getAttribute('aria-label');
      
      if (!href) {
        this.issues.push({
          type: 'link-href',
          element: 'a',
          message: 'Link missing href attribute',
          severity: 'error',
          wcag: '2.4.4'
        });
      }
      
      if (!text && !ariaLabel) {
        this.issues.push({
          type: 'link-text',
          element: 'a',
          message: 'Link missing accessible text',
          severity: 'error',
          wcag: '2.4.4'
        });
      }
      
      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'more', 'here', 'link'];
      if (genericTexts.includes(text.toLowerCase())) {
        this.warnings.push({
          type: 'link-text',
          element: 'a',
          message: 'Link text is not descriptive',
          severity: 'warning',
          wcag: '2.4.4'
        });
      }
    });
  }

  // Check buttons
  checkButtons() {
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
    
    buttons.forEach((button) => {
      const text = button.textContent.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const value = button.getAttribute('value');
      
      if (!text && !ariaLabel && !value) {
        this.issues.push({
          type: 'button-text',
          element: button.tagName.toLowerCase(),
          message: 'Button missing accessible text',
          severity: 'error',
          wcag: '2.4.4'
        });
      }
    });
  }

  // Check landmarks
  checkLandmarks() {
    const main = document.querySelectorAll('main, [role="main"]');
    const nav = document.querySelectorAll('nav, [role="navigation"]');
    
    if (main.length === 0) {
      this.warnings.push({
        type: 'landmark-main',
        element: 'main',
        message: 'Page should have a main landmark',
        severity: 'warning',
        wcag: '1.3.1'
      });
    }
    
    if (nav.length === 0) {
      this.warnings.push({
        type: 'landmark-nav',
        element: 'nav',
        message: 'Page should have navigation landmarks',
        severity: 'warning',
        wcag: '1.3.1'
      });
    }
  }

  // Check focus management
  checkFocusManagement() {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex');
      
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.warnings.push({
          type: 'focus-tabindex',
          element: element.tagName.toLowerCase(),
          message: 'Positive tabindex can disrupt natural tab order',
          severity: 'warning',
          wcag: '2.4.3'
        });
      }
    });
  }

  // Check keyboard navigation
  checkKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"], [role="link"]'
    );
    
    interactiveElements.forEach((element) => {
      // Check if element is keyboard accessible
      const tabIndex = element.getAttribute('tabindex');
      const isNativelyFocusable = ['button', 'a', 'input', 'textarea', 'select'].includes(element.tagName.toLowerCase());
      
      if (tabIndex === '-1' && !isNativelyFocusable) {
        this.warnings.push({
          type: 'keyboard-access',
          element: element.tagName.toLowerCase(),
          message: 'Interactive element may not be keyboard accessible',
          severity: 'warning',
          wcag: '2.1.1'
        });
      }
    });
  }

  // Check ARIA labels
  checkAriaLabels() {
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
    const elementsWithAriaLabelledBy = document.querySelectorAll('[aria-labelledby]');
    
    elementsWithAriaLabelledBy.forEach((element) => {
      const labelledBy = element.getAttribute('aria-labelledby');
      const labelIds = labelledBy.split(' ');
      
      labelIds.forEach((id) => {
        const labelElement = document.getElementById(id);
        if (!labelElement) {
          this.issues.push({
            type: 'aria-labelledby',
            element: element.tagName.toLowerCase(),
            message: `aria-labelledby references non-existent element: ${id}`,
            severity: 'error',
            wcag: '1.3.1'
          });
        }
      });
    });
  }

  // Helper methods
  findLabel(input) {
    const id = input.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label;
    }
    
    // Check if input is wrapped in a label
    const parentLabel = input.closest('label');
    return parentLabel;
  }

  hasRequiredIndicator(input) {
    const label = this.findLabel(input);
    if (label) {
      return label.textContent.includes('*') || 
             label.querySelector('[aria-label*="required"]') ||
             input.getAttribute('aria-required') === 'true';
    }
    return input.getAttribute('aria-required') === 'true';
  }

  calculateScore() {
    const total = this.issues.length + this.warnings.length + this.passed.length;
    if (total === 0) return 100;
    
    const score = (this.passed.length / total) * 100;
    return Math.round(score);
  }
}

// Export utilities
export const runAccessibilityAudit = () => {
  const auditor = new AccessibilityAuditor();
  return auditor.audit();
};

export const logAccessibilityReport = () => {
  const report = runAccessibilityAudit();
  
  console.group('🔍 Accessibility Audit Report');
  console.log(`Score: ${report.score}%`);
  
  if (report.issues.length > 0) {
    console.group('❌ Issues (Must Fix)');
    report.issues.forEach(issue => {
      console.error(`${issue.type}: ${issue.message} (WCAG ${issue.wcag})`);
    });
    console.groupEnd();
  }
  
  if (report.warnings.length > 0) {
    console.group('⚠️ Warnings (Should Fix)');
    report.warnings.forEach(warning => {
      console.warn(`${warning.type}: ${warning.message} (WCAG ${warning.wcag})`);
    });
    console.groupEnd();
  }
  
  if (report.passed.length > 0) {
    console.group('✅ Passed');
    report.passed.forEach(pass => {
      console.log(`${pass.type}: ${pass.message} (WCAG ${pass.wcag})`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return report;
};

// Development helper
if (process.env.NODE_ENV === 'development') {
  window.auditAccessibility = logAccessibilityReport;
}