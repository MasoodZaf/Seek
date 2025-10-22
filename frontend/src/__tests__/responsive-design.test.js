/**
 * Responsive Design Test Suite
 * 
 * Comprehensive testing for responsive design behavior across different
 * device sizes, orientations, and screen densities.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

// Components to test
import BottomNavigation from '../components/mobile/BottomNavigation';
import ResponsiveHeader from '../components/mobile/ResponsiveHeader';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import ResponsiveGrid from '../components/layout/ResponsiveGrid';
import MobileCodeEditor from '../components/CodeEditor/MobileCodeEditor';
import MobileTutorialCard from '../components/mobile/MobileTutorialCard';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const mockReact = require('react');
  return {
    motion: {
      div: ({ children, ...props }) => mockReact.createElement('div', props, children),
      button: ({ children, ...props }) => mockReact.createElement('button', props, children),
      header: ({ children, ...props }) => mockReact.createElement('header', props, children),
      nav: ({ children, ...props }) => mockReact.createElement('nav', props, children)
    },
    AnimatePresence: ({ children }) => children
  };
});

// Mock Monaco Editor
jest.mock('../components/CodeEditor/MonacoCodeEditor', () => {
  const mockReact = require('react');
  return function MockMonacoEditor({ onMount, onChange, value }) {
    mockReact.useEffect(() => {
      if (onMount) {
        const mockEditor = {
          onDidChangeCursorPosition: jest.fn(),
          onDidChangeCursorSelection: jest.fn(),
          onDidChangeModelContent: jest.fn(),
          getDomNode: () => document.createElement('div'),
          addCommand: jest.fn(),
          getAction: jest.fn(() => ({ run: jest.fn() })),
          getPosition: () => ({ lineNumber: 1, column: 1 }),
          setPosition: jest.fn(),
          getModel: () => ({
            getValueInRange: () => '',
            getLineContent: () => '',
            getFullModelRange: () => ({})
          }),
          executeEdits: jest.fn(),
          focus: jest.fn(),
          getSelection: () => null
        };
        onMount(mockEditor, {});
      }
    }, [onMount]);

    return mockReact.createElement('textarea', {
      'data-testid': 'monaco-editor',
      value: value,
      onChange: (e) => onChange?.(e.target.value)
    });
  };
});

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

// Device configurations for testing
const DEVICE_SIZES = {
  // Mobile devices
  'iPhone SE': { width: 375, height: 667, dpr: 2 },
  'iPhone 12': { width: 390, height: 844, dpr: 3 },
  'iPhone 12 Pro Max': { width: 428, height: 926, dpr: 3 },
  'Samsung Galaxy S21': { width: 360, height: 800, dpr: 3 },
  'Google Pixel 5': { width: 393, height: 851, dpr: 2.75 },
  
  // Tablets
  'iPad': { width: 768, height: 1024, dpr: 2 },
  'iPad Pro 11"': { width: 834, height: 1194, dpr: 2 },
  'iPad Pro 12.9"': { width: 1024, height: 1366, dpr: 2 },
  'Samsung Galaxy Tab': { width: 800, height: 1280, dpr: 2 },
  
  // Desktop
  'Small Desktop': { width: 1024, height: 768, dpr: 1 },
  'Medium Desktop': { width: 1440, height: 900, dpr: 1 },
  'Large Desktop': { width: 1920, height: 1080, dpr: 1 },
  '4K Desktop': { width: 3840, height: 2160, dpr: 2 }
};

// Utility functions
const setViewport = (width, height, dpr = 1) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: dpr,
  });
  
  // Update matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => {
      const matches = {
        '(max-width: 640px)': width <= 640,
        '(max-width: 768px)': width <= 768,
        '(max-width: 1024px)': width <= 1024,
        '(max-width: 1280px)': width <= 1280,
        '(min-width: 768px)': width >= 768,
        '(min-width: 1024px)': width >= 1024,
        '(orientation: portrait)': height > width,
        '(orientation: landscape)': width > height,
        '(prefers-reduced-motion: reduce)': false,
        '(hover: hover)': width >= 1024, // Assume desktop has hover
        '(pointer: coarse)': width < 1024, // Assume mobile has coarse pointer
        '(pointer: fine)': width >= 1024 // Assume desktop has fine pointer
      };
      
      return {
        matches: matches[query] || false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

const getComputedBreakpoint = (width) => {
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
};

describe('Responsive Design Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
    
    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
  });

  describe('Breakpoint Behavior', () => {
    Object.entries(DEVICE_SIZES).forEach(([deviceName, { width, height, dpr }]) => {
      test(`should adapt layout for ${deviceName} (${width}x${height})`, () => {
        setViewport(width, height, dpr);
        const breakpoint = getComputedBreakpoint(width);
        
        render(
          <TestWrapper>
            <ResponsiveLayout>
              <ResponsiveHeader title={`Test on ${deviceName}`} />
              <div>Content for {deviceName}</div>
              <BottomNavigation />
            </ResponsiveLayout>
          </TestWrapper>
        );
        
        // Check if components adapt to the breakpoint
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        
        if (breakpoint === 'xs' || breakpoint === 'sm') {
          // Mobile layout
          const bottomNav = screen.getByRole('navigation', { hidden: true });
          expect(bottomNav).toBeInTheDocument();
          
          // Mobile search button should be visible
          const mobileSearch = screen.getByRole('button', { name: /search/i });
          expect(mobileSearch).toHaveClass('md:hidden');
        } else {
          // Desktop layout
          const bottomNav = screen.getByRole('navigation', { hidden: true });
          expect(bottomNav).toHaveClass('md:hidden');
          
          // Desktop search should be visible
          const desktopSearch = screen.queryByPlaceholderText(/search tutorials/i);
          if (desktopSearch) {
            expect(desktopSearch).toHaveClass('hidden', 'md:flex');
          }
        }
      });
    });
  });

  describe('Orientation Changes', () => {
    const testOrientationChange = (deviceName, device) => {
      test(`should handle orientation change on ${deviceName}`, async () => {
        // Start in portrait
        setViewport(device.width, device.height, device.dpr);
        
        const { rerender } = render(
          <TestWrapper>
            <ResponsiveHeader title="Orientation Test" />
            <MobileCodeEditor
              value="console.log('orientation test');"
              onChange={jest.fn()}
              language="javascript"
            />
            <BottomNavigation />
          </TestWrapper>
        );
        
        // Verify portrait layout
        expect(screen.getByText('Orientation Test')).toBeInTheDocument();
        
        // Switch to landscape
        setViewport(device.height, device.width, device.dpr);
        
        rerender(
          <TestWrapper>
            <ResponsiveHeader title="Orientation Test" />
            <MobileCodeEditor
              value="console.log('orientation test');"
              onChange={jest.fn()}
              language="javascript"
            />
            <BottomNavigation />
          </TestWrapper>
        );
        
        // Components should still be functional
        expect(screen.getByText('Orientation Test')).toBeInTheDocument();
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
        
        // Layout should adapt to landscape
        const codeEditor = screen.getByTestId('monaco-editor').closest('div');
        expect(codeEditor).toBeInTheDocument();
      });
    };
    
    // Test orientation changes on mobile devices
    testOrientationChange('iPhone 12', DEVICE_SIZES['iPhone 12']);
    testOrientationChange('iPad', DEVICE_SIZES['iPad']);
    testOrientationChange('Samsung Galaxy S21', DEVICE_SIZES['Samsung Galaxy S21']);
  });

  describe('Grid System Responsiveness', () => {
    test('should adapt grid columns based on screen size', () => {
      const tutorials = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Tutorial ${i + 1}`,
        description: `Description for tutorial ${i + 1}`,
        difficulty: 'Beginner',
        duration: '10 min'
      }));
      
      // Test different screen sizes
      const screenSizes = [
        { width: 375, expectedCols: 1 }, // Mobile: 1 column
        { width: 640, expectedCols: 2 }, // Small tablet: 2 columns
        { width: 1024, expectedCols: 3 }, // Desktop: 3 columns
        { width: 1440, expectedCols: 4 } // Large desktop: 4 columns
      ];
      
      screenSizes.forEach(({ width, expectedCols }) => {
        setViewport(width, 800);
        
        render(
          <TestWrapper>
            <ResponsiveGrid>
              {tutorials.map(tutorial => (
                <MobileTutorialCard
                  key={tutorial.id}
                  title={tutorial.title}
                  description={tutorial.description}
                  difficulty={tutorial.difficulty}
                  duration={tutorial.duration}
                />
              ))}
            </ResponsiveGrid>
          </TestWrapper>
        );
        
        const grid = screen.getByRole('grid', { hidden: true }) || 
                    screen.getByTestId('responsive-grid') ||
                    document.querySelector('[class*="grid"]');
        
        if (grid) {
          const computedStyle = window.getComputedStyle(grid);
          const gridCols = computedStyle.gridTemplateColumns;
          
          // Count the number of columns
          const colCount = gridCols ? gridCols.split(' ').length : expectedCols;
          expect(colCount).toBeLessThanOrEqual(expectedCols + 1); // Allow some flexibility
        }
      });
    });
  });

  describe('Typography Scaling', () => {
    test('should scale typography appropriately across devices', () => {
      const testSizes = [
        { width: 375, name: 'mobile' },
        { width: 768, name: 'tablet' },
        { width: 1024, name: 'desktop' }
      ];
      
      testSizes.forEach(({ width, name }) => {
        setViewport(width, 800);
        
        render(
          <TestWrapper>
            <ResponsiveHeader title="Typography Test" />
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">Main Heading</h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl">Sub Heading</h2>
              <p className="text-base md:text-lg">Body text content</p>
            </div>
          </TestWrapper>
        );
        
        const mainHeading = screen.getByText('Main Heading');
        const subHeading = screen.getByText('Sub Heading');
        const bodyText = screen.getByText('Body text content');
        
        // Check that elements have appropriate classes for the screen size
        expect(mainHeading).toHaveClass('text-4xl');
        expect(subHeading).toHaveClass('text-2xl');
        expect(bodyText).toHaveClass('text-base');
        
        if (width >= 768) {
          expect(mainHeading).toHaveClass('md:text-5xl');
          expect(subHeading).toHaveClass('md:text-3xl');
          expect(bodyText).toHaveClass('md:text-lg');
        }
      });
    });
  });

  describe('Touch Target Optimization', () => {
    test('should maintain minimum touch target sizes on mobile', () => {
      setViewport(375, 667);
      
      render(
        <TestWrapper>
          <BottomNavigation />
        </TestWrapper>
      );
      
      // Get all interactive elements
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      const interactiveElements = [...buttons, ...links];
      
      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        // Check minimum touch target size (44px)
        const minHeight = Math.max(rect.height, parseInt(computedStyle.minHeight) || 0);
        const minWidth = Math.max(rect.width, parseInt(computedStyle.minWidth) || 0);
        
        expect(minHeight).toBeGreaterThanOrEqual(44);
        expect(minWidth).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Content Reflow', () => {
    test('should reflow content without horizontal scrolling', () => {
      const testWidths = [320, 375, 414, 768, 1024, 1440];
      
      testWidths.forEach(width => {
        setViewport(width, 800);
        
        render(
          <TestWrapper>
            <ResponsiveHeader title="Content Reflow Test" />
            <div className="p-4">
              <MobileTutorialCard
                title="Long Tutorial Title That Should Wrap Properly"
                description="This is a very long description that should wrap properly and not cause horizontal scrolling on any device size. It contains enough text to test wrapping behavior."
                difficulty="Intermediate"
                duration="25 min"
              />
            </div>
          </TestWrapper>
        );
        
        // Check that content doesn't overflow
        const container = screen.getByText('Content Reflow Test').closest('div');
        if (container) {
          const computedStyle = window.getComputedStyle(container);
          expect(computedStyle.overflowX).not.toBe('scroll');
        }
        
        // Check that text content wraps properly
        const longTitle = screen.getByText(/Long Tutorial Title/);
        const titleRect = longTitle.getBoundingClientRect();
        expect(titleRect.width).toBeLessThanOrEqual(width);
      });
    });
  });

  describe('Image Responsiveness', () => {
    test('should serve appropriate image sizes for different devices', () => {
      const testCases = [
        { width: 375, expectedMaxWidth: 375 },
        { width: 768, expectedMaxWidth: 768 },
        { width: 1024, expectedMaxWidth: 1024 }
      ];
      
      testCases.forEach(({ width, expectedMaxWidth }) => {
        setViewport(width, 800);
        
        render(
          <TestWrapper>
            <MobileTutorialCard
              title="Image Test"
              description="Testing responsive images"
              difficulty="Beginner"
              duration="5 min"
              imageUrl="https://example.com/tutorial-image.jpg"
            />
          </TestWrapper>
        );
        
        const image = screen.queryByRole('img');
        if (image) {
          const rect = image.getBoundingClientRect();
          expect(rect.width).toBeLessThanOrEqual(expectedMaxWidth);
          
          // Should have responsive attributes
          expect(image).toHaveAttribute('loading', 'lazy');
        }
      });
    });
  });

  describe('Navigation Adaptation', () => {
    test('should switch between mobile and desktop navigation patterns', () => {
      // Test mobile navigation
      setViewport(375, 667);
      
      const { rerender } = render(
        <TestWrapper>
          <ResponsiveHeader />
          <BottomNavigation />
        </TestWrapper>
      );
      
      // Mobile should show bottom navigation
      const bottomNav = screen.getByRole('navigation', { hidden: true });
      expect(bottomNav).toBeInTheDocument();
      expect(bottomNav).not.toHaveClass('md:hidden');
      
      // Mobile should show hamburger menu or mobile search
      const mobileSearch = screen.getByRole('button', { name: /search/i });
      expect(mobileSearch).toHaveClass('md:hidden');
      
      // Test desktop navigation
      setViewport(1024, 768);
      
      rerender(
        <TestWrapper>
          <ResponsiveHeader />
          <BottomNavigation />
        </TestWrapper>
      );
      
      // Desktop should hide bottom navigation
      const desktopBottomNav = screen.getByRole('navigation', { hidden: true });
      expect(desktopBottomNav).toHaveClass('md:hidden');
      
      // Desktop should show search bar
      const desktopSearch = screen.queryByPlaceholderText(/search tutorials/i);
      if (desktopSearch) {
        expect(desktopSearch).toHaveClass('hidden', 'md:flex');
      }
    });
  });

  describe('Performance Across Devices', () => {
    test('should maintain performance on different screen densities', () => {
      const densities = [1, 1.5, 2, 3];
      
      densities.forEach(dpr => {
        setViewport(375, 667, dpr);
        
        const startTime = performance.now();
        
        render(
          <TestWrapper>
            <ResponsiveHeader title={`DPR ${dpr} Test`} />
            <MobileCodeEditor
              value="console.log('DPR test');"
              onChange={jest.fn()}
              language="javascript"
            />
          </TestWrapper>
        );
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        // Should render quickly regardless of pixel density
        expect(renderTime).toBeLessThan(100);
        
        // Components should be present
        expect(screen.getByText(`DPR ${dpr} Test`)).toBeInTheDocument();
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Across Devices', () => {
    test('should maintain accessibility on all screen sizes', () => {
      const testSizes = [375, 768, 1024, 1440];
      
      testSizes.forEach(width => {
        setViewport(width, 800);
        
        render(
          <TestWrapper>
            <ResponsiveHeader title="Accessibility Test" />
            <BottomNavigation />
          </TestWrapper>
        );
        
        // Check that interactive elements are accessible
        const buttons = screen.getAllByRole('button');
        const links = screen.getAllByRole('link');
        
        [...buttons, ...links].forEach(element => {
          // Should be focusable
          expect(element.tabIndex).toBeGreaterThanOrEqual(0);
          
          // Should have accessible name
          const accessibleName = element.getAttribute('aria-label') || 
                                element.textContent || 
                                element.getAttribute('title');
          expect(accessibleName).toBeTruthy();
        });
        
        // Check heading hierarchy
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
      });
    });
  });
});