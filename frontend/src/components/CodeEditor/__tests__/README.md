# Code Playground Tests

This directory contains comprehensive tests for the code playground functionality, covering:

## Test Coverage

### Core Functionality Tests
- **EnhancedPlayground.test.js** - Main playground component tests
- **MobileCodeEditor.test.js** - Mobile-specific editor functionality
- **CodeSharingModal.test.js** - Code sharing and export features
- **CodeSnippetManager.test.js** - Snippet management functionality

### Integration Tests
- **CodePlayground.integration.test.js** - End-to-end playground workflows
- **CodeExecution.integration.test.js** - Code execution across languages
- **MobileExperience.integration.test.js** - Mobile-specific user flows

## Test Requirements Coverage

### Requirement 3.1 - Code Editor Experience
- ✅ Premium editor experience with Monaco integration
- ✅ Language switching and syntax highlighting
- ✅ Professional themes and settings
- ✅ Mobile editor optimizations

### Requirement 3.2 - Code Execution
- ✅ Code execution across all supported languages
- ✅ Error handling and output formatting
- ✅ Performance metrics and timing
- ✅ Execution cancellation

### Requirement 3.3 - Code Management
- ✅ Code snippet saving and loading
- ✅ Code organization and categorization
- ✅ Search and filtering functionality
- ✅ Import/export capabilities

### Requirement 3.4 - Code Sharing
- ✅ Share URL generation and QR codes
- ✅ Social media integration
- ✅ Preview image generation
- ✅ Export functionality

## Running Tests

```bash
# Run all code playground tests
npm test -- --testPathPattern=CodeEditor

# Run specific test file
npm test EnhancedPlayground.test.js

# Run with coverage
npm test -- --coverage --testPathPattern=CodeEditor

# Run integration tests only
npm test -- --testNamePattern="integration"
```

## Test Structure

Each test file follows the pattern:
1. **Setup** - Mock dependencies and create test utilities
2. **Unit Tests** - Test individual component functionality
3. **Integration Tests** - Test component interactions
4. **Edge Cases** - Test error conditions and boundary cases
5. **Accessibility** - Test keyboard navigation and screen readers
6. **Performance** - Test loading times and responsiveness

## Mock Strategy

- **Monaco Editor** - Mocked with essential methods for testing
- **API Calls** - Mocked axios responses for code execution
- **File System** - Mocked for download/upload functionality
- **Clipboard** - Mocked for copy/paste operations
- **Local Storage** - Mocked for persistence testing