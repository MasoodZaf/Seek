import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';
import { UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      input: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('input', { ref, ...props }, children)
      )),
      label: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('label', { ref, ...props }, children)
      )),
      div: ({ children, ...props }) => React.createElement('div', props, children),
    },
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, {}, children),
  };
});

describe('Input Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('input', 'input-default');
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Input Types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'];
    
    types.forEach(type => {
      it(`renders ${type} input type correctly`, () => {
        render(<Input type={type} />);
        const input = screen.getByRole(type === 'password' ? 'textbox' : type === 'email' ? 'textbox' : 'textbox');
        expect(input).toHaveAttribute('type', type);
      });
    });
  });

  describe('Labels', () => {
    it('renders traditional label', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('renders floating label', () => {
      render(<Input label="Email" floatingLabel />);
      const label = screen.getByText('Email');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('absolute');
    });

    it('shows required indicator', () => {
      render(<Input label="Required Field" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-error-500');
    });

    it('floating label animates on focus', async () => {
      render(<Input label="Floating Label" floatingLabel />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Floating Label');
      
      await user.click(input);
      expect(label).toHaveClass('text-primary-600');
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Input size={size} />);
        const input = screen.getByRole('textbox');
        const sizeClass = size === 'sm' ? 'px-3 py-2 text-sm' : size === 'md' ? 'px-4 py-3 text-sm' : 'px-4 py-4 text-base';
        expect(input).toHaveClass('px-3', 'py-2');
      });
    });
  });

  describe('Variants and States', () => {
    it('renders error state correctly', () => {
      render(<Input error="This field is required" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input-error');
      
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-error-600');
    });

    it('renders success state correctly', () => {
      render(<Input success="Valid input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input-success');
      
      const successMessage = screen.getByText('Valid input');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveClass('text-success-600');
    });

    it('renders helper text', () => {
      render(<Input helperText="This is helper text" />);
      const helperText = screen.getByText('This is helper text');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-secondary-600');
    });

    it('renders loading state', () => {
      render(<Input loading />);
      const input = screen.getByRole('textbox');
      const spinner = input.parentElement.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      render(<Input leftIcon={UserIcon} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10');
      
      const icon = input.parentElement.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(<Input rightIcon={UserIcon} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
      
      const icon = input.parentElement.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders status icons for error state', () => {
      render(<Input error="Error message" />);
      const errorIcon = screen.getByRole('textbox').parentElement.querySelector('.text-error-500');
      expect(errorIcon).toBeInTheDocument();
    });

    it('renders status icons for success state', () => {
      render(<Input success="Success message" />);
      const successIcon = screen.getByRole('textbox').parentElement.querySelector('.text-success-500');
      expect(successIcon).toBeInTheDocument();
    });
  });

  describe('Password Toggle', () => {
    it('renders password toggle button', () => {
      render(<Input type="password" showPasswordToggle />);
      const toggleButton = screen.getByRole('button');
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
      render(<Input type="password" showPasswordToggle />);
      const input = screen.getByRole('textbox');
      const toggleButton = screen.getByRole('button');
      
      expect(input).toHaveAttribute('type', 'password');
      
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('shows correct eye icons', async () => {
      render(<Input type="password" showPasswordToggle />);
      const toggleButton = screen.getByRole('button');
      
      // Initially should show EyeIcon (password hidden)
      let eyeIcon = toggleButton.querySelector('svg');
      expect(eyeIcon).toBeInTheDocument();
      
      await user.click(toggleButton);
      
      // After click should show EyeSlashIcon (password visible)
      eyeIcon = toggleButton.querySelector('svg');
      expect(eyeIcon).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles focus and blur events', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles change events', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
    });

    it('updates floating label state on value change', async () => {
      render(<Input label="Test Label" floatingLabel />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test Label');
      
      await user.type(input, 'test value');
      
      // Label should remain in focused/filled state
      expect(label).toHaveClass('text-primary-600');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<Input label="Accessible Input" />);
      const input = screen.getByLabelText('Accessible Input');
      expect(input).toBeInTheDocument();
    });

    it('supports ARIA attributes', () => {
      render(
        <Input 
          aria-describedby="help-text" 
          aria-invalid="true"
          aria-required="true"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('password toggle button has proper accessibility', () => {
      render(<Input type="password" showPasswordToggle />);
      const toggleButton = screen.getByRole('button');
      expect(toggleButton).toHaveAttribute('tabIndex', '-1');
    });

    it('provides proper focus indicators', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await user.tab();
      expect(input).toHaveFocus();
    });
  });

  describe('Validation States', () => {
    it('shows error state with proper styling', () => {
      render(<Input error="Invalid input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input-error');
      
      const errorText = screen.getByText('Invalid input');
      expect(errorText).toHaveClass('text-error-600');
    });

    it('shows success state with proper styling', () => {
      render(<Input success="Valid input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input-success');
      
      const successText = screen.getByText('Valid input');
      expect(successText).toHaveClass('text-success-600');
    });

    it('error state takes precedence over success', () => {
      render(<Input error="Error message" success="Success message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input-error');
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  describe('Animation Props', () => {
    it('renders without animation when animate is false', () => {
      render(<Input animate={false} />);
      const input = screen.getByRole('textbox');
      expect(input.tagName).toBe('INPUT');
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Responsive Behavior', () => {
    it('handles different screen sizes appropriately', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-4', 'text-base');
    });

    it('maintains proper spacing with icons', () => {
      render(<Input leftIcon={UserIcon} rightIcon={UserIcon} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10', 'pr-10');
    });
  });

  describe('Edge Cases', () => {
    it('handles controlled input correctly', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      
      render(<TestComponent />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'controlled');
      expect(input).toHaveValue('controlled');
    });

    it('handles uncontrolled input correctly', async () => {
      render(<Input defaultValue="default" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('default');
      
      await user.clear(input);
      await user.type(input, 'new value');
      expect(input).toHaveValue('new value');
    });
  });
});