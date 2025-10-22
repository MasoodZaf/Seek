import React from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';

const ResponsiveGrid = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 4, tablet: 6, desktop: 8 },
  className = '',
  animate = true,
  staggerChildren = 0.1,
  ...props
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridColumns = () => {
    if (isMobile) return columns.mobile;
    if (isTablet) return columns.tablet;
    return columns.desktop;
  };

  const getGridGap = () => {
    if (isMobile) return gap.mobile;
    if (isTablet) return gap.tablet;
    return gap.desktop;
  };

  const gridClasses = `
    grid
    grid-cols-${getGridColumns()}
    gap-${getGridGap()}
    ${className}
  `;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animate ? staggerChildren : 0
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (animate) {
    return (
      <motion.div
        className={gridClasses}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

// Specialized grid components for common layouts
export const TutorialGrid = ({ children, ...props }) => (
  <ResponsiveGrid
    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
    gap={{ mobile: 4, tablet: 6, desktop: 8 }}
    {...props}
  >
    {children}
  </ResponsiveGrid>
);

export const DashboardGrid = ({ children, ...props }) => (
  <ResponsiveGrid
    columns={{ mobile: 1, tablet: 2, desktop: 4 }}
    gap={{ mobile: 4, tablet: 6, desktop: 6 }}
    {...props}
  >
    {children}
  </ResponsiveGrid>
);

export const AchievementGrid = ({ children, ...props }) => (
  <ResponsiveGrid
    columns={{ mobile: 2, tablet: 3, desktop: 4 }}
    gap={{ mobile: 3, tablet: 4, desktop: 6 }}
    {...props}
  >
    {children}
  </ResponsiveGrid>
);

export const CodeExampleGrid = ({ children, ...props }) => (
  <ResponsiveGrid
    columns={{ mobile: 1, tablet: 1, desktop: 2 }}
    gap={{ mobile: 4, tablet: 6, desktop: 8 }}
    {...props}
  >
    {children}
  </ResponsiveGrid>
);

// Responsive flex layouts
export const ResponsiveFlex = ({
  children,
  direction = { mobile: 'column', tablet: 'row', desktop: 'row' },
  align = 'stretch',
  justify = 'start',
  gap = { mobile: 4, tablet: 6, desktop: 8 },
  wrap = true,
  className = '',
  animate = true,
  ...props
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getFlexDirection = () => {
    if (isMobile) return direction.mobile;
    if (isTablet) return direction.tablet;
    return direction.desktop;
  };

  const getFlexGap = () => {
    if (isMobile) return gap.mobile;
    if (isTablet) return gap.tablet;
    return gap.desktop;
  };

  const flexClasses = `
    flex
    flex-${getFlexDirection()}
    items-${align}
    justify-${justify}
    gap-${getFlexGap()}
    ${wrap ? 'flex-wrap' : ''}
    ${className}
  `;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animate ? 0.1 : 0
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (animate) {
    return (
      <motion.div
        className={flexClasses}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive container with max-width constraints
export const ResponsiveContainer = ({
  children,
  size = 'default',
  className = '',
  noPadding = false,
  ...props
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getSizeClasses = () => {
    const sizes = {
      sm: 'max-w-2xl',
      default: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full'
    };
    return sizes[size] || sizes.default;
  };

  const getPaddingClasses = () => {
    if (noPadding) return '';
    
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-8';
  };

  const containerClasses = `
    w-full
    ${getSizeClasses()}
    mx-auto
    ${getPaddingClasses()}
    ${className}
  `;

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

// Responsive section with proper spacing
export const ResponsiveSection = ({
  children,
  spacing = 'default',
  className = '',
  ...props
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getSpacingClasses = () => {
    const spacings = {
      sm: isMobile ? 'py-8' : isTablet ? 'py-12' : 'py-16',
      default: isMobile ? 'py-12' : isTablet ? 'py-16' : 'py-20',
      lg: isMobile ? 'py-16' : isTablet ? 'py-20' : 'py-24',
      xl: isMobile ? 'py-20' : isTablet ? 'py-24' : 'py-32'
    };
    return spacings[spacing] || spacings.default;
  };

  const sectionClasses = `
    ${getSpacingClasses()}
    ${className}
  `;

  return (
    <section className={sectionClasses} {...props}>
      {children}
    </section>
  );
};

export default ResponsiveGrid;