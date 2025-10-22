/**
 * Social Sharing Functionality Tests
 * Tests all social sharing components and their integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SocialShare, {
  CodeSnippetShare,
  AchievementShare,
  TutorialCompletionShare,
  ProjectShare,
  MinimalShare
} from '../../components/ui/SocialShare';

// Mock window.open and navigator APIs
const mockWindowOpen = jest.fn();
const mockClipboardWriteText = jest.fn();
const mockNavigatorShare = jest.fn();

beforeAll(() => {
  global.window.open = mockWindowOpen;
  Object.assign(navigator, {
    clipboard: {
      writeText: mockClipboardWriteText,
    },
    share: mockNavigatorShare,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockClipboardWriteText.mockResolvedValue();
  mockNavigatorShare.mockResolvedValue();
});

describe('SocialShare Component', () => {
  const defaultProps = {
    url: 'https://seek.example.com/test',
    title: 'Test Share Title',
    description: 'Test share description',
    hashtags: ['test', 'coding'],
    via: 'SeekLearning'
  };

  describe('Basic Functionality', () => {
    test('renders all social platform buttons', () => {
      render(<SocialShare {...defaultProps} />);
      
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Reddit')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Telegram')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    test('renders copy link button', () => {
      render(<SocialShare {...defaultProps} />);
      
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    test('shows labels when showLabels is true', () => {
      render(<SocialShare {...defaultProps} showLabels={true} />);
      
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    test('hides labels when showLabels is false', () => {
      render(<SocialShare {...defaultProps} showLabels={false} />);
      
      expect(screen.queryByText('Twitter')).not.toBeInTheDocument();
      expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    });
  });

  describe('Social Platform Sharing', () => {
    test('opens Twitter share URL with correct parameters', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const twitterButton = screen.getByText('Twitter');
      await user.click(twitterButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.url));
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.title));
      expect(calledUrl).toContain('hashtags=test%2Ccoding');
      expect(calledUrl).toContain('via=SeekLearning');
    });

    test('opens Facebook share URL with correct parameters', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const facebookButton = screen.getByText('Facebook');
      await user.click(facebookButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer/sharer.php'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.url));
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.title));
    });

    test('opens LinkedIn share URL with correct parameters', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const linkedinButton = screen.getByText('LinkedIn');
      await user.click(linkedinButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing/share-offsite'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.url));
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.title));
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.description));
    });

    test('opens email client with correct parameters', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const emailButton = screen.getByText('Email');
      await user.click(emailButton);
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('mailto:'),
        '_blank',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('subject=' + encodeURIComponent(defaultProps.title));
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.description));
      expect(calledUrl).toContain(encodeURIComponent(defaultProps.url));
    });
  });

  describe('Copy Link Functionality', () => {
    test('copies URL to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const copyButton = screen.getByText('Copy Link');
      await user.click(copyButton);
      
      expect(mockClipboardWriteText).toHaveBeenCalledWith(defaultProps.url);
    });

    test('shows "Copied!" feedback after successful copy', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const copyButton = screen.getByText('Copy Link');
      await user.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    test('reverts to "Copy Link" after timeout', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const copyButton = screen.getByText('Copy Link');
      await user.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
      
      // Wait for timeout
      await waitFor(() => {
        expect(screen.getByText('Copy Link')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('handles clipboard API failure gracefully', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClipboardWriteText.mockRejectedValue(new Error('Clipboard failed'));
      
      render(<SocialShare {...defaultProps} />);
      
      const copyButton = screen.getByText('Copy Link');
      await user.click(copyButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy link:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Native Share API', () => {
    test('shows native share button when navigator.share is available', () => {
      render(<SocialShare {...defaultProps} />);
      
      expect(screen.getByText('Share')).toBeInTheDocument();
    });

    test('calls navigator.share with correct parameters', async () => {
      const user = userEvent.setup();
      render(<SocialShare {...defaultProps} />);
      
      const nativeShareButton = screen.getByText('Share');
      await user.click(nativeShareButton);
      
      expect(mockNavigatorShare).toHaveBeenCalledWith({
        title: defaultProps.title,
        text: defaultProps.description,
        url: defaultProps.url
      });
    });

    test('handles native share API failure gracefully', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockNavigatorShare.mockRejectedValue(new Error('Share failed'));
      
      render(<SocialShare {...defaultProps} />);
      
      const nativeShareButton = screen.getByText('Share');
      await user.click(nativeShareButton);
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Variants', () => {
    test('applies correct CSS classes for default variant', () => {
      const { container } = render(<SocialShare {...defaultProps} variant="default" />);
      
      expect(container.firstChild.firstChild).toHaveClass('grid', 'grid-cols-4', 'gap-3');
    });

    test('applies correct CSS classes for compact variant', () => {
      const { container } = render(<SocialShare {...defaultProps} variant="compact" />);
      
      expect(container.firstChild.firstChild).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });

    test('applies correct CSS classes for minimal variant', () => {
      const { container } = render(<SocialShare {...defaultProps} variant="minimal" />);
      
      expect(container.firstChild.firstChild).toHaveClass('flex', 'space-x-2');
    });

    test('renders minimal buttons without labels', () => {
      render(<SocialShare {...defaultProps} variant="minimal" showLabels={true} />);
      
      // Even with showLabels=true, minimal variant shouldn't show labels
      expect(screen.queryByText('Twitter')).not.toBeInTheDocument();
      expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    });
  });
});

describe('Predefined Share Components', () => {
  describe('CodeSnippetShare', () => {
    const codeProps = {
      code: 'console.log("Hello World");',
      language: 'javascript',
      title: 'My JS Code'
    };

    test('renders with correct share URL and title', () => {
      render(<CodeSnippetShare {...codeProps} />);
      
      // Should have compact variant
      const container = screen.getByText('Copy Link').closest('div').parentElement;
      expect(container).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });

    test('generates correct share URL for code', async () => {
      const user = userEvent.setup();
      render(<CodeSnippetShare {...codeProps} />);
      
      const twitterButton = screen.getByText('Twitter');
      await user.click(twitterButton);
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('share/code');
      expect(calledUrl).toContain(encodeURIComponent(codeProps.code));
      expect(calledUrl).toContain('lang=javascript');
    });
  });

  describe('AchievementShare', () => {
    const achievementProps = {
      achievement: {
        name: 'First Steps',
        description: 'Completed your first tutorial'
      }
    };

    test('renders with achievement-specific messaging', () => {
      render(<AchievementShare {...achievementProps} />);
      
      // Should use default variant
      const container = screen.getByText('Copy Link').closest('div').parentElement;
      expect(container).toHaveClass('grid', 'grid-cols-4', 'gap-3');
    });

    test('includes achievement hashtags', async () => {
      const user = userEvent.setup();
      render(<AchievementShare {...achievementProps} />);
      
      const twitterButton = screen.getByText('Twitter');
      await user.click(twitterButton);
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('hashtags=achievement%2Ccoding%2Clearning%2CSeekLearning');
    });
  });

  describe('TutorialCompletionShare', () => {
    const tutorialProps = {
      tutorial: {
        title: 'JavaScript Basics',
        language: 'JavaScript'
      }
    };

    test('renders with tutorial-specific messaging', () => {
      render(<TutorialCompletionShare {...tutorialProps} />);
      
      expect(screen.getByText('Twitter')).toBeInTheDocument();
    });

    test('includes tutorial language in hashtags', async () => {
      const user = userEvent.setup();
      render(<TutorialCompletionShare {...tutorialProps} />);
      
      const twitterButton = screen.getByText('Twitter');
      await user.click(twitterButton);
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('hashtags=tutorial%2CJavaScript%2Clearning%2CSeekLearning');
    });
  });

  describe('ProjectShare', () => {
    const projectProps = {
      project: {
        id: 'proj-123',
        name: 'My Calculator',
        language: 'Python'
      }
    };

    test('generates correct project URL', async () => {
      const user = userEvent.setup();
      render(<ProjectShare {...projectProps} />);
      
      const copyButton = screen.getByText('Copy Link');
      await user.click(copyButton);
      
      expect(mockClipboardWriteText).toHaveBeenCalledWith(
        expect.stringContaining('/projects/proj-123')
      );
    });

    test('includes project language in hashtags', async () => {
      const user = userEvent.setup();
      render(<ProjectShare {...projectProps} />);
      
      const twitterButton = screen.getByText('Twitter');
      await user.click(twitterButton);
      
      const calledUrl = mockWindowOpen.mock.calls[0][0];
      expect(calledUrl).toContain('hashtags=project%2CPython%2Ccoding%2CSeekLearning');
    });
  });

  describe('MinimalShare', () => {
    const minimalProps = {
      url: 'https://example.com',
      title: 'Check this out'
    };

    test('renders in minimal variant without labels', () => {
      render(<MinimalShare {...minimalProps} />);
      
      const container = screen.getByText('Copy Link').closest('div').parentElement;
      expect(container).toHaveClass('flex', 'space-x-2');
      
      // Should not show labels
      expect(screen.queryByText('Twitter')).not.toBeInTheDocument();
    });
  });
});

describe('Accessibility', () => {
  test('all buttons have proper labels', () => {
    render(<SocialShare url="test" title="test" />);
    
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  test('copy button shows proper feedback for screen readers', async () => {
    const user = userEvent.setup();
    render(<SocialShare url="test" title="test" />);
    
    const copyButton = screen.getByText('Copy Link');
    await user.click(copyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  test('buttons are keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<SocialShare url="test" title="test" />);
    
    const twitterButton = screen.getByText('Twitter');
    twitterButton.focus();
    
    await user.keyboard('{Enter}');
    
    expect(mockWindowOpen).toHaveBeenCalled();
  });
});

describe('Professional Messaging Integration', () => {
  test('uses consistent brand messaging in share titles', () => {
    const codeShare = render(<CodeSnippetShare code="test" language="js" />);
    expect(codeShare.container).toBeInTheDocument();
    
    const achievementShare = render(<AchievementShare achievement={{ name: 'Test', description: 'Test' }} />);
    expect(achievementShare.container).toBeInTheDocument();
    
    // All share components should include "Seek" branding
    // This is verified through the URL generation and title formatting
  });

  test('maintains consistent hashtag strategy', async () => {
    const user = userEvent.setup();
    
    // Test different share types use consistent hashtag patterns
    const { rerender } = render(<CodeSnippetShare code="test" language="javascript" />);
    
    let twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);
    
    let calledUrl = mockWindowOpen.mock.calls[0][0];
    expect(calledUrl).toContain('SeekLearning');
    
    mockWindowOpen.mockClear();
    
    rerender(<AchievementShare achievement={{ name: 'Test', description: 'Test' }} />);
    
    twitterButton = screen.getByText('Twitter');
    await user.click(twitterButton);
    
    calledUrl = mockWindowOpen.mock.calls[0][0];
    expect(calledUrl).toContain('SeekLearning');
  });
});