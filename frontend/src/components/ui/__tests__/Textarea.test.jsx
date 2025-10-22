import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from '../Textarea';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      textarea: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('textarea', { ref, ...props }, children)
      )),
      label: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('label', { ref, ...props }, children)
      )),
      div: ({ children, ...props }) => React.createElement('div', props, children),
    },
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, {}, children),
  };
});

describe('Textarea Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveClass('input', 'input-default');
    });

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter your message" />);
      const textarea = screen.getByPlaceholderText('Enter your message');
      expect(textarea).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Textarea className="custom-class" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });

    it('sets default rows', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('sets custom rows', () => {
      render(<Textarea rows={6} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '6');
    });
  });

  describe('Labels', () => {
    it('renders traditional label', () => {
      render(<Textarea label="Message" />);
      const label = screen.getByText('Message');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('renders floating label', () => {
      render(<Textarea label="Description" floatingLabel />);
      const label = screen.getByText('Description');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('absolute');
    });

    it('shows required indicator', () => {
      render(<Textarea label="Required Field" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-error-500');
    });

    it('floating label animates on focus', async () => {
      render(<Textarea label="Floating Label" floatingLabel />);
      const textarea = screen.getByRole('textbox');
      const label = screen.getByText('Floating Label');
      
      await user.click(textarea);
      expect(label).toHaveClass('text-primary-600');
    });

    it('associates label with textarea', () => {
      render(<Textarea label="Accessible Textarea" />);
      const textarea = screen.getByLabelText('Accessible Textarea');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Textarea size={size} />);
        const textarea = screen.getByRole('textbox');
        const sizeClass = size === 'sm' ? 'px-3 py-2 text-sm' : size === 'md' ? 'px-4 py-3 text-sm' : 'px-4 py-4 text-base';
        expect(textarea).toHaveClass('px-3', 'py-2');
      });
    });
  });

  describe('Resize Options', () => {
    const resizeOptions = ['none', 'vertical', 'horizontal', 'both'];
    
    resizeOptions.forEach(resize => {
      it(`renders ${resize} resize correctly`, () => {
        render(<Textarea resize={resize} />);
        const textarea = screen.getByRole('textbox');
        const resizeClass = resize === 'none' ? 'resize-none' : resize === 'vertical' ? 'resize-y' : resize === 'horizontal' ? 'resize-x' : 'resize';
        expect(textarea).toHaveClass(resizeClass);
      });
    });
  });

  describe('Variants and States', () => {
    it('renders error state correctly', () => {
      render(<Textarea error="This field is required" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('input-error');
      
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-error-600');
    });

    it('renders success state correctly', () => {
      render(<Textarea success="Valid input" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('input-success');
      
      const successMessage = screen.getByText('Valid input');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveClass('text-success-600');
    });

    it('renders helper text', () => {
      render(<Textarea helperText="Enter a detailed description" />);
      const helperText = screen.getByText('Enter a detailed description');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-secondary-600');
    });

    it('error state takes precedence over success', () => {
      render(<Textarea error="Error message" success="Success message" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('input-error');
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  describe('Status Icons', () => {
    it('renders status icons for error state', () => {
      render(<Textarea error="Error message" />);
      const errorIcon = screen.getByRole('textbox').parentElement.querySelector('.text-error-500');
      expect(errorIcon).toBeInTheDocument();
    });

    it('renders status icons for success state', () => {
      render(<Textarea success="Success message" />);
      const successIcon = screen.getByRole('textbox').parentElement.querySelector('.text-success-500');
      expect(successIcon).toBeInTheDocument();
    });

    it('positions status icon correctly', () => {
      render(<Textarea error="Error message" />);
      const iconContainer = screen.getByRole('textbox').parentElement.querySelector('.absolute.top-3.right-3');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles focus and blur events', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />);
      const textarea = screen.getByRole('textbox');
      
      await user.click(textarea);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles change events', async () => {
      const handleChange = jest.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');
      
      await user.type(textarea, 'test message');
      expect(handleChange).toHaveBeenCalledTimes(12); // Once for each character
    });

    it('updates floating label state on value change', async () => {
      render(<Textarea label="Test Label" floatingLabel />);
      const textarea = screen.getByRole('textbox');
      const label = screen.getByText('Test Label');
      
      await user.type(textarea, 'test value');
      
      // Label should remain in focused/filled state
      expect(label).toHaveClass('text-primary-600');
    });

    it('handles multiline text input', async () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      
      const multilineText = 'Line 1\nLine 2\nLine 3';
      await user.type(textarea, multilineText);
      expect(textarea).toHaveValue(multilineText);
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(<Textarea label="Accessible Textarea" />);
      const textarea = screen.getByRole('textbox', { multiline: true });
      expect(textarea).toBeInTheDocument();
    });

    it('supports ARIA attributes', () => {
      render(
        <Textarea 
          aria-describedby="help-text" 
          aria-invalid="true"
          aria-required="true"
        />
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });

    it('provides proper focus indicators', async () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      
      await user.tab();
      expect(textarea).toHaveFocus();
    });

    it('associates error messages with textarea', () => {
      render(<Textarea error="Please enter a message" />);
      const textarea = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Please enter a message');
      
      expect(textarea).toHaveClass('input-error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Validation States', () => {
    it('shows error state with proper styling', () => {
      render(<Textarea error="Invalid input" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('input-error');
      
      const errorText = screen.getByText('Invalid input');
      expect(errorText).toHaveClass('text-error-600');
    });

    it('shows success state with proper styling', () => {
      render(<Textarea success="Valid input" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('input-success');
      
      const successText = screen.getByText('Valid input');
      expect(successText).toHaveClass('text-success-600');
    });
  });

  describe('Floating Label Behavior', () => {
    it('positions floating label correctly when empty', () => {
      render(<Textarea label="Floating Label" floatingLabel />);
      const label = screen.getByText('Floating Label');
      expect(label).toHaveClass('top-4', 'text-sm');
    });

    it('positions floating label correctly when focused or filled', async () => {
      render(<Textarea label="Floating Label" floatingLabel />);
      const textarea = screen.getByRole('textbox');
      const label = screen.getByText('Floating Label');
      
      await user.click(textarea);
      expect(label).toHaveClass('top-2', 'text-xs');
    });

    it('adjusts padding for floating label', () => {
      render(<Textarea label="Floating Label" floatingLabel />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('pt-4', 'pb-4');
    });
  });

  describe('Animation Props', () => {
    it('renders without animation when animate is false', () => {
      render(<Textarea animate={false} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Responsive Behavior', () => {
    it('handles different screen sizes appropriately', () => {
      render(<Textarea size="lg" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('px-4', 'py-4', 'text-base');
    });

    it('maintains proper resize behavior', () => {
      render(<Textarea resize="vertical" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('resize-y');
    });
  });

  describe('Edge Cases', () => {
    it('handles controlled textarea correctly', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Textarea value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      
      render(<TestComponent />);
      const textarea = screen.getByRole('textbox');
      
      await user.type(textarea, 'controlled text');
      expect(textarea).toHaveValue('controlled text');
    });

    it('handles uncontrolled textarea correctly', async () => {
      render(<Textarea defaultValue="default text" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('default text');
      
      await user.clear(textarea);
      await user.type(textarea, 'new text');
      expect(textarea).toHaveValue('new text');
    });

    it('handles very long text input', async () => {
      const longText = 'A'.repeat(1000);
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      
      await user.type(textarea, longText);
      expect(textarea).toHaveValue(longText);
    });

    it('maintains floating label state with initial value', () => {
      render(<Textarea label="Floating Label" floatingLabel value="Initial value" readOnly />);
      const label = screen.getByText('Floating Label');
      expect(label).toHaveClass('text-primary-600');
    });
  });

  describe('Custom Props', () => {
    it('passes through additional props', () => {
      render(<Textarea data-testid="custom-textarea" maxLength={100} />);
      const textarea = screen.getByTestId('custom-textarea');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('handles disabled state', () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('handles readonly state', () => {
      render(<Textarea readOnly value="Read only text" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readOnly');
      expect(textarea).toHaveValue('Read only text');
    });
  });
});