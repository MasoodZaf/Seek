import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../Card';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        React.createElement('div', { ref, ...props }, children)
      )),
    },
  };
});

describe('Card Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Card>Test content</Card>);
      const card = screen.getByText('Test content').closest('div');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-white', 'rounded-xl');
    });

    it('renders children correctly', () => {
      render(
        <Card>
          <div>Child content</div>
        </Card>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card className="custom-class">Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'glass', 'gradient', 'outline', 'dark', 'premium'];
    
    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Card variant={variant}>Test</Card>);
        const card = screen.getByText('Test').closest('div');
        
        if (variant === 'default') {
          expect(card).toHaveClass('bg-white', 'rounded-xl');
        } else {
          expect(card).toHaveClass(`card-${variant}`);
        }
      });
    });
  });

  describe('Elevation', () => {
    const elevations = ['flat', 'elevated', 'floating', 'high'];
    
    elevations.forEach(elevation => {
      it(`renders ${elevation} elevation correctly`, () => {
        render(<Card elevation={elevation}>Test</Card>);
        const card = screen.getByText('Test').closest('div');
        
        if (elevation === 'flat') {
          expect(card).toHaveClass('shadow-none', 'border');
        } else {
          expect(card).toHaveClass(`shadow-elevation-${elevation === 'elevated' ? '1' : elevation === 'floating' ? '2' : '3'}`);
        }
      });
    });
  });

  describe('Padding', () => {
    const paddings = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
    
    paddings.forEach(padding => {
      it(`renders ${padding} padding correctly`, () => {
        render(<Card padding={padding}>Test</Card>);
        const card = screen.getByText('Test').closest('div');
        
        if (padding === 'none') {
          expect(card).not.toHaveClass('p-2', 'p-4', 'p-6', 'p-8', 'p-10');
        } else {
          const paddingClass = padding === 'xs' ? 'p-2' : padding === 'sm' ? 'p-4' : padding === 'md' ? 'p-6' : padding === 'lg' ? 'p-8' : 'p-10';
          expect(card).toHaveClass(paddingClass);
        }
      });
    });
  });

  describe('Interactive States', () => {
    it('applies hover classes when hover prop is true', () => {
      render(<Card hover>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('group', 'cursor-pointer');
    });

    it('applies interactive classes when interactive prop is true', () => {
      render(<Card interactive>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('group', 'cursor-pointer');
    });

    it('applies glow on hover when glowOnHover prop is true', () => {
      render(<Card glowOnHover>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('hover:shadow-glow');
    });

    it('handles click events when interactive', async () => {
      const handleClick = jest.fn();
      render(<Card interactive onClick={handleClick}>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      
      await user.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Gradient and Premium Effects', () => {
    it('applies overflow hidden for gradient cards', () => {
      render(<Card gradient>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('relative', 'overflow-hidden');
    });

    it('applies overflow hidden for premium variant', () => {
      render(<Card variant="premium">Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('relative', 'overflow-hidden');
    });
  });

  describe('Animation Props', () => {
    it('renders without animation when animate is false', () => {
      render(<Card animate={false}>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('Card Composition Components', () => {
    describe('Card.Header', () => {
      it('renders header correctly', () => {
        render(
          <Card>
            <Card.Header>Header content</Card.Header>
          </Card>
        );
        const header = screen.getByText('Header content');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('mb-4');
      });

      it('applies divider when divider prop is true', () => {
        render(
          <Card>
            <Card.Header divider>Header with divider</Card.Header>
          </Card>
        );
        const header = screen.getByText('Header with divider');
        expect(header).toHaveClass('pb-4', 'border-b', 'border-secondary-200');
      });
    });

    describe('Card.Title', () => {
      it('renders title with default size', () => {
        render(
          <Card>
            <Card.Title>Card Title</Card.Title>
          </Card>
        );
        const title = screen.getByText('Card Title');
        expect(title).toBeInTheDocument();
        expect(title.tagName).toBe('H3');
        expect(title).toHaveClass('text-xl', 'font-semibold');
      });

      it('renders different title sizes', () => {
        const sizes = ['sm', 'md', 'lg', 'xl'];
        sizes.forEach(size => {
          render(
            <Card>
              <Card.Title size={size}>Title {size}</Card.Title>
            </Card>
          );
          const title = screen.getByText(`Title ${size}`);
          const sizeClass = size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-xl' : 'text-2xl';
          expect(title).toHaveClass(sizeClass);
        });
      });

      it('applies gradient text when gradient prop is true', () => {
        render(
          <Card>
            <Card.Title gradient>Gradient Title</Card.Title>
          </Card>
        );
        const title = screen.getByText('Gradient Title');
        expect(title).toHaveClass('text-gradient');
      });
    });

    describe('Card.Description', () => {
      it('renders description correctly', () => {
        render(
          <Card>
            <Card.Description>Card description</Card.Description>
          </Card>
        );
        const description = screen.getByText('Card description');
        expect(description).toBeInTheDocument();
        expect(description.tagName).toBe('P');
        expect(description).toHaveClass('text-sm', 'text-secondary-600');
      });

      it('applies muted styling when muted prop is true', () => {
        render(
          <Card>
            <Card.Description muted>Muted description</Card.Description>
          </Card>
        );
        const description = screen.getByText('Muted description');
        expect(description).toHaveClass('text-secondary-500');
      });
    });

    describe('Card.Content', () => {
      it('renders content with default spacing', () => {
        render(
          <Card>
            <Card.Content>Content area</Card.Content>
          </Card>
        );
        const content = screen.getByText('Content area');
        expect(content).toBeInTheDocument();
        expect(content).toHaveClass('space-y-4');
      });

      it('applies different spacing options', () => {
        const spacings = ['none', 'tight', 'normal', 'relaxed'];
        spacings.forEach(spacing => {
          render(
            <Card>
              <Card.Content spacing={spacing}>Content {spacing}</Card.Content>
            </Card>
          );
          const content = screen.getByText(`Content ${spacing}`);
          const spacingClass = spacing === 'none' ? '' : spacing === 'tight' ? 'space-y-2' : spacing === 'normal' ? 'space-y-4' : 'space-y-6';
          if (spacingClass) {
            expect(content).toHaveClass(spacingClass);
          }
        });
      });
    });

    describe('Card.Footer', () => {
      it('renders footer with default layout', () => {
        render(
          <Card>
            <Card.Footer>Footer content</Card.Footer>
          </Card>
        );
        const footer = screen.getByText('Footer content');
        expect(footer).toBeInTheDocument();
        expect(footer).toHaveClass('mt-6', 'flex', 'justify-between', 'items-center');
      });

      it('applies different justify options', () => {
        const justifyOptions = ['start', 'center', 'end', 'between', 'around'];
        justifyOptions.forEach(justify => {
          render(
            <Card>
              <Card.Footer justify={justify}>Footer {justify}</Card.Footer>
            </Card>
          );
          const footer = screen.getByText(`Footer ${justify}`);
          const justifyClass = `justify-${justify}`;
          expect(footer).toHaveClass(justifyClass);
        });
      });

      it('applies different align options', () => {
        const alignOptions = ['start', 'center', 'end', 'stretch'];
        alignOptions.forEach(align => {
          render(
            <Card>
              <Card.Footer align={align}>Footer {align}</Card.Footer>
            </Card>
          );
          const footer = screen.getByText(`Footer ${align}`);
          const alignClass = `items-${align}`;
          expect(footer).toHaveClass(alignClass);
        });
      });
    });

    describe('Card.Badge', () => {
      it('renders badge with default variant', () => {
        render(
          <Card>
            <Card.Badge>Badge</Card.Badge>
          </Card>
        );
        const badge = screen.getByText('Badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
      });

      it('renders different badge variants', () => {
        const variants = ['primary', 'success', 'warning', 'error', 'secondary'];
        variants.forEach(variant => {
          render(
            <Card>
              <Card.Badge variant={variant}>Badge {variant}</Card.Badge>
            </Card>
          );
          const badge = screen.getByText(`Badge ${variant}`);
          expect(badge).toHaveClass(`bg-${variant}-100`, `text-${variant}-800`);
        });
      });

      it('renders different badge sizes', () => {
        const sizes = ['xs', 'sm', 'md'];
        sizes.forEach(size => {
          render(
            <Card>
              <Card.Badge size={size}>Badge {size}</Card.Badge>
            </Card>
          );
          const badge = screen.getByText(`Badge ${size}`);
          const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-xs' : size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
          expect(badge).toHaveClass('px-2', 'py-0.5');
        });
      });
    });

    describe('Card.Image', () => {
      it('renders image with default aspect ratio', () => {
        render(
          <Card>
            <Card.Image src="/test.jpg" alt="Test image" />
          </Card>
        );
        const image = screen.getByAltText('Test image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/test.jpg');
        
        const container = image.closest('div');
        expect(container).toHaveClass('aspect-video');
      });

      it('renders different aspect ratios', () => {
        const aspectRatios = ['square', 'video', 'photo', 'wide'];
        aspectRatios.forEach(aspectRatio => {
          render(
            <Card>
              <Card.Image src="/test.jpg" alt={`Test ${aspectRatio}`} aspectRatio={aspectRatio} />
            </Card>
          );
          const image = screen.getByAltText(`Test ${aspectRatio}`);
          const container = image.closest('div');
          
          const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 
                             aspectRatio === 'video' ? 'aspect-video' : 
                             aspectRatio === 'photo' ? 'aspect-[4/3]' : 
                             'aspect-[21/9]';
          expect(container).toHaveClass(aspectClass);
        });
      });

      it('applies hover scale effect', () => {
        render(
          <Card>
            <Card.Image src="/test.jpg" alt="Test image" />
          </Card>
        );
        const image = screen.getByAltText('Test image');
        expect(image).toHaveClass('group-hover:scale-105');
      });
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Accessible Card</Card.Title>
            <Card.Description>Card description</Card.Description>
          </Card.Header>
          <Card.Content>Content</Card.Content>
        </Card>
      );
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Accessible Card');
    });

    it('supports ARIA attributes', () => {
      render(
        <Card aria-label="Custom card" role="article">
          Content
        </Card>
      );
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-label', 'Custom card');
    });
  });

  describe('Responsive Behavior', () => {
    it('handles responsive padding classes', () => {
      render(<Card padding="md">Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('p-6');
    });

    it('maintains proper overflow handling for effects', () => {
      render(<Card variant="premium" hover>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card).toHaveClass('relative', 'overflow-hidden', 'group', 'cursor-pointer');
    });
  });
});