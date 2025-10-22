# Navigation Component Tests

This directory contains comprehensive tests for the navigation components of the Seek learning platform. The tests cover functionality across all screen sizes, keyboard navigation, accessibility, and touch interactions.

## Test Files

### NavigationCore.test.jsx
Core navigation functionality tests using a simplified navigation component. This file tests:

- **Desktop Navigation**: Sidebar, header, search functionality
- **Mobile Navigation**: Bottom navigation, mobile menu overlay, touch interactions
- **Keyboard Navigation**: Tab navigation, Enter/Space key handling, Escape key
- **Touch Interactions**: Touch events, swipe gestures
- **Accessibility**: ARIA labels, landmarks, screen reader support
- **Responsive Behavior**: Screen size adaptation, window resize handling
- **Search Functionality**: Input handling, form submission
- **Error Handling**: Graceful degradation, rapid interactions
- **Performance**: Efficient rendering, large datasets

### Sidebar.test.jsx
Comprehensive tests for the desktop/mobile sidebar component:

- Desktop sidebar rendering and functionality
- Mobile sidebar overlay behavior
- User profile information display
- Navigation section collapse/expand
- Active state management
- Keyboard navigation support
- Accessibility compliance
- Responsive behavior across screen sizes
- User progress display
- Error handling for missing data

### Header.test.jsx
Tests for the header component functionality:

- Basic header rendering with all elements
- Search functionality with autocomplete
- Notifications dropdown
- User menu dropdown
- Theme toggle functionality
- Breadcrumb navigation
- Glass morphism effects
- Keyboard navigation
- Accessibility features
- Responsive behavior
- Error handling

### MobileNavigation.test.jsx
Mobile-specific navigation tests:

- Bottom navigation bar
- Mobile header with user info
- Quick actions bar
- Mobile menu overlay with swipe support
- Touch interactions and gestures
- Keyboard navigation on mobile
- Accessibility on mobile devices
- Responsive behavior
- Performance optimizations
- Error handling

### Navigation.integration.test.jsx
Integration tests covering navigation across the entire application:

- Cross-screen size navigation consistency
- Navigation state management
- Keyboard navigation integration
- Touch and gesture support
- Accessibility integration
- Performance and error handling
- Theme integration
- Route integration

## Test Coverage

The navigation tests cover the following requirements from the specification:

### Requirement 2.1: Enhanced User Experience & Ergonomics
- ✅ Logical and discoverable information architecture
- ✅ Immediate, clear feedback for user actions
- ✅ Device-optimized experiences
- ✅ Engaging, branded loading states
- ✅ Helpful, non-intimidating error presentation

### Requirement 2.3: Mobile Experience Excellence
- ✅ Touch-friendly and responsive interface
- ✅ Intuitive and accessible menu system
- ✅ Readable and well-organized content
- ✅ Smooth layout adaptation between orientations

### Requirement 7.1: Touch Interaction and Gesture Optimization
- ✅ Touch-friendly button sizes (minimum 44px)
- ✅ Swipe gestures for navigation
- ✅ Pull-to-refresh functionality
- ✅ Haptic feedback support
- ✅ Touch-specific animations

### Requirement 7.3: Responsive Navigation and Layout
- ✅ Bottom navigation for mobile
- ✅ Collapsible mobile header
- ✅ Optimized sidebar with overlay animations
- ✅ Mobile-specific layout patterns
- ✅ Responsive typography scaling

## Running the Tests

### Run all navigation tests:
```bash
npm test -- --testPathPattern="Navigation" --watchAll=false
```

### Run specific test files:
```bash
# Core navigation functionality
npm test -- --testPathPattern="NavigationCore.test" --watchAll=false

# Sidebar tests
npm test -- --testPathPattern="Sidebar.test" --watchAll=false

# Header tests
npm test -- --testPathPattern="Header.test" --watchAll=false

# Mobile navigation tests
npm test -- --testPathPattern="MobileNavigation.test" --watchAll=false

# Integration tests
npm test -- --testPathPattern="Navigation.integration.test" --watchAll=false
```

### Run tests with coverage:
```bash
npm test -- --testPathPattern="Navigation" --coverage --watchAll=false
```

## Test Structure

Each test file follows a consistent structure:

1. **Setup and Mocking**: Mock external dependencies and set up test utilities
2. **Component Rendering**: Helper functions to render components with proper context
3. **Test Suites**: Organized by functionality area
4. **Assertions**: Comprehensive checks for behavior, accessibility, and performance

## Key Testing Patterns

### Accessibility Testing
- ARIA labels and roles verification
- Keyboard navigation testing
- Screen reader compatibility
- Focus management
- Color contrast compliance

### Responsive Testing
- Screen size adaptation
- Touch target size verification
- Mobile-specific functionality
- Orientation change handling

### Interaction Testing
- Click and touch event handling
- Keyboard event processing
- Gesture recognition
- State management

### Error Handling
- Graceful degradation
- Missing data scenarios
- Network failure recovery
- Rapid interaction handling

## Mock Strategy

The tests use comprehensive mocking to isolate navigation functionality:

- **framer-motion**: Simplified motion components
- **axios**: HTTP request mocking
- **react-hot-toast**: Toast notification mocking
- **Context providers**: Simplified auth and theme contexts
- **External libraries**: Headless UI, Heroicons mocking

## Accessibility Standards

All navigation tests verify compliance with:

- WCAG 2.1 AA standards
- Keyboard navigation requirements
- Screen reader compatibility
- Touch accessibility guidelines
- Color contrast requirements
- Focus management standards

## Performance Considerations

Tests include performance checks for:

- Efficient rendering without unnecessary re-renders
- Large dataset handling
- Rapid interaction processing
- Memory leak prevention
- Animation performance

## Browser Compatibility

Tests verify functionality across:

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Different screen sizes and orientations
- Various input methods (mouse, keyboard, touch)

## Continuous Integration

These tests are designed to run in CI/CD pipelines with:

- Consistent test environment setup
- Reliable mocking strategies
- Comprehensive error reporting
- Performance benchmarking
- Accessibility auditing

## Contributing

When adding new navigation features:

1. Add corresponding tests to the appropriate test file
2. Follow the existing test structure and patterns
3. Include accessibility and responsive behavior tests
4. Add error handling and edge case coverage
5. Update this README with new test descriptions

## Troubleshooting

Common test issues and solutions:

### Mock Issues
- Ensure all external dependencies are properly mocked
- Check that context providers are correctly set up
- Verify that async operations are properly awaited

### Accessibility Issues
- Use proper ARIA labels and roles
- Ensure keyboard navigation works correctly
- Test with screen reader simulation

### Responsive Issues
- Mock window dimensions correctly
- Test across multiple screen sizes
- Verify touch target sizes meet guidelines

### Performance Issues
- Check for memory leaks in animations
- Verify efficient re-rendering
- Test with large datasets