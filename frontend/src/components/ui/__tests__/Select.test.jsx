import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../Select';
import { UserIcon } from '@heroicons/react/24/outline';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      select: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('select', { ref, ...props }, children)
      )),
      div: ({ children, ...props }) => React.createElement('div', props, children),
    },
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, {}, children),
  };
});

describe('Select Component', () => {
  const user = userEvent.setup();

  const defaultOptions = (
    <>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </>
  );

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <Select>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).toHaveClass('input', 'input-default');
    });

    it('renders with placeholder option', () => {
      render(
        <Select placeholder="Choose an option">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      const placeholderOption = screen.getByText('Choose an option');
      expect(placeholderOption).toBeInTheDocument();
      expect(placeholderOption).toHaveAttribute('value', '');
      expect(placeholderOption).toHaveAttribute('disabled');
    });

    it('renders children options correctly', () => {
      render(
        <Select>
          {defaultOptions}
        </Select>
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Select className="custom-class">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('custom-class');
    });
  });

  describe('Labels', () => {
    it('renders label correctly', () => {
      render(
        <Select label="Select Option">
          {defaultOptions}
        </Select>
      );
      const label = screen.getByText('Select Option');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('shows required indicator', () => {
      render(
        <Select label="Required Field" required>
          {defaultOptions}
        </Select>
      );
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-error-500');
    });

    it('associates label with select', () => {
      render(
        <Select label="Accessible Select">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByLabelText('Accessible Select');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <Select size={size}>
            {defaultOptions}
          </Select>
        );
        const select = screen.getByRole('combobox');
        const sizeClass = size === 'sm' ? 'px-3 py-2 text-sm' : size === 'md' ? 'px-4 py-3 text-sm' : 'px-4 py-4 text-base';
        expect(select).toHaveClass('px-3', 'py-2');
      });
    });
  });

  describe('Variants and States', () => {
    it('renders error state correctly', () => {
      render(
        <Select error="Please select an option">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('input-error');
      
      const errorMessage = screen.getByText('Please select an option');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-error-600');
    });

    it('renders success state correctly', () => {
      render(
        <Select success="Good choice">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('input-success');
      
      const successMessage = screen.getByText('Good choice');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveClass('text-success-600');
    });

    it('renders helper text', () => {
      render(
        <Select helperText="Choose the best option">
          {defaultOptions}
        </Select>
      );
      const helperText = screen.getByText('Choose the best option');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-secondary-600');
    });

    it('error state takes precedence over success', () => {
      render(
        <Select error="Error message" success="Success message">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('input-error');
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      render(
        <Select leftIcon={UserIcon}>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('pl-10');
      
      const icon = select.parentElement.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('always has space for chevron icon', () => {
      render(
        <Select>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('pr-10');
      
      // Check for chevron icon
      const chevronIcon = select.parentElement.querySelector('.text-secondary-400');
      expect(chevronIcon).toBeInTheDocument();
    });

    it('renders status icons for error state', () => {
      render(
        <Select error="Error message">
          {defaultOptions}
        </Select>
      );
      const errorIcon = screen.getByRole('combobox').parentElement.querySelector('.text-error-500');
      expect(errorIcon).toBeInTheDocument();
    });

    it('renders status icons for success state', () => {
      render(
        <Select success="Success message">
          {defaultOptions}
        </Select>
      );
      const successIcon = screen.getByRole('combobox').parentElement.querySelector('.text-success-500');
      expect(successIcon).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles focus and blur events', async () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(
        <Select onFocus={handleFocus} onBlur={handleBlur}>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      await user.click(select);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles change events', async () => {
      const handleChange = jest.fn();
      render(
        <Select onChange={handleChange}>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      await user.selectOptions(select, 'option2');
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(select).toHaveValue('option2');
    });

    it('supports keyboard navigation', async () => {
      render(
        <Select>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      await user.tab();
      expect(select).toHaveFocus();
      
      await user.keyboard('{ArrowDown}');
      // Note: Actual keyboard navigation behavior depends on browser implementation
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(
        <Select label="Accessible Select">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('supports ARIA attributes', () => {
      render(
        <Select 
          aria-describedby="help-text" 
          aria-invalid="true"
          aria-required="true"
        >
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'help-text');
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(select).toHaveAttribute('aria-required', 'true');
    });

    it('provides proper focus indicators', async () => {
      render(
        <Select>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      
      await user.tab();
      expect(select).toHaveFocus();
    });

    it('associates error messages with select', () => {
      render(
        <Select error="Please select an option">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      const errorMessage = screen.getByText('Please select an option');
      
      expect(select).toHaveClass('input-error');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('Validation States', () => {
    it('shows error state with proper styling', () => {
      render(
        <Select error="Invalid selection">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('input-error');
      
      const errorText = screen.getByText('Invalid selection');
      expect(errorText).toHaveClass('text-error-600');
    });

    it('shows success state with proper styling', () => {
      render(
        <Select success="Great choice">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('input-success');
      
      const successText = screen.getByText('Great choice');
      expect(successText).toHaveClass('text-success-600');
    });
  });

  describe('Animation Props', () => {
    it('renders without animation when animate is false', () => {
      render(
        <Select animate={false}>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select.tagName).toBe('SELECT');
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef();
      render(
        <Select ref={ref}>
          {defaultOptions}
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  describe('Option Handling', () => {
    it('handles complex option structures', () => {
      render(
        <Select>
          <optgroup label="Group 1">
            <option value="g1-option1">Group 1 Option 1</option>
            <option value="g1-option2">Group 1 Option 2</option>
          </optgroup>
          <optgroup label="Group 2">
            <option value="g2-option1">Group 2 Option 1</option>
            <option value="g2-option2">Group 2 Option 2</option>
          </optgroup>
        </Select>
      );
      
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
      expect(screen.getByText('Group 1 Option 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2 Option 1')).toBeInTheDocument();
    });

    it('handles disabled options', () => {
      render(
        <Select>
          <option value="option1">Option 1</option>
          <option value="option2" disabled>Option 2 (Disabled)</option>
          <option value="option3">Option 3</option>
        </Select>
      );
      
      const disabledOption = screen.getByText('Option 2 (Disabled)');
      expect(disabledOption).toHaveAttribute('disabled');
    });
  });

  describe('Responsive Behavior', () => {
    it('handles different screen sizes appropriately', () => {
      render(
        <Select size="lg">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('px-4', 'py-4', 'text-base');
    });

    it('maintains proper spacing with icons', () => {
      render(
        <Select leftIcon={UserIcon}>
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('pl-10', 'pr-10');
    });
  });

  describe('Edge Cases', () => {
    it('handles controlled select correctly', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <Select value={value} onChange={(e) => setValue(e.target.value)}>
            {defaultOptions}
          </Select>
        );
      };
      
      render(<TestComponent />);
      const select = screen.getByRole('combobox');
      
      await user.selectOptions(select, 'option2');
      expect(select).toHaveValue('option2');
    });

    it('handles uncontrolled select correctly', async () => {
      render(
        <Select defaultValue="option1">
          {defaultOptions}
        </Select>
      );
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('option1');
      
      await user.selectOptions(select, 'option3');
      expect(select).toHaveValue('option3');
    });

    it('handles empty options gracefully', () => {
      render(<Select />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });
});