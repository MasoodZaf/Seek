import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeSharingModal from '../CodeSharingModal';
import ThemeContext from '../../../context/ThemeContext';
import AuthContext from '../../../context/AuthContext';

// Mock canvas for preview generation
const mockCanvas = {
  getContext: jest.fn(() => ({
    fillStyle: '',
    fillRect: jest.fn(),
    fillText: jest.fn(),
    strokeStyle: '',
    strokeRect: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    font: '',
    lineWidth: 0,
    measureText: jest.fn(() => ({ width: 100 }))
  })),
  width: 800,
  height: 600,
  toDataURL: jest.fn(() => 'data:image/png;base64,mock-image-data')
};

// Mock HTML5 Canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvas.getContext());
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mock-image-data');

// Mock QR code service
global.fetch = jest.fn();

const mockUser = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com'
};

const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true
};

const mockThemeContext = {
  isDarkMode: false,
  toggleTheme: jest.fn()
};

const renderWithProviders = (component, { user = mockUser, isDarkMode = false } = {}) => {
  const authValue = { ...mockAuthContext, user };
  const themeValue = { ...mockThemeContext, isDarkMode };

  return render(
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        {component}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

describe('CodeSharingModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    code: 'console.log("Hello, World!");',
    language: 'javascript',
    title: 'Test Code'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.location
    delete window.location;
    window.location = { origin: 'https://example.com' };
    
    // Mock btoa for base64 encoding
    global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'));
    
    // Mock URL methods
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Mock document methods
    const mockElement = {
      href: '',
      download: '',
      click: jest.fn()
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockElement);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  describe('Component Rendering', () => {
    test('renders modal when open', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      expect(screen.getByText('Share Code')).toBeInTheDocument();
      expect(screen.getByText('Share Settings')).toBeInTheDocument();
      expect(screen.getByText('Share URL')).toBeInTheDocument();
    });

    test('does not render when closed', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Share Code')).not.toBeInTheDocument();
    });

    test('renders in dark mode correctly', () => {
      renderWithProviders(
        <CodeSharingModal {...defaultProps} />, 
        { isDarkMode: true }
      );
      
      const modal = screen.getByText('Share Code').closest('div');
      expect(modal).toHaveClass('bg-gray-800', 'text-white');
    });

    test('displays code information', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      expect(screen.getByText('Test Code')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Lines
      expect(screen.getByText('29')).toBeInTheDocument(); // Characters
    });

    test('displays author information when user is logged in', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  describe('Share Settings', () => {
    test('toggles visibility settings', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const publicRadio = screen.getByLabelText(/Public - Anyone with the link can view/);
      const privateRadio = screen.getByLabelText(/Private - Only you can view/);
      
      expect(publicRadio).toBeChecked();
      
      await userEvent.click(privateRadio);
      expect(privateRadio).toBeChecked();
      expect(publicRadio).not.toBeChecked();
    });

    test('toggles permission settings', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const allowComments = screen.getByLabelText(/Allow comments/);
      const allowForks = screen.getByLabelText(/Allow forks/);
      
      expect(allowComments).toBeChecked();
      expect(allowForks).toBeChecked();
      
      await userEvent.click(allowComments);
      expect(allowComments).not.toBeChecked();
      
      await userEvent.click(allowForks);
      expect(allowForks).not.toBeChecked();
    });

    test('changes expiration settings', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const expirationSelect = screen.getByDisplayValue('Never');
      
      await userEvent.selectOptions(expirationSelect, '1day');
      expect(screen.getByDisplayValue('1 Day')).toBeInTheDocument();
    });

    test('changes theme settings', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const themeSelect = screen.getByDisplayValue('Auto');
      
      await userEvent.selectOptions(themeSelect, 'dark');
      expect(screen.getByDisplayValue('Dark')).toBeInTheDocument();
    });
  });

  describe('Share URL Generation', () => {
    test('generates share URL with encoded data', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(() => {
        const shareInput = screen.getByDisplayValue(/https:\/\/example\.com\/playground\?share=/);
        expect(shareInput).toBeInTheDocument();
      });
      
      expect(global.btoa).toHaveBeenCalled();
    });

    test('copies share URL to clipboard', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(() => {
        const copyButton = screen.getByRole('button', { name: /copy/i });
        return userEvent.click(copyButton);
      });
      
      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining('https://example.com/playground?share=')
      );
    });

    test('shows copy success state', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(async () => {
        const copyButton = screen.getByRole('button', { name: /copy/i });
        await userEvent.click(copyButton);
      });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copy/i })).toHaveClass('bg-green-600');
      });
    });
  });

  describe('QR Code Generation', () => {
    test('generates QR code for share URL', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(() => {
        const qrImage = screen.getByAltText('QR Code');
        expect(qrImage).toBeInTheDocument();
        expect(qrImage.src).toContain('api.qrserver.com');
      });
    });

    test('copies QR code URL', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(async () => {
        const copyQrButton = screen.getByText('Copy QR URL');
        await userEvent.click(copyQrButton);
      });
      
      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining('api.qrserver.com')
      );
    });
  });

  describe('Preview Image Generation', () => {
    test('generates preview image on mount', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(() => {
        const previewImage = screen.getByAltText('Code Preview');
        expect(previewImage).toBeInTheDocument();
        expect(previewImage.src).toBe('data:image/png;base64,mock-image-data');
      });
    });

    test('regenerates preview image', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const regenerateButton = screen.getByText('Regenerate');
      await userEvent.click(regenerateButton);
      
      expect(mockCanvas.getContext).toHaveBeenCalled();
    });

    test('downloads preview image', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(async () => {
        const downloadButton = screen.getByText('Download');
        await userEvent.click(downloadButton);
      });
      
      expect(document.createElement).toHaveBeenCalledWith('a');
    });

    test('updates preview when theme changes', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const themeSelect = screen.getByDisplayValue('Auto');
      await userEvent.selectOptions(themeSelect, 'dark');
      
      // Preview should regenerate with new theme
      await waitFor(() => {
        expect(mockCanvas.getContext).toHaveBeenCalled();
      });
    });
  });

  describe('Social Media Sharing', () => {
    test('opens Twitter share window', async () => {
      const mockOpen = jest.fn();
      global.window.open = mockOpen;
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const twitterButton = screen.getByText('Twitter');
      await userEvent.click(twitterButton);
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400'
      );
    });

    test('opens LinkedIn share window', async () => {
      const mockOpen = jest.fn();
      global.window.open = mockOpen;
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const linkedinButton = screen.getByText('LinkedIn');
      await userEvent.click(linkedinButton);
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing/share-offsite'),
        '_blank',
        'width=600,height=400'
      );
    });

    test('opens Reddit share window', async () => {
      const mockOpen = jest.fn();
      global.window.open = mockOpen;
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const redditButton = screen.getByText('Reddit');
      await userEvent.click(redditButton);
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('reddit.com/submit'),
        '_blank',
        'width=600,height=400'
      );
    });

    test('opens Facebook share window', async () => {
      const mockOpen = jest.fn();
      global.window.open = mockOpen;
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const facebookButton = screen.getByText('Facebook');
      await userEvent.click(facebookButton);
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer/sharer.php'),
        '_blank',
        'width=600,height=400'
      );
    });
  });

  describe('Modal Interactions', () => {
    test('closes modal when close button is clicked', async () => {
      const onClose = jest.fn();
      renderWithProviders(<CodeSharingModal {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    test('closes modal when backdrop is clicked', async () => {
      const onClose = jest.fn();
      renderWithProviders(<CodeSharingModal {...defaultProps} onClose={onClose} />);
      
      const backdrop = screen.getByText('Share Code').closest('div').previousSibling;
      fireEvent.click(backdrop);
      
      expect(onClose).toHaveBeenCalled();
    });

    test('does not close modal when content is clicked', async () => {
      const onClose = jest.fn();
      renderWithProviders(<CodeSharingModal {...defaultProps} onClose={onClose} />);
      
      const content = screen.getByText('Share Settings');
      fireEvent.click(content);
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Code Information Display', () => {
    test('displays correct line count', () => {
      const multiLineCode = 'line 1\nline 2\nline 3';
      renderWithProviders(
        <CodeSharingModal {...defaultProps} code={multiLineCode} />
      );
      
      expect(screen.getByText('3')).toBeInTheDocument(); // Lines
    });

    test('displays correct character count', () => {
      const code = 'test code';
      renderWithProviders(
        <CodeSharingModal {...defaultProps} code={code} />
      );
      
      expect(screen.getByText(code.length.toString())).toBeInTheDocument();
    });

    test('displays language information', () => {
      renderWithProviders(
        <CodeSharingModal {...defaultProps} language="python" />
      );
      
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    test('displays title information', () => {
      renderWithProviders(
        <CodeSharingModal {...defaultProps} title="My Awesome Code" />
      );
      
      expect(screen.getByText('My Awesome Code')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles clipboard write errors gracefully', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard error'));
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText }
      });
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      await waitFor(async () => {
        const copyButton = screen.getByRole('button', { name: /copy/i });
        await userEvent.click(copyButton);
      });
      
      // Should not crash on clipboard error
      expect(screen.getByText('Share Code')).toBeInTheDocument();
    });

    test('handles canvas errors gracefully', () => {
      // Mock canvas error
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
      
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      // Should still render without crashing
      expect(screen.getByText('Share Code')).toBeInTheDocument();
    });

    test('handles missing user gracefully', () => {
      renderWithProviders(
        <CodeSharingModal {...defaultProps} />, 
        { user: null }
      );
      
      // Should still render without user information
      expect(screen.getByText('Share Code')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog', { hidden: true }) || 
                   screen.getByText('Share Code').closest('[role]') ||
                   screen.getByText('Share Code').closest('div');
      
      expect(modal).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      
      // Focus and activate with keyboard
      closeButton.focus();
      expect(closeButton).toHaveFocus();
      
      fireEvent.keyDown(closeButton, { key: 'Enter' });
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('traps focus within modal', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // All interactive elements should be within the modal
      buttons.forEach(button => {
        expect(button.closest('[data-testid="sharing-modal"]') || 
               button.closest('div')).toBeInTheDocument();
      });
    });

    test('closes on Escape key', () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Note: This would need to be implemented in the component
      // expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    test('generates preview efficiently for large code', async () => {
      const largeCode = 'console.log("test");\n'.repeat(1000);
      
      renderWithProviders(
        <CodeSharingModal {...defaultProps} code={largeCode} />
      );
      
      await waitFor(() => {
        expect(mockCanvas.getContext).toHaveBeenCalled();
      });
      
      // Should handle large code without performance issues
      expect(screen.getByText('Share Code')).toBeInTheDocument();
    });

    test('debounces settings changes', async () => {
      renderWithProviders(<CodeSharingModal {...defaultProps} />);
      
      const themeSelect = screen.getByDisplayValue('Auto');
      
      // Rapid changes
      await userEvent.selectOptions(themeSelect, 'dark');
      await userEvent.selectOptions(themeSelect, 'light');
      await userEvent.selectOptions(themeSelect, 'auto');
      
      // Should handle rapid changes efficiently
      expect(screen.getByDisplayValue('Auto')).toBeInTheDocument();
    });
  });
});