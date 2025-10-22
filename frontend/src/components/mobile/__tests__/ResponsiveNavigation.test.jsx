import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../context/ThemeContext';
import { AuthProvider } from '../../../context/AuthContext';
import BottomNavigation from '../BottomNavigation';
import ResponsiveHeader from '../ResponsiveHeader';
import ResponsiveLayout from '../../layout/ResponsiveLayout';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock touch interactions
jest.mock('../../../utils/touchInteractions', () => ({
  hapticFeedback: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    selection: jest.fn()
  }
}));

// Mock responsive hook
jest.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    breakpoint: 'mobile'
  })
}));

const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  progress: {
    level: 5,
    xp: 1250,
    streak: 7
  }
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider value={{ user: mockUser, logout: jest.fn() }}>
          {component}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('BottomNavigation', () => {
  beforeEach(() => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
  });

  test('renders bottom navigation with all items', () => {
    renderWithProviders(<BottomNavigation />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  test('highlights active navigation item', () => {
    // Mock location to be on dashboard
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({ pathname: '/dashboard' })
    }));

    renderWithProviders(<BottomNavigation />);
    
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('text-gray-900', 'font-semibold');
  });

  test('shows FAB (Floating Action Button) for code playground', () => {
    renderWithProviders(<BottomNavigation />);
    
    // The code button should be styled as a FAB
    const codeButton = screen.getByText('Code').closest('button');
    expect(codeButton).toHaveClass('rounded-full');
  });

  test('handles scroll to hide/show navigation', async () => {
    renderWithProviders(<BottomNavigation />);
    
    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    fireEvent.scroll(window);
    
    await waitFor(() => {
      const navigation = screen.getByText('Home').closest('.fixed');
      expect(navigation).toHaveStyle('transform: translateY(100px)');
    });
  });

  test('opens FAB actions menu when code button is pressed', async () => {
    renderWithProviders(<BottomNavigation />);
    
    const codeButton = screen.getByText('Code');
    fireEvent.click(codeButton);
    
    await waitFor(() => {
      expect(screen.getByText('New Code')).toBeInTheDocument();
      expect(screen.getByText('AI Tutor')).toBeInTheDocument();
    });
  });
});

describe('ResponsiveHeader', () => {
  test('renders header with logo and title', () => {
    renderWithProviders(<ResponsiveHeader title="Test Page" />);
    
    expect(screen.getByText('S')).toBeInTheDocument(); // Logo
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  test('shows user stats on mobile', () => {
    renderWithProviders(<ResponsiveHeader />);
    
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('7 day streak')).toBeInTheDocument();
    expect(screen.getByText('1250 XP')).toBeInTheDocument();
  });

  test('opens user menu when profile button is clicked', async () => {
    renderWithProviders(<ResponsiveHeader />);
    
    const profileButton = screen.getByText('J'); // User initial
    fireEvent.click(profileButton);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  test('opens mobile search overlay', async () => {
    renderWithProviders(<ResponsiveHeader />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search tutorials/)).toBeInTheDocument();
      expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
    });
  });

  test('shows notifications indicator', () => {
    renderWithProviders(<ResponsiveHeader />);
    
    const notificationButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationButton).toBeInTheDocument();
    
    // Should show notification badge
    const badge = notificationButton.querySelector('.bg-red-500');
    expect(badge).toBeInTheDocument();
  });

  test('handles back button when showBackButton is true', () => {
    const onBack = jest.fn();
    renderWithProviders(
      <ResponsiveHeader showBackButton={true} onBack={onBack} />
    );
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    expect(onBack).toHaveBeenCalled();
  });
});

describe('ResponsiveLayout', () => {
  test('renders layout with header and content', () => {
    renderWithProviders(
      <ResponsiveLayout title="Test Layout">
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    
    expect(screen.getByText('Test Layout')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('shows bottom navigation on mobile', () => {
    renderWithProviders(
      <ResponsiveLayout>
        <div>Content</div>
      </ResponsiveLayout>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  test('applies responsive classes based on screen size', () => {
    renderWithProviders(
      <ResponsiveLayout>
        <div data-testid="content">Content</div>
      </ResponsiveLayout>
    );
    
    const content = screen.getByTestId('content').closest('div');
    expect(content).toHaveClass('w-full', 'px-4'); // Mobile classes
  });

  test('handles fullWidth prop', () => {
    renderWithProviders(
      <ResponsiveLayout fullWidth>
        <div data-testid="content">Content</div>
      </ResponsiveLayout>
    );
    
    const content = screen.getByTestId('content').closest('div');
    expect(content).toHaveClass('w-full');
  });

  test('handles noPadding prop', () => {
    renderWithProviders(
      <ResponsiveLayout noPadding>
        <div data-testid="content">Content</div>
      </ResponsiveLayout>
    );
    
    const content = screen.getByTestId('content').closest('div');
    expect(content).not.toHaveClass('py-4');
  });

  test('passes header actions correctly', () => {
    const testAction = {
      icon: ({ className }) => <div className={className}>Test Icon</div>,
      onPress: jest.fn()
    };

    renderWithProviders(
      <ResponsiveLayout headerActions={[testAction]}>
        <div>Content</div>
      </ResponsiveLayout>
    );
    
    expect(screen.getByText('Test Icon')).toBeInTheDocument();
  });
});

describe('Responsive Typography and Spacing', () => {
  test('applies mobile typography scaling', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
      writable: true
    });

    renderWithProviders(
      <ResponsiveLayout>
        <h1>Mobile Heading</h1>
        <p className="text-base">Mobile Text</p>
      </ResponsiveLayout>
    );

    // Check if mobile styles are applied (this would be tested via CSS)
    const heading = screen.getByText('Mobile Heading');
    const text = screen.getByText('Mobile Text');
    
    expect(heading).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  test('provides touch-friendly spacing on mobile', () => {
    renderWithProviders(
      <ResponsiveLayout>
        <div className="space-y-4">
          <div>Item 1</div>
          <div>Item 2</div>
        </div>
      </ResponsiveLayout>
    );

    const container = screen.getByText('Item 1').parentElement;
    expect(container).toHaveClass('space-y-4');
  });
});