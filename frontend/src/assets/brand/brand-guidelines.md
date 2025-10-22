# Seek Brand Guidelines

## Brand Identity

### Mission Statement
Seek empowers developers of all levels to learn, practice, and master coding through an engaging, professional, and accessible platform.

### Brand Values
- **Innovation**: Cutting-edge learning experiences
- **Accessibility**: Inclusive design for all learners
- **Excellence**: Professional quality in every detail
- **Growth**: Continuous learning and improvement
- **Community**: Collaborative learning environment

## Visual Identity

### Logo Usage

#### Primary Logo
- Use the full-color gradient logo on light backgrounds
- Maintain clear space equal to the height of the "S" in SEEK around the logo
- Minimum size: 32px width for digital, 1 inch for print

#### Logo Variations
- **Primary**: Full gradient logo with tagline
- **Simplified**: Logo without tagline for small sizes
- **Monochrome**: White version for dark backgrounds
- **Icon**: Square icon version for favicons and app icons

#### Logo Don'ts
- Don't stretch or distort the logo
- Don't use on backgrounds with insufficient contrast
- Don't recreate or modify the logo
- Don't use outdated versions

### Color Palette

#### Primary Colors
```css
--brand-primary: #2563eb
--brand-primary-light: #3b82f6
--brand-primary-dark: #1d4ed8
```

#### Gradient System
```css
--brand-gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--brand-gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
--brand-gradient-success: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)
--brand-gradient-warning: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)
```

#### Semantic Colors
```css
--brand-success: #22c55e
--brand-warning: #f59e0b
--brand-error: #ef4444
--brand-info: #3b82f6
```

#### Neutral Colors
```css
--brand-gray-50: #f8fafc
--brand-gray-100: #f1f5f9
--brand-gray-200: #e2e8f0
--brand-gray-300: #cbd5e1
--brand-gray-400: #94a3b8
--brand-gray-500: #64748b
--brand-gray-600: #475569
--brand-gray-700: #334155
--brand-gray-800: #1e293b
--brand-gray-900: #0f172a
```

### Typography

#### Font Families
- **Primary**: Inter (Headings, UI, Body text)
- **Code**: JetBrains Mono (Code blocks, technical content)
- **Display**: Inter (Large headings, hero text)

#### Font Weights
- **Regular**: 400 (Body text)
- **Medium**: 500 (Subheadings, emphasis)
- **Semibold**: 600 (Headings)
- **Bold**: 700 (Important headings)
- **Extrabold**: 800 (Display text)

#### Typography Scale
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
```

### Iconography

#### Icon Style
- **Style**: Outline icons with 2px stroke width
- **Corner Radius**: 2px for consistency
- **Size**: 16px, 20px, 24px standard sizes
- **Color**: Use semantic colors or neutral grays

#### Icon Sources
- Primary: Heroicons (outline style)
- Secondary: Lucide React
- Custom: SVG icons following the same style guidelines

### Spacing System

#### Spacing Scale
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
```

### Shadows and Elevation

#### Shadow System
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3)
```

#### Elevation Levels
- **Level 0**: No shadow (flat elements)
- **Level 1**: Subtle shadow (cards, buttons)
- **Level 2**: Medium shadow (dropdowns, tooltips)
- **Level 3**: Strong shadow (modals, overlays)
- **Level 4**: Maximum shadow (floating elements)

## Voice and Tone

### Brand Voice
- **Professional**: Knowledgeable and trustworthy
- **Encouraging**: Supportive and motivating
- **Clear**: Simple and easy to understand
- **Friendly**: Approachable and welcoming
- **Inspiring**: Motivating growth and learning

### Tone Guidelines

#### Instructional Content
- Use clear, step-by-step language
- Provide context and explanations
- Encourage experimentation
- Acknowledge different skill levels

#### Error Messages
- Be helpful, not judgmental
- Provide actionable solutions
- Use encouraging language
- Offer learning opportunities

#### Success Messages
- Celebrate achievements
- Encourage continued learning
- Provide next steps
- Build confidence

#### Marketing Copy
- Focus on benefits, not just features
- Use inclusive language
- Highlight learning outcomes
- Build excitement for coding

## Application Guidelines

### Component Consistency
- Use design system components consistently
- Follow established patterns
- Maintain visual hierarchy
- Ensure accessibility compliance

### Animation Principles
- Use purposeful animations
- Keep durations appropriate (150-500ms)
- Respect motion preferences
- Enhance, don't distract

### Accessibility Standards
- Maintain WCAG 2.1 AA compliance
- Ensure proper color contrast (4.5:1 minimum)
- Provide keyboard navigation
- Include screen reader support

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions (44px minimum)
- Readable text at all sizes
- Consistent experience across devices

## Implementation Checklist

### Design Review
- [ ] Logo usage follows guidelines
- [ ] Colors match brand palette
- [ ] Typography uses approved fonts and scales
- [ ] Spacing follows the system
- [ ] Shadows and elevation are consistent

### Content Review
- [ ] Voice and tone are appropriate
- [ ] Language is inclusive and encouraging
- [ ] Error messages are helpful
- [ ] Success messages are motivating

### Technical Review
- [ ] Accessibility standards are met
- [ ] Performance is optimized
- [ ] Responsive design works on all devices
- [ ] Animations respect user preferences

## Brand Assets

### File Locations
- Logo files: `/src/assets/brand/logos/`
- Icon files: `/src/assets/brand/icons/`
- Brand colors: `/src/styles/design-system.css`
- Typography: `/src/styles/design-system.css`

### Export Formats
- **SVG**: Primary format for web use
- **PNG**: High-resolution for presentations
- **ICO**: Favicon format
- **PDF**: Print materials

## Contact

For questions about brand guidelines or asset requests, contact the design team or refer to this document for the most up-to-date standards.

---

*Last updated: March 2025*
*Version: 1.0*