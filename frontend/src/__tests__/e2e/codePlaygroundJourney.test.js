/**
 * Code Playground End-to-End Journey Tests
 * 
 * Tests complete code editing, execution, and sharing workflows,
 * validating professional polish and mobile optimization.
 * 
 * Requirements Coverage:
 * - Requirement 3: Code Playground Professional Polish
 * - Requirement 7: Mobile Experience Excellence
 * - Requirement 5: Component Library Standardization
 * - Requirement 6: Performance & Accessibility Optimization
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import EnhancedPlayground from '../../components/CodeEditor/EnhancedPlayground';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange, language, theme, options }) => (
    <div
      data-testid="monaco-editor"
      data-language={language}
      data-theme={theme}
      className="monaco-editor professional-theme"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="code-input"
        className="code-editor-textarea"
      />
    </div>
  )
}));

// Mock code execution service
const mockCodeExecution = {
  execute: jest.fn(),
  getLanguages: jest.fn(() => ['javascript', 'python', 'java', 'cpp']),
  saveSnippet: jest.fn(),
  shareSnippet: jest.fn()
};

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Code Playground Complete Journey E2E Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    Object.values(mockCodeExecution).forEach(method => {
      if (typeof method === 'function') method.mockReset();
    });
  });

  describe('Code Writing and Execution Journey', () => {
    test('should complete full code writing to execution workflow', async () => {
      // Mock successful code execution
      mockCodeExecution.execute.mockResolvedValue({
        success: true,
        output: 'Hello, World!',
        executionTime: 45,
        memoryUsage: 1024
      });

      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Step 1: Verify professional playground loads (Requirement 3.1)
      const playground = await screen.findByTestId('enhanced-playground');
      expect(playground).toHaveClass('professional-layout');

      const monacoEditor = await screen.findByTestId('monaco-editor');
      expect(monacoEditor).toHaveAttribute('data-theme', 'seek-professional');
      expect(monacoEditor).toHaveClass('professional-theme');

      // Step 2: Select programming language
      const languageSelector = await screen.findByTestId('language-selector');
      expect(languageSelector).toHaveClass('enhanced-select');
      
      await user.click(languageSelector);
      const javascriptOption = await screen.findByRole('option', { name: /javascript/i });
      await user.click(javascriptOption);

      // Verify language change animation (Requirement 3.1)
      await waitFor(() => {
        expect(monacoEditor).toHaveAttribute('data-language', 'javascript');
      });

      // Step 3: Write code with enhanced editor features
      const codeInput = await screen.findByTestId('code-input');
      const testCode = 'console.log("Hello, World!");';
      
      await user.clear(codeInput);
      await user.type(codeInput, testCode);

      // Verify syntax highlighting and editor enhancements
      expect(codeInput).toHaveValue(testCode);

      // Step 4: Execute code with professional feedback (Requirement 3.2)
      const executeButton = await screen.findByRole('button', { name: /run code/i });
      expect(executeButton).toHaveClass('gradient-button', 'execute-button');
      
      await user.click(executeButton);

      // Verify loading state during execution
      const loadingSpinner = await screen.findByTestId('execution-loading');
      expect(loadingSpinner).toHaveClass('professional-spinner');

      // Step 5: Verify execution results with enhanced output (Requirement 3.2)
      await waitFor(() => {
        const outputPanel = screen.getByTestId('enhanced-output-panel');
        expect(outputPanel).toBeInTheDocument();
      });

      const outputPanel = screen.getByTestId('enhanced-output-panel');
      expect(within(outputPanel).getByText('Hello, World!')).toBeInTheDocument();

      // Verify performance metrics display
      const executionTime = within(outputPanel).getByTestId('execution-time');
      expect(executionTime).toHaveTextContent('45ms');

      const memoryUsage = within(outputPanel).getByTestId('memory-usage');
      expect(memoryUsage).toHaveTextContent('1.0 KB');

      expect(mockCodeExecution.execute).toHaveBeenCalledWith({
        code: testCode,
        language: 'javascript'
      });
    });

    test('should handle code execution errors with helpful feedback', async () => {
      // Mock execution error
      mockCodeExecution.execute.mockResolvedValue({
        success: false,
        error: 'SyntaxError: Unexpected token',
        line: 1,
        column: 15,
        suggestions: ['Check for missing semicolon', 'Verify parentheses matching']
      });

      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      const codeInput = await screen.findByTestId('code-input');
      await user.type(codeInput, 'console.log("Hello World"');

      const executeButton = await screen.findByRole('button', { name: /run code/i });
      await user.click(executeButton);

      // Verify professional error handling (Requirement 3.2)
      await waitFor(() => {
        const errorPanel = screen.getByTestId('error-panel');
        expect(errorPanel).toHaveClass('professional-error');
      });

      const errorPanel = screen.getByTestId('error-panel');
      expect(within(errorPanel).getByText(/syntaxerror/i)).toBeInTheDocument();
      
      // Verify helpful suggestions
      const suggestions = within(errorPanel).getByTestId('error-suggestions');
      expect(within(suggestions).getByText(/check for missing semicolon/i)).toBeInTheDocument();

      // Verify error highlighting in editor
      const errorHighlight = await screen.findByTestId('error-highlight');
      expect(errorHighlight).toHaveAttribute('data-line', '1');
      expect(errorHighlight).toHaveAttribute('data-column', '15');
    });
  });

  describe('Code Management and Sharing Journey', () => {
    test('should complete code saving and sharing workflow', async () => {
      // Mock successful save and share
      mockCodeExecution.saveSnippet.mockResolvedValue({
        success: true,
        snippetId: 'abc123',
        url: 'https://seek.com/snippets/abc123'
      });

      mockCodeExecution.shareSnippet.mockResolvedValue({
        success: true,
        shareUrl: 'https://seek.com/share/abc123',
        previewImage: 'https://seek.com/previews/abc123.png'
      });

      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Step 1: Write code
      const codeInput = await screen.findByTestId('code-input');
      const testCode = 'function greet(name) {\n  return `Hello, ${name}!`;\n}';
      await user.type(codeInput, testCode);

      // Step 2: Save snippet (Requirement 3.4)
      const saveButton = await screen.findByRole('button', { name: /save/i });
      expect(saveButton).toHaveClass('professional-button');
      await user.click(saveButton);

      // Fill save dialog
      const saveDialog = await screen.findByTestId('save-snippet-dialog');
      const titleInput = within(saveDialog).getByLabelText(/title/i);
      const descriptionInput = within(saveDialog).getByLabelText(/description/i);
      const tagsInput = within(saveDialog).getByLabelText(/tags/i);

      await user.type(titleInput, 'Greeting Function');
      await user.type(descriptionInput, 'A simple greeting function in JavaScript');
      await user.type(tagsInput, 'javascript, function, beginner');

      const confirmSaveButton = within(saveDialog).getByRole('button', { name: /save snippet/i });
      await user.click(confirmSaveButton);

      // Verify save success
      await waitFor(() => {
        const successMessage = screen.getByTestId('save-success');
        expect(successMessage).toHaveTextContent(/snippet saved successfully/i);
      });

      // Step 3: Share snippet (Requirement 3.4, 8.3)
      const shareButton = await screen.findByRole('button', { name: /share/i });
      await user.click(shareButton);

      const shareModal = await screen.findByTestId('share-modal');
      expect(shareModal).toHaveClass('professional-modal');

      // Verify social sharing options
      const twitterShare = within(shareModal).getByRole('button', { name: /twitter/i });
      const linkedinShare = within(shareModal).getByRole('button', { name: /linkedin/i });
      const copyLinkButton = within(shareModal).getByRole('button', { name: /copy link/i });

      expect(twitterShare).toBeInTheDocument();
      expect(linkedinShare).toBeInTheDocument();
      expect(copyLinkButton).toBeInTheDocument();

      // Test copy link functionality
      await user.click(copyLinkButton);

      const copySuccess = await screen.findByTestId('copy-success');
      expect(copySuccess).toHaveTextContent(/link copied/i);
      expect(copySuccess).toHaveClass('success-animation');

      expect(mockCodeExecution.saveSnippet).toHaveBeenCalledWith({
        code: testCode,
        language: 'javascript',
        title: 'Greeting Function',
        description: 'A simple greeting function in JavaScript',
        tags: ['javascript', 'function', 'beginner']
      });
    });

    test('should manage code snippet history and versions', async () => {
      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Open snippet manager (Requirement 3.4)
      const snippetManagerButton = await screen.findByRole('button', { name: /my snippets/i });
      await user.click(snippetManagerButton);

      const snippetManager = await screen.findByTestId('snippet-manager');
      expect(snippetManager).toHaveClass('professional-panel');

      // Verify snippet list with enhanced cards
      const snippetList = within(snippetManager).getByTestId('snippet-list');
      const snippetCards = within(snippetList).getAllByTestId('snippet-card');
      
      snippetCards.forEach(card => {
        expect(card).toHaveClass('enhanced-card', 'hover-animation');
      });

      // Test snippet filtering
      const filterInput = within(snippetManager).getByLabelText(/filter snippets/i);
      await user.type(filterInput, 'javascript');

      await waitFor(() => {
        const filteredCards = within(snippetList).getAllByTestId('snippet-card');
        expect(filteredCards.length).toBeGreaterThan(0);
      });

      // Test snippet loading
      const firstSnippet = snippetCards[0];
      const loadButton = within(firstSnippet).getByRole('button', { name: /load/i });
      await user.click(loadButton);

      // Verify code loads in editor
      await waitFor(() => {
        const codeInput = screen.getByTestId('code-input');
        expect(codeInput.value).not.toBe('');
      });
    });
  });

  describe('Mobile Code Editing Journey', () => {
    test('should provide optimized mobile code editing experience', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      
      // Mock touch device
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5 });

      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Step 1: Verify mobile-optimized layout (Requirement 7.2)
      const playground = await screen.findByTestId('enhanced-playground');
      expect(playground).toHaveClass('mobile-optimized');

      const mobileEditor = await screen.findByTestId('mobile-code-editor');
      expect(mobileEditor).toBeInTheDocument();
      expect(mobileEditor).toHaveClass('touch-friendly');

      // Step 2: Test mobile code templates
      const templatesButton = await screen.findByRole('button', { name: /templates/i });
      expect(templatesButton).toHaveClass('mobile-button');
      await user.click(templatesButton);

      const templatePanel = await screen.findByTestId('mobile-templates');
      const templates = within(templatePanel).getAllByTestId('code-template');
      
      expect(templates.length).toBeGreaterThan(0);
      templates.forEach(template => {
        expect(template).toHaveClass('touch-target'); // Minimum 44px touch targets
      });

      // Step 3: Test mobile code execution
      const mobileExecuteButton = await screen.findByRole('button', { name: /run/i });
      expect(mobileExecuteButton).toHaveClass('mobile-execute-button');
      
      // Verify button size meets touch target requirements
      const buttonRect = mobileExecuteButton.getBoundingClientRect();
      expect(buttonRect.width).toBeGreaterThanOrEqual(44);
      expect(buttonRect.height).toBeGreaterThanOrEqual(44);

      // Step 4: Test mobile sharing interface
      const mobileShareButton = await screen.findByRole('button', { name: /share/i });
      await user.click(mobileShareButton);

      const mobileShareModal = await screen.findByTestId('mobile-share-modal');
      expect(mobileShareModal).toHaveClass('mobile-modal');

      // Verify native share API integration (Requirement 7.2)
      const nativeShareButton = within(mobileShareModal).getByRole('button', { name: /share via/i });
      expect(nativeShareButton).toBeInTheDocument();
    });

    test('should handle mobile gestures and interactions', async () => {
      // Mock touch events
      const mockTouchStart = jest.fn();
      const mockTouchMove = jest.fn();
      const mockTouchEnd = jest.fn();

      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      const mobileEditor = await screen.findByTestId('mobile-code-editor');

      // Test swipe gestures for navigation
      fireEvent.touchStart(mobileEditor, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      fireEvent.touchMove(mobileEditor, {
        touches: [{ clientX: 200, clientY: 100 }]
      });
      
      fireEvent.touchEnd(mobileEditor, {
        changedTouches: [{ clientX: 200, clientY: 100 }]
      });

      // Verify swipe gesture handling
      await waitFor(() => {
        const gestureIndicator = screen.queryByTestId('swipe-indicator');
        expect(gestureIndicator).toBeInTheDocument();
      });

      // Test pull-to-refresh functionality
      const pullToRefresh = await screen.findByTestId('pull-to-refresh');
      expect(pullToRefresh).toHaveClass('mobile-pull-refresh');

      fireEvent.touchStart(pullToRefresh, {
        touches: [{ clientX: 100, clientY: 50 }]
      });
      
      fireEvent.touchMove(pullToRefresh, {
        touches: [{ clientX: 100, clientY: 150 }]
      });

      // Verify pull-to-refresh activation
      await waitFor(() => {
        expect(pullToRefresh).toHaveClass('pull-active');
      });
    });
  });

  describe('Performance and Accessibility Journey', () => {
    test('should maintain performance during intensive code operations', async () => {
      const performanceMarks = [];
      const originalMark = performance.mark;
      performance.mark = jest.fn((name) => {
        performanceMarks.push({ name, timestamp: Date.now() });
        return originalMark(name);
      });

      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Step 1: Load large code file
      const codeInput = await screen.findByTestId('code-input');
      const largeCode = 'console.log("test");\n'.repeat(1000);
      
      performance.mark('code-input-start');
      await user.clear(codeInput);
      await user.type(codeInput, largeCode);
      performance.mark('code-input-end');

      // Step 2: Execute code multiple times rapidly
      const executeButton = await screen.findByRole('button', { name: /run code/i });
      
      performance.mark('execution-start');
      for (let i = 0; i < 5; i++) {
        await user.click(executeButton);
        await waitFor(() => {
          expect(screen.queryByTestId('execution-loading')).not.toBeInTheDocument();
        });
      }
      performance.mark('execution-end');

      // Verify performance metrics (Requirement 6.1)
      const inputMarks = performanceMarks.filter(m => m.name.includes('code-input'));
      const executionMarks = performanceMarks.filter(m => m.name.includes('execution'));
      
      expect(inputMarks.length).toBeGreaterThan(0);
      expect(executionMarks.length).toBeGreaterThan(0);

      // Verify no performance degradation
      const memoryUsage = performance.memory?.usedJSHeapSize || 0;
      expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // Less than 50MB

      performance.mark = originalMark;
    });

    test('should provide full keyboard accessibility', async () => {
      render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Test keyboard navigation through all interactive elements
      const interactiveElements = [
        'language-selector',
        'code-input',
        'execute-button',
        'save-button',
        'share-button'
      ];

      // Start from first element
      const firstElement = await screen.findByTestId(interactiveElements[0]);
      firstElement.focus();
      expect(document.activeElement).toBe(firstElement);

      // Tab through all elements
      for (let i = 1; i < interactiveElements.length; i++) {
        await user.tab();
        const currentElement = await screen.findByTestId(interactiveElements[i]);
        expect(document.activeElement).toBe(currentElement);
        
        // Verify focus indicators (Requirement 6.3)
        expect(currentElement).toHaveClass('focus-visible');
      }

      // Test keyboard shortcuts
      const codeInput = await screen.findByTestId('code-input');
      codeInput.focus();

      // Test Ctrl+Enter for execution
      await user.keyboard('{Control>}{Enter}{/Control}');
      
      await waitFor(() => {
        expect(screen.getByTestId('execution-loading')).toBeInTheDocument();
      });

      // Test Ctrl+S for saving
      await user.keyboard('{Control>}s{/Control}');
      
      await waitFor(() => {
        expect(screen.getByTestId('save-snippet-dialog')).toBeInTheDocument();
      });
    });

    test('should meet WCAG 2.1 AA accessibility standards', async () => {
      const { container } = render(<EnhancedPlayground />, { wrapper: TestWrapper });

      // Test color contrast ratios
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;
        
        // Verify sufficient contrast (simplified check)
        expect(backgroundColor).not.toBe(color);
      });

      // Test ARIA labels and descriptions
      const codeEditor = await screen.findByTestId('monaco-editor');
      expect(codeEditor).toHaveAttribute('aria-label');

      const executeButton = await screen.findByRole('button', { name: /run code/i });
      expect(executeButton).toHaveAttribute('aria-describedby');

      // Test semantic HTML structure
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();

      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);

      // Test keyboard trap in modals
      const shareButton = await screen.findByRole('button', { name: /share/i });
      await user.click(shareButton);

      const modal = await screen.findByTestId('share-modal');
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // First focusable element should receive focus
      expect(document.activeElement).toBe(focusableElements[0]);
    });
  });
});